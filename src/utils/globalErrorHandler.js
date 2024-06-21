const HttpStatusCode = require("../utils/httpStatusCode");
const AppError = require("../utils/appError");

const sendErrorDev = (err, req, res) =>  {
    err.statusCode =   err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    err.status = err.status || "error";
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stackTrace: err.stack,
        error: err
    })
}

const sendErrorProd =  (err, req, res) =>  {

    if(err.isOperational){
        console.log('isOperational');

        err.statusCode =   err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
        err.status = err.status || "error";
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    else{
        console.log('Not isOperational');
        console.log(err);

        err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;

        res.status(err.statusCode).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }

   
}

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, HttpStatusCode.BAD_REQUEST);
}

const globalErrorHandler = (err, req, res, next) => {
    console.log(process.env.NODE_ENV);

    if(process.env.NODE_ENV === "developement"){

        sendErrorDev(err, req, res);

    }
    else if(process.env.NODE_ENV === "production"){

        if(err.name === "CastError") err = handleCastErrorDB(err);

        sendErrorProd(err, req, res);

    }else{
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })

    }
}

module.exports = globalErrorHandler;