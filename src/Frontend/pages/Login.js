import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/services";
import { setUser, clearUser } from "../utils/authUtils";
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ROLE BASED REDIRECT (MATCHES BACKEND EXACTLY)
  const redirectByRole = (role) => {
    switch (role) {
      case "ADMIN":
        return "/admin";
      case "FLEET_MANAGER":
        return "/fleet-manager";
      case "DRIVER":
        return "/driver";
      case "CUSTOMER":
        return "/customer";
      default:
        return "/login";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🚨 CLEAR OLD USER (VERY IMPORTANT)
      clearUser();

      // Backend returns USER object
      const user = await authService.login(form);

      console.log("LOGIN USER:", user); // debug
      console.log("ROLE:", user.role);  // debug

      // ✅ SINGLE SOURCE OF TRUTH
      setUser({
        email: user.email,
        role: user.role,
      });

      navigate(redirectByRole(user.role), { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
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
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="nf-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button className="nf-btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
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
