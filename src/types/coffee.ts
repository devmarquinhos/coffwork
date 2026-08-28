export interface CoffeeShopDetails {
  id: string;
  name: string;
  location: string;
  score: string;
  coverImageUrl: string;
  shortDescription: string;
  hasWifi: boolean;
  hasPowerOutlets: boolean;
  specialtyHighlights: string[];
  ownerId: string;
}