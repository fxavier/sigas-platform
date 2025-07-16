// components/forms/objetivos-metas/index.tsx
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
import { CalendarIcon, Plus, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  objetivosMetasSchema,
  ObjetivosMetasFormData,
} from '@/lib/validations/objetivos-metas';
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
import { AddMembroEquipaDialog } from './AddMembroEquipaDialog';
import { AddTabelaAcaoDialog } from './AddTabelaAcaoDialog';
import { toast } from 'sonner';

interface ObjetivosMetasFormProps {
  initialData?: ObjetivosMetasFormData;
  onSubmit: (data: ObjetivosMetasFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ObjetivosMetasForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ObjetivosMetasFormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const [membrosEquipa, setMembrosEquipa] = useState<any[]>([]);
  const [tabelaAccoes, setTabelaAccoes] = useState<any[]>([]);
  const [selectedMembros, setSelectedMembros] = useState<string[]>([]);
  const [selectedAccoes, setSelectedAccoes] = useState<string[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandAcoesOpen, setCommandAcoesOpen] = useState(false);

  // Add dialog states
  const [isAddMembroOpen, setIsAddMembroOpen] = useState(false);
  const [isAddAcaoOpen, setIsAddAcaoOpen] = useState(false);
  const [isLoadingMembros, setIsLoadingMembros] = useState(false);
  const [isLoadingAcoes, setIsLoadingAcoes] = useState(false);

  const defaultValues: Partial<ObjetivosMetasFormData> = {
    tenantId: currentTenantId || '',
    projectId: currentProjectId || '',
    numeroRefOAndM: '',
    aspetoRefNumero: '',
    centroCustos: '',
    objectivo: '',
    publicoAlvo: '',
    orcamentoRecursos: '',
    refDocumentoComprovativo: '',
    dataInicio: new Date(),
    dataConclusaoPrevista: new Date(),
    dataConclusaoReal: new Date(),
    pgasAprovadoPor: '',
    dataAprovacao: new Date(),
    observacoes: '',
    oAndMAlcancadoFechado: 'NAO',
    assinaturaDirectorGeral: '',
    data: new Date(),
    membrosDaEquipaIds: [],
    tabelasAcoesIds: [],
  };

  const form = useForm<ObjetivosMetasFormData>({
    resolver: zodResolver(objetivosMetasSchema),
    defaultValues: initialData || defaultValues,
  });

  // Fetch team members function
  const fetchMembrosEquipa = useCallback(async () => {
    if (!currentTenantId) return;

    setIsLoadingMembros(true);
    try {
      const response = await fetch(
        `/api/membros-equipa?tenantId=${currentTenantId}`
      );
      if (!response.ok) {
        throw new Error('Falha ao buscar membros da equipa');
      }
      const data = await response.json();
      setMembrosEquipa(data);
    } catch (error) {
      console.error('Erro ao carregar membros da equipa:', error);
      toast.error('Erro ao carregar membros da equipa');
    } finally {
      setIsLoadingMembros(false);
    }
  }, [currentTenantId]);

  // Fetch action items function
  const fetchTabelaAccoes = useCallback(async () => {
    if (!currentTenantId) return;

    setIsLoadingAcoes(true);
    try {
      const response = await fetch(
        `/api/tabela-accoes?tenantId=${currentTenantId}`
      );
      if (!response.ok) {
        throw new Error('Falha ao buscar tabela de ações');
      }
      const data = await response.json();
      setTabelaAccoes(data);
    } catch (error) {
      console.error('Erro ao carregar tabela de ações:', error);
      toast.error('Erro ao carregar tabela de ações');
    } finally {
      setIsLoadingAcoes(false);
    }
  }, [currentTenantId]);

  // Fetch team members and actions table data
  useEffect(() => {
    fetchMembrosEquipa();
    fetchTabelaAccoes();
  }, [fetchMembrosEquipa, fetchTabelaAccoes]);

  // Set selected members and actions when initialData is available
  useEffect(() => {
    if (initialData) {
      // Set the selected member IDs
      if (
        initialData.membrosDaEquipaIds &&
        Array.isArray(initialData.membrosDaEquipaIds)
      ) {
        setSelectedMembros(initialData.membrosDaEquipaIds);
      }

      // Set the selected action IDs
      if (
        initialData.tabelasAcoesIds &&
        Array.isArray(initialData.tabelasAcoesIds)
      ) {
        setSelectedAccoes(initialData.tabelasAcoesIds);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (currentTenantId && currentProjectId) {
      form.setValue('tenantId', currentTenantId);
      form.setValue('projectId', currentProjectId);
    }
  }, [currentTenantId, currentProjectId, form]);

  const handleSubmit = async (data: ObjetivosMetasFormData) => {
    try {
      // Add selected members and actions to form data
      data.membrosDaEquipaIds = selectedMembros;
      data.tabelasAcoesIds = selectedAccoes;

      await onSubmit(data);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  // Toggle member selection
  const toggleMembro = (id: string) => {
    if (selectedMembros.includes(id)) {
      setSelectedMembros(selectedMembros.filter((m) => m !== id));
    } else {
      setSelectedMembros([...selectedMembros, id]);
    }
  };

  // Toggle action selection
  const toggleAcao = (id: string) => {
    if (selectedAccoes.includes(id)) {
      setSelectedAccoes(selectedAccoes.filter((a) => a !== id));
    } else {
      setSelectedAccoes([...selectedAccoes, id]);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
      <FormSection title='Informações Gerais'>
        <FormRow>
          <FormField label='Número de Referência' required>
            <Controller
              control={form.control}
              name='numeroRefOAndM'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    placeholder='Ex: O&M-2025-001'
                    className={cn(error && 'border-red-500')}
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Aspeto/Ref. Número' required>
            <Controller
              control={form.control}
              name='aspetoRefNumero'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    placeholder='Ex: A-2025-001'
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
          <FormField label='Centro de Custos' required>
            <Controller
              control={form.control}
              name='centroCustos'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    placeholder='Ex: CC-001'
                    className={cn(error && 'border-red-500')}
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Data de Início' required>
            <Controller
              control={form.control}
              name='dataInicio'
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

      <FormSection title='Objetivos e Metas'>
        <FormField label='Objetivo' required>
          <Controller
            control={form.control}
            name='objectivo'
            render={({ field, fieldState: { error } }) => (
              <div className='space-y-1'>
                <Textarea
                  {...field}
                  placeholder='Descreva o objetivo ambiental ou social'
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
          <FormField label='Público Alvo' required>
            <Controller
              control={form.control}
              name='publicoAlvo'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    placeholder='Ex: Funcionários, Comunidade'
                    className={cn(error && 'border-red-500')}
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Orçamento/Recursos' required>
            <Controller
              control={form.control}
              name='orcamentoRecursos'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    placeholder='Ex: 10.000 MZN'
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
          <FormField label='Data Conclusão Prevista' required>
            <Controller
              control={form.control}
              name='dataConclusaoPrevista'
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

          <FormField label='Data Conclusão Real' required>
            <Controller
              control={form.control}
              name='dataConclusaoReal'
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

        <FormField label='Referência do Documento Comprovativo'>
          <Controller
            control={form.control}
            name='refDocumentoComprovativo'
            render={({ field, fieldState: { error } }) => (
              <div className='space-y-1'>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder='Ex: DOC-2025-001'
                  className={cn(error && 'border-red-500')}
                />
                {error && (
                  <p className='text-sm text-red-500'>{error.message}</p>
                )}
              </div>
            )}
          />
        </FormField>
      </FormSection>

      <FormSection title='Membros da Equipa'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label>Selecione os Membros da Equipa</Label>
            <div className='flex items-center space-x-2'>
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={fetchMembrosEquipa}
                disabled={isLoadingMembros}
                title='Atualizar lista'
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isLoadingMembros ? 'animate-spin' : ''
                  }`}
                />
              </Button>
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={() => setIsAddMembroOpen(true)}
                title='Adicionar novo membro'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <Popover open={commandOpen} onOpenChange={setCommandOpen}>
            <PopoverTrigger asChild>
              <Button
                type='button'
                variant='outline'
                role='combobox'
                aria-expanded={commandOpen}
                className='w-full justify-between'
              >
                {selectedMembros.length > 0
                  ? `${selectedMembros.length} membros selecionados`
                  : 'Selecione os membros da equipa'}
                {isLoadingMembros && (
                  <RefreshCw className='ml-2 h-4 w-4 animate-spin' />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0' align='start'>
              <Command>
                <CommandInput placeholder='Buscar membros...' />
                <CommandList>
                  <CommandEmpty>
                    {membrosEquipa.length === 0 ? (
                      <div className='text-center p-4'>
                        <p className='text-sm text-muted-foreground mb-2'>
                          Nenhum membro cadastrado
                        </p>
                        <Button
                          type='button'
                          size='sm'
                          onClick={() => {
                            setCommandOpen(false);
                            setIsAddMembroOpen(true);
                          }}
                        >
                          <Plus className='h-4 w-4 mr-2' />
                          Adicionar membro
                        </Button>
                      </div>
                    ) : (
                      'Nenhum membro encontrado'
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {membrosEquipa.map((membro) => {
                      const isSelected = selectedMembros.includes(membro.id);
                      return (
                        <div
                          key={membro.id}
                          className={cn(
                            'flex items-center px-2 py-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground',
                            isSelected ? 'bg-accent' : 'bg-transparent'
                          )}
                          onClick={() => {
                            toggleMembro(membro.id);
                            // Don't close dropdown when selecting
                            // setCommandOpen(false);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              'mr-2 h-4 w-4',
                              isSelected ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          <div className='flex-grow'>
                            <span>{membro.nome}</span>
                            {membro.cargo && (
                              <span className='ml-2 text-muted-foreground'>
                                ({membro.cargo})
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedMembros.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-2'>
              {selectedMembros.map((id) => {
                const membro = membrosEquipa.find((m) => m.id === id);
                return (
                  <Badge key={id} variant='secondary' className='py-1'>
                    {membro?.nome || id}
                    <button
                      type='button'
                      className='ml-1 hover:text-destructive'
                      onClick={() => toggleMembro(id)}
                    >
                      ×
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title='Tabela de Ações'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label>Selecione as Ações</Label>
            <div className='flex items-center space-x-2'>
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={fetchTabelaAccoes}
                disabled={isLoadingAcoes}
                title='Atualizar lista'
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoadingAcoes ? 'animate-spin' : ''}`}
                />
              </Button>
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={() => setIsAddAcaoOpen(true)}
                title='Adicionar nova ação'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <Popover open={commandAcoesOpen} onOpenChange={setCommandAcoesOpen}>
            <PopoverTrigger asChild>
              <Button
                type='button'
                variant='outline'
                role='combobox'
                aria-expanded={commandAcoesOpen}
                className='w-full justify-between'
              >
                {selectedAccoes.length > 0
                  ? `${selectedAccoes.length} ações selecionadas`
                  : 'Selecione as ações'}
                {isLoadingAcoes && (
                  <RefreshCw className='ml-2 h-4 w-4 animate-spin' />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0' align='start'>
              <Command>
                <CommandInput placeholder='Buscar ações...' />
                <CommandList>
                  <CommandEmpty>
                    {tabelaAccoes.length === 0 ? (
                      <div className='text-center p-4'>
                        <p className='text-sm text-muted-foreground mb-2'>
                          Nenhuma ação cadastrada
                        </p>
                        <Button
                          type='button'
                          size='sm'
                          onClick={() => {
                            setCommandAcoesOpen(false);
                            setIsAddAcaoOpen(true);
                          }}
                        >
                          <Plus className='h-4 w-4 mr-2' />
                          Adicionar ação
                        </Button>
                      </div>
                    ) : (
                      'Nenhuma ação encontrada'
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {tabelaAccoes.map((acao) => {
                      const isSelected = selectedAccoes.includes(acao.id);
                      return (
                        <div
                          key={acao.id}
                          className={cn(
                            'flex items-center px-2 py-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground',
                            isSelected ? 'bg-accent' : 'bg-transparent'
                          )}
                          onClick={() => {
                            toggleAcao(acao.id);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              'mr-2 h-4 w-4',
                              isSelected ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          <div className='flex-grow'>
                            <span>{acao.accao}</span>
                            {acao.pessoaResponsavel && (
                              <span className='ml-2 text-muted-foreground'>
                                (Resp: {acao.pessoaResponsavel})
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedAccoes.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-2'>
              {selectedAccoes.map((id) => {
                const acao = tabelaAccoes.find((a) => a.id === id);
                return (
                  <Badge key={id} variant='secondary' className='py-1'>
                    {acao?.accao || id}
                    <button
                      type='button'
                      className='ml-1 hover:text-destructive'
                      onClick={() => toggleAcao(id)}
                    >
                      ×
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title='Aprovação e Status'>
        <FormRow>
          <FormField label='PGAS Aprovado Por' required>
            <Controller
              control={form.control}
              name='pgasAprovadoPor'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    placeholder='Nome do aprovador'
                    className={cn(error && 'border-red-500')}
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Data de Aprovação' required>
            <Controller
              control={form.control}
              name='dataAprovacao'
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

        <FormRow>
          <FormField label='O&M Alcançado/Fechado' required>
            <Controller
              control={form.control}
              name='oAndMAlcancadoFechado'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select value={field.value} onValueChange={field.onChange}>
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

          <FormField label='Data' required>
            <Controller
              control={form.control}
              name='data'
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

        <FormField label='Observações' required>
          <Controller
            control={form.control}
            name='observacoes'
            render={({ field, fieldState: { error } }) => (
              <div className='space-y-1'>
                <Textarea
                  {...field}
                  placeholder='Observações relevantes'
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

        <FormField label='Assinatura do Diretor Geral' required>
          <Controller
            control={form.control}
            name='assinaturaDirectorGeral'
            render={({ field, fieldState: { error } }) => (
              <div className='space-y-1'>
                <Input
                  {...field}
                  placeholder='Nome do Diretor Geral'
                  className={cn(error && 'border-red-500')}
                />
                {error && (
                  <p className='text-sm text-red-500'>{error.message}</p>
                )}
              </div>
            )}
          />
        </FormField>
      </FormSection>

      <FormActions
        onCancel={onCancel}
        isSubmitting={isLoading}
        submitLabel={initialData ? 'Atualizar' : 'Salvar'}
      />

      {/* Add Dialog Components */}
      <AddMembroEquipaDialog
        open={isAddMembroOpen}
        onOpenChange={setIsAddMembroOpen}
        onSuccess={fetchMembrosEquipa}
      />

      <AddTabelaAcaoDialog
        open={isAddAcaoOpen}
        onOpenChange={setIsAddAcaoOpen}
        onSuccess={fetchTabelaAccoes}
      />
    </form>
  );
}
