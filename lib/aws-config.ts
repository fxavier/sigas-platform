// AWS S3 Configuration
export const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
export const AWS_S3_BUCKET = process.env.S3_BUCKET_NAME;
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

// Debug logging (only on server)
if (typeof window === 'undefined') {
  console.log('AWS Environment Variables:', {
    region: AWS_REGION,
    bucket: AWS_S3_BUCKET ? 'Set' : 'Not Set',
    accessKey: AWS_ACCESS_KEY ? 'Set' : 'Not Set',
    secretKey: AWS_SECRET_KEY ? 'Set' : 'Not Set',
  });
}

// Validate required environment variables (only on server)
if (
  typeof window === 'undefined' &&
  (!AWS_S3_BUCKET || !AWS_ACCESS_KEY || !AWS_SECRET_KEY)
) {
  console.error('Missing required AWS environment variables');
}
