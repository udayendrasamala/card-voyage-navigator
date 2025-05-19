
import { ApiResponse, Card, StatusEvent, WebhookPayload } from "./types";
import { mockCards } from "./mockData";

// Create a custom event system for real-time updates
type CardUpdateListener = (updatedCard: Card) => void;
const cardUpdateListeners: CardUpdateListener[] = [];

// Function to subscribe to card updates
export const subscribeToCardUpdates = (listener: CardUpdateListener) => {
  cardUpdateListeners.push(listener);
  return () => {
    const index = cardUpdateListeners.indexOf(listener);
    if (index > -1) {
      cardUpdateListeners.splice(index, 1);
    }
  };
};

// Function to notify all listeners about a card update
const notifyCardUpdate = (card: Card) => {
  cardUpdateListeners.forEach(listener => listener(card));
};

// This would normally be a real API call to Supabase or another backend
export const updateCardStatus = (payload: WebhookPayload): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find the card in our mock data
      const cardIndex = mockCards.findIndex(card => card.id === payload.cardId);
      
      if (cardIndex === -1) {
        resolve({
          success: false,
          message: "Card not found",
          error: `No card found with ID: ${payload.cardId}`
        });
        return;
      }

      // Create a new status event
      const newEvent: StatusEvent = {
        id: `evt-${payload.cardId}-${Date.now()}`,
        status: payload.status,
        timestamp: payload.timestamp || new Date().toISOString(),
        location: payload.location,
        notes: payload.notes,
        failureReason: payload.failureReason,
        agentId: payload.agentId,
        statusType: payload.statusType || "info"
      };

      // Update the card in our mock database
      mockCards[cardIndex] = {
        ...mockCards[cardIndex],
        currentStatus: payload.status,
        statusHistory: [...mockCards[cardIndex].statusHistory, newEvent]
      };

      // Notify all subscribers about the card update
      notifyCardUpdate(mockCards[cardIndex]);

      resolve({
        success: true,
        message: "Card status updated successfully",
        data: mockCards[cardIndex]
      });
    }, 300); // Simulate network delay
  });
};

// Webhook handler function
export const handleWebhookRequest = async (
  apiKey: string,
  requestApiKey: string,
  payload: WebhookPayload
): Promise<ApiResponse> => {
  // Validate API key (in a real app, this would be more secure)
  if (!requestApiKey || requestApiKey !== apiKey) {
    return {
      success: false,
      message: "Unauthorized",
      error: "Invalid or missing API key"
    };
  }

  // Validate required fields
  if (!payload.cardId || !payload.status) {
    return {
      success: false,
      message: "Bad request",
      error: "Missing required fields: cardId or status"
    };
  }

  // Process the webhook payload
  try {
    const result = await updateCardStatus(payload);
    return result;
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

// Function to simulate receiving a webhook for testing
export const simulateWebhook = async (payload: WebhookPayload): Promise<ApiResponse> => {
  console.log("Simulating webhook with payload:", payload);
  const result = await updateCardStatus(payload);
  return result;
};
