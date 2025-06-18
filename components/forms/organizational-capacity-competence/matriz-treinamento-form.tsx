'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  matrizTreinamentoSchema,
  MatrizTreinamentoFormData,
} from '@/lib/validations/organizational-capacity-competence';
import {
  useMatrizTreinamento,
  MatrizTreinamentoResponse,
} from '@/hooks/use-matriz-treinamento';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { AddFuncaoDialog } from './AddFuncaoDialog';
import { AddAreaTreinamentoDialog } from './AddAreaTreinamentoDialog';
import { AddCaixaFerramentasDialog } from './AddCaixaFerramentasDialog';

interface MatrizTreinamentoFormProps {
  initialData?: MatrizTreinamentoResponse;
  onSubmit?: (data: MatrizTreinamentoFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function MatrizTreinamentoForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading: externalLoading = false,
}: MatrizTreinamentoFormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const { fetchAreasTreinamento, fetchCaixaFerramentas, fetchFuncoes } =
    useMatrizTreinamento();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [areasTreinamento, setAreasTreinamento] = useState<any[]>([]);
  const [caixaFerramentas, setCaixaFerramentas] = useState<any[]>([]);
  const [funcoes, setFuncoes] = useState<any[]>([]);

  // Modal states
  const [isFuncaoModalOpen, setIsFuncaoModalOpen] = useState(false);
  const [isAreaTreinamentoModalOpen, setIsAreaTreinamentoModalOpen] =
    useState(false);
  const [isCaixaFerramentasModalOpen, setIsCaixaFerramentasModalOpen] =
    useState(false);

  const form = useForm<MatrizTreinamentoFormData>({
    resolver: zodResolver(matrizTreinamentoSchema),
    defaultValues: {
      tenantId: currentTenantId || '',
      projectId: currentProjectId || '',
      data: initialData?.data || null,
      funcaoId: initialData?.funcaoId || '',
      areaTreinamentoId: initialData?.areaTreinamentoId || '',
      caixaFerramentasId: initialData?.caixaFerramentasId || '',
      totais_palestras: initialData?.totais_palestras || 0,
      total_horas: initialData?.total_horas || 0,
      total_caixa_ferramentas: initialData?.total_caixa_ferramentas || 0,
      total_pessoas_informadas_caixa_ferramentas:
        initialData?.total_pessoas_informadas_caixa_ferramentas || 0,
      eficacia: initialData?.eficacia || 'Eficaz',
      accoes_treinamento_nao_eficaz:
        initialData?.accoes_treinamento_nao_eficaz || '',
      aprovado_por: initialData?.aprovado_por || '',
    },
  });

  // Watch the eficacia field to conditionally show/hide the actions field
  const eficaciaValue = useWatch({
    control: form.control,
    name: 'eficacia',
  });

  // Clear the actions field when eficacia changes to "Eficaz"
  useEffect(() => {
    if (eficaciaValue === 'Eficaz') {
      form.setValue('accoes_treinamento_nao_eficaz', '');
    }
  }, [eficaciaValue, form]);

  // Load related data
  const loadRelatedData = useCallback(async () => {
    try {
      const [areas, caixas, funcoesData] = await Promise.all([
        fetchAreasTreinamento(),
        fetchCaixaFerramentas(),
        fetchFuncoes(),
      ]);

      setAreasTreinamento(areas);
      setCaixaFerramentas(caixas);
      setFuncoes(funcoesData);
    } catch (error) {
      console.error('Error loading related data:', error);
      toast.error('Erro ao carregar dados relacionados');
    }
  }, [fetchAreasTreinamento, fetchCaixaFerramentas, fetchFuncoes]);

  useEffect(() => {
    if (currentTenantId) {
      loadRelatedData();
    }
  }, [currentTenantId, loadRelatedData]);

  const onSubmitForm = async (data: MatrizTreinamentoFormData) => {
    if (!currentTenantId || !currentProjectId) {
      toast.error('Tenant e Projeto são obrigatórios');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = {
        ...data,
        tenantId: currentTenantId,
        projectId: currentProjectId,
      };

      await onSubmit?.(formData);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Erro ao salvar matriz de treinamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Data */}
          <FormField
            control={form.control}
            name='data'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'dd/MM/yyyy')
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Função */}
          <FormField
            control={form.control}
            name='funcaoId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Função</FormLabel>
                <div className='flex items-center gap-2'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleciona a opção' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {funcoes.map((funcao) => (
                        <SelectItem key={funcao.id} value={funcao.id}>
                          {funcao.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className='rounded-full flex-shrink-0'
                    onClick={() => setIsFuncaoModalOpen(true)}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Área de Treinamento */}
          <FormField
            control={form.control}
            name='areaTreinamentoId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área de Treinamento</FormLabel>
                <div className='flex items-center gap-2'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleciona a opção' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {areasTreinamento.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className='rounded-full flex-shrink-0'
                    onClick={() => setIsAreaTreinamentoModalOpen(true)}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Caixa de Ferramentas */}
          <FormField
            control={form.control}
            name='caixaFerramentasId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caixa de Ferramentas</FormLabel>
                <div className='flex items-center gap-2'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleciona a opção' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {caixaFerramentas.map((caixa) => (
                        <SelectItem key={caixa.id} value={caixa.id}>
                          {caixa.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className='rounded-full flex-shrink-0'
                    onClick={() => setIsCaixaFerramentasModalOpen(true)}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Total de Palestras */}
          <FormField
            control={form.control}
            name='totais_palestras'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total de Palestras</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min='0'
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Total de Horas */}
          <FormField
            control={form.control}
            name='total_horas'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total de Horas</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min='0'
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Total Caixa de Ferramentas */}
          <FormField
            control={form.control}
            name='total_caixa_ferramentas'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Caixa de Ferramentas</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min='0'
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Total Pessoas Informadas */}
          <FormField
            control={form.control}
            name='total_pessoas_informadas_caixa_ferramentas'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Total Pessoas Informadas (Caixa de Ferramentas)
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min='0'
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Eficácia */}
          <FormField
            control={form.control}
            name='eficacia'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Eficácia</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Eficaz'>Eficaz</SelectItem>
                    <SelectItem value='Nao_Eficaz'>Não Eficaz</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Aprovado Por */}
          <FormField
            control={form.control}
            name='aprovado_por'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aprovado Por</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Ações de Treinamento Não Eficaz - Only show when eficacia is "Nao_Eficaz" */}
        {eficaciaValue === 'Nao_Eficaz' && (
          <FormField
            control={form.control}
            name='accoes_treinamento_nao_eficaz'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Ações de Treinamento Não Eficaz{' '}
                  <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva as ações para treinamento não eficaz...'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Form Actions */}
        <div className='flex justify-end space-x-4'>
          {onCancel && (
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type='submit' disabled={isSubmitting || externalLoading}>
            {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>

      {/* Modal Dialogs */}
      <AddFuncaoDialog
        open={isFuncaoModalOpen}
        onOpenChange={setIsFuncaoModalOpen}
        onSuccess={loadRelatedData}
      />

      <AddAreaTreinamentoDialog
        open={isAreaTreinamentoModalOpen}
        onOpenChange={setIsAreaTreinamentoModalOpen}
        onSuccess={loadRelatedData}
      />

      <AddCaixaFerramentasDialog
        open={isCaixaFerramentasModalOpen}
        onOpenChange={setIsCaixaFerramentasModalOpen}
        onSuccess={loadRelatedData}
      />
    </Form>
  );
}
