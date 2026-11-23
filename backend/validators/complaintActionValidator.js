

const validStatuses = [
    'Pending',
    'In Progress',
    'Resolved'
];

export const validateAssignment = (req, res, next) => {
    const { staffId } = req.body || {};

    if (
        typeof staffId !== 'string' ||
        staffId.trim().length === 0
    ) {
        return res.status(400).json({
            success: false,
            message: 'A valid staff ID is required'
        });
    }

    next();
};

export const validateAdminStatus = (req, res, next) => {
    const { status } = req.body || {};

    if (
        typeof status !== 'string' ||
        !validStatuses.includes(status)
    ) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid complaint status'
        });
    }

    next();
};

export const validateStaffStatus = (req, res, next) => {
    const { status, resolutionDetails } = req.body || {};

    if (
        typeof status !== 'string' ||
        !validStatuses.includes(status)
    ) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid complaint status'
        });
    }

    if (status === 'Resolved') {
        if (
            typeof resolutionDetails !== 'string' ||
            resolutionDetails.trim().length < 10 ||
            resolutionDetails.trim().length > 1000
        ) {
            return res.status(400).json({
                success: false,
                message: 'Resolution details must contain 10 to 1000 characters'
            });
        }
    }

    next();
};
