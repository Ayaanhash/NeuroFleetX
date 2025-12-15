// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/services';
import { ROLES } from '../utils/authUtils';
import '../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const redirectByRole = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return '/admin';
      case ROLES.FLEET_MANAGER:
        return '/fleet-manager';
      case ROLES.DRIVER:
        return '/driver';
      default:
        return '/customer';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user } = await authService.login(form);
      navigate(redirectByRole(user.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nf-auth-page">
      <div className="nf-auth-card">
        <h1 className="nf-auth-title">Login</h1>
        <p className="nf-auth-subtitle">
          Enter your email and password to access NeuroFleetX.
        </p>

        {error && <div className="nf-alert nf-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="nf-auth-form">
          <div className="nf-form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="nf-form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button className="nf-btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="nf-spinner" /> : 'Login'}
          </button>
        </form>

        <p className="nf-auth-footer">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
