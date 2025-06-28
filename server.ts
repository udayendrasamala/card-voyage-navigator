import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { updateCardStatus } from './src/lib/api';
import { WebhookPayload, ApiResponse } from './src/lib/types';

const app = express();
const PORT = 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

/**
 * POST /update-card-status
 * Expects: WebhookPayload
 * Returns: ApiResponse
 */
app.post('/update-card-status', async (req: any,res: any) => {
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

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is runnnnnnnnnnning at http://localhost:${PORT}`);
});
