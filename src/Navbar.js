import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './stylesheets/App.module.css';

function Navbar() {
  const [showLinks, setShowLinks] = useState(false);

  const handleKebabClick = () => {
    setShowLinks(!showLinks);
  };

  const handleLinkClick = () => {
    setShowLinks(false);
  };

  // Weird bug with sessions and stuff?
  if (localStorage.getItem('isAuthenticated') === 'true' && !localStorage.getItem('username')) {
    localStorage.removeItem('isAuthenticated');
  }

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
    <nav className={styles.navbar}>
      <Link to="/" className={styles['nav-logo']}>ePlanner</Link>
      <div className={styles['kebab-menu']} onClick={handleKebabClick}>
        <div className={styles['kebab-line']}></div>
        <div className={styles['kebab-line']}></div>
        <div className={styles['kebab-line']}></div>
      </div>
      <ul className={`${styles['nav-links']} ${showLinks ? styles.show : ''}`}>
        <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
        <li><Link to="/view-events" onClick={handleLinkClick}>View Events</Link></li>
        {!isAuthenticated ? (
          <>
            <li><Link to="/login" onClick={handleLinkClick}>Login</Link></li>
            <li><Link to="/register" onClick={handleLinkClick}>Register</Link></li>
          </>
        ) : (
          <>
            <li className={styles['welcome-back']}>Welcome back, {username}!</li>
            <li><Link to="/user-page" onClick={handleLinkClick}>My Page</Link></li>
            <li><button className={styles['logout-btn']} onClick={handleLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );

}

export default Navbar;