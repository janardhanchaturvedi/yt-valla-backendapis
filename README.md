# YTVaala Backend APIs

Backend APIs for YTVaala.app - A high-performance AI image generation platform built with Bun.js native HTTP server, Prisma, and PostgreSQL.

## 🚀 Features

- **Authentication**: JWT-based authentication with secure password hashing (using jose library)
- **AI Image Generation**: Support for OpenAI DALL-E 3 and Replicate Stable Diffusion XL
- **Credit System**: User credit management with transaction history
- **Cloud Storage**: Automatic upload to DigitalOcean Spaces
- **Type Safety**: Full TypeScript support with Zod validation
- **Fast & Scalable**: Built on Bun.js native HTTP server for optimal performance
- **Secure**: Industry-standard security practices

## 📁 Folder Structure

```
yt-valla-backendapis/
├── src/
│   ├── routes/           # API route handlers
│   │   ├── auth.routes.ts
│   │   ├── credit.routes.ts
│   │   └── image.routes.ts
│   ├── services/         # Business logic
│   │   ├── auth.service.ts
│   │   ├── credit.service.ts
│   │   ├── ai.service.ts
│   │   └── storage.service.ts
│   ├── middlewares/      # Express-like middlewares
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── utils/            # Utility functions
│   │   ├── config.ts
│   │   ├── prisma.ts
│   │   ├── validations.ts
│   │   └── errors.ts
│   └── app.ts            # Main application
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma
├── index.ts              # Entry point
├── .env.example          # Environment variables template
└── package.json
```

## 🛠️ Tech Stack

- **Runtime**: Bun.js native HTTP server
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jose library)
- **Validation**: Zod
- **AI Services**: OpenAI, Replicate
- **Storage**: DigitalOcean Spaces (S3-compatible)

## 📦 Installation

1. **Install Bun** (if not already installed):
```bash
curl -fsSL https://bun.sh/install | bash
```

2. **Clone the repository**:
```bash
git clone https://github.com/janardhanchaturvedi/yt-valla-backendapis.git
cd yt-valla-backendapis
```

3. **Install dependencies**:
```bash
bun install
```

4. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Set up the database**:
```bash
bun run db:generate
bun run db:push
```

## 🔧 Configuration

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ALLOWED_ORIGINS=*

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ytvalla?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Replicate Configuration
REPLICATE_API_KEY=your-replicate-api-key

# DigitalOcean Spaces Configuration
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACES_REGION=nyc3
DO_SPACES_BUCKET=your-bucket-name
DO_SPACES_ACCESS_KEY_ID=your-access-key-id
DO_SPACES_SECRET_ACCESS_KEY=your-secret-access-key

# AI Image Generation Costs (in credits)
OPENAI_IMAGE_COST=10
REPLICATE_IMAGE_COST=5
```

## 🚀 Running the Application

**Development mode** (with hot reload):
```bash
bun run dev
```

**Production mode**:
```bash
bun run start
```

**Database commands**:
```bash
bun run db:generate    # Generate Prisma Client
bun run db:push        # Push schema to database
bun run db:migrate     # Create migration
bun run db:studio      # Open Prisma Studio
```

## 📚 API Endpoints

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Credits

#### Get Credit Balance
```http
GET /credits/balance
Authorization: Bearer <token>
```

#### Add Credits
```http
POST /credits/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 100,
  "description": "Purchase credits"
}
```

#### Get Transaction History
```http
GET /credits/history?limit=50
Authorization: Bearer <token>
```

### Images

#### Generate Image
```http
POST /images/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "A beautiful sunset over mountains",
  "provider": "openai"
}
```

#### Get User Images
```http
GET /images?limit=50
Authorization: Bearer <token>
```

#### Get Image by ID
```http
GET /images/:id
Authorization: Bearer <token>
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Environment variable configuration
- Input validation with Zod
- Error handling middleware
- SQL injection protection via Prisma
- CORS support

## 🎨 AI Providers

### OpenAI DALL-E 3
- High-quality image generation
- 1024x1024 resolution
- Cost: 10 credits per image

### Replicate Stable Diffusion XL
- Fast image generation
- Multiple resolutions
- Cost: 5 credits per image

## 💾 Database Schema

### Users
- User authentication and profile
- Credit balance tracking
- Timestamps

### Images
- Generated image records
- Provider information
- Status tracking (pending/completed/failed)

### Transactions
- Credit transaction history
- Type (credit/debit)
- Descriptions

## 🚨 Error Handling

The API uses consistent error responses:

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

## 📈 Performance Optimizations

- Bun.js native HTTP server for ultra-fast execution
- No framework overhead - direct HTTP handling
- Efficient database queries with Prisma
- Transaction-based credit operations
- Async image generation with error recovery
- Connection pooling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is private and proprietary.

## 👨‍💻 Developer

Janardhan Chaturvedi

---

Built with ❤️ using Bun.js + Prisma + PostgreSQL