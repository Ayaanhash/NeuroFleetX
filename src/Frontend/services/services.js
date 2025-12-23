import axios from "axios";
import { setUser, clearUser } from "../utils/authUtils";

const API_BASE = "http://localhost:8081/api";

/* ================= AUTH SERVICE ================= */

export const authService = {
  async register({ email, password, role }) {
    const res = await axios.post(`${API_BASE}/auth/register`, {
      email,
      password,
      role,
    });
    return res.data;
  },

  async login({ email, password }) {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password,
    });

    // backend should return user details
    setUser(res.data.user);
    return res.data;
  },

  logout() {
    clearUser();
  },
};

/* ================= PROFILE SERVICE ================= */

export const profileService = {
  async getProfile() {
    const res = await axios.get(`${API_BASE}/profile`);
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await axios.put(`${API_BASE}/profile`, profileData);
    return res.data;
  },

  async changePassword(data) {
    const res = await axios.put(`${API_BASE}/profile/password`, data);
    return res.data;
  },
};

/* ================= DASHBOARD DATA ================= */
/* (demo data – keep this for now) */

export const dashboardService = {
  getAdminMetrics() {
    return Promise.resolve({
      totalUsers: 128,
      totalFleets: 14,
      totalBookings: 2075,
      activeUsers: 58,
      completedTrips: 1890,
      totalRevenue: 425000,
    });
  },

  getFleetManagerMetrics() {
    return Promise.resolve({
      activeVehicles: 32,
      totalFleet: 48,
      activeTrips: 9,
      completedTrips: 680,
      activeDrivers: 26,
      weeklyRevenue: 72000,
    });
  },

  getDriverMetrics() {
    return Promise.resolve({
      todaysTrips: 6,
      todaysEarnings: 1850,
      distanceCovered: 74,
      rating: 4.8,
      completedTrips: 390,
      acceptanceRate: 94,
    });
  },

  getCustomerMetrics() {
    return Promise.resolve({
      activeBookings: 1,
      totalTrips: 54,
      totalSpent: 18500,
      amountSaved: 2300,
      upcomingTrips: 2,
      favouriteRoutes: 5,
    });
  },
};
