import { AnalyticsData } from "./types";

// Keep only analytics data - cards are now fetched from Supabase
export const mockAnalytics: AnalyticsData = {
  totalCards: 1250,
  cardsInTransit: 345,
  cardsDelivered: 780,
  cardsWithIssues: 125,
  averageTimeToDelivery: 5.3, // days
  delayBreakdown: {
    embossing: 35,
    qualityCheck: 20,
    dispatch: 15,
    transit: 25,
    delivery: 5
  }
};

// Re-export functions from supabaseApi for backward compatibility
export { searchCards, getCardByIdentifier } from './supabaseApi';
