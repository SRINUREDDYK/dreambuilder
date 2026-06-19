import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ user, handleLogout }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      setIsDark(false);
      document.body.classList.add('light-theme');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">DreamBuilder</span>
        </Link>
      </div>

      <div className="navbar-right">
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
          {isDark ? <FiSun size={20} className="icon-sun" /> : <FiMoon size={20} className="icon-moon" />}
        </button>

        {user ? (
          <div className="user-menu">
            <Link to="/profile" className="user-profile-link">
              <FiUser size={18} />
              <span className="username-display">{user.username}</span>
            </Link>
            <button onClick={() => handleLogout()} className="logout-btn">
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="btn btn-secondary btn-login">Login</Link>
            <Link to="/register" className="btn btn-primary btn-register">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
