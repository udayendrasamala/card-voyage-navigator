
import { Card, AnalyticsData } from "./types";

export const mockCards: Card[] = [
  {
    id: "card-001",
    cardNumber: "****-****-****-1234",
    panLastFour: "1234",
    customerName: "John Smith",
    mobileNumber: "9876543210",
    cardType: "Platinum Credit",
    currentStatus: "delivered",
    statusHistory: [
      {
        id: "evt-001-1",
        status: "approved",
        timestamp: "2025-05-01T10:30:00Z",
        notes: "Card approved after credit check",
        statusType: "success"
      },
      {
        id: "evt-001-2",
        status: "created",
        timestamp: "2025-05-02T09:15:00Z",
        notes: "Card created in system",
        statusType: "success"
      },
      {
        id: "evt-001-3",
        status: "embossing_queued",
        timestamp: "2025-05-02T14:20:00Z",
        location: "Central Production Facility",
        statusType: "info"
      },
      {
        id: "evt-001-4",
        status: "embossing_complete",
        timestamp: "2025-05-03T11:45:00Z",
        location: "Central Production Facility",
        statusType: "success"
      },
      {
        id: "evt-001-5",
        status: "quality_check_passed",
        timestamp: "2025-05-03T13:10:00Z",
        agentId: "QA-072",
        statusType: "success"
      },
      {
        id: "evt-001-6",
        status: "dispatch_queued",
        timestamp: "2025-05-04T09:30:00Z",
        location: "Distribution Center East",
        statusType: "info"
      },
      {
        id: "evt-001-7",
        status: "dispatched",
        timestamp: "2025-05-04T16:20:00Z",
        location: "Distribution Center East",
        statusType: "success"
      },
      {
        id: "evt-001-8",
        status: "in_transit",
        timestamp: "2025-05-05T10:45:00Z",
        location: "Regional Hub Mumbai",
        statusType: "info"
      },
      {
        id: "evt-001-9",
        status: "delivered",
        timestamp: "2025-05-06T14:30:00Z",
        location: "Mumbai",
        notes: "Delivered to customer, signature collected",
        statusType: "success"
      }
    ],
    issueDate: "2025-05-06",
    expiryDate: "2030-05-31",
    address: {
      line1: "123 Main Street",
      line2: "Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India"
    }
  },
  {
    id: "card-002",
    cardNumber: "****-****-****-5678",
    panLastFour: "5678",
    customerName: "Priya Sharma",
    mobileNumber: "8765432109",
    cardType: "Gold Debit",
    currentStatus: "quality_check_failed",
    statusHistory: [
      {
        id: "evt-002-1",
        status: "approved",
        timestamp: "2025-05-03T11:20:00Z",
        statusType: "success"
      },
      {
        id: "evt-002-2",
        status: "created",
        timestamp: "2025-05-04T10:15:00Z",
        statusType: "success"
      },
      {
        id: "evt-002-3",
        status: "embossing_queued",
        timestamp: "2025-05-04T16:40:00Z",
        location: "Central Production Facility",
        statusType: "info"
      },
      {
        id: "evt-002-4",
        status: "embossing_complete",
        timestamp: "2025-05-05T13:25:00Z",
        location: "Central Production Facility",
        statusType: "success"
      },
      {
        id: "evt-002-5",
        status: "quality_check_failed",
        timestamp: "2025-05-05T14:50:00Z",
        failureReason: "Name embossing misalignment",
        agentId: "QA-045",
        notes: "Requeue for production",
        statusType: "error"
      }
    ],
    issueDate: undefined,
    expiryDate: "2030-05-31",
    address: {
      line1: "45 Park Avenue",
      city: "Delhi",
      state: "Delhi",
      postalCode: "110001",
      country: "India"
    }
  },
  {
    id: "card-003",
    cardNumber: "****-****-****-9012",
    panLastFour: "9012",
    customerName: "Raj Kumar",
    mobileNumber: "7654321098",
    cardType: "Platinum Credit",
    currentStatus: "delivery_failed",
    statusHistory: [
      {
        id: "evt-003-1",
        status: "approved",
        timestamp: "2025-04-28T09:30:00Z",
        statusType: "success"
      },
      {
        id: "evt-003-2",
        status: "created",
        timestamp: "2025-04-29T10:45:00Z",
        statusType: "success"
      },
      {
        id: "evt-003-3",
        status: "embossing_queued",
        timestamp: "2025-04-29T15:10:00Z",
        location: "Central Production Facility",
        statusType: "info"
      },
      {
        id: "evt-003-4",
        status: "embossing_complete",
        timestamp: "2025-04-30T12:30:00Z",
        location: "Central Production Facility",
        statusType: "success"
      },
      {
        id: "evt-003-5",
        status: "quality_check_passed",
        timestamp: "2025-04-30T14:20:00Z",
        agentId: "QA-031",
        statusType: "success"
      },
      {
        id: "evt-003-6",
        status: "dispatch_queued",
        timestamp: "2025-05-01T09:15:00Z",
        location: "Distribution Center North",
        statusType: "info"
      },
      {
        id: "evt-003-7",
        status: "dispatched",
        timestamp: "2025-05-01T16:40:00Z",
        location: "Distribution Center North",
        statusType: "success"
      },
      {
        id: "evt-003-8",
        status: "in_transit",
        timestamp: "2025-05-02T11:30:00Z",
        location: "Regional Hub Kolkata",
        statusType: "info"
      },
      {
        id: "evt-003-9",
        status: "delivery_failed",
        timestamp: "2025-05-03T15:45:00Z",
        location: "Kolkata",
        failureReason: "Address not found",
        notes: "Customer address incorrect, awaiting clarification",
        statusType: "error"
      }
    ],
    issueDate: undefined,
    expiryDate: "2030-04-30",
    address: {
      line1: "78 Lake View Road",
      city: "Kolkata",
      state: "West Bengal",
      postalCode: "700001",
      country: "India"
    }
  },
  {
    id: "card-004",
    cardNumber: "****-****-****-3456",
    panLastFour: "3456",
    customerName: "Ananya Patel",
    mobileNumber: "6543210987",
    cardType: "Business Credit",
    currentStatus: "in_transit",
    statusHistory: [
      {
        id: "evt-004-1",
        status: "approved",
        timestamp: "2025-05-10T14:20:00Z",
        statusType: "success"
      },
      {
        id: "evt-004-2",
        status: "created",
        timestamp: "2025-05-11T10:30:00Z",
        statusType: "success"
      },
      {
        id: "evt-004-3",
        status: "embossing_queued",
        timestamp: "2025-05-11T15:45:00Z",
        location: "Central Production Facility",
        statusType: "info"
      },
      {
        id: "evt-004-4",
        status: "embossing_complete",
        timestamp: "2025-05-12T11:50:00Z",
        location: "Central Production Facility",
        statusType: "success"
      },
      {
        id: "evt-004-5",
        status: "quality_check_passed",
        timestamp: "2025-05-12T13:40:00Z",
        agentId: "QA-089",
        statusType: "success"
      },
      {
        id: "evt-004-6",
        status: "dispatch_queued",
        timestamp: "2025-05-13T09:20:00Z",
        location: "Distribution Center South",
        statusType: "info"
      },
      {
        id: "evt-004-7",
        status: "dispatched",
        timestamp: "2025-05-13T16:30:00Z",
        location: "Distribution Center South",
        statusType: "success"
      },
      {
        id: "evt-004-8",
        status: "in_transit",
        timestamp: "2025-05-14T11:20:00Z",
        location: "Regional Hub Bangalore",
        statusType: "info"
      }
    ],
    issueDate: undefined,
    expiryDate: "2030-05-31",
    address: {
      line1: "25 Tech Park Road",
      line2: "Electronic City",
      city: "Bangalore",
      state: "Karnataka",
      postalCode: "560100",
      country: "India"
    }
  },
  {
    id: "card-005",
    cardNumber: "****-****-****-7890",
    panLastFour: "7890",
    customerName: "Vikram Singh",
    mobileNumber: "5432109876",
    cardType: "Platinum Debit",
    currentStatus: "dispatched",
    statusHistory: [
      {
        id: "evt-005-1",
        status: "approved",
        timestamp: "2025-05-12T09:45:00Z",
        statusType: "success"
      },
      {
        id: "evt-005-2",
        status: "created",
        timestamp: "2025-05-13T11:20:00Z",
        statusType: "success"
      },
      {
        id: "evt-005-3",
        status: "embossing_queued",
        timestamp: "2025-05-13T16:15:00Z",
        location: "Central Production Facility",
        statusType: "info"
      },
      {
        id: "evt-005-4",
        status: "embossing_complete",
        timestamp: "2025-05-14T12:40:00Z",
        location: "Central Production Facility",
        statusType: "success"
      },
      {
        id: "evt-005-5",
        status: "quality_check_passed",
        timestamp: "2025-05-14T14:10:00Z",
        agentId: "QA-056",
        statusType: "success"
      },
      {
        id: "evt-005-6",
        status: "dispatch_queued",
        timestamp: "2025-05-15T09:30:00Z",
        location: "Distribution Center West",
        statusType: "info"
      },
      {
        id: "evt-005-7",
        status: "dispatched",
        timestamp: "2025-05-15T15:50:00Z",
        location: "Distribution Center West",
        statusType: "success"
      }
    ],
    issueDate: undefined,
    expiryDate: "2030-05-31",
    address: {
      line1: "56 Business Hub",
      line2: "Sector 63",
      city: "Noida",
      state: "Uttar Pradesh",
      postalCode: "201301",
      country: "India"
    }
  }
];

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

export const getCardByIdentifier = (identifier: string): Card | undefined => {
  // This would be an API call in a real app
  return mockCards.find(
    card => 
      card.panLastFour === identifier || 
      card.mobileNumber === identifier || 
      card.id === identifier
  );
};

export const searchCards = (query: string): Card[] => {
  // This would be an API call in a real app
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  return mockCards.filter(
    card => 
      card.customerName.toLowerCase().includes(lowerQuery) ||
      card.panLastFour.includes(lowerQuery) ||
      card.mobileNumber.includes(lowerQuery) ||
      card.id.toLowerCase().includes(lowerQuery)
  );
};
