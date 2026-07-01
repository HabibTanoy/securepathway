import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: BASE, withCredentials: true });

// ── TOKEN MANAGEMENT ─────────────────────────────────────────────────────────
const getToken  = () => localStorage.getItem('sp_at');
const setToken  = t  => localStorage.setItem('sp_at', t);
const getRefresh = () => localStorage.getItem('sp_rt');
const setRefresh = t  => localStorage.setItem('sp_rt', t);
const clearTokens = () => { localStorage.removeItem('sp_at'); localStorage.removeItem('sp_rt'); };

api.interceptors.request.use(cfg => {
  const token = getToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  async err => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry && getRefresh()) {
      orig._retry = true;
      try {
        const { data } = await axios.post(`${BASE}/auth/refresh`, { refreshToken: getRefresh() });
        setToken(data.accessToken);
        orig.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(orig);
      } catch {
        clearTokens();
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ── AUTH ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: d => api.post('/auth/register', d).then(r => {
    setToken(r.data.accessToken); setRefresh(r.data.refreshToken); return r.data;
  }),
  login: d => api.post('/auth/login', d).then(r => {
    setToken(r.data.accessToken); setRefresh(r.data.refreshToken); return r.data;
  }),
  logout: () => api.post('/auth/logout', { refreshToken: getRefresh() }).finally(clearTokens),
  me: () => api.get('/auth/me').then(r => r.data),
};

// ── PROGRESS ─────────────────────────────────────────────────────────────────
export const progressAPI = {
  getAll:           () => api.get('/progress').then(r => r.data),
  update:           (moduleId, data) => api.patch(`/progress/${moduleId}`, data),
  getSpaced:        () => api.get('/progress/spaced').then(r => r.data),
  flagSpaced:       data => api.post('/progress/spaced', data),
  resolveSpaced:    (id, data) => api.patch(`/progress/spaced/${id}`, data),
  getBookmarks:     () => api.get('/progress/bookmarks').then(r => r.data),
  addBookmark:      id => api.post(`/progress/bookmarks/${id}`),
  removeBookmark:   id => api.delete(`/progress/bookmarks/${id}`),
};

// ── QUIZ ─────────────────────────────────────────────────────────────────────
export const quizAPI = {
  gradeShortAnswer: data => api.post('/quiz/short-answer', data).then(r => r.data),
  saveResponse:     data => api.post('/quiz/response', data),
};

// ── ASSESSMENT ────────────────────────────────────────────────────────────────
export const assessAPI = {
  submitTrack:      data => api.post('/assessment/submit', data).then(r => r.data),
  submitSimulation: data => api.post('/assessment/simulation', data).then(r => r.data),
  getPortfolio:     () => api.get('/assessment/portfolio').then(r => r.data),
  getCertificates:  () => api.get('/assessment/certificates').then(r => r.data),
  awardCert:        data => api.post('/assessment/certificates', data),
};

// ── MFA ───────────────────────────────────────────────────────────────────────
export const mfaAPI = {
  status:  () => api.get('/mfa/status').then(r => r.data),
  setup:   () => api.post('/mfa/setup').then(r => r.data),
  confirm: token => api.post('/mfa/confirm', { token }).then(r => r.data),
  disable: token => api.delete('/mfa/disable', { data: { token } }).then(r => r.data),
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getTeam:        () => api.get('/admin/team').then(r => r.data),
  getLearner:     id => api.get(`/admin/team/${id}`).then(r => r.data),
  getTrackStats:  () => api.get('/admin/track-stats').then(r => r.data),
  invite:         data => api.post('/admin/invite', data).then(r => r.data),
  getInvitations: () => api.get('/admin/invitations').then(r => r.data),
  getAiLog:       () => api.get('/admin/ai-log').then(r => r.data),
  uploadDoc:      form => api.post('/admin/documents', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  getDocs:        () => api.get('/admin/documents').then(r => r.data),
  signCert:       id => api.post(`/admin/certificates/${id}/sign`),
  getAssessments: () => api.get('/admin/assessments').then(r => r.data),
  signAssessment: (id, data) => api.post(`/admin/assessments/${id}/sign`, data).then(r => r.data),
  exportGDPR:     id => api.get(`/admin/gdpr/export/${id}`).then(r => r.data),
  deleteUser:     id => api.delete(`/admin/gdpr/delete/${id}`),
};

export { clearTokens };
export default api;
