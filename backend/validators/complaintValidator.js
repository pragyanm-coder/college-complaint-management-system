
const isNonEmptyString = (value) =>
    typeof value === 'string' && value.trim().length > 0;

const validCategories = [
    'Hostel',
    'Classroom and Infrastructure',
    'Library',
    'Canteen',
    'Academics',
    'Transport',
    'IT and Wi-Fi',
    'Other'
];

export const validateComplaint = (req, res, next) => {
    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid request body'
        });
    }

    const { title, description, category, location } = body;

    // Validate title
    if (
        !isNonEmptyString(title) ||
        title.trim().length < 5 ||
        title.trim().length > 120
    ) {
        return res.status(400).json({
            success: false,
            message: 'Title must contain 5 to 120 characters'
        });
    }

    // Validate description
    if (
        !isNonEmptyString(description) ||
        description.trim().length < 20 ||
        description.trim().length > 2000
    ) {
        return res.status(400).json({
            success: false,
            message: 'Description must contain 20 to 2000 characters'
        });
    }

    // Validate category
    if (
        !isNonEmptyString(category) ||
        !validCategories.includes(category.trim())
    ) {
        return res.status(400).json({
            success: false,
            message: 'Please select a valid complaint category'
        });
    }

    // Validate location
    if (
        !isNonEmptyString(location) ||
        location.trim().length > 150
    ) {
        return res.status(400).json({
            success: false,
            message: 'Location is required and must not exceed 150 characters'
        });
    }

    next();
};
