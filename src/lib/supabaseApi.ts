
import { supabase } from "@/integrations/supabase/client";
import { Card, StatusEvent, WebhookPayload, ApiResponse } from "./types";

// Transform database card to frontend Card type
const transformDbCardToCard = (dbCard: any): Card => {
  return {
    id: dbCard.id,
    cardNumber: dbCard.card_number,
    panLastFour: dbCard.pan_last_four,
    customerName: dbCard.customer_name,
    mobileNumber: dbCard.mobile_number,
    cardType: dbCard.card_type,
    currentStatus: dbCard.current_status,
    statusHistory: dbCard.status_events?.map((event: any) => ({
      id: event.id,
      status: event.status,
      timestamp: event.timestamp,
      location: event.location,
      notes: event.notes,
      failureReason: event.failure_reason,
      agentId: event.agent_id,
      statusType: event.status_type
    })) || [],
    issueDate: dbCard.issue_date,
    expiryDate: dbCard.expiry_date,
    address: {
      line1: dbCard.address_line1,
      line2: dbCard.address_line2,
      city: dbCard.city,
      state: dbCard.state,
      postalCode: dbCard.postal_code,
      country: dbCard.country
    }
  };
};

// Search for cards
export const searchCards = async (query: string): Promise<Card[]> => {
  if (!query || query.length < 3) return [];

  const { data, error } = await supabase
    .from('cards')
    .select(`
      *,
      status_events (*)
    `)
    .or(`customer_name.ilike.%${query}%,pan_last_four.ilike.%${query}%,mobile_number.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching cards:', error);
    return [];
  }

  return data.map(transformDbCardToCard);
};

// Get card by identifier
export const getCardByIdentifier = async (identifier: string): Promise<Card | undefined> => {
  const { data, error } = await supabase
    .from('cards')
    .select(`
      *,
      status_events (*)
    `)
    .or(`id.eq.${identifier},pan_last_four.eq.${identifier},mobile_number.eq.${identifier}`)
    .single();

  if (error) {
    console.error('Error fetching card:', error);
    return undefined;
  }

  return transformDbCardToCard(data);
};

// Subscribe to real-time card updates
export const subscribeToCardUpdates = (callback: (card: Card) => void) => {
  const channel = supabase
    .channel('card-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'cards'
      },
      async (payload) => {
        console.log('Card update received:', payload);
        
        // Fetch the updated card with full data
        if (payload.new && payload.new.id) {
          const { data, error } = await supabase
            .from('cards')
            .select(`
              *,
              status_events (*)
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && data) {
            callback(transformDbCardToCard(data));
          }
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Update card status via Edge Function
export const updateCardStatus = async (payload: WebhookPayload): Promise<ApiResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('update-card-status', {
      body: payload
    });

    if (error) {
      return {
        success: false,
        message: 'Failed to update card status',
        error: error.message
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Network error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Simulate webhook for testing
export const simulateWebhook = async (payload: WebhookPayload): Promise<ApiResponse> => {
  console.log("Simulating webhook with payload:", payload);
  return updateCardStatus(payload);
};
