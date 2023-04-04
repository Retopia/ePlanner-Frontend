import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  // Logging out redirects you to home page
  // Called when user presses on navbar "Logout" component
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">ePlanner</Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/view-events">View Events</Link></li>
        {!isAuthenticated ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <>
            <li className="welcome-back">Welcome back, {username}!</li>
            <li><Link to="/user-page">My Page</Link></li>
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;