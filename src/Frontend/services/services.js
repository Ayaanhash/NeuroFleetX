// src/services/services.js
import { setUser, clearUser } from '../utils/authUtils';

const REGISTERED_USER_KEY = 'nf_registered_user';

export const authService = {
  async register({ gender, role, email, password }) {
    // Initial user data (other fields filled later in Profile)
    const registeredUser = {
      name: '',
      dob: '',
      phone: '',
      travelPreferences: '',
      location: '',
      gender,
      role,
      email,
      password,
    };

    localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(registeredUser));
    return { success: true };
  },

  async login({ email, password }) {
    const raw = localStorage.getItem(REGISTERED_USER_KEY);
    if (!raw) {
      throw new Error('No account found. Please register first.');
    }

    let registered;
    try {
      registered = JSON.parse(raw);
    } catch {
      throw new Error('Stored user data is invalid. Please register again.');
    }

    if (registered.email !== email || registered.password !== password) {
      throw new Error('Invalid email or password.');
    }

    // Logged-in user object (used by dashboards & navbar)
    const user = {
      email: registered.email,
      role: registered.role,
      gender: registered.gender,
      name: registered.name || registered.email.split('@')[0],
    };

    setUser(user);
    return { user };
  },

  async logout() {
    clearUser();
  },
};

// ========= PROFILE SERVICE =========

export const profileService = {
  getProfile() {
    const raw = localStorage.getItem(REGISTERED_USER_KEY);
    if (!raw) return null;
    try {
      const stored = JSON.parse(raw);
      return {
        name: stored.name || '',
        email: stored.email || '',
        dob: stored.dob || '',
        phone: stored.phone || '',
        gender: stored.gender || '',
        travelPreferences: stored.travelPreferences || '',
        location: stored.location || '',
        role: stored.role || '',
      };
    } catch {
      return null;
    }
  },

  updateProfile({ name, dob, phone, gender, travelPreferences, location }) {
    const raw = localStorage.getItem(REGISTERED_USER_KEY);
    if (!raw) {
      throw new Error('No registered user found.');
    }

    const stored = JSON.parse(raw);
    const updated = {
      ...stored,
      name: name ?? stored.name,
      dob: dob ?? stored.dob,
      phone: phone ?? stored.phone,
      gender: gender ?? stored.gender,
      travelPreferences: travelPreferences ?? stored.travelPreferences,
      location: location ?? stored.location,
    };

    // update saved registration details
    localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(updated));

    // update current logged-in user (used in navbar etc.)
    setUser({
      email: updated.email,
      role: updated.role,
      gender: updated.gender,
      name: updated.name || updated.email,
    });

    return {
      success: true,
      profile: {
        name: updated.name,
        email: updated.email,
        dob: updated.dob,
        phone: updated.phone,
        gender: updated.gender,
        travelPreferences: updated.travelPreferences,
        location: updated.location,
        role: updated.role,
      },
    };
  },

  changePassword({ currentPassword, newPassword }) {
    const raw = localStorage.getItem(REGISTERED_USER_KEY);
    if (!raw) {
      throw new Error('No registered user found.');
    }

    const stored = JSON.parse(raw);

    if (stored.password !== currentPassword) {
      throw new Error('Current password is incorrect.');
    }

    const updated = {
      ...stored,
      password: newPassword,
    };

    localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(updated));

    return { success: true };
  },
};

// ========= DASHBOARD DATA (demo) =========

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
