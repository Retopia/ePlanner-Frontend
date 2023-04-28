import React, { useState } from 'react';
import './stylesheets/ForgotPassword.css';
import ReCAPTCHA from 'react-google-recaptcha';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [message, setMessage] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const checkGoogleUser = async (email) => {
        const response = await fetch(process.env.REACT_APP_SERVER + `/is-google-user/${email}`);
        const data = await response.json();
        return data.isGoogleUser;
    };

    const handleSendEmail = async (event) => {
        event.preventDefault();

        if (!captcha) {
            setMessage('Error: Please complete the captcha first');
            return;
        }

        // Google user checking
        const isGoogleUser = await checkGoogleUser(email);
        if (isGoogleUser) {
            setMessage('Cannot reset password of Google user');
            return;
        }

        setEmailSent(true);

        // Send the email and captcha to your server
        const response = await fetch(process.env.REACT_APP_SERVER + '/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, captcha }),
        });

        // Handle server response
        if (response.ok) {
            setMessage('Success: Password reset email sent');
        } else {
            setMessage('Error: Unable to send password reset email');
            setEmailSent(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="inner">
                <h2 className="forgot-password-title">Forgot your password?</h2>
                {message && <p>{message}</p>}
                <form className="email-form" onSubmit={handleSendEmail}>
                    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <ReCAPTCHA sitekey={"6Le_yaglAAAAANTEAKBnmSjwtZXtSFxwGdNcsK5W"} onChange={(value) => setCaptcha(value)} />
                    <button type="submit" disabled={emailSent}>
                        {emailSent ? 'Email Sent' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
