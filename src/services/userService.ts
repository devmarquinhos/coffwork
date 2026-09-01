import { api } from "@/services/api";

export interface UpdateUserRequest {
  name: string;
  city: string;
}

export const userService = {
  async updateProfile(data: UpdateUserRequest) {
    const response = await api.put("/users/me", data);
    return response.data;
  },
};