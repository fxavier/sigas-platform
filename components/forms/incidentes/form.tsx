'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { FormField } from '@/components/forms/form-field';
import { FormActions } from '@/components/forms/form-actions';
import { Textarea } from '@/components/ui/textarea';
import {
  incidenteSchema,
  IncidenteFormData,
} from '@/lib/validations/incidentes';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';

interface IncidenteFormProps {
  initialData?: IncidenteFormData;
  onSubmit: (data: IncidenteFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function IncidenteForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: IncidenteFormProps) {
  const { currentTenantId } = useTenantProjectContext();

  const defaultValues: Partial<IncidenteFormData> = {
    tenantId: currentTenantId || '',
    descricao: '',
  };

  const form = useForm<IncidenteFormData>({
    resolver: zodResolver(incidenteSchema),
    defaultValues: initialData || defaultValues,
  });

  const handleSubmit = async (data: IncidenteFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
      <FormField label='Descrição do Incidente' required>
        <Controller
          control={form.control}
          name='descricao'
          render={({ field, fieldState: { error } }) => (
            <div className='space-y-1'>
              <Textarea
                {...field}
                placeholder='Descreva o incidente (máximo 100 caracteres)'
                maxLength={100}
                rows={3}
                className={error ? 'border-red-500' : ''}
              />
              {error && <p className='text-sm text-red-500'>{error.message}</p>}
              <p className='text-sm text-gray-500'>
                {field.value?.length || 0}/100 caracteres
              </p>
            </div>
          )}
        />
      </FormField>

      <FormActions
        onCancel={onCancel}
        isSubmitting={isLoading}
        submitLabel='Salvar Incidente'
      />
    </form>
  );
}
