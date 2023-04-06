import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stylesheets/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: '125373371985-su7jac9becmpka5d24pc78lu23ab5lnp.apps.googleusercontent.com',
        callback: async (response) => {
          const id_token = response.credential;
          const googleResponse = await fetch(process.env.REACT_APP_SERVER + '/users/google-signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_token }),
          });


          if (googleResponse.ok) {
            const data = await googleResponse.json();
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('username', data.username);
            localStorage.setItem('isGoogleUser', 'true');
            localStorage.setItem('accessToken', data.accessToken);
            navigate('/user-page');
          } else {
            const errorData = await googleResponse.json();
            setErrorMessage(errorData.error);
          }
        },
        auto_select: false,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          width: '240',
          height: '50',
          locale: 'en',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        }
      );
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset the error message
    setErrorMessage(null);

    const response = await fetch(process.env.REACT_APP_SERVER + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', data.username);
      localStorage.setItem('isGoogleUser', 'false');
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/user-page');
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.error);
    }
  };

  return (
    <div className="login-page">
      <div className="inspirational-message">
        <h2>Welcome Back!</h2>
        <p>
          Plan your next event with ease and enjoy the convenience of our
          platform.
        </p>
      </div>
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
      <div className="login-wrapper">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Submit</button>
        </form>
        <div className="divider"></div>
        <div id="google-signin-button"></div>
      </div>
    </div>
  );
}

export default LoginPage;
