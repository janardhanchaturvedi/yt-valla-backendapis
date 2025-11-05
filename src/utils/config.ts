// Validate required environment variables in production
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production environment');
}

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  cors: {
    allowedOrigins: process.env.CORS_ALLOWED_ORIGINS || '*',
  },
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    imageCost: parseInt(process.env.OPENAI_IMAGE_COST || '10'),
  },
  
  replicate: {
    apiKey: process.env.REPLICATE_API_KEY || '',
    imageCost: parseInt(process.env.REPLICATE_IMAGE_COST || '5'),
    model: process.env.REPLICATE_MODEL || 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
  },
  
  digitalOcean: {
    endpoint: process.env.DO_SPACES_ENDPOINT || '',
    region: process.env.DO_SPACES_REGION || '',
    bucket: process.env.DO_SPACES_BUCKET || '',
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY || '',
  },
};
