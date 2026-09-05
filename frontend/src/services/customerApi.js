const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';

const TOKEN_KEY = 'transmaa_customer_token';
const CUSTOMER_KEY = 'transmaa_customer_profile';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredCustomer() {
  try {
    const raw = localStorage.getItem(CUSTOMER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function persistSession(token, customer) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CUSTOMER_KEY);
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

export const register = (name, phone, email) =>
  request('/api/customer/auth/register', { method: 'POST', body: { name, phone, email }, auth: false });

export const requestOtp = (identifier) =>
  request('/api/customer/auth/request-otp', { method: 'POST', body: identifier, auth: false });

export const verifyOtp = (identifier, otp) =>
  request('/api/customer/auth/verify-otp', { method: 'POST', body: { ...identifier, otp }, auth: false });

export const getMe = () => request('/api/customer/auth/me');

export const updateProfile = (name, email) =>
  request('/api/customer/auth/profile', { method: 'PUT', body: { name, email } });

// ==========================================
// BOOKINGS
// ==========================================

export const createBooking = (payload) =>
  request('/api/customer/bookings', { method: 'POST', body: payload });

export const getMyBookings = () => request('/api/customer/bookings');

// ==========================================
// VEHICLES (BUY & SELL)
// ==========================================

export const getLiveVehicles = () => request('/api/customer/vehicles/live', { auth: false });

export const expressInterest = (vehicleId, name, phone) =>
  request(`/api/customer/vehicles/${vehicleId}/interest`, {
    method: 'POST',
    body: { name, phone },
    auth: false
  });

export const submitVehicle = (payload) =>
  request('/api/customer/vehicles', { method: 'POST', body: payload });

// ==========================================
// FINANCE & INSURANCE ENQUIRIES
// ==========================================

export const submitEnquiry = (payload) =>
  request('/api/customer/enquiries', { method: 'POST', body: payload });
