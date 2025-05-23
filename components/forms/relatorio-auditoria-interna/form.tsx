// components/forms/relatorio-auditoria-interna/RelatorioAuditoriaInternaForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { FormField } from '@/components/forms/form-field';
import { FormRow } from '@/components/forms/form-row';
import { FormSection } from '@/components/forms/form-section';
import { FormActions } from '@/components/forms/form-actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  relatorioAuditoriaInternaSchema,
  RelatorioAuditoriaInternaFormData,
} from '@/lib/validations/relatorio-auditoria-interna';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RelatorioAuditoriaInternaFormProps {
  initialData?: RelatorioAuditoriaInternaFormData;
  onSubmit: (data: RelatorioAuditoriaInternaFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function RelatorioAuditoriaInternaForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: RelatorioAuditoriaInternaFormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  const defaultValues: Partial<RelatorioAuditoriaInternaFormData> = {
    tenantId: currentTenantId || '',
    projectId: currentProjectId || '',
    ambitoAuditoria: '',
    dataAuditoria: new Date(),
    dataRelatorio: new Date(),
    auditorLider: '',
    auditorObservador: '',
    resumoAuditoria: '',
    descricaoNaoConformidades: [],
  };

  const form = useForm<RelatorioAuditoriaInternaFormData>({
    resolver: zodResolver(relatorioAuditoriaInternaSchema),
    defaultValues: initialData || defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'descricaoNaoConformidades',
  });

  useEffect(() => {
    if (currentTenantId && currentProjectId) {
      form.setValue('tenantId', currentTenantId);
      form.setValue('projectId', currentProjectId);
    }
  }, [currentTenantId, currentProjectId, form]);

  const handleSubmit = async (data: RelatorioAuditoriaInternaFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const addNaoConformidade = () => {
    append({
      processo: '',
      clausula: '',
      naoConformidade: '',
    });
  };

  const removeNaoConformidade = (index: number) => {
    remove(index);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
      <FormSection title='Informações Gerais da Auditoria'>
        <FormField label='Âmbito da Auditoria' required>
          <Controller
            control={form.control}
            name='ambitoAuditoria'
            render={({ field, fieldState: { error } }) => (
              <div className='space-y-1'>
                <Textarea
                  {...field}
                  placeholder='Descreva o âmbito e escopo da auditoria interna'
                  className={cn(
                    'resize-none min-h-[100px]',
                    error && 'border-red-500'
                  )}
                />
                {error && (
                  <p className='text-sm text-red-500'>{error.message}</p>
                )}
              </div>
            )}
          />
        </FormField>

        <FormRow>
          <FormField label='Data da Auditoria' required>
            <Controller
              control={form.control}
              name='dataAuditoria'
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

          <FormField label='Data do Relatório' required>
            <Controller
              control={form.control}
              name='dataRelatorio'
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

      <FormSection title='Equipa de Auditoria'>
        <FormRow>
          <FormField label='Auditor Líder' required>
            <Controller
              control={form.control}
              name='auditorLider'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    placeholder='Nome do auditor líder'
                    className={cn(error && 'border-red-500')}
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Auditor Observador' required>
            <Controller
              control={form.control}
              name='auditorObservador'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    placeholder='Nome do auditor observador'
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
      </FormSection>

      <FormSection title='Resumo da Auditoria'>
        <FormField label='Resumo da Auditoria' required>
          <Controller
            control={form.control}
            name='resumoAuditoria'
            render={({ field, fieldState: { error } }) => (
              <div className='space-y-1'>
                <Textarea
                  {...field}
                  placeholder='Descreva um resumo detalhado dos resultados da auditoria'
                  className={cn(
                    'resize-none min-h-[150px]',
                    error && 'border-red-500'
                  )}
                />
                {error && (
                  <p className='text-sm text-red-500'>{error.message}</p>
                )}
              </div>
            )}
          />
        </FormField>
      </FormSection>

      <FormSection title='Não Conformidades Identificadas'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label>Descrição das Não Conformidades</Label>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={addNaoConformidade}
              className='gap-2'
            >
              <Plus className='h-4 w-4' />
              Adicionar Não Conformidade
            </Button>
          </div>

          {fields.length === 0 && (
            <div className='text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg'>
              <p className='text-gray-500 mb-4'>
                Nenhuma não conformidade adicionada ainda
              </p>
              <Button
                type='button'
                variant='outline'
                onClick={addNaoConformidade}
                className='gap-2'
              >
                <Plus className='h-4 w-4' />
                Adicionar primeira não conformidade
              </Button>
            </div>
          )}

          {fields.map((field, index) => (
            <Card key={field.id} className='relative'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>
                    Não Conformidade {index + 1}
                  </CardTitle>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => removeNaoConformidade(index)}
                    className='h-8 w-8 text-destructive hover:text-destructive'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormRow>
                  <FormField label='Processo' required>
                    <Controller
                      control={form.control}
                      name={`descricaoNaoConformidades.${index}.processo`}
                      render={({ field, fieldState: { error } }) => (
                        <div className='space-y-1'>
                          <Input
                            {...field}
                            placeholder='Nome do processo auditado'
                            className={cn(error && 'border-red-500')}
                          />
                          {error && (
                            <p className='text-sm text-red-500'>
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </FormField>

                  <FormField label='Cláusula' required>
                    <Controller
                      control={form.control}
                      name={`descricaoNaoConformidades.${index}.clausula`}
                      render={({ field, fieldState: { error } }) => (
                        <div className='space-y-1'>
                          <Input
                            {...field}
                            placeholder='Ex: 4.1, 7.2, 9.1'
                            className={cn(error && 'border-red-500')}
                          />
                          {error && (
                            <p className='text-sm text-red-500'>
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </FormField>
                </FormRow>

                <FormField label='Descrição da Não Conformidade' required>
                  <Controller
                    control={form.control}
                    name={`descricaoNaoConformidades.${index}.naoConformidade`}
                    render={({ field, fieldState: { error } }) => (
                      <div className='space-y-1'>
                        <Textarea
                          {...field}
                          placeholder='Descreva detalhadamente a não conformidade identificada'
                          className={cn(
                            'resize-none min-h-[100px]',
                            error && 'border-red-500'
                          )}
                        />
                        {error && (
                          <p className='text-sm text-red-500'>
                            {error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </FormField>
              </CardContent>
            </Card>
          ))}
        </div>
      </FormSection>

      <FormActions
        onCancel={onCancel}
        isSubmitting={isLoading}
        submitLabel={initialData ? 'Atualizar' : 'Salvar'}
      />
    </form>
  );
}
