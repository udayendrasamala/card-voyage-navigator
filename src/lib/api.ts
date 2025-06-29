import { ApiResponse, Card as CardType, StatusEvent, WebhookPayload } from "./types";
import { Card } from "./cards";
import { connectDB } from "./db";

// Create a custom event system for real-time updates
type CardUpdateListener = (updatedCard: CardType) => void;
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
const notifyCardUpdate = (card: CardType) => {
  cardUpdateListeners.forEach(listener => listener(card));
};

// Main function to update card status using Mongoose
export const updateCardStatus = async (payload: WebhookPayload): Promise<ApiResponse> => {
  try {
    // Ensure database connection
    await connectDB();

    // Find the card by ID
    const existingCard = await Card.findOne({ id: payload.cardId });

    if (!existingCard) {
      return {
        success: false,
        message: "Card not found",
        error: `No card found with ID: ${payload.cardId}`
      };
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

    // Update the card document
    const updatedCard = await Card.findOneAndUpdate(
      { id: payload.cardId },
      {
        $set: { currentStatus: payload.status },
        $push: { statusHistory: newEvent }
      },
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return {
        success: false,
        message: "Failed to update card",
        error: "Card update operation failed"
      };
    }

    // Convert Mongoose document to plain object for notification
    const cardData = updatedCard.toObject() as CardType;
    
    // Notify all subscribers about the card update
    notifyCardUpdate(cardData);

    return {
      success: true,
      message: "Card status updated successfully",
      data: cardData
    };
  } catch (err: any) {
    console.error('DB update failed:', err);
    return {
      success: false,
      message: 'Internal server error',
      error: err.message || 'Unknown error'
    };
  }
};

// Function to create a new card
export const createCard = async (cardData: Omit<CardType, 'statusHistory'>): Promise<ApiResponse> => {
  try {
    await connectDB();

    // Check if card already exists
    const existingCard = await Card.findOne({ id: cardData.id });
    if (existingCard) {
      return {
        success: false,
        message: "Card already exists",
        error: `Card with ID ${cardData.id} already exists`
      };
    }

    // Create initial status event
    const initialEvent: StatusEvent = {
      id: `evt-${cardData.id}-${Date.now()}`,
      status: cardData.currentStatus,
      timestamp: new Date().toISOString(),
      statusType: "info"
    };

    // Create new card with initial status history
    const newCard = new Card({
      ...cardData,
      statusHistory: [initialEvent]
    });

    const savedCard = await newCard.save();
    const cardObject = savedCard.toObject() as CardType;

    // Notify subscribers
    notifyCardUpdate(cardObject);

    return {
      success: true,
      message: "Card created successfully",
      data: cardObject
    };
  } catch (err: any) {
    console.error('Card creation failed:', err);
    return {
      success: false,
      message: 'Failed to create card',
      error: err.message || 'Unknown error'
    };
  }
};

// Function to get a card by ID
export const getCard = async (cardId: string): Promise<ApiResponse> => {
  try {
    await connectDB();

    const card = await Card.findOne({ id: cardId });
    
    if (!card) {
      return {
        success: false,
        message: "Card not found",
        error: `No card found with ID: ${cardId}`
      };
    }

    return {
      success: true,
      message: "Card retrieved successfully",
      data: card.toObject()
    };
  } catch (err: any) {
    console.error('Card retrieval failed:', err);
    return {
      success: false,
      message: 'Failed to retrieve card',
      error: err.message || 'Unknown error'
    };
  }
};

// Function to get all cards with optional status filter
export const getCards = async (status?: string): Promise<ApiResponse> => {
  try {
    await connectDB();

    const query = status ? { currentStatus: status } : {};
    const cards = await Card.find(query).sort({ createdAt: -1 });

    return {
      success: true,
      message: "Cards retrieved successfully",
      data: cards.map(card => card.toObject())
    };
  } catch (err: any) {
    console.error('Cards retrieval failed:', err);
    return {
      success: false,
      message: 'Failed to retrieve cards',
      error: err.message || 'Unknown error'
    };
  }
};

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
