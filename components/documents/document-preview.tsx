// components/documents/document-preview.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, File, FileImage, FileArchive } from 'lucide-react';

interface DocumentPreviewProps {
  fileName: string;
  fileType: string;
  fileSize?: string;
}

export function DocumentPreview({
  fileName,
  fileType,
  fileSize,
}: DocumentPreviewProps) {
  // Determine the icon based on file type
  const getFileIcon = () => {
    const type = fileType.toLowerCase();

    if (type.includes('doc') || type.includes('word')) {
      return <FileText className='h-12 w-12 text-blue-600' />;
    } else if (type.includes('pdf')) {
      return <File className='h-12 w-12 text-red-600' />;
    } else if (
      type.includes('image') ||
      type.includes('png') ||
      type.includes('jpg')
    ) {
      return <FileImage className='h-12 w-12 text-green-600' />;
    } else {
      return <FileArchive className='h-12 w-12 text-gray-600' />;
    }
  };

  return (
    <Card className='flex items-center p-6 hover:shadow-md transition-shadow'>
      <div className='mr-6 flex-shrink-0'>{getFileIcon()}</div>
      <CardContent className='p-0 flex-grow'>
        <h3 className='font-medium text-lg'>{fileName}</h3>
        <div className='flex items-center text-sm text-gray-500 mt-1'>
          <span className='mr-3'>Tipo: {fileType}</span>
          {fileSize && <span>Tamanho: {fileSize}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
