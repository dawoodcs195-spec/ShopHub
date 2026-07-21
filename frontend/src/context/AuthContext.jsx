import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // ===============================
    // User
    // ===============================
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // ===============================
    // Token
    // ===============================
    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || null;
    });

    // ===============================
    // Persist Auth
    // ===============================
    useEffect(() => {
        if (user) {
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );
        } else {
            localStorage.removeItem("user");
        }

        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [user, token]);

    // ===============================
    // Login
    // ===============================
    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
    };

    // ===============================
    // Update User
    // ===============================
    const updateUser = (userData) => {
        setUser(userData);
    };

    // ===============================
    // Logout
    // ===============================
    const logout = () => {
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                updateUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);