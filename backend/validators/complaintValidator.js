
export const validateComplaint = (req, res, next) => {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
        return res.status(400).json({
            success: false,
            message: 'Title, description, category and location are required'
        });
    }

    if (title.trim().length < 5) {
        return res.status(400).json({
            success: false,
            message: 'Title must contain at least 5 characters'
        });
    }

    if (description.trim().length < 20) {
        return res.status(400).json({
            success: false,
            message: 'Description must contain at least 20 characters'
        });
    }

    next();
};
