// components/forms/formulario-registo-reclamacoes-trabalhadores/form.tsx
'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { FormField } from '@/components/forms/form-field';
import { FormRow } from '@/components/forms/form-row';
import { FormSection } from '@/components/forms/form-section';
import { FormActions } from '@/components/forms/form-actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  formularioRegistoReclamacoesTrabalhadoresSchema,
  FormularioRegistoReclamacoesTrabalhadoresFormData,
} from '@/lib/validations/formulario-registo-reclamacoes-trabalhadores';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';

interface FormularioRegistoReclamacoesTrabalhadoresFormProps {
  initialData?: FormularioRegistoReclamacoesTrabalhadoresFormData;
  onSubmit: (
    data: FormularioRegistoReclamacoesTrabalhadoresFormData
  ) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function FormularioRegistoReclamacoesTrabalhadoresForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: FormularioRegistoReclamacoesTrabalhadoresFormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  const defaultValues: Partial<FormularioRegistoReclamacoesTrabalhadoresFormData> =
    {
      tenantId: currentTenantId || '',
      projectId: currentProjectId || '',
      empresa: '',
      dataReclamacao: new Date(),
      horaReclamacao: '',
      metodoPreferidoDoContacto: 'TELEFONE',
      detalhesDoContacto: '',
      linguaPreferida: 'PORTUGUES',
      detalhesDareclamacao: '',
      numeroIdentificacaoResponsavelRecepcao: '',
    };

  const form = useForm<FormularioRegistoReclamacoesTrabalhadoresFormData>({
    resolver: zodResolver(formularioRegistoReclamacoesTrabalhadoresSchema),
    defaultValues: initialData || defaultValues,
  });

  // Watch for conditional fields
  const linguaPreferida = form.watch('linguaPreferida');
  const confirmarRecepcaoResposta = form.watch('confirmarRecepcaoResposta');

  useEffect(() => {
    if (currentTenantId && currentProjectId) {
      form.setValue('tenantId', currentTenantId);
      form.setValue('projectId', currentProjectId);
    }
  }, [currentTenantId, currentProjectId, form]);

  const handleSubmit = async (
    data: FormularioRegistoReclamacoesTrabalhadoresFormData
  ) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
      <FormSection title='Informações da Reclamação'>
        <FormRow>
          <FormField label='Nome do Trabalhador'>
            <Controller
              control={form.control}
              name='nome'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    value={field.value || ''}
                    className={cn(error && 'border-red-500')}
                    placeholder='Nome do trabalhador (opcional)'
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Empresa' required>
            <Controller
              control={form.control}
              name='empresa'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Nome da empresa'
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Data da Reclamação' required>
            <Controller
              control={form.control}
              name='dataReclamacao'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
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
                        onSelect={field.onChange}
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

          <FormField label='Hora da Reclamação' required>
            <Controller
              control={form.control}
              name='horaReclamacao'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    type='time'
                    {...field}
                    className={cn(error && 'border-red-500')}
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Detalhes da Reclamação' required>
            <Controller
              control={form.control}
              name='detalhesDareclamacao'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Textarea
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Descreva em detalhes a reclamação'
                    rows={4}
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>
        </FormRow>
      </FormSection>

      <FormSection title='Preferências de Contacto'>
        <FormRow>
          <FormField label='Método Preferido de Contacto' required>
            <Controller
              control={form.control}
              name='metodoPreferidoDoContacto'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className={cn(error && 'border-red-500')}>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='TELEFONE'>Telefone</SelectItem>
                      <SelectItem value='EMAIL'>Email</SelectItem>
                      <SelectItem value='PRESENCIAL'>Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Detalhes do Contacto' required>
            <Controller
              control={form.control}
              name='detalhesDoContacto'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Telefone, email ou endereço conforme método escolhido'
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Língua Preferida' required>
            <Controller
              control={form.control}
              name='linguaPreferida'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className={cn(error && 'border-red-500')}>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='PORTUGUES'>Português</SelectItem>
                      <SelectItem value='INGLES'>Inglês</SelectItem>
                      <SelectItem value='OUTRO'>Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          {linguaPreferida === 'OUTRO' && (
            <FormField label='Especificar Outra Língua'>
              <Controller
                control={form.control}
                name='outraLinguaPreferida'
                render={({ field, fieldState: { error } }) => (
                  <div className='space-y-1'>
                    <Input
                      {...field}
                      value={field.value || ''}
                      className={cn(error && 'border-red-500')}
                      placeholder='Especifique a língua preferida'
                    />
                    {error && (
                      <p className='text-sm text-red-500'>{error.message}</p>
                    )}
                  </div>
                )}
              />
            </FormField>
          )}
        </FormRow>
      </FormSection>

