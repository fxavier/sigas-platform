// Client-side upload service

export interface PresignedUrlResponse {
  url: string;
  key: string;
  fileUrl: string;
}

export interface UploadResponse {
  fileUrl: string;
}

export async function getPresignedUploadUrl(
  fileName: string,
  contentType: string
): Promise<PresignedUrlResponse> {
  const response = await fetch('/api/presigned', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileName, contentType }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get presigned URL');
  }

  return response.json();
}

export async function uploadFileWithPresignedUrl(
  presignedUrl: string,
  file: File
): Promise<void> {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file using presigned URL');
  }
}

export async function uploadFileToS3(file: File): Promise<string> {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);

    // Upload using our server-side API
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload file');
    }

    const data = await response.json();
    return data.fileUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
