import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import {
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
} from './aws-config';

// Initialize S3 client with proper credentials check
const createS3Client = () => {
  // Check if required credentials are available
  if (!AWS_S3_BUCKET || !AWS_ACCESS_KEY || !AWS_SECRET_KEY) {
    console.warn('AWS credentials not fully configured: using fallback mode');
    return null;
  }

  return new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
    },
  });
};

// Initialize client (or set to null if credentials missing)
const s3Client = createS3Client();

/**
 * Uploads a file to S3 and returns the URL
 * Falls back to local storage if S3 credentials are not configured
 * @param file The file to upload
 * @returns The URL of the uploaded file
 */
export async function uploadFileToS3(file: File): Promise<string> {
  try {
    console.log('Uploading file:', file.name, file.size, file.type);

    // Check if we're in server-side context
    if (typeof window === 'undefined') {
      // Server-side: use direct S3 upload to avoid circular dependency
      return await uploadDirectlyToS3(file);
    }

    // Client-side: can safely use the main upload route
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Upload failed with status ${response.status}`
      );
    }

    const result = await response.json();
    console.log('File uploaded successfully:', result);

    return result.fileUrl;
  } catch (error) {
    console.error('Error in upload process:', error);
    throw new Error(
      `Failed to upload file: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Fallback function to upload file to local storage
 * @param file The file to upload
 * @returns The URL of the uploaded file
 */
async function uploadToLocalStorage(file: File): Promise<string> {
  // Create form data
  const formData = new FormData();
  formData.append('file', file);

  // Upload to local API endpoint
  const response = await fetch('/api/upload/local', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Upload failed with status ${response.status}`
    );
  }

  const result = await response.json();
  console.log('File uploaded to local storage:', result);

  return result.url;
}

/**
 * Direct local storage upload (for server-side use)
 * @param file The file to upload
 * @returns The URL of the uploaded file
 */
async function uploadToLocalStorageDirect(file: File): Promise<string> {
  const { writeFile, mkdir } = await import('fs/promises');
  const { join } = await import('path');

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('Arquivo muito grande. Tamanho máximo: 10MB');
  }

  // Get file extension
  const fileName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars
    .substring(0, 50); // Limit length

  const uniqueFileName = `${uuidv4().substring(0, 8)}-${fileName}`;

  // Create uploads directory if it doesn't exist
  const uploadsDir = join(process.cwd(), 'public', 'uploads');

  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    // Directory might already exist, that's fine
  }

  // Convert file to buffer and write to filesystem
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = join(uploadsDir, uniqueFileName);
  await writeFile(filePath, buffer);

  // Return the public URL
  const fileUrl = `/uploads/${uniqueFileName}`;
  console.log('File uploaded locally:', fileUrl);

  return fileUrl;
}

/**
 * Direct S3 upload function with fallback (for server-side use)
 * @param file The file to upload
 * @returns The URL of the uploaded file
 */
export async function uploadDirectlyToS3(file: File): Promise<string> {
  try {
    console.log(
      'Uploading file directly to S3:',
      file.name,
      file.size,
      file.type
    );

    // Check if AWS is configured
    if (!AWS_S3_BUCKET || !AWS_ACCESS_KEY || !AWS_SECRET_KEY) {
      console.log('AWS not configured, using local storage');
      return await uploadToLocalStorageDirect(file);
    }

    // Try S3 upload first
    try {
      // Create S3 client and upload directly
      const s3Client = new S3Client({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY,
          secretAccessKey: AWS_SECRET_KEY,
        },
      });

      // Generate unique filename
      const fileName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .substring(0, 50);
      const key = `uploads/${uuidv4().substring(0, 8)}-${fileName}`;

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to S3
      const command = new PutObjectCommand({
        Bucket: AWS_S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ACL: 'public-read',
      });

      await s3Client.send(command);

      // Return the URL
      const fileUrl = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
      console.log('File uploaded successfully to S3:', fileUrl);

      return fileUrl;
    } catch (s3Error) {
      console.warn('S3 upload failed, falling back to local storage:', s3Error);
      return await uploadToLocalStorageDirect(file);
    }
  } catch (error) {
    console.error('Error in S3 upload process:', error);
    throw new Error(
      `Failed to upload file: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Extracts the key from a URL (works for both S3 and local paths)
 * @param url The URL
 * @returns The key
 */
export function getKeyFromUrl(url: string): string | null {
  try {
    console.log('Extracting key from URL:', url);

    // Local file path handling
    if (url.startsWith('/uploads/')) {
      console.log('Local file URL detected');
      return url.substring(1); // Remove leading slash
    }

    // Check if it's an S3 URL
    if (!url || !AWS_S3_BUCKET || !url.includes(AWS_S3_BUCKET)) {
      console.warn('Not an S3 URL or bucket name not configured:', url);
      return null;
    }

    // Extract the key part from S3 URL
    const urlObj = new URL(url);
    const key = urlObj.pathname.startsWith('/')
      ? urlObj.pathname.substring(1)
      : urlObj.pathname;

    console.log('Extracted key:', key);
    return key;
  } catch (error) {
    console.error('Error extracting key from URL:', error);
    return null;
  }
}

/**
 * Deletes a file (either from S3 or local storage)
 * @param url The file URL
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    console.log('Attempting to delete file:', url);

    // Extract the key
    const key = getKeyFromUrl(url);
    if (!key) {
      console.warn('Could not extract key from URL, skipping deletion');
      return;
    }

    // Check if it's a local file
    if (key.startsWith('uploads/')) {
      // For local development, we might want to delete the file from local storage
      // This would require a server endpoint to handle this
      console.log('Local file, would delete from filesystem:', key);
      // Implementation depends on your local storage setup
      return;
    }

    // If S3 client isn't available, skip deletion
    if (!s3Client) {
      console.warn('S3 client not available, skipping deletion');
      return;
    }

    // Delete from S3
    const command = new DeleteObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
    });

    await s3Client.send(command);
    console.log('File deleted successfully from S3');
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error(
      `Failed to delete file: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

// Alias for backward compatibility
export const uploadToS3 = uploadFileToS3;
export const deleteFromS3 = async (key: string): Promise<void> => {
  // If it's a full URL, extract the key first
  if (key.startsWith('http')) {
    const extractedKey = getKeyFromUrl(key);
    if (extractedKey) {
      key = extractedKey;
    }
  }

  // If S3 client isn't available, skip deletion
  if (!s3Client) {
    console.warn('S3 client not available, skipping deletion');
    return;
  }

  const command = new DeleteObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
  });

  await s3Client.send(command);
  console.log('File deleted successfully from S3 using legacy method');
};

/**
 * Debugging function to check if AWS credentials are properly configured
 */
export function checkAwsConfig(): boolean {
  console.log('AWS Configuration:');
  console.log('- Region:', AWS_REGION);
  console.log('- S3 Bucket:', AWS_S3_BUCKET ? 'Set' : 'Not set');
  console.log('- Access Key:', AWS_ACCESS_KEY ? 'Set' : 'Not set');
  console.log('- Secret Key:', AWS_SECRET_KEY ? 'Set (hidden)' : 'Not set');

  const isConfigured = !!(AWS_S3_BUCKET && AWS_ACCESS_KEY && AWS_SECRET_KEY);

  if (!isConfigured) {
    console.warn(
      'AWS configuration incomplete. S3 operations will fallback to local storage.'
    );
  } else {
    console.log('AWS configuration complete. S3 operations available.');
  }

  return isConfigured;
}
