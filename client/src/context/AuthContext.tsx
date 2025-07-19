import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    userId: string | null;
    username: string | null;
    login: (token: string, userId: string, username: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');

        if (storedToken && storedUserId && storedUsername) {
            try {
                setIsAuthenticated(true);
                setUserId(storedUserId);
                setUsername(storedUsername);
            } catch (e) {
                console.error("Error parsing stored user data:", e);
                logout();
            }
        }
    }, []);

    const login = (token: string, id: string, user: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', id);
        localStorage.setItem('username', user);
        setIsAuthenticated(true);
        setUserId(id);
        setUsername(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUserId(null);
        setUsername(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};