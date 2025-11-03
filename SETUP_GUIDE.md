# YTVaala Backend Setup Guide

This guide will help you set up the YTVaala backend on your local machine or server.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Bun.js** (v1.0.0 or higher)
- **PostgreSQL** (v13 or higher)
- **Node.js** (v18 or higher, for some dependencies)
- **Git**

## Step-by-Step Setup

### 1. Install Bun

If you don't have Bun installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

After installation, restart your terminal or run:

```bash
source ~/.bashrc  # or ~/.zshrc for zsh users
```

Verify installation:

```bash
bun --version
```

### 2. Clone the Repository

```bash
git clone https://github.com/janardhanchaturvedi/yt-valla-backendapis.git
cd yt-valla-backendapis
```

### 3. Install Dependencies

```bash
bun install
```

This will install all required packages including:
- Elysia.js (web framework)
- Prisma (database ORM)
- OpenAI & Replicate clients
- JWT authentication
- And more...

### 4. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL

1. Install PostgreSQL on your system:
   - **Ubuntu/Debian**: `sudo apt install postgresql postgresql-contrib`
   - **macOS**: `brew install postgresql`
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/)

2. Start PostgreSQL:
   ```bash
   # Ubuntu/Debian
   sudo service postgresql start
   
   # macOS
   brew services start postgresql
   ```

3. Create a database:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE ytvalla;
   CREATE USER ytvalla_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE ytvalla TO ytvalla_user;
   \q
   ```

#### Option B: Cloud Database (Recommended for Production)

Use a managed PostgreSQL service like:
- **Supabase** (https://supabase.com) - Free tier available
- **Neon** (https://neon.tech) - Serverless PostgreSQL
- **Railway** (https://railway.app) - Simple deployment
- **DigitalOcean Managed Databases**

### 5. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your configuration:
   ```bash
   nano .env  # or use your preferred editor
   ```

3. Update the following variables:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database - Update with your PostgreSQL credentials
   DATABASE_URL="postgresql://ytvalla_user:your_secure_password@localhost:5432/ytvalla?schema=public"

   # JWT Configuration - IMPORTANT: Change this to a strong secret
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   JWT_EXPIRES_IN=7d

   # OpenAI Configuration - Get from https://platform.openai.com/api-keys
   OPENAI_API_KEY=sk-your-openai-api-key

   # Replicate Configuration - Get from https://replicate.com/account/api-tokens
   REPLICATE_API_KEY=r8_your-replicate-api-key

   # DigitalOcean Spaces - Or any S3-compatible storage
   DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
   DO_SPACES_REGION=nyc3
   DO_SPACES_BUCKET=your-bucket-name
   DO_SPACES_ACCESS_KEY_ID=your-access-key
   DO_SPACES_SECRET_ACCESS_KEY=your-secret-key

   # AI Image Costs (in credits)
   OPENAI_IMAGE_COST=10
   REPLICATE_IMAGE_COST=5
   ```

### 6. Set Up API Keys

#### OpenAI (for DALL-E 3)

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it to your `.env` file as `OPENAI_API_KEY`

#### Replicate (for Stable Diffusion XL)

1. Go to https://replicate.com/account/api-tokens
2. Create a new token
3. Copy it to your `.env` file as `REPLICATE_API_KEY`

#### DigitalOcean Spaces (for image storage)

1. Create a DigitalOcean account
2. Go to Spaces and create a new Space
3. Generate an API key from API → Tokens/Keys
4. Update the `.env` file with your Space details

**Alternative:** You can use any S3-compatible storage service (AWS S3, Cloudflare R2, MinIO, etc.)

### 7. Generate Prisma Client

```bash
bun run db:generate
```

This generates the Prisma Client based on your schema.

### 8. Run Database Migrations

Push the schema to your database:

```bash
bun run db:push
```

Or create and run migrations (recommended for production):

```bash
bun run db:migrate
```

### 9. Verify Setup

Check that everything is configured correctly:

```bash
bunprisma db pull
```

This should connect to your database successfully.

### 10. Start the Development Server

```bash
bun run dev
```

You should see:
```
🚀 YTVaala Backend is running at http://localhost:3000
```

### 11. Test the API

Open another terminal and test the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-11-03T15:00:00.000Z"
}
```

## Production Deployment

### Environment Setup

1. Set `NODE_ENV=production` in your `.env`
2. Use a strong, randomly generated `JWT_SECRET`
3. Use managed database services
4. Enable SSL/TLS for database connections
5. Use environment-specific API keys

### Build for Production

```bash
bun build index.ts --target=bun --outfile=dist/server.js
```

### Run in Production

```bash
bun run start
```

Or with PM2 for process management:

```bash
npm install -g pm2
pm2 start "bun run start" --name ytvalla-backend
```

### Deployment Platforms

The app can be deployed to:

1. **DigitalOcean App Platform**
   - Easy deployment from GitHub
   - Automatic scaling
   - Built-in database support

2. **Railway**
   - Simple deployment
   - Free tier available
   - PostgreSQL included

3. **Fly.io**
   - Global edge deployment
   - Bun.js support
   - PostgreSQL addon

4. **AWS/GCP/Azure**
   - Full control
   - Requires more configuration

### Reverse Proxy (Nginx)

For production, use Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Management

### Prisma Studio

Open Prisma Studio to view and edit your database:

```bash
bun run db:studio
```

This opens a web interface at `http://localhost:5555`

### Backup Database

```bash
pg_dump -U ytvalla_user ytvalla > backup.sql
```

### Restore Database

```bash
psql -U ytvalla_user ytvalla < backup.sql
```

## Troubleshooting

### Database Connection Issues

1. **Error: Can't reach database server**
   - Verify PostgreSQL is running: `sudo service postgresql status`
   - Check DATABASE_URL in `.env`
   - Ensure firewall allows connections

2. **Error: Authentication failed**
   - Verify database credentials
   - Check user permissions in PostgreSQL

### API Key Issues

1. **OpenAI errors**
   - Verify API key is valid
   - Check billing/usage limits
   - Ensure key has proper permissions

2. **Replicate errors**
   - Verify token is active
   - Check API quotas

### Port Already in Use

If port 3000 is busy:

```bash
# Change PORT in .env
PORT=3001

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Prisma Issues

1. **Clear Prisma cache**:
   ```bash
   rm -rf node_modules/.prisma
   bun run db:generate
   ```

2. **Reset database** (⚠️ This deletes all data):
   ```bash
   bunprisma db push --force-reset
   ```

## Development Tips

### Hot Reload

The dev server automatically reloads on file changes:
```bash
bun run dev
```

### Debug Mode

Enable verbose logging:
```bash
DEBUG=* bun run dev
```

### Database Seeding

Create a seed file at `prisma/seed.ts`:

```typescript
import { prisma } from '../src/utils/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
      credits: 1000,
    },
  });
  
  console.log('Created user:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run seed:
```bash
bun run prisma/seed.ts
```

## Additional Resources

- [Bun.js Documentation](https://bun.sh/docs)
- [Elysia.js Documentation](https://elysiajs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Replicate API Documentation](https://replicate.com/docs)

## Getting Help

- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API usage
- Review [README.md](./README.md) for project overview
- Open an issue on GitHub for bugs
- Contact the maintainer for questions

## Next Steps

After setup is complete:

1. Read the [API Documentation](./API_DOCUMENTATION.md)
2. Test the API endpoints with Postman or cURL
3. Build your frontend application
4. Implement payment integration for credits
5. Add monitoring and logging
6. Set up CI/CD pipeline

Happy coding! 🚀
