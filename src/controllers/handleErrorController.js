const CustomError = require("../exceptions/errors_exceptions");

const handleError = (err, req, res, next) => {
    console.log("Hello world")
    let errObj = {
        message: err.message || 'Something went wrong',
        status: err.statusCode || 500,
    };

    if (err instanceof CustomError) {
        // Custom error handling
        errObj.errors = err.errors || [];  // Include additional details for validation errors

        if (process.env.ENVIRONMENT === 'local') {
            errObj.stackTrace = err.stack;
        }

        return res.status(err.statusCode).json(errObj);
    } else {
        // Handle generic errors (non-CustomError)
        const customErr = new CustomError(err.message || 'Unknown Error', err.stack);
        
        errObj.message = customErr.message;
        errObj.status = customErr.statusCode;

        if (process.env.ENVIRONMENT === 'local') {
            errObj.stackTrace = customErr.stack;
        }

        console.log("hi")
        console.error(errObj);

        return res.status(customErr.statusCode).json(errObj);
    }
};

module.exports = handleError;
