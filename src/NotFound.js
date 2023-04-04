// This file is for handling all non-existent pages on the site, redirecting them accordingly
import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const navigate = useNavigate();

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/user-page');
        } else {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return null;
}

export default NotFound;
