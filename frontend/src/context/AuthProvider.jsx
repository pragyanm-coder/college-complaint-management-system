
import { useState } from 'react';
import { AuthContext } from './AuthContext';
import api from '../api/axios';

const USER_KEY = 'ccrs_user';
const TOKEN_KEY = 'ccrs_token';

function loadSavedUser() {
    try {
        const saved = localStorage.getItem(USER_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

function AuthProvider({ children }) {
    const [user, setUser] = useState(loadSavedUser);

    const saveAuth = (newUser, token) => {
        setUser(newUser);

        if (newUser && token) {
            localStorage.setItem(USER_KEY, JSON.stringify(newUser));
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_KEY);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/api/auth/login', {
                email,
                password,
            });

            const { user, token } = response.data.data;

            saveAuth({
                id: user.id,
                name: user.fullName,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            }, token);

            return { ok: true };
        } catch (error) {
            return {
                ok: false,
                message: error.response?.data?.message || error.message || 'Login failed.',
            };
        }
    };

    const registerStudent = async (details) => {
        try {
            const response = await api.post('/api/auth/register', {
                fullName: details.fullName,
                email: details.email,
                password: details.password,
                rollNumber: details.rollNumber,
                department: details.department,
                year: details.year,
                phone: details.phone,
            });

            const { user, token } = response.data.data;

            saveAuth({
                id: user.id,
                name: user.fullName,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            }, token);

            return { ok: true };
        } catch (error) {
            return {
                ok: false,
                message: error.response?.data?.message || error.message || 'Registration failed.',
            };
        }
    };

    const logout = () => saveAuth(null, null);

    return (
        <AuthContext.Provider value={{ user, login, registerStudent, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
