const AppError = require("./../utils/appError");

const handleDuplicateFieldsDB = (err) => {
    const value = err.keyValue.name;
    const message = `Duplicate field value: "${value}", Please use another value`;
    return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((value) => value.message);
    const message = `Invalid Input data. ${errors.join(". ")}`;
    return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
    // 1. ERROR FOR API
    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack,
        });
    }
    console.error("Error: ", err);
    // 2. ERROR FOR WEBSITE
    return res.status(err.statusCode).render("error", {
        title: "Something Went Wrong!",
        msg: err.message,
    });
};

const sendErrorProd = (err, req, res) => {
    // 1. FOR API
    if (req.originalUrl.startsWith("/api")) {
        // Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        // Programming or other unknown bug: don't leak error details
        // 1. Log error to console
        console.error("Error: ", err);

        // 2. Send a generic message
        return res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
            error: err,
        });
    }

    // 2. FOR WEBSITE
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).render("error", {
            title: "Something Went Wrong!",
            msg: err.message,
        });
    }

    // Programming or other unknown bug: don't leak error details
    // 1. Log error to console
    console.error("Error: ", err);

    // 2. Send a generic message
    return res.status(err.statusCode).render("error", {
        title: "Something Went Wrong!",
        msg: "Please try again later.",
    });
};

module.exports = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") sendErrorDev(err, req, res);
    else if (process.env.NODE_ENV === "production") {
        let error = Object.assign(err);

        if (error.name === "CastError") error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error);

        sendErrorProd(error, req, res);
    }
};
