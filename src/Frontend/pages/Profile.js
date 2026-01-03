import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { profileService } from "../services/services";
import { getUser } from "../utils/authUtils";
import MapView from "../components/MapView";
import "../styles/auth.css";

const DASHBOARD_ROUTE = {
  ADMIN: "/admin",
  FLEET_MANAGER: "/fleet-manager",
  DRIVER: "/driver",
  CUSTOMER: "/customer",
};

const Profile = () => {
  const navigate = useNavigate();

  // 🔐 LOGGED-IN USER (SINGLE SOURCE OF TRUTH)
  const user = getUser();

  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const [form, setForm] = useState({
    name: "",
    dob: "",
    phone: "",
    gender: "Female",
    travelPreferences: "",
    location: "",
    latitude: null,
    longitude: null,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // ================= LOAD PROFILE =================
  useEffect(() => {
    if (!user) {
      setProfileLoaded(true);
      return;
    }

    const profile = profileService.getProfile();

    if (profile) {
      setForm((prev) => ({
        ...prev,
        ...profile,
      }));
    }

    setProfileLoaded(true);
  }, [user]);

  // ================= LIVE LOCATION =================
  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setForm((prev) => ({
          ...prev,
          latitude,
          longitude,
          location:
            prev.location?.trim()
              ? prev.location
              : `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        }));
      },
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // ================= INPUT HANDLER =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ================= DASHBOARD NAV =================
  const goBackToDashboard = () => {
    navigate(DASHBOARD_ROUTE[user?.role] || "/");
  };

  // ================= SAVE PROFILE =================
  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (
      showPasswordFields &&
      (form.currentPassword || form.newPassword || form.confirmPassword)
    ) {
      if (!form.currentPassword) {
        setErr("Please enter current password.");
        return;
      }
      if (form.newPassword.length < 6) {
        setErr("New password must be at least 6 characters.");
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        setErr("Passwords do not match.");
        return;
      }
    }

    try {
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
      setTimeout(goBackToDashboard, 800);
    } catch (error) {
      setErr(error.message || "Failed to update profile.");
    }
  };

  // ================= NO USER =================
  if (!user && profileLoaded) {
    return (
      <div className="nf-auth-page">
        <div className="nf-auth-card">
          <h1 className="nf-auth-title">Profile</h1>
          <p className="nf-auth-subtitle">Please login to view your profile.</p>
          <Link to="/login" className="nf-btn-primary nf-center-btn">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="nf-auth-page">
      <div className="nf-auth-card nf-profile-card">
        <h1 className="nf-auth-title">My Profile</h1>

        {err && <div className="nf-alert nf-alert-error">{err}</div>}
        {msg && <div className="nf-alert nf-alert-success">{msg}</div>}

        <form onSubmit={handleSubmit} className="nf-auth-form nf-profile-form">
          <div className="nf-form-row">
            <div className="nf-form-group">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </div>
            <div className="nf-form-group">
              <label>Email</label>
              <input value={user?.email || ""} readOnly />
            </div>
          </div>

          <div className="nf-form-row">
            <div className="nf-form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} />
            </div>
            <div className="nf-form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="nf-form-row">
            <div className="nf-form-group">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </div>
            <div className="nf-form-group">
              <label>Role</label>
              <input value={user?.role || ""} readOnly />
            </div>
          </div>

          <div className="nf-form-group">
            <label>Travel Preferences</label>
            <textarea
              name="travelPreferences"
              value={form.travelPreferences}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="nf-form-group">
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} />
            <MapView lat={form.latitude} lng={form.longitude} />
          </div>

          <div className="nf-form-actions">
            <button type="button" className="nf-btn-outline" onClick={goBackToDashboard}>
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
