import { api } from '@/services/api';
import { isAxiosError } from 'axios';

export interface FavoriteResponse {
  id: number;
  coffeeShopId: string;
  coffeeShopName: string;
  coverImageUrl: string;
  favoritedAt: string;
}

export const favoriteService = {
  async getMyFavorites(): Promise<FavoriteResponse[]> {
    try {
      const response = await api.get<FavoriteResponse[]>('/users/me/favorites');
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        throw error;
      }
      console.log('Erro ao buscar favoritos:', error);
      throw error;
    }
  },

  async addFavorite(coffeeShopId: string): Promise<void> {
    try {
      await api.post(`/coffee-shops/${coffeeShopId}/favorites`);
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      throw error;
    }
  },

  async removeFavorite(coffeeShopId: string): Promise<void> {
    try {
      await api.delete(`/coffee-shops/${coffeeShopId}/favorites`);
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      throw error;
    }
  }
};