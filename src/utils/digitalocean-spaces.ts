import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// In digitalocean-spaces.ts
const spacesEndpoint = process.env.DO_SPACES_ENDPOINT || '';
const accessKeyId = process.env.DO_SPACES_KEY || '';
const secretAccessKey = process.env.DO_SPACES_SECRET || '';
const bucketName = process.env.DO_SPACES_BUCKET || '';
const imageEndpointURL = process.env.DO_BASE_URL || '';


// Update the S3 client configuration
const s3Client = new S3Client({
  endpoint: String(spacesEndpoint),
  region: 'blr1', 
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: false, 
});

export const uploadToSpaces = async (fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> => {
  const key = `uploads/${fileName}`;
  
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ACL: 'public-read',
      ContentType: contentType,
    });

    await s3Client.send(command);
    
    // Construct the public URL correctly
    return `${imageEndpointURL}/${key}`;
  } catch (error: any) {
    console.error('Error details:', {
      error: error?.message,
      bucketName,
      imageEndpointURL,
      key
    });
    throw new Error(`Failed to upload file to storage: ${error?.message}`);
  }
};

export const uploadBase64Image = async (base64String: string, fileName: string): Promise<string> => {
  // Remove the data URL prefix if it exists
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Determine content type from base64 string or default to jpeg
  const contentType = base64String.startsWith('data:image/') 
    ? base64String.substring(5, base64String.indexOf(';base64')) 
    : 'image/jpeg';
  
  return uploadToSpaces(buffer, fileName, contentType);
};
