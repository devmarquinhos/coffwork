import { api } from './api';
import { ReviewFormState } from '../types/review';

export const reviewService = {
  createReview: async (coffeeShopId: string, reviewData: ReviewFormState) => {
    try {
      const response = await api.post(`/coffee-shops/${coffeeShopId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      throw error;
    }
  },

  getReviewsByCoffeeShop: async (coffeeShopId: string, context?: string) => {
    try {
      const url = context 
        ? `/coffee-shops/${coffeeShopId}/reviews?context=${context}`
        : `/coffee-shops/${coffeeShopId}/reviews`;
        
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      throw error;
    }
  }
};