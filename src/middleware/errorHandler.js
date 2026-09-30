import { logger } from "../shared/logger";
import path from "path";

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");


// 400 Bad Request
// 401 Unauthorized
// 403 Forbidden
// 404 Not Found
// 500 Internal Server Error
// 502 Bad Gateway
// 503 Service Unavailable


export default function errorHandler(err, req, res, next) {

    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Server error';

    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }

    logger.error(`HTTP error ${statusCode}: ${message}`);

    if (statusCode === 404) {

        return res.status(404).sendFile(path.join(__dirname, "views", "404.html"), (sendErr) => {
            if (sendErr) next(sendErr);
        });
    }

    res.status(statusCode).send(`Error ${statusCode}: ${message}`);

}

// module.exports = errorHandler;