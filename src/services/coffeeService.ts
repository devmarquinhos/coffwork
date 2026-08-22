import { api } from './api';

export interface CoffeeShop {
  id: string;
  name: string;
  location: string;
  score: string;
  image: string;
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
  }
};