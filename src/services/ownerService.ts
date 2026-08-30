import { api } from "./api";
import { useAuthStore } from "../store/useAuthStore";
import { User } from "../types/auth";

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  city: string;
  role: User["role"];
}

export interface MonthlyAverage {
  month: string;
  average: number;
}

export interface CoffeeShopStatistics {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
  contextStatistics: Record<string, Record<string, number>>;
  monthlyAverage: MonthlyAverage[];
}

export interface CoffeeShopDTO {
  name: string;
  shortDescription?: string;
  address?: string;
  district: string;
  city: string;
  openingTime?: string;
  closingTime?: string;
  pricingRange?: string;
  hasWifi: boolean;
  hasPowerOutlets: boolean;
  averageNoiseLevel?: string;
  coverImageUrl: string;
}
export interface AuthResponse {
  token: string;
  user: User;
}

export const ownerService = {
  async registerOwnerAndShop(data: {
    user: RegisterUserDTO;
    shop: CoffeeShopDTO;
    highlights: string[];
  }) {
    await api.post("/auth/register", data.user);

    const loginRes = await api.post<AuthResponse>("/auth/login", {
      email: data.user.email,
      password: data.user.password,
    });

    const { token, user } = loginRes.data;

    useAuthStore.getState().login(user, token);

    const shopRes = await api.post("/coffee-shops", data.shop);
    const createdShopId = shopRes.data.id;

    if (data.highlights.length > 0 && createdShopId) {
      await Promise.all(
        data.highlights.map((imageUrl) =>
          api.post(`/coffee-shops/${createdShopId}/highlights`, { imageUrl }),
        ),
      );
    }

    return shopRes.data;
  },

  async addHighlight(coffeeShopId: string, imageUrl: string) {
    const response = await api.post(
      `/coffee-shops/${coffeeShopId}/highlights`,
      {
        imageUrl,
      },
    );
    return response.data;
  },

  async getReviews(coffeeShopId: string) {
    const response = await api.get(`/coffee-shops/${coffeeShopId}/reviews`);
    return response.data;
  },

  async replyToReview(
    coffeeShopId: string,
    reviewId: string,
    replyText: string,
  ) {
    await api.post(`/coffee-shops/${coffeeShopId}/reviews/${reviewId}/reply`, {
      replyText,
    });
  },

  async getStatistics(coffeeShopId: string): Promise<CoffeeShopStatistics> {
    const response = await api.get(`/coffee-shops/${coffeeShopId}/statistics`);
    return response.data;
  },
};
