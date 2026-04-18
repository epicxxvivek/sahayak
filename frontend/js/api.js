/**
 * SAHAYAK — API Client
 * Centralised fetch wrapper with JWT auth headers.
 * Replace BASE_URL with your deployed backend URL.
 */

const API_BASE = 'http://localhost:5000/api';

const Api = {
  /** Get auth headers */
  _headers(extra = {}) {
    const token = localStorage.getItem('sahayak_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...extra,
    };
  },

  /** Generic request */
  async _request(method, endpoint, body = null) {
    const opts = { method, headers: this._headers() };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${API_BASE}${endpoint}`, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  },

  get:    (ep)       => Api._request('GET',    ep),
  post:   (ep, body) => Api._request('POST',   ep, body),
  put:    (ep, body) => Api._request('PUT',    ep, body),
  delete: (ep)       => Api._request('DELETE', ep),

  // ── Auth ──────────────────────────────────────────────────────
  async login(email, password) {
    const data = await this.post('/auth/login', { email, password });
    localStorage.setItem('sahayak_token', data.token);
    localStorage.setItem('sahayak_user',  JSON.stringify(data.user));
    return data;
  },

  async signup(payload) {
    const data = await this.post('/auth/signup', payload);
    return data;
  },

  logout() {
    localStorage.removeItem('sahayak_token');
    localStorage.removeItem('sahayak_user');
    window.location.href = 'login.html';
  },

  getUser() {
    try { return JSON.parse(localStorage.getItem('sahayak_user') || 'null'); }
    catch { return null; }
  },

  isLoggedIn() { return !!localStorage.getItem('sahayak_token'); },

  // ── Providers ──────────────────────────────────────────────────
  getProviders(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/providers${qs ? '?' + qs : ''}`);
  },
  getProvider(id) { return this.get(`/providers/${id}`); },
  createProvider(data) { return this.post('/providers', data); },
  updateProvider(id, data) { return this.put(`/providers/${id}`, data); },

  // ── Bookings ───────────────────────────────────────────────────
  getBookings()       { return this.get('/bookings'); },
  getBooking(id)      { return this.get(`/bookings/${id}`); },
  createBooking(data) { return this.post('/bookings', data); },
  updateBookingStatus(id, status) { return this.put(`/bookings/${id}/status`, { status }); },

  // ── Messages ───────────────────────────────────────────────────
  getMessages(bookingId)       { return this.get(`/messages/${bookingId}`); },
  sendMessage(bookingId, text) { return this.post(`/messages/${bookingId}`, { text }); },

  // ── Reviews ────────────────────────────────────────────────────
  getReviews(providerId) { return this.get(`/reviews/${providerId}`); },
  submitReview(data)     { return this.post('/reviews', data); },
};

window.Api = Api;
