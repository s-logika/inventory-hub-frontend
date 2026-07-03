import axios from 'axios';

const serverBaseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.FLASK_API_URL || 'http://127.0.0.1:5000';

const apiClient = axios.create({
  // In the browser, use same-origin requests so Next.js can proxy to Flask (avoids CORS).
  baseURL: typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_URL ? '' : serverBaseUrl,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiClient;
