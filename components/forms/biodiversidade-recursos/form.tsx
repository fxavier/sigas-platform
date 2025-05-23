// components/forms/biodiversidade-recursos/form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormSection } from '../form-section';
import { FormActions } from '../form-actions';
import {
  biodiversidadeRecursosSchema,
  BiodiversidadeRecursosFormData,
} from '@/lib/validations/biodiversidade-recursos';

interface BiodiversidadeRecursosFormProps {
  initialData?: any;
  onSubmit: (data: BiodiversidadeRecursosFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function BiodiversidadeRecursosForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: BiodiversidadeRecursosFormProps) {
  const { currentTenantId } = useTenantProjectContext();

  const form = useForm<BiodiversidadeRecursosFormData>({
    resolver: zodResolver(biodiversidadeRecursosSchema),
    defaultValues: {
      id: initialData?.id,
      reference: initialData?.reference || '',
      description: initialData?.description || '',
      tenantId: currentTenantId || '',
    },
  });

  // Handle form submission
  const handleFormSubmit = async (data: BiodiversidadeRecursosFormData) => {
    if (!currentTenantId) {
      return;
    }

    try {
      // Ensure current tenant ID is used
      const submissionData = {
        ...data,
        tenantId: currentTenantId,
      };

      await onSubmit(submissionData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className='space-y-8'
      >
        <FormSection title='Detalhes do Recurso'>
          <FormField
            control={form.control}
            name='reference'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Referência
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Ex: BIO-001'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Descrição
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descrição detalhada do recurso de biodiversidade'
                    className='min-h-[120px]'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <input
            type='hidden'
            {...form.register('tenantId')}
            value={currentTenantId || ''}
          />
        </FormSection>

        <FormActions
          isSubmitting={isLoading}
          onCancel={onCancel}
          submitLabel={initialData?.id ? 'Atualizar' : 'Criar'}
        />
      </form>
    </Form>
  );
}
