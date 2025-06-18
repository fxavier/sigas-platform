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
  relatorioInicialIncidenteSchema,
  RelatorioInicialIncidenteFormData,
} from '@/lib/validations/relatorio-inicial-incidente';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { CheckIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TimePicker } from '@/components/ui/time-picker';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IncidenteForm } from '@/components/forms/incidentes';
import { IncidenteFormData } from '@/lib/validations/incidentes';

interface RelatorioInicialIncidenteFormProps {
  initialData?: RelatorioInicialIncidenteFormData;
  onSubmit: (data: RelatorioInicialIncidenteFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function RelatorioInicialIncidenteForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: RelatorioInicialIncidenteFormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const [incidentes, setIncidentes] = useState<any[]>([]);
  const [selectedIncidentes, setSelectedIncidentes] = useState<string[]>([]);
  const [commandIncidentesOpen, setCommandIncidentesOpen] = useState(false);
  const [isLoadingIncidentes, setIsLoadingIncidentes] = useState(false);
  const [isIncidenteModalOpen, setIsIncidenteModalOpen] = useState(false);
  const [isCreatingIncidente, setIsCreatingIncidente] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter incidentes based on search term
  const filteredIncidentes = incidentes.filter((incidente) =>
    incidente.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const defaultValues: Partial<RelatorioInicialIncidenteFormData> = {
    tenantId: currentTenantId || '',
    projectId: currentProjectId || '',
    dataIncidente: new Date(),
    horaIncidente: new Date(),
    dataComunicacao: new Date(),
    dataCriacao: new Date(),
    data: new Date(),
    localIncidente: '',
    supervisor: '',
    tipoIncidente: 'INCIDENTE_AMBIENTAL',
    descricaoCircunstanciaIncidente: '',
    infoSobreFeriodosETratamentoFeito: '',
    recomendacoes: '',
    necessitaDeInvestigacaoAprofundada: 'NAO',
    incidenteReportavel: 'NAO',
    credoresObrigadosASeremNotificados: 'NAO',
    nomeProvedor: '',
    incidentesIds: [],
  };

  const form = useForm<RelatorioInicialIncidenteFormData>({
    resolver: zodResolver(relatorioInicialIncidenteSchema),
    defaultValues: initialData || defaultValues,
  });

  // Watch for empregado to conditionally show nomeFuncionario
  const empregado = form.watch('empregado');
  const subcontratante = form.watch('subcontratante');

  // Fetch incidentes
  const fetchIncidentes = useCallback(async () => {
    if (!currentTenantId) return;

    setIsLoadingIncidentes(true);
    try {
      const response = await fetch(
        `/api/incidentes?tenantId=${currentTenantId}`
      );
      if (!response.ok) {
        throw new Error('Falha ao buscar incidentes');
      }
      const data = await response.json();
      setIncidentes(data);
    } catch (error) {
      console.error('Error fetching incidentes:', error);
      toast.error('Erro ao carregar incidentes');
    } finally {
      setIsLoadingIncidentes(false);
    }
  }, [currentTenantId]);

  // Fetch data on mount
  useEffect(() => {
    fetchIncidentes();
  }, [fetchIncidentes]);

  // Set initial selected incidentes from form data
  useEffect(() => {
    if (initialData?.incidentesIds) {
      setSelectedIncidentes(initialData.incidentesIds);
    }
  }, [initialData]);

  // Update form when selected incidentes change
  useEffect(() => {
    form.setValue('incidentesIds', selectedIncidentes);
  }, [selectedIncidentes, form]);

  const handleSubmit = async (data: RelatorioInicialIncidenteFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        incidentesIds: selectedIncidentes,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleIncidente = (id: string) => {
    setSelectedIncidentes((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      return newSelection;
    });
  };

  const handleCreateIncidente = async (data: IncidenteFormData) => {
    setIsCreatingIncidente(true);
    try {
      const response = await fetch('/api/incidentes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar incidente');
      }

      const newIncidente = await response.json();

      // Add the new incidente to the list
      setIncidentes((prev) => [newIncidente, ...prev]);

      // Automatically select the new incidente
      setSelectedIncidentes((prev) => [...prev, newIncidente.id]);

      // Close the modal
      setIsIncidenteModalOpen(false);

      toast.success('Incidente criado com sucesso');
    } catch (error) {
      console.error('Error creating incidente:', error);
      toast.error('Erro ao criar incidente');
    } finally {
      setIsCreatingIncidente(false);
    }
  };

  // Tipo de incidente options
  const tipoIncidenteOptions = [
    { value: 'FATALIDADE', label: 'Fatalidade' },
    { value: 'OCORRENCIA_PERIGOSA', label: 'Ocorrência Perigosa' },
    { value: 'INCIDENTE_QUASE_ACIDENTE', label: 'Incidente/Quase Acidente' },
    { value: 'TEMPO_PERDIDO', label: 'Tempo Perdido' },
    { value: 'INCIDENTE_AMBIENTAL', label: 'Incidente Ambiental' },
    { value: 'SEGURANCA', label: 'Segurança' },
    { value: 'RECLAMACAO_EXTERNA', label: 'Reclamação Externa' },
    {
      value: 'NOTIFICACAO_DO_REGULADOR_VIOLACAO',
      label: 'Notificação do Regulador/Violação',
    },
    {
      value: 'DERAMAMENTO_LBERACAO_DESCONTROLADA',
      label: 'Derramamento/Liberação Descontrolada',
    },
    { value: 'DANOS_PERDAS', label: 'Danos/Perdas' },
    { value: 'FLORA_FAUNA', label: 'Flora/Fauna' },
    {
      value: 'AUDITORIA_NAO_CONFORMIDADE',
      label: 'Auditoria/Não Conformidade',
    },
  ];

  const simNaoOptions = [
    { value: 'SIM', label: 'Sim' },
    { value: 'NAO', label: 'Não' },
  ];

  return (
    <div className='relative'>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
        <FormSection title='Informações Básicas do Incidente'>
          <FormRow>
            <FormField label='Data do Incidente' required>
              <Controller
                control={form.control}
                name='dataIncidente'
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </FormField>

            <FormField label='Hora do Incidente' required>
              <Controller
                control={form.control}
                name='horaIncidente'
                render={({ field }) => (
                  <TimePicker date={field.value} setDate={field.onChange} />
                )}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label='Seção'>
              <Controller
                control={form.control}
                name='seccao'
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ''}
                    placeholder='Digite a seção'
                  />
                )}
              />
            </FormField>

