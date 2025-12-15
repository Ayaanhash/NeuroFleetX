// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { profileService } from "../services/services";
import { getUser } from "../utils/authUtils";
import MapView from "../components/MapView"; // ✅ Map component
import "../styles/auth.css";

const DASHBOARD_ROUTE = {
  ADMIN: "/admin",
  FLEET_MANAGER: "/fleet-manager",
  DRIVER: "/driver",
  CUSTOMER: "/customer",
};

const Profile = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    dob: "",
    phone: "",
    gender: "Female",
    travelPreferences: "",
    location: "",
    role: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    // ✅ Live location
    latitude: null,
    longitude: null,
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Load profile on mount
  useEffect(() => {
    const p = profileService.getProfile();
    if (p) {
      setForm((prev) => ({
        ...prev,
        ...p,
      }));
    }
    setProfileLoaded(true);
  }, []);

  // ✅ Get live location using browser geolocation
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation is not available in this browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setForm((prev) => ({
          ...prev,
          latitude,
          longitude,
          // If location text is empty, auto-fill with coords
          location:
            prev.location && prev.location.trim() !== ""
              ? prev.location
              : `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        }));
      },
      (error) => {
        console.error("Error getting live location:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    // Cleanup watcher when component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const goBackToDashboard = () => {
    const role = user?.role || form.role;
    const target = DASHBOARD_ROUTE[role] || "/";
    navigate(target);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    // Password validation if user is changing password
    if (
      showPasswordFields &&
      (form.currentPassword || form.newPassword || form.confirmPassword)
    ) {
      if (!form.currentPassword) {
        setErr("Please enter your current password.");
        return;
      }
      if (!form.newPassword || form.newPassword.length < 6) {
        setErr("New password must be at least 6 characters.");
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        setErr("New password and confirm password do not match.");
        return;
      }
    }

    try {
      // ✅ Save profile (including optional live location)
      profileService.updateProfile({
        name: form.name,
        dob: form.dob,
        phone: form.phone,
        gender: form.gender,
        travelPreferences: form.travelPreferences,
        location: form.location,
        latitude: form.latitude,
        longitude: form.longitude,
      });

      if (showPasswordFields && form.newPassword) {
        profileService.changePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        });
      }

      setMsg("Profile updated successfully.");

      setTimeout(() => {
        goBackToDashboard();
      }, 700);
    } catch (error) {
      setErr(error.message || "Failed to update profile.");
    }
  };

  const handleCancel = () => {
    goBackToDashboard();
  };

  // If no profile exists
  if (profileLoaded && !form.email) {
    return (
      <div className="nf-auth-page">
        <div className="nf-auth-card">
          <h1 className="nf-auth-title">Profile</h1>
          <p className="nf-auth-subtitle">
            No profile found. Please register your account first.
          </p>
          <Link to="/register" className="nf-btn-primary nf-center-btn">
            Go to Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="nf-auth-page">
      <div className="nf-auth-card nf-profile-card">
        <h1 className="nf-auth-title">My Profile</h1>
        <p className="nf-auth-subtitle">
          Manage your personal details, preferences and password.
        </p>

        {err && <div className="nf-alert nf-alert-error">{err}</div>}
        {msg && <div className="nf-alert nf-alert-success">{msg}</div>}

        <form onSubmit={handleSubmit} className="nf-auth-form nf-profile-form">
          <div className="nf-form-row">
            <div className="nf-form-group">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </div>
            <div className="nf-form-group">
              <label>Email</label>
              <input name="email" value={form.email} readOnly />
            </div>
          </div>

          <div className="nf-form-row">
            <div className="nf-form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
            </div>
            <div className="nf-form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
              />
            </div>
          </div>

          <div className="nf-form-row">
            <div className="nf-form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="nf-form-group">
              <label>Role</label>
              <input name="role" value={form.role} readOnly />
            </div>
          </div>

          <div className="nf-form-group">
            <label>Travel Preferences</label>
            <textarea
              name="travelPreferences"
              value={form.travelPreferences}
              onChange={handleChange}
              placeholder="Example: prefers shared rides, avoids peak hours, likes AC cabs, etc."
              rows={3}
            />
          </div>

          {/* Location + Live Map */}
          <div className="nf-form-group">
            <label>Location (live)</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="We try to fill this from your device location"
            />
            <small className="nf-field-note">
              Your browser may ask for permission to access location.
            </small>

            {/* ✅ Live location map */}
            <div style={{ marginTop: "10px" }}>
              <MapView lat={form.latitude} lng={form.longitude} />
            </div>
          </div>

          {/* Security section */}
          <div className="nf-profile-section">
            <div className="nf-profile-section-header">
              <h4 className="nf-section-title">Security</h4>
              <button
                type="button"
                className="nf-btn-outline nf-small-btn"
                onClick={() => setShowPasswordFields((prev) => !prev)}
              >
                {showPasswordFields ? "Hide Password Fields" : "Change Password"}
              </button>
            </div>

            {showPasswordFields && (
              <>
                <div className="nf-form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className="nf-form-row">
                  <div className="nf-form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="nf-form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="nf-form-actions">
            <button
              type="button"
              className="nf-btn-outline"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button className="nf-btn-primary" type="submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
