import { CoffeeShopDetails } from '@/types/coffee';
import { api } from '@/services/api';

export interface CoffeeShop {
  id: string;
  name: string;
  location: string;
  score: string;
  coverImageUrl: string;
}

export const coffeeService = {
  async getByContext(context: string): Promise<CoffeeShop[]> {
    try {
      const response = await api.get<CoffeeShop[]>('/coffee-shops', {
        params: { context }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cafeterias:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<CoffeeShopDetails> {
    try {
      const response = await api.get<CoffeeShopDetails>(`/coffee-shops/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes da cafeteria:', error);
      throw error;
    }
  },
};