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
  perguntaAvaliacaoClassificacaoEmergenciaSchema,
  PerguntaAvaliacaoClassificacaoEmergenciaFormData,
} from '@/lib/validations/perguntas-avaliacao-classificacao-emergencia';

interface PerguntaAvaliacaoClassificacaoEmergenciaFormProps {
  initialData?: any;
  onSubmit: (
    data: PerguntaAvaliacaoClassificacaoEmergenciaFormData
  ) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function PerguntaAvaliacaoClassificacaoEmergenciaForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: PerguntaAvaliacaoClassificacaoEmergenciaFormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  const form = useForm<PerguntaAvaliacaoClassificacaoEmergenciaFormData>({
    resolver: zodResolver(perguntaAvaliacaoClassificacaoEmergenciaSchema),
    defaultValues: {
      id: initialData?.id,
      codigo: initialData?.codigo || '',
      pergunta: initialData?.pergunta || '',
      tenantId: currentTenantId || '',
      projectId: currentProjectId || '',
    },
  });

  // Handle form submission
  const handleFormSubmit = async (
    data: PerguntaAvaliacaoClassificacaoEmergenciaFormData
  ) => {
    if (!currentTenantId || !currentProjectId) {
      return;
    }

    try {
      // Ensure current tenant and project IDs are used
      const submissionData = {
        ...data,
        tenantId: currentTenantId,
        projectId: currentProjectId,
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
        <FormSection title='Detalhes da Pergunta'>
          <FormField
            control={form.control}
            name='codigo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Código
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Ex: P-001'
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
            name='pergunta'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Pergunta
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Pergunta para avaliação e classificação de emergência'
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
          <input
            type='hidden'
            {...form.register('projectId')}
            value={currentProjectId || ''}
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
