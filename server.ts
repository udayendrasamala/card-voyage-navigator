import 'dotenv/config';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { updateCardStatus, createCard, getCard, getCards } from './src/lib/api';
import { WebhookPayload, ApiResponse } from './src/lib/types';
import { connectDB } from './src/lib/db';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Initialize database connection
connectDB().catch(console.error);

/**
 * POST /update-card-status
 * Expects: WebhookPayload
 * Returns: ApiResponse
 */
app.post('/update-card-status', async (req: any, res: any) => {
  console.log('Received request:', req.body);
  const payload = req.body as WebhookPayload;

  // Validate required fields
  if (!payload.cardId || !payload.status || !payload.timestamp) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: cardId, status, or timestamp',
      error: 'ValidationError'
    });
  }

  try {
    console.log('Received payload:', payload);
    const result = await updateCardStatus(payload);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /cards
 * Create a new card
 * Expects: Card data (without statusHistory)
 * Returns: ApiResponse
 */
app.post('/cards', async (req: any, res: any) => {
  try {
    const result = await createCard(req.body);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /cards/:cardId
 * Get a specific card by ID
 * Returns: ApiResponse
 */
app.get('/cards/:cardId', async (req: any, res: any) => {
  try {
    const result = await getCard(req.params.cardId);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /cards
 * Get all cards, optionally filtered by status
 * Query params: status (optional)
 * Returns: ApiResponse
 */
app.get('/cards', async (req: any, res: any) => {
  try {
    const status = req.query.status;
    const result = await getCards(status);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req: any, res: any) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is runnnnnnnnnnning at http://localhost:${PORT}`);
});
