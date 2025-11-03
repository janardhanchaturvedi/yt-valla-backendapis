# YTVaala Backend API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication

All protected endpoints require a JWT bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Public Endpoints

### Health Check
Check if the API is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-11-03T15:00:00.000Z"
}
```

### API Info
Get basic API information.

**Endpoint:** `GET /`

**Response:**
```json
{
  "success": true,
  "message": "YTVaala Backend API",
  "version": "1.0.0"
}
```

---

## Authentication Endpoints

### Register
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Validation Rules:**
- `email`: Must be a valid email format
- `password`: Minimum 8 characters
- `name`: Optional

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "credits": 100,
      "createdAt": "2025-11-03T15:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "message": "User with this email already exists",
    "code": "BAD_REQUEST",
    "statusCode": 400
  }
}
```

### Login
Authenticate an existing user.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "credits": 100,
      "createdAt": "2025-11-03T15:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid email or password",
    "code": "UNAUTHORIZED",
    "statusCode": 401
  }
}
```

### Get Current User
Get authenticated user information.

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "credits": 90,
    "createdAt": "2025-11-03T15:00:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "message": "No authorization token provided",
    "code": "UNAUTHORIZED",
    "statusCode": 401
  }
}
```

---

## Credit Management Endpoints

### Get Credit Balance
Get the current user's credit balance.

**Endpoint:** `GET /credits/balance`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "credits": 90
  }
}
```

### Add Credits
Add credits to the user's account.

**Endpoint:** `POST /credits/add`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 100,
  "description": "Credit purchase"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "credits": 190,
    "transaction": {
      "id": "uuid",
      "userId": "uuid",
      "type": "credit",
      "amount": 100,
      "description": "Credit purchase",
      "createdAt": "2025-11-03T15:00:00.000Z"
    }
  }
}
```

### Get Transaction History
Get the user's credit transaction history.

**Endpoint:** `GET /credits/history?limit=50`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit`: Number of transactions to return (default: 50, max: 100)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "type": "debit",
      "amount": 10,
      "description": "Image generation via openai",
      "createdAt": "2025-11-03T15:00:00.000Z"
    },
    {
      "id": "uuid",
      "userId": "uuid",
      "type": "credit",
      "amount": 100,
      "description": "Signup bonus",
      "createdAt": "2025-11-03T14:00:00.000Z"
    }
  ]
}
```

---

## Image Generation Endpoints

### Generate Image
Generate an AI image using OpenAI or Replicate.

**Endpoint:** `POST /images/generate`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "prompt": "A beautiful sunset over mountains",
  "provider": "openai"
}
```

**Parameters:**
- `prompt`: Text description of the image (required, 1-1000 characters)
- `provider`: `"openai"` or `"replicate"` (default: `"openai"`)

**Costs:**
- OpenAI (DALL-E 3): 10 credits per image
- Replicate (SDXL): 5 credits per image

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "prompt": "A beautiful sunset over mountains",
    "imageUrl": "https://your-bucket.nyc3.digitaloceanspaces.com/images/1234567890-uuid.png",
    "provider": "openai",
    "cost": 10,
    "status": "completed",
    "createdAt": "2025-11-03T15:00:00.000Z"
  }
}
```

**Error Response (402):**
```json
{
  "success": false,
  "error": {
    "message": "Insufficient credits. You have 5 credits but need 10",
    "code": "INSUFFICIENT_CREDITS",
    "statusCode": 402
  }
}
```

### Get User Images
Get all images generated by the current user.

**Endpoint:** `GET /images?limit=50`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit`: Number of images to return (default: 50, max: 100)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "prompt": "A beautiful sunset over mountains",
      "imageUrl": "https://your-bucket.nyc3.digitaloceanspaces.com/images/1234567890-uuid.png",
      "provider": "openai",
      "cost": 10,
      "status": "completed",
      "createdAt": "2025-11-03T15:00:00.000Z"
    }
  ]
}
```

### Get Image by ID
Get a specific image by its ID.

**Endpoint:** `GET /images/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "prompt": "A beautiful sunset over mountains",
    "imageUrl": "https://your-bucket.nyc3.digitaloceanspaces.com/images/1234567890-uuid.png",
    "provider": "openai",
    "cost": 10,
    "status": "completed",
    "createdAt": "2025-11-03T15:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "message": "Image not found",
    "code": "BAD_REQUEST",
    "statusCode": 400
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "statusCode": 400
  }
}
```

### Common Error Codes

- `400` - **BAD_REQUEST**: Invalid request data
- `401` - **UNAUTHORIZED**: Missing or invalid authentication token
- `402` - **INSUFFICIENT_CREDITS**: Not enough credits for the operation
- `403` - **FORBIDDEN**: Access denied
- `404` - **NOT_FOUND**: Resource not found
- `500` - **INTERNAL_SERVER_ERROR**: Server error

### Validation Errors

Validation errors return a different format:

```json
[
  {
    "code": "invalid_format",
    "message": "Invalid email format",
    "path": ["email"]
  }
]
```

---

## Rate Limiting

Currently, there are no rate limits enforced. Consider implementing rate limiting in production.

---

## Examples

### Complete User Flow

#### 1. Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123",
    "name": "Demo User"
  }'
```

#### 2. Login (if already registered)
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123"
  }'
```

#### 3. Check credit balance
```bash
curl http://localhost:3000/credits/balance \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Generate an image
```bash
curl -X POST http://localhost:3000/images/generate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A futuristic city at night",
    "provider": "openai"
  }'
```

#### 5. Get all generated images
```bash
curl http://localhost:3000/images \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Webhook Events (Future)

Webhook support is not currently implemented but can be added for:
- Image generation completion
- Credit balance updates
- Failed image generations

---

## Best Practices

1. **Store tokens securely**: Never expose JWT tokens in client-side code or version control
2. **Handle errors gracefully**: Always check the `success` field in responses
3. **Monitor credits**: Check credit balance before generating images
4. **Validate inputs**: Use the validation schemas provided
5. **Use HTTPS in production**: Never use HTTP for production deployments

---

## Support

For issues or questions, please contact the repository maintainer or open an issue on GitHub.
