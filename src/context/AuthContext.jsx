import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = 'http://localhost:5001';

    useEffect(() => {
        // Check if user is already logged in
        const storedToken = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (storedToken && userData) {
            setToken(storedToken);
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setToken(data.token);
                setUser({ ...data.user, favorites: data.user.favorites || [] });
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'An error occurred during login' };
        }
    };

    const register = async (username, email, password, role = 'customer') => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, role })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setToken(data.token);
                setUser({ ...data.user, favorites: data.user.favorites || [] });
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'An error occurred during registration' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateProfile = async (profileData) => {
        try {
            const storedToken = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                },
                body: JSON.stringify(profileData)
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser({ ...data.user, favorites: user?.favorites || [] });
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, message: error.message || 'Failed to update profile' };
        }
    };

    const toggleFavorite = async (restaurantId) => {
        try {
            const storedToken = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/users/favorites/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                },
                body: JSON.stringify({ restaurantId })
            });

            const data = await res.json();

            if (res.ok) {
                const updatedUser = { ...user, favorites: data.favorites };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                return { success: true, isFavorite: data.isFavorite };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Toggle favorite error:', error);
            return { success: false, message: error.message || 'Failed to toggle favorite' };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated,
            loading,
            login,
            register,
            logout,
            updateProfile,
            toggleFavorite
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
