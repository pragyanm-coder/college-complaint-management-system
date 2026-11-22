
const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateRegister = (req, res, next) => {
    const {
        fullName,
        email,
        password,
        rollNumber,
        department,
        year,
        phone
    } = req.body;

    if (!fullName || fullName.trim().length < 3) {
        return res.status(400).json({
            success: false,
            message: 'Full name must contain at least 3 characters'
        });
    }

    if (!email || !isValidEmail(email.trim())) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email'
        });
    }

    if (!rollNumber || !rollNumber.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Roll number is required'
        });
    }

    if (!department || !department.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Department is required'
        });
    }

    if (!year) {
        return res.status(400).json({
            success: false,
            message: 'Year is required'
        });
    }

    if (!phone || !/^\d{10}$/.test(phone.trim())) {
        return res.status(400).json({
            success: false,
            message: 'Enter a valid 10-digit phone number'
        });
    }

    if (!password || password.length < 8 ||
        !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        return res.status(400).json({
            success: false,
            message: 'Password must contain at least 8 characters, including letters and numbers'
        });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
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
