import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHelloWorld = async () => {
  try {
    const response = await api.get('/api/hello');
    return response.data;
  } catch (error) {
    console.error('Error fetching hello world:', error);
    throw error;
  }
};