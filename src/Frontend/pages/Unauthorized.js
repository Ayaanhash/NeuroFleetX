// src/pages/Unauthorized.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

const Unauthorized = () => {
  return (
    <div className="nf-auth-page">
      <div className="nf-auth-card">
        <h1 className="nf-auth-title">Access Denied</h1>
        <p className="nf-auth-subtitle">
          You don&apos;t have permission to view this page.
        </p>
        <Link to="/login" className="nf-btn-primary nf-center-btn">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
