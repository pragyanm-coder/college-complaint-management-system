export const notFound = (req, res, next) => {
    console.log("Custom notFound middleware executed");

    const error = new Error(
        `Route not found: ${req.originalUrl}`
    );

    error.statusCode = 404;
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    console.log("Custom errorHandler executed");

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};