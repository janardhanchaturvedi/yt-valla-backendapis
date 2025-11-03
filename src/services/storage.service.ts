import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../utils/config';

export class StorageService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      endpoint: config.digitalOcean.endpoint,
      region: config.digitalOcean.region,
      credentials: {
        accessKeyId: config.digitalOcean.accessKeyId,
        secretAccessKey: config.digitalOcean.secretAccessKey,
      },
    });
  }

  async uploadImage(buffer: Buffer, fileName: string, contentType: string = 'image/png'): Promise<string> {
    const key = `images/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: config.digitalOcean.bucket,
      Key: key,
      Body: buffer,
      ACL: 'public-read',
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    // Construct public URL in the format: https://{bucket}.{region}.digitaloceanspaces.com/{key}
    const bucketUrl = config.digitalOcean.endpoint.replace('https://', `https://${config.digitalOcean.bucket}.`);
    const publicUrl = `${bucketUrl}/${key}`;
    return publicUrl;
  }

  async uploadFromUrl(imageUrl: string, fileName: string): Promise<string> {
    try {
      // Fetch image from URL
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get('content-type') || 'image/png';

      // Upload to DigitalOcean Spaces
      return await this.uploadImage(buffer, fileName, contentType);
    } catch (error) {
      console.error('Error uploading from URL:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
