const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';

const TOKEN_KEY = 'transmaa_staff_token';
const STAFF_KEY = 'transmaa_staff_profile';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredStaff() {
  try {
    const raw = localStorage.getItem(STAFF_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function persistSession(token, staff) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(STAFF_KEY);
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

export const login = (phone, password) =>
  request('/api/staff/auth/login', { method: 'POST', body: { phone, password }, auth: false });

export const getMe = () => request('/api/staff/auth/me');

// ==========================================
// BOOKINGS / ORDERS
// ==========================================

export const getBookings = () => request('/api/staff/bookings');
export const acceptBooking = (id, payload) =>
  request(`/api/staff/bookings/${id}/accept`, { method: 'PUT', body: payload });
export const rejectBooking = (id, reason) =>
  request(`/api/staff/bookings/${id}/reject`, { method: 'PUT', body: { reason } });
export const driverAcceptBooking = (id, driverId) =>
  request(`/api/staff/bookings/${id}/driver-accept`, { method: 'PUT', body: { driverId } });
export const sendBookingConfirmation = (id) =>
  request(`/api/staff/bookings/${id}/send-confirmation`, { method: 'PUT' });
export const markBookingDelivered = (id) =>
  request(`/api/staff/bookings/${id}/deliver`, { method: 'PUT' });

// ==========================================
// DRIVERS
// ==========================================

export const getDrivers = () => request('/api/staff/drivers');
export const approveDriver = (id) => request(`/api/staff/drivers/${id}/approve`, { method: 'PUT' });
export const rejectDriver = (id) => request(`/api/staff/drivers/${id}/reject`, { method: 'PUT' });
export const toggleDriverStatus = (id) =>
  request(`/api/staff/drivers/${id}/toggle-status`, { method: 'PUT' });

// ==========================================
// VEHICLES (BUY & SELL)
// ==========================================

export const getVehicles = () => request('/api/staff/vehicles');
export const approveVehicle = (id) => request(`/api/staff/vehicles/${id}/approve`, { method: 'PUT' });
export const rejectVehicle = (id) => request(`/api/staff/vehicles/${id}/reject`, { method: 'PUT' });

// ==========================================
// FINANCE & INSURANCE ENQUIRIES
// ==========================================

export const getEnquiries = () => request('/api/staff/enquiries');
export const toggleEnquiryContacted = (id) =>
  request(`/api/staff/enquiries/${id}/toggle-contacted`, { method: 'PUT' });
