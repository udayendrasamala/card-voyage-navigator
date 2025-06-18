
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  cardId: string;
  status: string;
  timestamp?: string;
  location?: string;
  notes?: string;
  failureReason?: string;
  agentId?: string;
  statusType?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const payload: WebhookPayload = await req.json()
    console.log('Received webhook payload:', payload)

    // Validate required fields
    if (!payload.cardId || !payload.status) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: cardId or status' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // First, check if the card exists
    const { data: existingCard, error: cardError } = await supabaseClient
      .from('cards')
      .select('id')
      .eq('id', payload.cardId)
      .single()

    if (cardError || !existingCard) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Card not found with ID: ${payload.cardId}` 
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update the card's current status
    const { error: updateError } = await supabaseClient
      .from('cards')
      .update({ 
        current_status: payload.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', payload.cardId)

    if (updateError) {
      console.error('Error updating card:', updateError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to update card status' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a new status event
    const { error: eventError } = await supabaseClient
      .from('status_events')
      .insert({
        card_id: payload.cardId,
        status: payload.status,
        timestamp: payload.timestamp || new Date().toISOString(),
        location: payload.location,
        notes: payload.notes || payload.failureReason,
        failure_reason: payload.failureReason,
        agent_id: payload.agentId,
        status_type: payload.statusType || 'info'
      })

    if (eventError) {
      console.error('Error creating status event:', eventError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to create status event' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the updated card with its full status history
    const { data: updatedCard, error: fetchError } = await supabaseClient
      .from('cards')
      .select(`
        *,
        status_events (*)
      `)
      .eq('id', payload.cardId)
      .single()

    if (fetchError) {
      console.error('Error fetching updated card:', fetchError)
    }

    console.log('Card status updated successfully')
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Card status updated successfully',
        data: updatedCard 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
