# frontend/services/api.js

import axios from 'axios';

// ── Constants ─────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const STATUS_MAP = {
  PENDING_AI:           { label: 'Pending AI',    cls: 'badge-pending'   },
  AI_ANALYZED:          { label: 'AI Analyzed',   cls: 'badge-analyzed'  },
  DOCTOR_VERIFIED:      { label: 'Dr. Verified',  cls: 'badge-verified'  },
  PHARMACIST_COMPLETED: { label: 'Rx Complete',   cls: 'badge-completed' },
  REPORT_READY:         { label: 'Report Ready',  cls: 'badge-ready'     },
};

export const ERROR_MESSAGES = {
  400: 'Bad request. Please check your input.',
  401: 'Session expired. Please log in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'Conflict: This resource already exists.',
  422: 'Validation error. Please check your input.',
  429: 'Too many requests. Please slow down.',
  500: 'Server error. Please try again later.',
  502: 'Server is temporarily unavailable.',
  503: 'Service unavailable. Please try again later.',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

export const toFormData = (obj) => {
  const fd = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => fd.append(key, item));
    } else if (value !== undefined && value !== null) {
      fd.append(key, value);
    }
  });
  return fd;
};

export const parseJwt = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const isTokenExpired = () => {
  if (typeof window === 'undefined') return true;
  const token = localStorage.getItem('token');
  const payload = parseJwt(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

export const setUser = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
    window.location.href = '/login';
  }
};

export const getStatusBadge = (status) =>
  STATUS_MAP[status] ?? { label: status ?? 'Unknown', cls: 'badge-pending' };

export const getErrorMessage = (error) => {
  const serverMsg =
    error?.response?.data?.message ||
    error?.response?.data?.detail ||
    error?.response?.data?.error;

  if (serverMsg) return serverMsg;

  const status = error?.response?.status;
  if (status && ERROR_MESSAGES[status]) return ERROR_MESSAGES[status];

  if (error?.request && !error?.response) {
    return 'Network error. Please check your connection.';
  }

  return error?.message || 'An unexpected error occurred.';
};

// ── Axios Instance ────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor ───────────────────────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    error.friendlyMessage = getErrorMessage(error);

    if (status === 401 && typeof window !== 'undefined') {
      localStorage.clear();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;

// ── API Modules ───────────────────────────────────────────────────────────────

export const otpAPI = {
  send:   (email)      => api.post('/otp/send',   { email }),
  verify: (email, otp) => api.post('/otp/verify', { email, otp }),
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login',    data),
};

export const patientAPI = {
  uploadScan: (formData, onProgress) =>
    api.post('/patient/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    }),

  getStatus: (patientId) => api.get(`/patient/status/${patientId}`),

  getMyScans: () => api.get('/patient/scans'),

  // ✅ FIXED: was /patient/download/{scanId} — endpoint does not exist.
  // Correct endpoint is /reports/pdf/{scanId} (defined in backend/routers/reports.py)
  downloadReport: (scanId) =>
    api.get(`/reports/pdf/${scanId}`, { responseType: 'blob' }),
};

export const doctorAPI = {
  getPending:  ()               => api.get(`/doctor/pending`),
  analyzeScan: (scanId)         => api.post(`/doctor/analyze/${scanId}`),
  verify:      (scanId, formData) =>
    api.post(`/doctor/verify/${scanId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const pharmacistAPI = {
  getQueue: () => api.get('/pharmacist/queue'),
  complete: (scanId, notes) =>
    api.post(
      `/pharmacist/complete/${scanId}`,
      toFormData({ notes }),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ),
};

export const adminAPI = {
  getPending: ()                  => api.get('/admin/pending'),
  approve:    (scanId)            => api.post(`/admin/approve/${scanId}`),
  reject:     (scanId, reason)    =>
    api.post(`/admin/reject/${scanId}`, toFormData({ reason: reason ?? '' })),
};

export const chatbotAPI = {
  send: (message, session_id = 'default') =>
    api.post('/chatbot/', { message, session_id }),
};