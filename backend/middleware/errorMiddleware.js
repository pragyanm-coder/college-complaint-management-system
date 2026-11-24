
export const notFound = (req, res, next) =>
{
    const error = new Error(
        `Route not found: ${req.originalUrl}`
    );

    error.statusCode = 404;
    next(error);
};


export const errorHandler = (err, req, res, next) =>
{
    if(res.headersSent)
    {
        return next(err);
    }

    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || 'Internal Server Error';

    // Mongoose validation errors
    if(err.name === 'ValidationError')
    {
        statusCode = 400;
        message = Object.values(err.errors)
            .map(error => error.message)
            .join(', ');
    }

    // Invalid MongoDB ObjectId
    else if(err.name === 'CastError')
    {
        statusCode = 400;
        message = 'Invalid ID format';
    }

    // Duplicate database entries
    else if(err.code === 11000)
    {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0];

        message = field
            ? `${field} already exists`
            : 'Duplicate entry';
    }

    // Invalid JSON request body
    else if(err.type === 'entity.parse.failed')
    {
        statusCode = 400;
        message = 'Invalid JSON request body';
    }

    // Unexpected server errors
    if(statusCode >= 500)
    {
        console.error(err);
        statusCode = 500;
        message = 'Internal Server Error';
    }

    return res.status(statusCode).json(
    {
        success: false,
        message
    });
};
