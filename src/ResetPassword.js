import React, { useState, useEffect } from 'react';
import './stylesheets/ResetPassword.css';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isInvalidLink, setIsInvalidLink] = useState(false);

    const validateToken = async (token) => {
        const response = await fetch(process.env.REACT_APP_SERVER + `/validate-reset-token/${token}`);

        if (response.status === 400) {
            setIsInvalidLink(true);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const token = window.location.pathname.split('/').pop();
        validateToken(token);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        // Extract the token from the URL
        const token = window.location.pathname.split('/').pop();

        // Send the token and new password to your server
        const response = await fetch(process.env.REACT_APP_SERVER + '/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password }),
        });

        // Handle server response
        if (response.ok) {
            setMessage('Password reset successfully');

        } else {
            setMessage('Error: Unable to reset password');
        }
    };

    if (isLoading) {
        return null;
    }

    return (
        <div className="reset-password-page">
            {isInvalidLink ? (
                <div className="invalid-link-message">
                    <h2>Invalid/Expired password reset link</h2>
                </div>
            ) : (
                <div className="inner">
                    <h2>Reset Password</h2>
                    {message && <p>{message}</p>}
                    <form className="reset-password-form" onSubmit={handleSubmit}>
                        <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ResetPassword;
