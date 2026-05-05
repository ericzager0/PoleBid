import AppError from "../utils/appError";
import { ZodError } from "zod";
import multer from "multer";

const handleZodError = (err) => {
    /* ZodError handling: aggregate all error messages into one and formats it as object so that in the frontend it can be displayed properly */
    const issues = err.issues || err.errors || [];
    const errorsObj = issues.reduce((acc, issue) => {
        let fieldName = 'generic_error';
        if (issue.path && issue.path.length > 0){
            fieldName = issue.path[issue.path.length - 1];
        }
        acc[fieldName] = issue.message;
        return acc;
    }, {});
    
    const error = new AppError('Invalid input data', 400);
    error.validationErrors = errorsObj;
    return error;
};

const sendErrorDev = (err, res) => {
    /* Detailed error response for development environment */
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        validationErrors: err.validationErrors || undefined
    });
};

const sendErrorProd = (err, res) => {
    /* Controlled error response for production - Security focused */
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            errors: err.validationErrors || undefined
        });
    } else if (err.validationErrors) {
        response.errors = err.validationErrors;
    }else {
        console.error('ERROR:', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};


const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let workingError = err;    

    if (err instanceof multer.MulterError) {
        const msg = err.code === 'LIMIT_FILE_SIZE' ? 'File too large (Max 500KB)' : err.message;
        workingError = new AppError(msg, 400);
    }

    if (err.code === 'INVALID_FILE_TYPE') {
        workingError = new AppError(err.message, 400);
    }
    
    if (err instanceof ZodError || err.name === 'ZodError') {
        workingError = handleZodError(err);
    }

    // Ensure status and statusCode are preserved if not handled by helpers
    workingError.statusCode = workingError.statusCode || err.statusCode;
    workingError.status = workingError.status || err.status;

    // Environment-based dispatching
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(workingError, res);
    } else {
        sendErrorProd(workingError, res);
    }
};

export default globalErrorHandler;