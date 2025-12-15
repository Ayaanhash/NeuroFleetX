// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/services';
import { getUser } from '../utils/authUtils';
import '../styles/dashboard.css';

const Navbar = ({ onProfileClick }) => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const getInitial = () => {
    if (!user) return '?';
    if (user.name && user.name.length > 0) {
      return user.name[0].toUpperCase();
    }
    if (user.email && user.email.length > 0) {
      return user.email[0].toUpperCase();
    }
    return '?';
  };

  return (
    <nav className="nf-navbar">
      <div className="nf-navbar-left">
        <span className="nf-logo">NeuroFleetX</span>
        <span className="nf-navbar-subtitle">
          AI-Powered Urban Fleet & Traffic
        </span>
      </div>

      <div className="nf-navbar-right">
        <Link to="/" className="nf-nav-link">
          Home
        </Link>

        {user && (
          <>
            {/* ✅ PROFILE OPENS INSIDE DASHBOARD */}
            <button
              type="button"
              className="nf-profile-circle"
              title="Profile"
              onClick={() => onProfileClick && onProfileClick()}
            >
              {getInitial()}
            </button>

            <span className="nf-user-info">
              {user.email} ({user.role})
            </span>

            <button className="nf-btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
