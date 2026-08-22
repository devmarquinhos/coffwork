import { api } from './api';
import { User } from '../types/auth';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', { email, password });

      return response.data;
    } catch (error) {
      console.error('Erro na chamada de login:', error);
      throw error;
    }
  }
};