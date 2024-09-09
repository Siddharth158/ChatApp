const errorMiddleware = (err, req, res, next) => {
    err.message ||= "Internal server error";
    err.statusCode ||= 500;

    if (err.code === 11000) {
        const error = Object.keys(err.keyPAttern).join(",");
        err.message = `Duplicate key error - ${error}`
        err.statusCode = 400;
    }

    if(err.name === "CastError"){
        const errorPath = err.path
        err.message = "Invalid format of " + errorPath 
        err.statusCode = 400
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
};
export { errorMiddleware }