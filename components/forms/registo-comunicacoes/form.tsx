// components/forms/registo-comunicacoes/form.tsx
'use client';

import { useEffect } from 'react';
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { FormSection } from '../form-section';
import { FormRow } from '../form-row';
import { FormActions } from '../form-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

import {
  registoComunicacoesSchema,
  RegistoComunicacoesFormData,
  RespostaSimNaoEnum,
  translateRespostaSimNao,
} from '@/lib/validations/registo-comunicacoes';

interface RegistoComunicacoesFormProps {
  initialData?: any;
  onSubmit: (data: RegistoComunicacoesFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function RegistoComunicacoesForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: RegistoComunicacoesFormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  const form = useForm<RegistoComunicacoesFormData>({
    resolver: zodResolver(registoComunicacoesSchema) as any,
    defaultValues: {
      id: initialData?.id,
      tenantId: currentTenantId || '',
      projectId: currentProjectId || '',
      data: initialData?.data ? new Date(initialData.data) : new Date(),
      local: initialData?.local || '',
      horario: initialData?.horario || '',
      agenda: initialData?.agenda || '',
      participantes: initialData?.participantes || '',
      encontroAtendeuSeuProposito:
        initialData?.encontroAtendeuSeuProposito || 'SIM',
      porqueNaoAtendeu: initialData?.porqueNaoAtendeu || '',
      haNecessidadeRetomarTema: initialData?.haNecessidadeRetomarTema || 'NAO',
      poruqNecessarioRetomarTema: initialData?.poruqNecessarioRetomarTema || '',
    },
  });

  // Update form values when tenant/project context changes
  useEffect(() => {
    if (currentTenantId) {
      form.setValue('tenantId', currentTenantId);
    }
    if (currentProjectId) {
      form.setValue('projectId', currentProjectId);
    }
  }, [currentTenantId, currentProjectId, form]);

  // Handle form submission
  const handleFormSubmit = async (data: RegistoComunicacoesFormData) => {
    if (!currentTenantId || !currentProjectId) {
      return;
    }

    try {
      // Ensure current tenant ID and project ID are used
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

  // Watch fields for conditional rendering
  const encontroAtendeuSeuProposito = form.watch('encontroAtendeuSeuProposito');
  const haNecessidadeRetomarTema = form.watch('haNecessidadeRetomarTema');

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit as any)}
        className='space-y-8'
      >
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

        {(!currentTenantId || !currentProjectId) && (
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertTitle>Projeto não selecionado</AlertTitle>
            <AlertDescription>
              É necessário selecionar um projeto para continuar.
            </AlertDescription>
          </Alert>
        )}

        {/* Informações Básicas do Encontro */}
        <FormSection
          title='Informações do Encontro'
          description='Dados básicos sobre o encontro/comunicação com as partes interessadas'
        >
          <FormRow>
            <FormField
              control={form.control}
              name='data'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>
                    Data do Encontro
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                          disabled={isLoading}
                        >
                          {field.value ? (
                            format(field.value, 'dd/MM/yyyy', { locale: ptBR })
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='horario'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Horário
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ex: 09:00 - 12:00'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Horário de início e fim do encontro
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          <FormField
            control={form.control}
            name='local'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Local do Encontro
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Ex: Sede da Associação de Moradores, Sala de Conferências'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Conteúdo e Participação */}
        <FormSection
          title='Conteúdo e Participação'
          description='Detalhes sobre a agenda e participantes do encontro'
        >
          <FormField
            control={form.control}
            name='agenda'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Agenda do Encontro
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva os tópicos abordados e a agenda do encontro'
                    className='min-h-[120px]'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Inclua os principais tópicos discutidos, apresentações feitas
                  e decisões tomadas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='participantes'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Participantes
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Liste os participantes do encontro, suas organizações e funções'
                    className='min-h-[120px]'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Inclua nomes, organizações, cargos e dados de contacto quando
                  relevante
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Avaliação do Encontro */}
        <FormSection
          title='Avaliação do Encontro'
          description='Avaliação sobre a eficácia e necessidades de seguimento'
        >
          <FormRow>
            <FormField
              control={form.control}
              name='encontroAtendeuSeuProposito'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    O encontro atendeu ao seu propósito?
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className='bg-white'>
                        <SelectValue placeholder='Seleciona a opção' />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(RespostaSimNaoEnum.Values).map(
                          (value) => (
                            <SelectItem key={value} value={value}>
                              {translateRespostaSimNao(value)}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='haNecessidadeRetomarTema'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Há necessidade de retomar o tema?
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className='bg-white'>
                        <SelectValue placeholder='Seleciona a opção' />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(RespostaSimNaoEnum.Values).map(
                          (value) => (
                            <SelectItem key={value} value={value}>
                              {translateRespostaSimNao(value)}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          {/* Conditional fields based on responses */}
          {encontroAtendeuSeuProposito === 'NAO' && (
            <FormField
              control={form.control}
              name='porqueNaoAtendeu'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Por que o encontro não atendeu ao seu propósito?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Explique os motivos pelos quais o encontro não atingiu seus objetivos'
                      className='min-h-[100px]'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Descreva os obstáculos encontrados e o que poderia ter sido
                    feito diferente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {haNecessidadeRetomarTema === 'SIM' && (
            <FormField
              control={form.control}
              name='poruqNecessarioRetomarTema'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Por que é necessário retomar o tema?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Explique os motivos para retomar o tema e próximos passos necessários'
                      className='min-h-[100px]'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Inclua questões pendentes, esclarecimentos necessários ou
                    ações de seguimento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
