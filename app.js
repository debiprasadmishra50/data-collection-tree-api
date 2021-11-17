const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const AppError = require("./utils/appError");

const globalErrorHandler = require("./controllers/errorController");

const dataRouter = require("./routes/dataRoutes");

const app = express();

app.enable("trust proxy");

/* 
    1: Global MIDDLEWARES
*/
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev")); // for logging in console
}

app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                defaultSrc: [
                    "'self'",
                    "https://polyfill.io",
                    "https://*.cloudflare.com",
                    "http://127.0.0.1:8000/",
                    "https://*.herokuapp.com",
                    // "ws:",
                ],
                baseUri: ["'self'"],
                scriptSrc: [
                    "self",
                    "http://127.0.0.1:8000/",
                    "https://*.cloudflare.com",
                    "https://polyfill.io",
                    "https://*.herokuapp.com",
                    // "http:",
                    // "data:",
                ],
                styleSrc: ["self", "https:", "http:", "unsafe-inline"],
                imgSrc: ["'self'", "data:", "blob:"],
                fontSrc: ["'self'", "https:", "data:"],
                childSrc: ["'self'", "blob:"],
                styleSrcAttr: ["'self'", "unsafe-inline", "http:"],
            },
        },
    })
); // For security HTTP headers

// Implementing CORS
app.use(cors());
// set Access-Control-Allow-Origin to *

app.options("*", cors()); // for preflight stage in browsers for complex requests like PUT, PATCH, DELETE

// Implementing Rate Limiting; limit the requests to server per hour
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000, // 1000 requests per hour
    message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// reading url params and data from body to req.params and req.body
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json({ limit: "10kb" })); // for bodyParser
app.use(cookieParser());

// Data Sanitization against NoSQL query injections
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xssClean());

app.use(compression()); // To compress the requests for better performance

/* 
    Custom Middleware
*/
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
});

/* 
    Mounting Rounters as middleware
*/
app.use("/api/v1/data", dataRouter);

/* 
    For unknown routes
    all() is used for all get, post, patch, delete requests
*/
app.all("*", (req, res, next) => {
    const err = new AppError(
        `Can't find ${req.originalUrl} on this server!`,
        404
    );

    next(err);
});

/* 
    Global Error Handling Middleware
*/
app.use(globalErrorHandler);

module.exports = app;
