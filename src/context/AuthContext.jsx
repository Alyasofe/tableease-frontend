import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (email, password, role = 'user') => {
        // Simulate API Call
        console.log(`Logging in as ${role}...`);

        // 1. Retrieve "Database" of users
        const usersDb = JSON.parse(localStorage.getItem('app_users') || '[]');

        // 2. Check if user exists
        let activeUser = usersDb.find(u => u.email === email);

        if (!activeUser) {
            // 3. Register new user if not found
            activeUser = {
                id: Date.now(),
                name: role === 'owner' ? "Sufra Owner" : "Waseem", // Default mock name
                email: email,
                role: role,
                avatar: null,
                phone: ''
            };
            usersDb.push(activeUser);
            localStorage.setItem('app_users', JSON.stringify(usersDb));
        }

        // 4. Set Session
        setUser(activeUser);
        localStorage.setItem('user', JSON.stringify(activeUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const register = (userData) => {
        const usersDb = JSON.parse(localStorage.getItem('app_users') || '[]');

        if (usersDb.some(u => u.email === userData.email)) {
            return { success: false, message: "Email is already registered!" };
        }

        if (usersDb.some(u => u.name === userData.name)) {
            return { success: false, message: "Full Name is already taken!" };
        }

        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            role: userData.role,
            avatar: null,
            phone: '',
            createdAt: new Date().toISOString()
        };

        usersDb.push(newUser);
        localStorage.setItem('app_users', JSON.stringify(usersDb));

        // Auto-login removed: User must sign in manually
        // setUser(newUser);
        // localStorage.setItem('user', JSON.stringify(newUser));

        return { success: true };
    };

    const updateProfile = (updatedData) => {
        setUser(prev => {
            const newUser = { ...prev, ...updatedData };

            // Update Session
            localStorage.setItem('user', JSON.stringify(newUser));

            // Update "Database"
            const usersDb = JSON.parse(localStorage.getItem('app_users') || '[]');
            const userIndex = usersDb.findIndex(u => u.email === prev.email);
            if (userIndex !== -1) {
                usersDb[userIndex] = { ...usersDb[userIndex], ...updatedData };
                localStorage.setItem('app_users', JSON.stringify(usersDb));
            }

            return newUser;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
