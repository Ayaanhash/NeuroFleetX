// src/pages/Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/services";
import { ROLES } from "../utils/authUtils";
import "../styles/auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: ROLES.CUSTOMER,
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setMsg("");
  setErr("");

  if (form.password !== form.confirmPassword) {
    setErr("Passwords do not match.");
    return;
  }

  try {
    await authService.register({
      email: form.email,
      password: form.password,
      role: form.role,
    });

    // If backend call did NOT throw → registration is successful
    setErr("");
    setMsg("Registration successful! Please login.");
    setTimeout(() => navigate("/login"), 1000);

  } catch (error) {
    console.log("Register error:", error.response || error);

    /*
      IMPORTANT FIX:
      Sometimes backend returns 200/201 with no JSON body,
      Axios treats it as error, but user is already saved.
    */
    if (
      error.response &&
      (error.response.status === 200 || error.response.status === 201)
    ) {
      setErr("");
      setMsg("Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 1000);
    } else {
      setErr("Registration failed. Please try again.");
    }
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
              <option value={ROLES.ADMIN}>Admin</option>
              <option value={ROLES.FLEET_MANAGER}>Fleet Manager</option>
              <option value={ROLES.DRIVER}>Driver</option>
              <option value={ROLES.CUSTOMER}>Customer</option>
            </select>
          </div>

          <button className="nf-btn-primary" type="submit">
            Register
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
