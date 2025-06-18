// components/forms/esms-documents/document-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { FormField } from '@/components/forms/form-field';
import { FormRow } from '@/components/forms/form-row';
import { FormSection } from '@/components/forms/form-section';
import { FormActions } from '@/components/forms/form-actions';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  baseDocumentSchema,
  ESMSDocumentFormData,
  estadoDocumentoLabels,
  DocumentType,
  documentTypeLabels,
} from '@/lib/validations/esms-documents';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';

interface ESMSDocumentFormProps {
  documentType: DocumentType;
  initialData?: ESMSDocumentFormData & { id?: string };
  onSubmit: (data: ESMSDocumentFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ESMSDocumentForm({
  documentType,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ESMSDocumentFormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const [fileUrl, setFileUrl] = useState<string>(initialData?.ficheiro || '');

  const defaultValues: Partial<ESMSDocumentFormData> = {
    tenantId: currentTenantId || '',
    projectId: currentProjectId || '',
    codigo: '',
    nomeDocumento: '',
    ficheiro: '',
    estadoDocumento: 'REVISAO',
    periodoRetencao: null,
    dataRevisao: null,
  };

  const form = useForm<ESMSDocumentFormData>({
    resolver: zodResolver(baseDocumentSchema),
    defaultValues: initialData || defaultValues,
  });

  // Update form values when context changes
  useEffect(() => {
    if (currentTenantId && currentProjectId) {
      form.setValue('tenantId', currentTenantId);
      form.setValue('projectId', currentProjectId);
    }
  }, [currentTenantId, currentProjectId, form]);

  // Update file URL when initialData changes
  useEffect(() => {
    if (initialData?.ficheiro) {
      setFileUrl(initialData.ficheiro);
      form.setValue('ficheiro', initialData.ficheiro);
    }
  }, [initialData, form]);

  const handleSubmit = async (data: ESMSDocumentFormData) => {
    try {
      // Ensure file is set
      if (!fileUrl) {
        form.setError('ficheiro', {
          type: 'required',
          message: 'Ficheiro é obrigatório',
        });
        return;
      }

      data.ficheiro = fileUrl;
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleFileUpload = (url: string, fileName: string) => {
    setFileUrl(url);
    form.setValue('ficheiro', url);
    form.clearErrors('ficheiro');
  };

  const handleFileRemove = () => {
    setFileUrl('');
    form.setValue('ficheiro', '');
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
      <FormSection
        title={`${initialData ? 'Editar' : 'Novo'} ${
          documentTypeLabels[documentType]
        }`}
        description={`Preencha as informações do documento ${documentTypeLabels[
          documentType
        ].toLowerCase()}`}
      >
        <FormRow>
          <FormField label='Código' required>
            <Controller
              control={form.control}
              name='codigo'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    placeholder={`Ex: ${documentType.toUpperCase()}-001`}
                    className={cn(error && 'border-red-500')}
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Estado do Documento' required>
            <Controller
              control={form.control}
              name='estadoDocumento'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={cn(error && 'border-red-500')}>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(estadoDocumentoLabels).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>
        </FormRow>

        <FormField label='Nome do Documento' required>
          <Controller
            control={form.control}
            name='nomeDocumento'
            render={({ field, fieldState: { error } }) => (
              <div className='space-y-1'>
                <Input
                  {...field}
                  placeholder={`Nome do ${documentTypeLabels[
                    documentType
                  ].toLowerCase()}`}
                  className={cn(error && 'border-red-500')}
                />
                {error && (
                  <p className='text-sm text-red-500'>{error.message}</p>
                )}
              </div>
            )}
          />
        </FormField>

        <FormField label='Ficheiro' required>
          <Controller
            control={form.control}
            name='ficheiro'
            render={({ fieldState: { error } }) => (
              <FileUpload
                label='Carregar Documento'
                accept='.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'
                maxSize={10}
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
                currentFile={fileUrl}
                disabled={isLoading}
                required
                error={error?.message}
              />
            )}
          />
        </FormField>

        <FormRow>
          <FormField label='Data de Revisão'>
            <Controller
              control={form.control}
              name='dataRevisao'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground',
                          error && 'border-red-500'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field.value ? (
                          format(new Date(field.value), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => field.onChange(date)}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Período de Retenção'>
            <Controller
              control={form.control}
              name='periodoRetencao'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground',
                          error && 'border-red-500'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field.value ? (
                          format(new Date(field.value), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => field.onChange(date)}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>
        </FormRow>
      </FormSection>

      <FormActions
        onCancel={onCancel}
        isSubmitting={isLoading}
        submitLabel={initialData ? 'Atualizar' : 'Salvar'}
      />
    </form>
  );
}
