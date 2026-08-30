import { api } from "./api";
import { User } from "../types/auth";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  city: string;
  role: "USER" | "OWNER";
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Erro na chamada de login:", error);
      throw error;
    }
  },

  async register(data: RegisterData): Promise<User> {
    try {
      const response = await api.post<User>("/auth/register", data);
      return response.data;
    } catch (error) {
      console.error("Erro na chamada de registro:", error);
      throw error;
    }
  },
};
