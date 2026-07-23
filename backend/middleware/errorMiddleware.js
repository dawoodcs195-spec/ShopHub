const notFound = (req, res, next) => {
    const error = new Error(
        `Route not found - ${req.originalUrl}`
    );

    res.status(404);

    next(error);
};

const errorHandler = (
    err,
    req,
    res,
    next
) => {
    let statusCode = res.statusCode;

    if (statusCode === 200) {
        statusCode = 500;
    }

    res.status(statusCode).json({
        success: false,
        message: err.message || "Server Error",
        ...(process.env.NODE_ENV !== "production" && {
            stack: err.stack,
        }),
    });
};

module.exports = {
    notFound,
    errorHandler,
};