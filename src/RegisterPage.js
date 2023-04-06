import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stylesheets/RegisterPage.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset the error message
    setErrorMessage(null);

    const email = event.target[0].value;
    const username = event.target[1].value;
    const password = event.target[2].value;

    // Replace this URL with your Express server's URL
    const response = await fetch(process.env.REACT_APP_SERVER + '/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('username', username);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isGoogleUser', 'false');
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/user-page');
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.error);
    }
  };

  return (
    <div className="register-page">
      <div className="inspirational-message">
        <h2>Welcome!</h2>
        <p>
          Join our community and start planning your next event with ease and convenience.
        </p>
      </div>
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
      <div className="register-wrapper">
        <h2>Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
