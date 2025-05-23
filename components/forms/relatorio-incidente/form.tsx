// components/forms/relatorio-incidente/RelatorioIncidenteForm.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { CalendarIcon, Plus, RefreshCw, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  relatorioIncidenteSchema,
  RelatorioIncidenteFormData,
} from '@/lib/validations/relatorio-incidente';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { CheckIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TimePicker } from '@/components/ui/time-picker';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { z } from 'zod';
import { uploadFileToS3 } from '@/lib/s3-service';

interface RelatorioIncidenteFormProps {
  initialData?: RelatorioIncidenteFormData;
  onSubmit: (data: RelatorioIncidenteFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Add schemas for new items
const pessoaEnvolvidaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  funcao: z.string().min(1, 'Função é obrigatória'),
});

const accaoCorrectivaSchema = z.object({
  accao: z.string().min(1, 'Ação é obrigatória'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
});

const fotografiaSchema = z.object({
  fotografia: z.string().min(1, 'Fotografia é obrigatória'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
});

export function RelatorioIncidenteForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: RelatorioIncidenteFormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const [pessoasEnvolvidas, setPessoasEnvolvidas] = useState<any[]>([]);
  const [accoesCorrectivas, setAccoesCorrectivas] = useState<any[]>([]);
  const [fotografias, setFotografias] = useState<any[]>([]);
  const [selectedPessoas, setSelectedPessoas] = useState<string[]>([]);
  const [selectedAccoes, setSelectedAccoes] = useState<string[]>([]);
  const [selectedFotografias, setSelectedFotografias] = useState<string[]>([]);
  const [commandPessoasOpen, setCommandPessoasOpen] = useState(false);
  const [commandAccoesOpen, setCommandAccoesOpen] = useState(false);
  const [commandFotografiasOpen, setCommandFotografiasOpen] = useState(false);

  // Loading states
  const [isLoadingPessoas, setIsLoadingPessoas] = useState(false);
  const [isLoadingAccoes, setIsLoadingAccoes] = useState(false);
  const [isLoadingFotografias, setIsLoadingFotografias] = useState(false);

  const defaultValues: Partial<RelatorioIncidenteFormData> = {
    tenantId: currentTenantId || '',
    projectId: currentProjectId || '',
    dataIncidente: new Date(),
    horaIncident: new Date(),
    descricaoDoIncidente: '',
    detalhesLesao: '',
    accoesImediatasTomadas: '',
    tipoFuncionario: 'CONTRATADO',
    categoriaPessoaEnvolvida: '',
    formaActividade: 'CONTROLADA',
    foiRealizadaAvaliacaoRisco: 'NAO',
    existePadraoControleRisco: 'NAO',
    efeitosIncidenteReal: 'SAUDE',
    esteFoiIncidenteSemBarreira: 'NAO',
    foiIncidenteRepetitivo: 'NAO',
    foiIncidenteResultanteFalhaProcesso: 'NAO',
    danosMateriais: 'NAO',
    pessoasEnvolvidasIds: [],
    accoesCorrectivasIds: [],
    fotografiasIds: [],
  };

  const form = useForm<RelatorioIncidenteFormData>({
    resolver: zodResolver(relatorioIncidenteSchema),
    defaultValues: initialData || defaultValues,
  });

  // Watch for danosMateriais to conditionally show valorDanos
  const danosMateriais = form.watch('danosMateriais');

  // Fetch functions
  const fetchPessoasEnvolvidas = useCallback(async () => {
    if (!currentTenantId) return;

    setIsLoadingPessoas(true);
    try {
      const response = await fetch(
        `/api/pessoas-envolvidas?tenantId=${currentTenantId}`
      );
      if (!response.ok) {
        throw new Error('Falha ao buscar pessoas envolvidas');
      }
      const data = await response.json();
      setPessoasEnvolvidas(data);
    } catch (error) {
      console.error('Error fetching pessoas envolvidas:', error);
      toast.error('Erro ao carregar pessoas envolvidas');
    } finally {
      setIsLoadingPessoas(false);
    }
  }, [currentTenantId]);

  const fetchAccoesCorrectivas = useCallback(async () => {
    if (!currentTenantId) return;

    setIsLoadingAccoes(true);
    try {
      const response = await fetch(
        `/api/accoes-correctivas?tenantId=${currentTenantId}`
      );
      if (!response.ok) {
        throw new Error('Falha ao buscar ações correctivas');
      }
      const data = await response.json();
      setAccoesCorrectivas(data);
    } catch (error) {
      console.error('Error fetching accoes correctivas:', error);
      toast.error('Erro ao carregar ações correctivas');
    } finally {
      setIsLoadingAccoes(false);
    }
  }, [currentTenantId]);

  const fetchFotografias = useCallback(async () => {
    if (!currentTenantId) return;

    setIsLoadingFotografias(true);
    try {
      const response = await fetch(
        `/api/fotografias-incidente?tenantId=${currentTenantId}`
      );
      if (!response.ok) {
        throw new Error('Falha ao buscar fotografias');
      }
      const data = await response.json();
      setFotografias(data);
    } catch (error) {
      console.error('Error fetching fotografias:', error);
      toast.error('Erro ao carregar fotografias');
    } finally {
      setIsLoadingFotografias(false);
    }
  }, [currentTenantId]);

  // Fetch all data on mount
  useEffect(() => {
    fetchPessoasEnvolvidas();
    fetchAccoesCorrectivas();
    fetchFotografias();
  }, [fetchPessoasEnvolvidas, fetchAccoesCorrectivas, fetchFotografias]);

  // Set selected items when initialData is available
  useEffect(() => {
    if (initialData) {
      if (
        initialData.pessoasEnvolvidasIds &&
        Array.isArray(initialData.pessoasEnvolvidasIds)
      ) {
        setSelectedPessoas(initialData.pessoasEnvolvidasIds);
      }
      if (
        initialData.accoesCorrectivasIds &&
        Array.isArray(initialData.accoesCorrectivasIds)
      ) {
        setSelectedAccoes(initialData.accoesCorrectivasIds);
      }
      if (
        initialData.fotografiasIds &&
        Array.isArray(initialData.fotografiasIds)
      ) {
        setSelectedFotografias(initialData.fotografiasIds);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (currentTenantId && currentProjectId) {
      form.setValue('tenantId', currentTenantId);
      form.setValue('projectId', currentProjectId);
    }
  }, [currentTenantId, currentProjectId, form]);

  const handleSubmit = async (data: RelatorioIncidenteFormData) => {
    try {
      // Add selected relationships to form data
      data.pessoasEnvolvidasIds = selectedPessoas;
      data.accoesCorrectivasIds = selectedAccoes;
      data.fotografiasIds = selectedFotografias;

      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Toggle functions for multi-select
  const togglePessoa = (id: string) => {
    if (selectedPessoas.includes(id)) {
      setSelectedPessoas(selectedPessoas.filter((p) => p !== id));
    } else {
      setSelectedPessoas([...selectedPessoas, id]);
    }
  };

  const toggleAccao = (id: string) => {
    if (selectedAccoes.includes(id)) {
      setSelectedAccoes(selectedAccoes.filter((a) => a !== id));
    } else {
      setSelectedAccoes([...selectedAccoes, id]);
    }
  };

  const toggleFotografia = (id: string) => {
    if (selectedFotografias.includes(id)) {
      setSelectedFotografias(selectedFotografias.filter((f) => f !== id));
    } else {
      setSelectedFotografias([...selectedFotografias, id]);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
      <FormSection title='Informações Básicas do Incidente'>
        <FormRow>
          <FormField label='Data do Incidente' required>
            <Controller
              control={form.control}
              name='dataIncidente'
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

          <FormField label='Hora do Incidente' required>
            <Controller
              control={form.control}
              name='horaIncident'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <TimePicker date={field.value} setDate={field.onChange} />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Descrição do Incidente' required>
            <Controller
              control={form.control}
              name='descricaoDoIncidente'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Textarea
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Descreva o incidente em detalhes'
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
          <FormField label='Detalhes da Lesão' required>
            <Controller
              control={form.control}
              name='detalhesLesao'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Textarea
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Descreva os detalhes da lesão'
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
          <FormField label='Ações Imediatas Tomadas' required>
            <Controller
              control={form.control}
              name='accoesImediatasTomadas'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Textarea
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Descreva as ações imediatas tomadas'
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

      <FormSection title='Informações do Funcionário'>
        <FormRow>
          <FormField label='Tipo de Funcionário' required>
            <Controller
              control={form.control}
              name='tipoFuncionario'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className={cn(error && 'border-red-500')}>
                      <SelectValue placeholder='Selecione o tipo de funcionário' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='CONTRATADO'>Contratado</SelectItem>
                      <SelectItem value='INCIDENTE_DE_TERCEIROS'>
                        Incidente de Terceiros
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Categoria da Pessoa Envolvida' required>
            <Controller
              control={form.control}
              name='categoriaPessoaEnvolvida'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Digite a categoria'
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

      <FormSection title='Detalhes do Incidente'>
        <FormRow>
          <FormField label='Forma de Atividade' required>
            <Controller
              control={form.control}
              name='formaActividade'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className={cn(error && 'border-red-500')}>
                      <SelectValue placeholder='Selecione a forma de atividade' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='CONTROLADA'>Controlada</SelectItem>
                      <SelectItem value='NAO_CONTROLADA'>
                        Não Controlada
                      </SelectItem>
                      <SelectItem value='MONITORADA'>Monitorada</SelectItem>
                    </SelectContent>
                  </Select>
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Foi Realizada Avaliação de Risco?' required>
            <Controller
              control={form.control}
              name='foiRealizadaAvaliacaoRisco'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className={cn(error && 'border-red-500')}>
                      <SelectValue placeholder='Selecione uma opção' />
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

        <FormRow>
          <FormField label='Existe Padrão de Controle de Risco?' required>
            <Controller
              control={form.control}
              name='existePadraoControleRisco'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className={cn(error && 'border-red-500')}>
                      <SelectValue placeholder='Selecione uma opção' />
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

          <FormField label='Efeitos do Incidente Real' required>
            <Controller
              control={form.control}
              name='efeitosIncidenteReal'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className={cn(error && 'border-red-500')}>
                      <SelectValue placeholder='Selecione os efeitos' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='SAUDE'>Saúde</SelectItem>
                      <SelectItem value='SEGURANCA'>Segurança</SelectItem>
                      <SelectItem value='AMBIENTE'>Ambiente</SelectItem>
                      <SelectItem value='COMUNIDADE'>Comunidade</SelectItem>
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

        <FormRow>
          <FormField label='Este Foi um Incidente Sem Barreira?' required>
            <Controller
              control={form.control}
              name='esteFoiIncidenteSemBarreira'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className={cn(error && 'border-red-500')}>
                      <SelectValue placeholder='Selecione uma opção' />
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

          <FormField label='Foi um Incidente Repetitivo?' required>
            <Controller
              control={form.control}
              name='foiIncidenteRepetitivo'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className={cn(error && 'border-red-500')}>
                      <SelectValue placeholder='Selecione uma opção' />
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

        <FormRow>
          <FormField
            label='Foi um Incidente Resultante de Falha no Processo?'
            required
          >
            <Controller
              control={form.control}
              name='foiIncidenteResultanteFalhaProcesso'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className={cn(error && 'border-red-500')}>
                      <SelectValue placeholder='Selecione uma opção' />
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

          <FormField label='Houve Danos Materiais?' required>
            <Controller
              control={form.control}
              name='danosMateriais'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className={cn(error && 'border-red-500')}>
                      <SelectValue placeholder='Selecione uma opção' />
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

        {danosMateriais === 'SIM' && (
          <FormRow>
            <FormField label='Valor dos Danos' required>
              <Controller
                control={form.control}
                name='valorDanos'
                render={({ field, fieldState: { error } }) => (
                  <div className='space-y-1'>
                    <Input
                      type='number'
                      step='0.01'
                      {...field}
                      value={field.value?.toString() || ''}
                      className={cn(error && 'border-red-500')}
                      placeholder='Digite o valor dos danos'
                    />
                    {error && (
                      <p className='text-sm text-red-500'>{error.message}</p>
                    )}
                  </div>
                )}
              />
            </FormField>
          </FormRow>
        )}
      </FormSection>

      <FormSection title='Pessoas Envolvidas'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label>Pessoas Envolvidas na Investigação</Label>
            <div className='flex gap-2'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className='rounded-full'
                  >
                    <PlusCircle className='h-4 w-4' />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Pessoa Envolvida</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = {
                        nome: formData.get('nome'),
                        funcao: formData.get('funcao'),
                      };

                      try {
                        const response = await fetch(
                          '/api/pessoas-envolvidas',
                          {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data),
                          }
                        );

                        if (!response.ok)
                          throw new Error('Falha ao adicionar pessoa');

                        const newPessoa = await response.json();
                        setPessoasEnvolvidas([...pessoasEnvolvidas, newPessoa]);
                        toast.success('Pessoa adicionada com sucesso');
                        e.currentTarget.reset();
                      } catch (error) {
                        toast.error('Erro ao adicionar pessoa');
                      }
                    }}
                    className='space-y-4'
                  >
                    <div className='space-y-2'>
                      <Label htmlFor='nome'>Nome</Label>
                      <Input id='nome' name='nome' required />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='funcao'>Função</Label>
                      <Input id='funcao' name='funcao' required />
                    </div>
                    <Button type='submit' className='w-full'>
                      Adicionar
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setCommandPessoasOpen(true)}
              >
                <Plus className='mr-2 h-4 w-4' />
                Selecionar Pessoa
              </Button>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {selectedPessoas.map((id) => {
              const pessoa = pessoasEnvolvidas.find((p) => p.id === id);
              return (
                <Badge
                  key={id}
                  variant='secondary'
                  className='flex items-center gap-1'
                >
                  {pessoa?.nome}
                  <button
                    type='button'
                    onClick={() => togglePessoa(id)}
                    className='ml-1 rounded-full p-1 hover:bg-gray-200'
                  >
                    ×
                  </button>
                </Badge>
              );
            })}
          </div>

          <Command
            className={cn(
              'rounded-lg border shadow-md',
              commandPessoasOpen ? 'block' : 'hidden'
            )}
          >
            <CommandInput placeholder='Buscar pessoa...' />
            <CommandList>
              <CommandEmpty>Nenhuma pessoa encontrada.</CommandEmpty>
              <CommandGroup>
                {pessoasEnvolvidas.map((pessoa) => (
                  <CommandItem
                    key={pessoa.id}
                    onSelect={() => {
                      togglePessoa(pessoa.id);
                      setCommandPessoasOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedPessoas.includes(pessoa.id)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {pessoa.nome}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </FormSection>

      <FormSection title='Ações Corretivas'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label>Ações Corretivas Permanentes</Label>
            <div className='flex gap-2'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className='rounded-full'
                  >
                    <PlusCircle className='h-4 w-4' />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Ação Corretiva</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = {
                        accao: formData.get('accao'),
                        descricao: formData.get('descricao'),
                      };

                      try {
                        const response = await fetch(
                          '/api/accoes-correctivas',
                          {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data),
                          }
                        );

                        if (!response.ok)
                          throw new Error('Falha ao adicionar ação');

                        const newAccao = await response.json();
                        setAccoesCorrectivas([...accoesCorrectivas, newAccao]);
                        toast.success('Ação adicionada com sucesso');
                        e.currentTarget.reset();
                      } catch (error) {
                        toast.error('Erro ao adicionar ação');
                      }
                    }}
                    className='space-y-4'
                  >
                    <div className='space-y-2'>
                      <Label htmlFor='accao'>Ação</Label>
                      <Input id='accao' name='accao' required />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='descricao'>Descrição</Label>
                      <Textarea id='descricao' name='descricao' required />
                    </div>
                    <Button type='submit' className='w-full'>
                      Adicionar
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setCommandAccoesOpen(true)}
              >
                <Plus className='mr-2 h-4 w-4' />
                Selecionar Ação
              </Button>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {selectedAccoes.map((id) => {
              const accao = accoesCorrectivas.find((a) => a.id === id);
              return (
                <Badge
                  key={id}
                  variant='secondary'
                  className='flex items-center gap-1'
                >
                  {accao?.accao}
                  <button
                    type='button'
                    onClick={() => toggleAccao(id)}
                    className='ml-1 rounded-full p-1 hover:bg-gray-200'
                  >
                    ×
                  </button>
                </Badge>
              );
            })}
          </div>

          <Command
            className={cn(
              'rounded-lg border shadow-md',
              commandAccoesOpen ? 'block' : 'hidden'
            )}
          >
            <CommandInput placeholder='Buscar ação...' />
            <CommandList>
              <CommandEmpty>Nenhuma ação encontrada.</CommandEmpty>
              <CommandGroup>
                {accoesCorrectivas.map((accao) => (
                  <CommandItem
                    key={accao.id}
                    onSelect={() => {
                      toggleAccao(accao.id);
                      setCommandAccoesOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedAccoes.includes(accao.id)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {accao.accao}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </FormSection>

      <FormSection title='Fotografias'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label>Fotografias do Incidente</Label>
            <div className='flex gap-2'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className='rounded-full'
                  >
                    <PlusCircle className='h-4 w-4' />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Fotografia</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const file = formData.get('fotografia') as File;
                      const descricao = formData.get('descricao') as string;

                      if (!file) {
                        toast.error('Por favor, selecione uma fotografia');
                        return;
                      }

                      try {
                        // Upload file to S3
                        const fileUrl = await uploadFileToS3(file);

                        // Create fotografia record
                        const response = await fetch(
                          '/api/fotografias-incidente',
                          {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              fotografia: fileUrl,
                              descricao,
                            }),
                          }
                        );

                        if (!response.ok)
                          throw new Error('Falha ao adicionar fotografia');

                        const newFotografia = await response.json();
                        setFotografias([...fotografias, newFotografia]);
                        toast.success('Fotografia adicionada com sucesso');
                        e.currentTarget.reset();
                      } catch (error) {
                        console.error('Error:', error);
                        toast.error('Erro ao adicionar fotografia');
                      }
                    }}
                    className='space-y-4'
                  >
                    <div className='space-y-2'>
                      <Label htmlFor='fotografia'>Fotografia</Label>
                      <Input
                        id='fotografia'
                        name='fotografia'
                        type='file'
                        accept='image/*'
                        required
                        className='cursor-pointer'
                      />
                      <p className='text-sm text-muted-foreground'>
                        Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
                      </p>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='descricao'>Descrição</Label>
                      <Textarea id='descricao' name='descricao' required />
                    </div>
                    <Button type='submit' className='w-full'>
                      Adicionar
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setCommandFotografiasOpen(true)}
              >
                <Plus className='mr-2 h-4 w-4' />
                Selecionar Fotografia
              </Button>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {selectedFotografias.map((id) => {
              const fotografia = fotografias.find((f) => f.id === id);
              return (
                <Badge
                  key={id}
                  variant='secondary'
                  className='flex items-center gap-1'
                >
                  {fotografia?.fotografia}
                  <button
                    type='button'
                    onClick={() => toggleFotografia(id)}
                    className='ml-1 rounded-full p-1 hover:bg-gray-200'
                  >
                    ×
                  </button>
                </Badge>
              );
            })}
          </div>

          <Command
            className={cn(
              'rounded-lg border shadow-md',
              commandFotografiasOpen ? 'block' : 'hidden'
            )}
          >
            <CommandInput placeholder='Buscar fotografia...' />
            <CommandList>
              <CommandEmpty>Nenhuma fotografia encontrada.</CommandEmpty>
              <CommandGroup>
                {fotografias.map((fotografia) => (
                  <CommandItem
                    key={fotografia.id}
                    onSelect={() => {
                      toggleFotografia(fotografia.id);
                      setCommandFotografiasOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedFotografias.includes(fotografia.id)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {fotografia.fotografia}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </FormSection>

      <FormActions
        submitLabel='Salvar'
        onCancel={onCancel}
        isSubmitting={isLoading}
      />
    </form>
  );
}
