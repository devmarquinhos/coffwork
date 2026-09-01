import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL_PHYSICAL) {
    return process.env.EXPO_PUBLIC_API_URL_PHYSICAL;
  }

  return Platform.OS === 'android' 
    ? process.env.EXPO_PUBLIC_API_URL_ANDROID 
    : process.env.EXPO_PUBLIC_API_URL_IOS;
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Sessão expirada ou token inválido. Deslogando.');
      
      useAuthStore.getState().logout();
    }
    
    return Promise.reject(error);
  }
);