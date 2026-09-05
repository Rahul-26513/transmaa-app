const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';

const TOKEN_KEY = 'transmaa_driver_token';
const DRIVER_KEY = 'transmaa_driver_profile';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredDriver() {
  try {
    const raw = localStorage.getItem(DRIVER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function persistSession(token, driver) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(DRIVER_KEY, JSON.stringify(driver));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(DRIVER_KEY);
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return data;
}

// ==========================================
// AUTH
// ==========================================

export const register = (payload) =>
  request('/api/driver/auth/register', { method: 'POST', body: payload, auth: false });

export const requestOtp = (identifier) =>
  request('/api/driver/auth/request-otp', { method: 'POST', body: identifier, auth: false });

export const verifyOtp = (identifier, otp) =>
  request('/api/driver/auth/verify-otp', { method: 'POST', body: { ...identifier, otp }, auth: false });

export const getMe = () => request('/api/driver/auth/me');

// ==========================================
// LOADS
// ==========================================

export const getAvailableLoads = () => request('/api/driver/loads/available');

export const getMyLoads = () => request('/api/driver/loads/mine');

export const acceptLoad = (bookingId) =>
  request(`/api/driver/loads/${bookingId}/accept`, { method: 'PUT' });

export const markOnTheWay = (bookingId) =>
  request(`/api/driver/loads/${bookingId}/on-the-way`, { method: 'PUT' });

export const markDelivered = (bookingId) =>
  request(`/api/driver/loads/${bookingId}/deliver`, { method: 'PUT' });
