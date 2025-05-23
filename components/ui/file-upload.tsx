// components/ui/file-upload.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, File, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadFileToS3 } from '@/lib/s3-service';

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  onFileUpload: (fileUrl: string, fileName: string) => void;
  onFileRemove?: () => void;
  currentFile?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
}

export function FileUpload({
  label = 'Upload File',
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
  maxSize = 10,
  onFileUpload,
  onFileRemove,
  currentFile,
  disabled = false,
  required = false,
  className,
  error,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (accept && accept !== '*') {
      const acceptedTypes = accept.split(',').map((type) => type.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (
        !acceptedTypes.some(
          (type) =>
            type === fileExtension || file.type.match(type.replace('*', '.*'))
        )
      ) {
        setUploadError('Tipo de arquivo não suportado');
        return;
      }
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const fileUrl = await uploadFileToS3(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Call the callback with the file URL and name
      onFileUpload(fileUrl, file.name);

      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(
        error instanceof Error
          ? error.message
          : 'Erro ao fazer upload do arquivo'
      );
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemoveFile = () => {
    if (onFileRemove) {
      onFileRemove();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadError(null);
  };

  const getFileName = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const fileName = pathname.split('/').pop() || 'arquivo';
      // Remove UUID prefix if present
      return fileName.replace(/^[a-f0-9-]+-/, '');
    } catch {
      return 'arquivo';
    }
  };

  const displayError = error || uploadError;

  return (
    <div className={cn('space-y-2', className)}>
      <Label>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </Label>

      {/* Current file display */}
      {currentFile && !isUploading && (
        <div className='flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md'>
          <div className='flex items-center space-x-2'>
            <CheckCircle className='h-4 w-4 text-green-600' />
            <div>
              <p className='text-sm font-medium text-green-800'>
                {getFileName(currentFile)}
              </p>
              <p className='text-xs text-green-600'>Arquivo carregado</p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => window.open(currentFile, '_blank')}
              className='text-green-700 hover:text-green-800'
            >
              Ver
            </Button>
            {!disabled && (
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={handleRemoveFile}
                className='text-red-600 hover:text-red-700'
              >
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Upload area */}
      {!currentFile && (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400',
            disabled && 'opacity-50 cursor-not-allowed',
            displayError && 'border-red-300 bg-red-50'
          )}
          onDrop={disabled ? undefined : handleDrop}
          onDragOver={disabled ? undefined : handleDragOver}
          onDragLeave={disabled ? undefined : handleDragLeave}
        >
          {isUploading ? (
            <div className='space-y-4'>
              <div className='flex items-center justify-center'>
                <Upload className='h-8 w-8 text-primary animate-pulse' />
              </div>
              <div>
                <p className='text-sm font-medium'>Fazendo upload...</p>
                <Progress value={uploadProgress} className='mt-2' />
                <p className='text-xs text-gray-500 mt-1'>
                  {uploadProgress}% concluído
                </p>
              </div>
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='flex items-center justify-center'>
                <File className='h-8 w-8 text-gray-400' />
              </div>
              <div>
                <p className='text-sm font-medium'>
                  Arraste um arquivo aqui ou clique para selecionar
                </p>
                <p className='text-xs text-gray-500 mt-1'>
                  Tamanho máximo: {maxSize}MB
                </p>
                {accept && (
                  <p className='text-xs text-gray-500'>
                    Tipos aceitos: {accept}
                  </p>
                )}
              </div>
              <Button
                type='button'
                variant='outline'
                size='sm'
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className='h-4 w-4 mr-2' />
                Selecionar Arquivo
              </Button>
            </div>
          )}
        </div>
      )}

      {/* File input (hidden) */}
      <Input
        ref={fileInputRef}
        type='file'
        accept={accept}
        onChange={handleFileInputChange}
        disabled={disabled || isUploading}
        className='hidden'
      />

      {/* Error display */}
      {displayError && (
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
