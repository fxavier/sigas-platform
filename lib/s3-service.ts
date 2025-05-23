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

    // Create form data
    const formData = new FormData();
    formData.append('file', file);

    // Upload to S3 via API route
    const response = await fetch('/api/upload/s3', {
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

    return result.url;
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
