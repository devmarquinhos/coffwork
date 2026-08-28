export type VisitContextType = "STUDY" | "REMOTE_WORK" | "SOCIAL" | "COFFEE_TASTING" | "";

export interface ReviewFormState {
  context: VisitContextType;
  overallRating: number;
  comment: string;
  
  // study / remote work
  silenceRating: number;
  powerOutletsRating: number;
  seatComfortRating: number;
  wifiRating: number;
  longStayToleranceRating: number;
  
  // social
  ambienceRating: number;
  musicRating: number;
  privacyRating: number;
  
  // coffee
  coffeeQualityRating: number;
  brewMethodsVarietyRating: number;
  baristaServiceRating: number;
  priceFairnessRating: number;
}

export interface ReviewResponse {
  id: number;
  userId: string;
  userName: string;
  context: VisitContextType;
  overallRating: number;
  comment: string | null;
  ownerReply?: string | null;
  createdAt: string;
}