      <FormSection title='Responsável pela Recepção'>
        <FormRow>
          <FormField label='Número de Identificação do Responsável' required>
            <Controller
              control={form.control}
              name='numeroIdentificacaoResponsavelRecepcao'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Número de identificação'
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Nome do Responsável'>
            <Controller
              control={form.control}
              name='nomeResponsavelRecepcao'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    value={field.value || ''}
                    className={cn(error && 'border-red-500')}
                    placeholder='Nome do responsável'
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Função do Responsável'>
            <Controller
              control={form.control}
              name='funcaoResponsavelRecepcao'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    value={field.value || ''}
                    className={cn(error && 'border-red-500')}
                    placeholder='Função ou cargo'
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Data de Recepção'>
            <Controller
              control={form.control}
              name='dataRecepcao'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    value={field.value || ''}
                    className={cn(error && 'border-red-500')}
                    placeholder='dd/mm/aaaa'
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Assinatura do Responsável'>
            <Controller
              control={form.control}
              name='assinaturaResponsavelRecepcao'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    value={field.value || ''}
                    className={cn(error && 'border-red-500')}
                    placeholder='Assinatura digital ou nome'
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Detalhes do Responsável'>
            <Controller
              control={form.control}
              name='detalhesResponsavelRecepcao'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    className={cn(error && 'border-red-500')}
                    placeholder='Informações adicionais sobre o responsável'
                    rows={3}
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>
        </FormRow>
      </FormSection>

      <FormSection title='Acompanhamento e Encerramento'>
        <FormRow>
          <FormField label='Detalhes do Acompanhamento'>
            <Controller
              control={form.control}
              name='detalhesAcompanhamento'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    className={cn(error && 'border-red-500')}
                    placeholder='Descreva as ações de acompanhamento realizadas'
                    rows={4}
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Data de Encerramento'>
            <Controller
              control={form.control}
              name='dataEncerramento'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
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
                        onSelect={field.onChange}
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

          <FormField label='Assinatura de Encerramento'>
            <Controller
              control={form.control}
              name='assinatura'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    value={field.value || ''}
                    className={cn(error && 'border-red-500')}
                    placeholder='Assinatura de quem encerra'
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>
        </FormRow>
      </FormSection>

      <FormSection title='Confirmação de Recepção da Resposta'>
        <FormRow>
          <FormField label='Confirmar Recepção da Resposta?'>
            <Controller
              control={form.control}
              name='confirmarRecepcaoResposta'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <SelectTrigger className={cn(error && 'border-red-500')}>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='SIM'>Sim</SelectItem>
                      <SelectItem value='NAO'>Não</SelectItem>
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

        {confirmarRecepcaoResposta === 'SIM' && (
          <>
            <FormRow>
              <FormField label='Nome do Confirmante'>
                <Controller
                  control={form.control}
                  name='nomeDoConfirmante'
                  render={({ field, fieldState: { error } }) => (
                    <div className='space-y-1'>
                      <Input
                        {...field}
                        value={field.value || ''}
                        className={cn(error && 'border-red-500')}
                        placeholder='Nome de quem confirma a recepção'
                      />
                      {error && (
                        <p className='text-sm text-red-500'>{error.message}</p>
                      )}
                    </div>
                  )}
                />
              </FormField>

              <FormField label='Data de Confirmação'>
                <Controller
                  control={form.control}
                  name='dataConfirmacao'
                  render={({ field, fieldState: { error } }) => (
                    <div className='space-y-1'>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full justify-start text-left font-normal',
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
                            onSelect={field.onChange}
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

            <FormRow>
              <FormField label='Assinatura de Confirmação'>
                <Controller
                  control={form.control}
                  name='assinaturaConfirmacao'
                  render={({ field, fieldState: { error } }) => (
                    <div className='space-y-1'>
                      <Input
                        {...field}
                        value={field.value || ''}
                        className={cn(error && 'border-red-500')}
                        placeholder='Assinatura de confirmação'
                      />
                      {error && (
                        <p className='text-sm text-red-500'>{error.message}</p>
                      )}
                    </div>
                  )}
                />
              </FormField>
            </FormRow>
          </>
        )}
      </FormSection>

      <FormActions
        submitLabel='Salvar'
        onCancel={onCancel}
        isSubmitting={isLoading}
      />
    </form>
  );
}
