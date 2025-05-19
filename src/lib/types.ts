
export type CardStatus = 
  | "approved" 
  | "created" 
  | "embossing_queued" 
  | "embossing_complete" 
  | "quality_check_passed" 
  | "quality_check_failed" 
  | "dispatch_queued" 
  | "dispatched" 
  | "in_transit" 
  | "delivered" 
  | "delivery_failed" 
  | "destroyed";

export type StatusType = "success" | "warning" | "error" | "neutral" | "info";

export interface StatusEvent {
  id: string;
  status: CardStatus;
  timestamp: string;
  location?: string;
  notes?: string;
  failureReason?: string;
  agentId?: string;
  statusType: StatusType;
}

export interface Card {
  id: string;
  cardNumber: string; // Last 4 digits only for display
  panLastFour: string;
  customerName: string;
  mobileNumber: string;
  cardType: string;
  currentStatus: CardStatus;
  statusHistory: StatusEvent[];
  issueDate?: string;
  expiryDate?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface AnalyticsData {
  totalCards: number;
  cardsInTransit: number;
  cardsDelivered: number;
  cardsWithIssues: number;
  averageTimeToDelivery: number; // in days
  delayBreakdown: {
    embossing: number; // percentage
    qualityCheck: number;
    dispatch: number;
    transit: number;
    delivery: number;
  };
}
