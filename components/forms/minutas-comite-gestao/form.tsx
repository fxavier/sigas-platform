// components/forms/minutas-comite-gestao/form.tsx
'use client';

import { useEffect, useState } from 'react';
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
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { FormSection } from '../form-section';
import { FormRow } from '../form-row';
import { FormActions } from '../form-actions';
import { AddOptionDialog } from '@/components/forms/add-option-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

import {
  minutasComiteGestaoCompletoSchema,
  MinutasComiteGestaoCompletoFormData,
  ResultadoComiteFormData,
} from '@/lib/validations/minutas-comite-gestao';
import { ResultadoComiteGestaoResponse } from '@/hooks/use-minutas-comite-gestao';

interface MinutasComiteGestaoFormProps {
  initialData?: any;
  onSubmit: (data: MinutasComiteGestaoCompletoFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  resultados?: ResultadoComiteGestaoResponse[];
  onCreateResultado?: (
    data: ResultadoComiteFormData
  ) => Promise<ResultadoComiteGestaoResponse>;
}

export function MinutasComiteGestaoForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  resultados = [],
  onCreateResultado,
}: MinutasComiteGestaoFormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const [showNewResultadoForm, setShowNewResultadoForm] = useState(false);

  const form = useForm<MinutasComiteGestaoCompletoFormData>({
    resolver: zodResolver(minutasComiteGestaoCompletoSchema),
    defaultValues: {
      minuta: {
        id: initialData?.id,
        tenantId: currentTenantId || '',
        projectId: currentProjectId || '',
        presididoPor: initialData?.presididoPor || '',
        convidado: initialData?.convidado || '',
        ausenciasJustificadas: initialData?.ausenciasJustificadas || '',
        data: initialData?.data ? new Date(initialData.data) : new Date(),
        hora: initialData?.hora || '',
        local: initialData?.local || '',
        agenda: initialData?.agenda || '',
      },
      resultado: {
        pontosDebatidos:
          initialData?.resultadoComiteGestaoAmbientalESocial?.pontosDebatidos ||
          '',
        accoesNecessarias:
          initialData?.resultadoComiteGestaoAmbientalESocial
            ?.accoesNecessarias || '',
        responsavel:
          initialData?.resultadoComiteGestaoAmbientalESocial?.responsavel || '',
        prazo: initialData?.resultadoComiteGestaoAmbientalESocial?.prazo || '',
        situacao:
          initialData?.resultadoComiteGestaoAmbientalESocial?.situacao || '',
        revisaoEAprovacao:
          initialData?.resultadoComiteGestaoAmbientalESocial
            ?.revisaoEAprovacao || '',
        dataRevisaoEAprovacao: initialData
          ?.resultadoComiteGestaoAmbientalESocial?.dataRevisaoEAprovacao
          ? new Date(
              initialData.resultadoComiteGestaoAmbientalESocial.dataRevisaoEAprovacao
            )
          : new Date(),
      },
    },
  });

  // Update form values when tenant/project context changes
  useEffect(() => {
    if (currentTenantId) {
      form.setValue('minuta.tenantId', currentTenantId);
    }
    if (currentProjectId) {
      form.setValue('minuta.projectId', currentProjectId);
    }
  }, [currentTenantId, currentProjectId, form]);

  // Handle form submission
  const handleFormSubmit = async (
    data: MinutasComiteGestaoCompletoFormData
  ) => {
    if (!currentTenantId || !currentProjectId) {
      return;
    }

    try {
      // Ensure current tenant ID and project ID are used
      const submissionData = {
        ...data,
        minuta: {
          ...data.minuta,
          tenantId: currentTenantId,
          projectId: currentProjectId,
        },
      };

      await onSubmit(submissionData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Handle creating a new resultado
  const handleCreateResultado = async (
    resultadoData: ResultadoComiteFormData
  ) => {
    if (!onCreateResultado) return;

    try {
      const newResultado = await onCreateResultado(resultadoData);
      // The parent component should refresh the resultados list
      setShowNewResultadoForm(false);
    } catch (error) {
      console.error('Error creating resultado:', error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className='space-y-8'
      >
        <input
          type='hidden'
          {...form.register('minuta.tenantId')}
          value={currentTenantId || ''}
        />
        <input
          type='hidden'
          {...form.register('minuta.projectId')}
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

        {/* Informações da Reunião */}
        <FormSection
          title='Informações da Reunião'
          description='Dados básicos sobre a reunião do comitê de gestão ambiental e social'
        >
          <FormRow>
            <FormField
              control={form.control}
              name='minuta.presididoPor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Presidido Por
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nome de quem presidiu a reunião'
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
              name='minuta.convidado'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Convidados
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Lista dos convidados presentes na reunião'
                      className='min-h-[80px]'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          <FormField
            control={form.control}
            name='minuta.ausenciasJustificadas'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ausências Justificadas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Lista de pessoas que justificaram suas ausências'
                    className='min-h-[80px]'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Opcional - liste as pessoas que não puderam comparecer mas
                  justificaram suas ausências
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormRow>
            <FormField
              control={form.control}
              name='minuta.data'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>
                    Data da Reunião
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
              name='minuta.hora'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Horário
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ex: 09:00 às 12:00'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Horário de início e fim da reunião
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          <FormField
            control={form.control}
            name='minuta.local'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Local da Reunião
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Endereço ou nome do local onde ocorreu a reunião'
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
            name='minuta.agenda'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Agenda da Reunião
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva os tópicos abordados na agenda da reunião'
                    className='min-h-[120px]'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Inclua os pontos principais discutidos, apresentações e
                  decisões tomadas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Separator />

        {/* Resultados do Comitê */}
        <FormSection
          title='Resultados do Comitê'
          description='Pontos debatidos, ações necessárias e responsabilidades definidas na reunião'
        >
          <FormField
            control={form.control}
            name='resultado.pontosDebatidos'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Pontos Debatidos
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva detalhadamente os pontos que foram debatidos na reunião'
                    className='min-h-[150px]'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Inclua os principais temas discutidos, preocupações levantadas
                  e conclusões alcançadas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='resultado.accoesNecessarias'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Ações Necessárias
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Liste as ações que devem ser tomadas com base nas discussões'
                    className='min-h-[120px]'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Descreva as medidas concretas que devem ser implementadas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormRow>
            <FormField
              control={form.control}
              name='resultado.responsavel'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Responsável
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nome do responsável pelas ações'
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
              name='resultado.prazo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Prazo
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ex: 30 dias, até 15/12/2024'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Prazo para conclusão das ações
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          <FormField
            control={form.control}
            name='resultado.situacao'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Situação
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Ex: Pendente, Em andamento, Concluída'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Status atual das ações definidas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='resultado.revisaoEAprovacao'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Revisão e Aprovação
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva o processo de revisão e aprovação das decisões'
                    className='min-h-[100px]'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Inclua informações sobre quem revisou e aprovou as decisões
                  tomadas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='resultado.dataRevisaoEAprovacao'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>
                  Data de Revisão e Aprovação
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