            <FormField label='Local do Incidente' required>
              <Controller
                control={form.control}
                name='localIncidente'
                render={({ field }) => (
                  <Input {...field} placeholder='Digite o local do incidente' />
                )}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label='Data de Comunicação' required>
              <Controller
                control={form.control}
                name='dataComunicacao'
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </FormField>

            <FormField label='Supervisor' required>
              <Controller
                control={form.control}
                name='supervisor'
                render={({ field }) => (
                  <Input {...field} placeholder='Digite o nome do supervisor' />
                )}
              />
            </FormField>
          </FormRow>

          <FormField label='Tipo de Incidente' required>
            <Controller
              control={form.control}
              name='tipoIncidente'
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleciona a opção' />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoIncidenteOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </FormSection>

        <FormSection title='Informações sobre Pessoas Envolvidas'>
          <FormRow>
            <FormField label='Empregado'>
              <Controller
                control={form.control}
                name='empregado'
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      {simNaoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            {empregado === 'SIM' && (
              <FormField label='Nome do Funcionário'>
                <Controller
                  control={form.control}
                  name='nomeFuncionario'
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder='Digite o nome do funcionário'
                    />
                  )}
                />
              </FormField>
            )}
          </FormRow>

          <FormRow>
            <FormField label='Subcontratante'>
              <Controller
                control={form.control}
                name='subcontratante'
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      {simNaoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            {subcontratante === 'SIM' && (
              <FormField label='Nome do Subcontratado'>
                <Controller
                  control={form.control}
                  name='nomeSubcontratado'
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder='Digite o nome do subcontratado'
                    />
                  )}
                />
              </FormField>
            )}
          </FormRow>
        </FormSection>

        <FormSection title='Descrição do Incidente'>
          <FormField label='Descrição da Circunstância do Incidente' required>
            <Controller
              control={form.control}
              name='descricaoCircunstanciaIncidente'
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder='Descreva detalhadamente as circunstâncias do incidente'
                  rows={4}
                />
              )}
            />
          </FormField>

          <FormField
            label='Informação sobre Feridos e Tratamento Feito'
            required
          >
            <Controller
              control={form.control}
              name='infoSobreFeriodosETratamentoFeito'
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder='Descreva informações sobre feridos e tratamento realizado'
                  rows={4}
                />
              )}
            />
          </FormField>

          <FormField label='Declaração de Testemunhas'>
            <Controller
              control={form.control}
              name='declaracaoDeTestemunhas'
              render={({ field }) => (
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder='Declarações de testemunhas (se houver)'
                  rows={3}
                />
              )}
            />
          </FormField>

          <FormField label='Conclusão Preliminar'>
            <Controller
              control={form.control}
              name='conclusaoPreliminar'
              render={({ field }) => (
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder='Conclusão preliminar sobre o incidente'
                  rows={3}
                />
              )}
            />
          </FormField>
        </FormSection>

        <FormSection title='Recomendações e Ações'>
          <FormField label='Recomendações' required>
            <Controller
              control={form.control}
              name='recomendacoes'
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder='Descreva as recomendações para prevenir futuros incidentes'
                  rows={4}
                />
              )}
            />
          </FormField>

          <FormRow>
            <FormField label='Inclusão em Matéria de Segurança'>
              <Controller
                control={form.control}
                name='inclusaoEmMateriaSeguranca'
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ''}
                    placeholder='Informações sobre inclusão em matéria de segurança'
                  />
                )}
              />
            </FormField>

            <FormField label='Prazo'>
              <Controller
                control={form.control}
                name='prazo'
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title='Avaliação do Incidente'>
          <FormRow>
            <FormField label='Necessita de Investigação Aprofundada' required>
              <Controller
                control={form.control}
                name='necessitaDeInvestigacaoAprofundada'
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      {simNaoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField label='Incidente Reportável' required>
              <Controller
                control={form.control}
                name='incidenteReportavel'
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      {simNaoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </FormRow>

          <FormField label='Credores Obrigados a Serem Notificados' required>
            <Controller
              control={form.control}
              name='credoresObrigadosASeremNotificados'
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleciona a opção' />
                  </SelectTrigger>
                  <SelectContent>
                    {simNaoOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </FormSection>

        <FormSection title='Informações do Relatório'>
          <FormRow>
            <FormField label='Autor do Relatório'>
              <Controller
                control={form.control}
                name='autorDoRelatorio'
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ''}
                    placeholder='Digite o nome do autor do relatório'
                  />
                )}
              />
            </FormField>

            <FormField label='Nome do Provedor' required>
              <Controller
                control={form.control}
                name='nomeProvedor'
                render={({ field }) => (
                  <Input {...field} placeholder='Digite o nome do provedor' />
                )}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label='Data de Criação' required>
              <Controller
                control={form.control}
                name='dataCriacao'
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </FormField>

            <FormField label='Data' required>
              <Controller
                control={form.control}
                name='data'
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title='Incidentes Relacionados'>
          <FormField label='Incidentes'>
            <div className='flex items-center gap-2 mb-2'>
              <span
                className={cn(
                  'text-sm',
                  incidentes.length === 0 ? 'text-amber-600' : 'text-gray-600'
                )}
              >
                {incidentes.length === 0
                  ? 'Nenhum incidente disponível'
                  : `${incidentes.length} incidente(s) disponível(is)`}
              </span>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={fetchIncidentes}
                disabled={isLoadingIncidentes || isSubmitting}
                className='h-6 px-2'
              >
                <RefreshCw
                  className={cn(
                    'h-3 w-3',
                    isLoadingIncidentes && 'animate-spin'
                  )}
                />
              </Button>
              {incidentes.length === 0 && !isLoadingIncidentes && (
                <span className='text-xs text-gray-500'>
                  - Clique no botão + para criar
                </span>
              )}
            </div>
            <div className='flex gap-2'>
              <Popover
                open={commandIncidentesOpen}
                onOpenChange={(open) => {
                  setCommandIncidentesOpen(open);
                  if (!open) {
                    setSearchTerm(''); // Clear search when closing
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={commandIncidentesOpen}
                    className='flex-1 justify-between'
                    disabled={isLoadingIncidentes || isSubmitting}
                  >
                    <span className='flex-1 text-left'>
                      {selectedIncidentes.length > 0
                        ? `${selectedIncidentes.length} incidente(s) selecionado(s)`
                        : 'Selecione incidentes...'}
                    </span>
                    <div className='flex items-center gap-1'>
                      {selectedIncidentes.length > 0 && (
                        <Badge variant='secondary' className='text-xs'>
                          {selectedIncidentes.length}
                        </Badge>
                      )}
                      <RefreshCw
                        className={cn(
                          'h-4 w-4',
                          isLoadingIncidentes && 'animate-spin'
                        )}
                      />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[400px] p-0' align='start'>
                  <div className='p-2'>
                    <div className='relative mb-2'>
                      <Input
                        placeholder='Buscar incidentes...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='pr-8'
                      />
                      {searchTerm && (
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => setSearchTerm('')}
                          className='absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0'
                        >
                          ×
                        </Button>
                      )}
                    </div>

                    {filteredIncidentes.length > 0 && (
                      <div className='flex gap-2 mb-2'>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            const allFilteredIds = filteredIncidentes.map(
                              (i) => i.id
                            );
                            const newSelection = [
                              ...new Set([
                                ...selectedIncidentes,
                                ...allFilteredIds,
                              ]),
                            ];
                            setSelectedIncidentes(newSelection);
                          }}
                          className='h-6 text-xs'
                        >
                          Selecionar Todos
                        </Button>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => setSelectedIncidentes([])}
                          className='h-6 text-xs'
                          disabled={selectedIncidentes.length === 0}
                        >
                          Limpar Seleção
                        </Button>
                      </div>
                    )}

                    <div className='max-h-60 overflow-y-auto'>
                      {isLoadingIncidentes ? (
                        <div className='p-4 text-center text-sm text-gray-500'>
                          Carregando...
                        </div>
                      ) : filteredIncidentes.length === 0 ? (
                        <div className='p-4 text-center text-sm text-gray-500'>
                          {incidentes.length === 0
                            ? 'Nenhum incidente disponível. Clique no botão + para criar um novo.'
                            : 'Nenhum incidente encontrado.'}
                        </div>
                      ) : (
                        <div className='space-y-1'>
                          {filteredIncidentes.map((incidente) => {
                            const isSelected = selectedIncidentes.includes(
                              incidente.id
                            );
                            return (
                              <button
                                key={incidente.id}
                                type='button'
                                onClick={() => toggleIncidente(incidente.id)}
                                className={cn(
                                  'w-full flex items-center p-3 rounded-md text-left transition-colors',
                                  'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
                                  isSelected
                                    ? 'bg-blue-50 border border-blue-200'
                                    : 'border border-transparent'
                                )}
                              >
                                <CheckIcon
                                  className={cn(
                                    'mr-3 h-4 w-4 flex-shrink-0',
                                    isSelected
                                      ? 'opacity-100 text-blue-600'
                                      : 'opacity-0'
                                  )}
                                />
                                <span className='text-sm text-gray-900'>
                                  {incidente.descricao}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                type='button'
                size='icon'
                variant='outline'
                className='rounded-full h-10 w-10 flex-shrink-0'
                onClick={() => setIsIncidenteModalOpen(true)}
                title='Criar novo incidente'
                disabled={isSubmitting}
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </FormField>

          {selectedIncidentes.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-2'>
              {selectedIncidentes.map((incidenteId) => {
                const incidente = incidentes.find((p) => p.id === incidenteId);
                return (
                  <Badge key={incidenteId} variant='secondary'>
                    {incidente?.descricao}
                    <button
                      type='button'
                      className='ml-2 text-xs'
                      onClick={() => toggleIncidente(incidenteId)}
                    >
                      ×
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </FormSection>

        {/* Incidentes Modal */}
        <Dialog
          open={isIncidenteModalOpen}
          onOpenChange={setIsIncidenteModalOpen}
        >
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Criar Novo Incidente</DialogTitle>
            </DialogHeader>
            <IncidenteForm
              onSubmit={handleCreateIncidente}
              onCancel={() => setIsIncidenteModalOpen(false)}
              isLoading={isCreatingIncidente}
            />
          </DialogContent>
        </Dialog>

        <FormActions
          onCancel={onCancel}
          isSubmitting={isSubmitting || isLoading}
          submitLabel='Salvar Relatório'
        />
      </form>
    </div>
  );
}
