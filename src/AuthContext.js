import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated') === 'true';
        const storedUsername = localStorage.getItem('username');

        setIsAuthenticated(authStatus);
        setUsername(storedUsername);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, setIsAuthenticated, setUsername }}>
            {children}
        </AuthContext.Provider>
    );
};
