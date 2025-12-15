// src/utils/authUtils.js

export const ROLES = {
  ADMIN: 'ADMIN',
  FLEET_MANAGER: 'FLEET_MANAGER',
  DRIVER: 'DRIVER',
  CUSTOMER: 'CUSTOMER',
};

const USER_KEY = 'nf_demo_user';

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return !!getUser();
}

export function getUserRole() {
  return getUser()?.role || null;
}

export function hasAnyRole(roles = []) {
  const role = getUserRole();
  return role && roles.includes(role);
}
