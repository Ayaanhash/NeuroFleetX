import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/services";
import "../styles/auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (form.password !== form.confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        email: form.email,
        password: form.password,
        role: form.role,
      });

      setMsg("Registration successful! Please login.");
      setErr("");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } // fixed the display issue
    catch (error) {
      console.log("Register error:", error);

      const backendMsg =
        error.response?.data?.message ||
        error.response?.data ||
        "";

      if (
        backendMsg.toLowerCase().includes("already") ||
        backendMsg.toLowerCase().includes("exists")
      ) {
        setErr("Registration already done with this email");
      } else {
        setErr("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nf-auth-page">
      <div className="nf-auth-card">
        <h1 className="nf-auth-title">Register</h1>
        <p className="nf-auth-subtitle">
          Create your NeuroFleetX account
        </p>

        {err && <div className="nf-alert nf-alert-error">{err}</div>}
        {msg && <div className="nf-alert nf-alert-success">{msg}</div>}

        <form onSubmit={handleSubmit} className="nf-auth-form">
          {/* Email */}
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

          {/* Password */}
          <div className="nf-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="nf-form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role */}
          <div className="nf-form-group">
            <label>Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="ADMIN">Admin</option>
              <option value="FLEET_MANAGER">Fleet Manager</option>
              <option value="DRIVER">Driver</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>

          <button
            className="nf-btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="nf-auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
