
import { ApiResponse, Card, StatusEvent, WebhookPayload } from "./types";
import { mockCards } from "./mockData";
import {Cardm} from "./cards";
import { connectDB } from "./db";


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
// export const updateCardStatus = async(payload: WebhookPayload): Promise<ApiResponse> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // Find the card in our mock data
//       const card = await Card.findById(payload.cardId);

//       if (!card) {
//         return {
//           success: false,
//           message: "Card not found",
//           error: `No card found with ID: ${payload.cardId}`
//         };
//       }
  
//       // Create a new status event
//       const newEvent: StatusEvent = {
//         id: `evt-${payload.cardId}-${Date.now()}`,
//         status: payload.status,
//         timestamp: payload.timestamp || new Date().toISOString(),
//         location: payload.location,
//         notes: payload.notes,
//         failureReason: payload.failureReason,
//         agentId: payload.agentId,
//         statusType: payload.statusType || "info"
//       };
  
//       // Update the card document
//       card.currentStatus = payload.status;
//       card.statusHistory.push(newEvent);
//       await card.save();

//       // Notify all subscribers about the card update
//       notifyCardUpdate(mockCards[cardIndex]);

//       return {
//         success: true,
//         message: "Card status updated successfully",
//         data: card
//       };
//     } catch (err) {
//       return {
//         success: false,
//         message: "Failed to update card status",
//         error: err.message
//       };
//     }, 300); // Simulate network delay
//   });
// };

// export const updateCardStatus = async (payload: WebhookPayload): Promise<ApiResponse> => {
//   try {
//     // Find the card in MongoDB by _id (cardId)
//     let card = new Cardm({
//       _id: payload.cardId,
//       currentStatus: payload.status,
//       statusHistory: [],
//     });

//     if (!card) {
//       card = new Cardm({
//         _id: payload.cardId,
//         currentStatus: payload.status,
//         statusHistory: [],
//       });
//       return
//     }

//     // if (!card) {
//     //   return {
//     //     success: false,
//     //     message: "Card not found",
//     //     error: `No card found with ID: ${payload.cardId}`
//     //   };
//     // }

//     // Create a new status event
//     const newEvent: StatusEvent = {
//       id: `evt-${payload.cardId}-${Date.now()}`,
//       status: payload.status,
//       timestamp: payload.timestamp || new Date().toISOString(),
//       location: payload.location,
//       notes: payload.notes,
//       failureReason: payload.failureReason,
//       agentId: payload.agentId,
//       statusType: payload.statusType || "info"
//     };

//     // Update the card document
//     card.currentStatus = payload.status;
//     card.statusHistory.push(newEvent);
//     await card.save();

//     // Optionally notify UI clients
//     // notifyCardUpdate(card); // assumes this is compatible with Mongoose doc

//     return {
//       success: true,
//       message: "Card status updated successfully",
//       data: card
//     };
//   } catch (err) {
//     return {
//       success: false,
//       message: "Failed to update card status",
//       error: err.message
//     };
//   }
// };


// Webhook handler function

export const updateCardStatus = async (payload: WebhookPayload): Promise<ApiResponse> => {
  try {
    const db = await connectDB();
    const cardsCollection = db.collection('cards');
    let existingCard = new Cardm({
            _id: payload.cardId,
            currentStatus: payload.status,
            statusHistory: [],
          });

    //const existingCard = await cardsCollection.findOne({ id: payload.cardId });

    if (!existingCard) {
      return {
        success: false,
        message: "Card not found",
        error: `No card found with ID: ${payload.cardId}`
      };
    }

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

    const updatedCard = await cardsCollection.findOneAndUpdate(
      { id: payload.cardId },
      {
        $set: { currentStatus: payload.status },
        $push: { statusHistory: newEvent }
      },
      { returnDocument: 'after' }
    );

    return {
      success: true,
      message: "Card status updated successfully",
      data: updatedCard.value
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
