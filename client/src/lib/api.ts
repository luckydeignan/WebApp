// src/lib/api.ts   (or src/services/api.ts)
import axios from 'axios';

// Create ONE pre‑configured instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10_000,
  // headers: { Authorization: `Bearer ${token}` }   // if you need defaults
});

// Example interceptors (optional)
// api.interceptors.response.use(
//   res => res,
//   err => {
//     // central error handling
//     return Promise.reject(err);
//   }
// );

export default api;
