import { api } from "./api";

export const ownerService = {
  async addHighlight(coffeeShopId: string, imageUrl: string) {
    const response = await api.post(`/coffeeshops/${coffeeShopId}/highlights`, {
      imageUrl,
    });
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
};
