# MongoDB Atlas Schema Setup Guide

## Overview

This project uses **MongoDB Atlas** with **Mongoose** for schema definition and validation. The schemas are properly defined and structured to handle card management operations.

## Schema Structure

### 1. Card Schema (`src/lib/cards.ts`)

The main `Card` schema includes:

```typescript
{
  id: String (required, unique) - Card identifier
  cardNumber: String (required) - Last 4 digits for display
  panLastFour: String (required) - PAN last 4 digits
  customerName: String (required) - Customer name
  mobileNumber: String (required) - Customer mobile
  cardType: String (required) - Type of card
  currentStatus: CardStatus (required) - Current card status
  statusHistory: [StatusEvent] - Array of status events
  issueDate: String (optional) - Card issue date
  expiryDate: String (optional) - Card expiry date
  address: Address (required) - Customer address
  createdAt: Date (auto) - Creation timestamp
  updatedAt: Date (auto) - Last update timestamp
}
```

### 2. Status Event Schema

Embedded in Card schema:

```typescript
{
  id: String (required) - Event identifier
  status: CardStatus (required) - Status value
  timestamp: String (required) - Event timestamp
  location: String (optional) - Location info
  notes: String (optional) - Additional notes
  failureReason: String (optional) - Failure reason if any
  agentId: String (optional) - Agent identifier
  statusType: StatusType - Event type (success/warning/error/neutral/info)
}
```

### 3. Address Schema

Embedded in Card schema:

```typescript
{
  line1: String (required) - Address line 1
  line2: String (optional) - Address line 2
  city: String (required) - City
  state: String (required) - State
  postalCode: String (required) - Postal code
  country: String (required, default: "India") - Country
}
```

## Valid Status Values

The following status values are enforced by schema validation:

- `approved`
- `created`
- `embossing_queued`
- `embossing_complete`
- `quality_check_passed`
- `quality_check_failed`
- `dispatch_queued`
- `dispatched`
- `in_transit`
- `delivered`
- `delivery_failed`
- `destroyed`

## Database Connection

### Setup Steps:

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update MongoDB connection string in `.env`:**
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.x7arkho.mongodb.net/cardDB?retryWrites=true&w=majority&appName=Cluster0
   ```

3. **Replace placeholders:**
   - `your-username` - Your MongoDB Atlas username
   - `your-password` - Your MongoDB Atlas password
   - `cluster0.x7arkho` - Your cluster URL
   - `cardDB` - Your database name

### Connection Features:

- **Automatic reconnection** on connection loss
- **Connection pooling** for better performance
- **Graceful shutdown** handling
- **Error logging** for debugging
- **Environment variable support** for security

## API Endpoints

The server provides the following endpoints:

### Card Management:
- `POST /cards` - Create a new card
- `GET /cards` - Get all cards (optional status filter)
- `GET /cards/:cardId` - Get specific card by ID
- `POST /update-card-status` - Update card status (webhook)

### Health Check:
- `GET /health` - Server health status

## Usage Examples

### 1. Create a New Card:

```bash
curl -X POST http://localhost:3001/cards \
  -H "Content-Type: application/json" \
  -d '{
    "id": "card-123",
    "cardNumber": "1234",
    "panLastFour": "5678",
    "customerName": "John Doe",
    "mobileNumber": "+91-9876543210",
    "cardType": "Credit",
    "currentStatus": "created",
    "address": {
      "line1": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001",
      "country": "India"
    }
  }'
```

### 2. Update Card Status:

```bash
curl -X POST http://localhost:3001/update-card-status \
  -H "Content-Type: application/json" \
  -d '{
    "cardId": "card-123",
    "status": "dispatched",
    "timestamp": "2024-01-15T10:30:00Z",
    "location": "Mumbai Distribution Center",
    "notes": "Card dispatched via courier"
  }'
```

### 3. Get Card Details:

```bash
curl http://localhost:3001/cards/card-123
```

### 4. Get All Cards with Status Filter:

```bash
curl "http://localhost:3001/cards?status=dispatched"
```

## Schema Validation

The Mongoose schemas provide:

- **Required field validation**
- **Enum validation** for status values
- **Unique constraints** on card IDs
- **Data type validation**
- **Default values** where appropriate

## Database Indexes

Optimized indexes are created for:

- `id` field (unique)
- `currentStatus` field (for filtering)
- `customerName` field (for searching)

## Error Handling

The API provides comprehensive error handling:

- **Validation errors** for invalid data
- **Not found errors** for missing cards
- **Database connection errors**
- **Detailed error messages** for debugging

## Security Considerations

1. **Environment Variables**: Sensitive data stored in `.env` file
2. **Connection String Security**: No hardcoded credentials
3. **Input Validation**: All inputs validated by Mongoose schemas
4. **Error Sanitization**: Sensitive information not exposed in errors

## Running the Server

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB Atlas credentials
   ```

3. **Start the server:**
   ```bash
   npm run dev
   # or
   node server.ts
   ```

4. **Test the connection:**
   ```bash
   curl http://localhost:3001/health
   ```

## Troubleshooting

### Common Issues:

1. **Connection Failed**: Check MongoDB Atlas credentials and network access
2. **Validation Errors**: Ensure all required fields are provided
3. **Duplicate Key Errors**: Card IDs must be unique
4. **Schema Mismatch**: Ensure data matches the defined schema structure

### Debug Tips:

- Check server logs for detailed error messages
- Verify MongoDB Atlas cluster is running
- Ensure IP address is whitelisted in MongoDB Atlas
- Test connection string in MongoDB Compass

## Schema Benefits

✅ **Type Safety**: Full TypeScript integration
✅ **Data Validation**: Automatic validation on save
✅ **Performance**: Optimized with proper indexes
✅ **Scalability**: Designed for production use
✅ **Maintainability**: Clear schema structure
✅ **Security**: Environment-based configuration
