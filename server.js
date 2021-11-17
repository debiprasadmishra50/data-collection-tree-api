const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
    console.log("[-] UNCAUGHT EXCEPTION! Shutting Down...");
    console.log(err.name, err.message, err.stack);
    process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

/* 
    Mongoose Connect
    
*/
const DB = process.env.DATABASE_CLOUD.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then((con) => console.log("[+] Connection Established..."))
    .catch((err) => {
        console.log("[-] Connection Failure: ", err.message);
        server.close(() => {
            process.exit(1);
        });
    });

const port = process.env.PORT || 8000;
const server = app.listen(port, function () {
    console.log("[+] server started on port " + port);
});

process.on("unhandledRejection", (err) => {
    console.log("[-] UNHANDLER REJECTION! Shutting Down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on("SIGTERM", () => {
    console.log("[-] SIGTERM RECEIVED. Shutting down gracefully...");
    server.close(() => {
        console.log("[+] Process Terminated");
    });
});
