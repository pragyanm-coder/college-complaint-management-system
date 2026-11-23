
const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isNonEmptyString = (value) =>
    typeof value === 'string' && value.trim().length > 0;

const validYears = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year'
];

export const validateRegister = (req, res, next) => {
    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid request body'
        });
    }

    const {
        fullName,
        email,
        password,
        rollNumber,
        department,
        year,
        phone
    } = body;

    if (!isNonEmptyString(fullName) || fullName.trim().length < 3 || fullName.trim().length > 100) {
        return res.status(400).json({
            success: false,
            message: 'Full name must contain 3 to 100 characters'
        });
    }

    if (!isNonEmptyString(email) || !isValidEmail(email.trim())) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email'
        });
    }

    if (!isNonEmptyString(rollNumber) || rollNumber.trim().length > 30) {
        return res.status(400).json({
            success: false,
            message: 'A valid roll number is required'
        });
    }

    if (!isNonEmptyString(department)) {
        return res.status(400).json({
            success: false,
            message: 'Department is required'
        });
    }

    if (!validYears.includes(year)) {
        return res.status(400).json({
            success: false,
            message: 'Please select a valid academic year'
        });
    }

    if (!isNonEmptyString(phone) || !/^\d{10}$/.test(phone.trim())) {
        return res.status(400).json({
            success: false,
            message: 'Enter a valid 10-digit phone number'
        });
    }

    if (
        typeof password !== 'string' ||
        password.length < 8 ||
        password.length > 128 ||
        !/[A-Za-z]/.test(password) ||
        !/\d/.test(password)
    ) {
        return res.status(400).json({
            success: false,
            message: 'Password must contain 8 to 128 characters, including letters and numbers'
        });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid request body'
        });
    }

    const { email, password } = body;

    if (!isNonEmptyString(email) || typeof password !== 'string' || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    if (!isValidEmail(email.trim())) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email'
        });
    }

    next();
};
