import axios from 'axios';

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  headers: { 'Content-Type': 'application/json' },
});

// Placeholder
client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
