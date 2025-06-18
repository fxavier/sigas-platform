// components/forms/identificacao-avaliacao-riscos/form.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Check,
  ChevronsUpDown,
  Plus,
  CalendarIcon,
  InfoIcon,
} from 'lucide-react';
import { useFormApi } from '@/hooks/use-form-api';
import { FormSection } from '../form-section';
import { FormRow } from '../form-row';
import { FormField } from '../form-field';
import { FormActions } from '../form-actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais } from '@/lib/types/forms';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  identificacaoAvaliacaoRiscosSchema,
  type IdentificacaoAvaliacaoRiscosFormData,
} from '@/lib/validations/identificacao-avaliacao-riscos';
import { AddOptionDialog } from '@/components/forms/add-option-dialog';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface RiscoImpacto {
  id: string;
  descricao: string;
}

interface FactorAmbiental {
  id: string;
  descricao: string;
}

interface FormProps {
  initialData?: IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais;
  onSubmit: (data: IdentificacaoAvaliacaoRiscosFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  tenantId?: string;
  projectId?: string;
}

const calculateSignificance = (
  intensity: string,
  probability: string
): string => {
  if (intensity === 'BAIXA') {
    if (probability === 'IMPROVAVEL' || probability === 'PROVAVEL') {
      return 'Pouco Significativo';
    } else if (
      probability === 'ALTAMENTE_PROVAVEL' ||
      probability === 'DEFINITIVA'
    ) {
      return 'Significativo';
    }
  } else if (intensity === 'MEDIA') {
    if (probability === 'IMPROVAVEL') {
      return 'Pouco Significativo';
    } else if (
      probability === 'PROVAVEL' ||
      probability === 'ALTAMENTE_PROVAVEL'
    ) {
      return 'Significativo';
    } else if (probability === 'DEFINITIVA') {
      return 'Muito Significativo';
    }
  } else if (intensity === 'ALTA') {
    if (probability === 'IMPROVAVEL' || probability === 'PROVAVEL') {
      return 'Significativo';
    } else if (
      probability === 'ALTAMENTE_PROVAVEL' ||
      probability === 'DEFINITIVA'
    ) {
      return 'Muito Significativo';
    }
  }
  return '';
};

export function IdentificacaoAvaliacaoRiscosForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  tenantId,
  projectId,
}: FormProps) {
  const [riscosImpactos, setRiscosImpactos] = useState<RiscoImpacto[]>([]);
  const [fatoresAmbientais, setFatoresAmbientais] = useState<FactorAmbiental[]>(
    []
  );
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm<IdentificacaoAvaliacaoRiscosFormData>({
    resolver: zodResolver(identificacaoAvaliacaoRiscosSchema),
    defaultValues: {
      id: initialData?.id,
      tenantId: tenantId || initialData?.tenantId || '',
      projectId: projectId || initialData?.projectId || '',
      numeroReferencia: initialData?.numeroReferencia || '',
      processo: initialData?.processo || '',
      actiactividade: initialData?.actiactividade || '',
      riscosImpactosId: initialData?.riscosImpactosId || '',
      realOuPotencial: initialData?.realOuPotencial || '',
      condicao: initialData?.condicao || 'NORMAL',
      factorAmbientalImpactadoId: initialData?.factorAmbientalImpactadoId || '',
      faseProjecto: initialData?.faseProjecto || 'PRE_CONSTRUCAO',
      estatuto: initialData?.estatuto || 'POSITIVO',
      extensao: initialData?.extensao || 'LOCAL',
      duduacao: initialData?.duduacao || 'CURTO_PRAZO',
      intensidade: initialData?.intensidade || 'BAIXA',
      probabilidade: initialData?.probabilidade || 'IMPROVAVEL',
      significancia: initialData?.significancia || '',
      duracaoRisco: initialData?.duracaoRisco || '',
      descricaoMedidas: initialData?.descricaoMedidas || '',
      respresponsavelonsible: initialData?.respresponsavelonsible || '',
      prazo: initialData?.prazo ? new Date(initialData.prazo) : new Date(),
      referenciaDocumentoControl: initialData?.referenciaDocumentoControl || '',
      legislacaoMocambicanaAplicavel:
        initialData?.legislacaoMocambicanaAplicavel || '',
      observacoes: initialData?.observacoes || '',
    },
  });

  // Update form values when tenantId or projectId change
  useEffect(() => {
    if (tenantId) {
      form.setValue('tenantId', tenantId);
    }
    if (projectId) {
      form.setValue('projectId', projectId);
    }
  }, [tenantId, projectId, form]);

  const {
    create,
    update,
    isLoading: formApiLoading,
    error,
  } = useFormApi({
    endpoint: 'identificacao-riscos',
  });

  // Fetch options when tenantId changes
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (!tenantId) return;

        setIsLoadingOptions(true);
        const [riscosResponse, fatoresResponse] = await Promise.all([
          fetch(`/api/riscos-impactos?tenantId=${tenantId}`),
          fetch(`/api/fatores-ambientais?tenantId=${tenantId}`),
        ]);

        if (!riscosResponse.ok || !fatoresResponse.ok) {
          throw new Error('Failed to fetch options');
        }

        const [riscosData, fatoresData] = await Promise.all([
          riscosResponse.json(),
          fatoresResponse.json(),
        ]);

        setRiscosImpactos(riscosData);
        setFatoresAmbientais(fatoresData);
      } catch (error) {
        console.error('Error fetching options:', error);
        toast.error('Erro ao carregar opções de riscos e fatores ambientais');
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [tenantId]);

  const handleAddNewOption = async (type: string, value: string) => {
    if (!value || !tenantId) return;

    try {
      let endpoint = '';
      let data = {};

      switch (type) {
        case 'risco-impacto':
          endpoint = `/api/riscos-impactos?tenantId=${tenantId}`;
          data = { descricao: value };
          break;
        case 'fator-ambiental':
          endpoint = `/api/fatores-ambientais?tenantId=${tenantId}`;
          data = { descricao: value };
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add new option');
      }

      const newOption = await response.json();

      // Update the form with the new option
      if (type === 'risco-impacto' && newOption.id) {
        form.setValue('riscosImpactosId', newOption.id);
        setRiscosImpactos((prev) => [...prev, newOption]);
        toast.success('Novo risco/impacto adicionado com sucesso');
      } else if (type === 'fator-ambiental' && newOption.id) {
        form.setValue('factorAmbientalImpactadoId', newOption.id);
        setFatoresAmbientais((prev) => [...prev, newOption]);
        toast.success('Novo fator ambiental adicionado com sucesso');
      }
    } catch (error) {
      console.error('Error adding new option:', error);
      toast.error('Erro ao adicionar nova opção');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = form.getValues();

      if (!tenantId || !projectId) {
        throw new Error('Tenant and Project are required');
      }

      const dataToSubmit = {
        ...formData,
        tenantId,
        projectId,
      };

      if (initialData?.id) {
        await update(initialData.id, dataToSubmit, { tenantId });
      } else {
        await create(dataToSubmit, { tenantId });
      }

      if (onSubmit) {
        onSubmit(dataToSubmit);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erro ao enviar formulário');
    }
  };

  // Add useEffect to watch intensity and probability
  useEffect(() => {
    const intensity = form.watch('intensidade');
    const probability = form.watch('probabilidade');
    if (intensity && probability) {
      const significance = calculateSignificance(intensity, probability);
      form.setValue('significancia', significance);
    }
  }, [form.watch('intensidade'), form.watch('probabilidade'), form]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <Card className='border-gray-200'>
          <CardContent className='pt-6'>
            <FormSection
              title='Informações Básicas'
              description='Detalhes gerais sobre o registro de risco ou impacto'
            >
              <FormRow>
                <FormField label='Número de Referência'>
                  <Input
                    {...form.register('numeroReferencia')}
                    placeholder='Ex: ESMS-001'
                    className='bg-white'
                  />
                </FormField>

                <FormField label='Processo'>
                  <Input
                    {...form.register('processo')}
                    placeholder='Informe o processo relacionado'
                    className='bg-white'
                  />
                </FormField>
              </FormRow>

              <FormField label='Atividade' required>
                <Input
                  {...form.register('actiactividade')}
                  placeholder='Descreva a atividade relacionada ao risco/impacto'
                  className='bg-white'
                />
              </FormField>
            </FormSection>
          </CardContent>
        </Card>

        <Card className='border-gray-200'>
          <CardContent className='pt-6'>
            <FormSection
              title='Riscos e Impactos'
              description='Identifique e classifique o risco ou impacto ambiental'
            >
              <FormRow>
                <FormField label='Risco/Impacto' required>
                  <div className='flex gap-2'>
                    <TooltipProvider>
                      <Select
                        value={form.watch('riscosImpactosId') || ''}
                        onValueChange={(value) =>
                          form.setValue('riscosImpactosId', value)
                        }
                      >
                        <SelectTrigger className='bg-white'>
                          <SelectValue placeholder='Seleciona a opção' />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingOptions ? (
                            <SelectItem value='loading' disabled>
                              Carregando...
                            </SelectItem>
                          ) : (
                            riscosImpactos.map((risco) => (
                              <SelectItem key={risco.id} value={risco.id}>
                                {risco.descricao}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AddOptionDialog
                            type='Risco/Impacto'
                            onAdd={(value) =>
                              handleAddNewOption('risco-impacto', value)
                            }
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Adicionar novo risco ou impacto</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </FormField>

                <FormField label='Fator Ambiental Impactado' required>
                  <div className='flex gap-2'>
                    <TooltipProvider>
                      <Select
                        value={form.watch('factorAmbientalImpactadoId') || ''}
                        onValueChange={(value) =>
                          form.setValue('factorAmbientalImpactadoId', value)
                        }
                      >
                        <SelectTrigger className='bg-white'>
                          <SelectValue placeholder='Seleciona a opção' />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingOptions ? (
                            <SelectItem value='loading' disabled>
                              Carregando...
                            </SelectItem>
                          ) : (
                            fatoresAmbientais.map((factor) => (
                              <SelectItem key={factor.id} value={factor.id}>
                                {factor.descricao}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AddOptionDialog
                            type='Fator Ambiental'
                            onAdd={(value) =>
                              handleAddNewOption('fator-ambiental', value)
                            }
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Adicionar novo fator ambiental</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </FormField>
              </FormRow>

              <FormRow>
                <FormField label='Real ou Potencial'>
                  <Input
                    {...form.register('realOuPotencial')}
                    placeholder='Real ou Potencial'
                    className='bg-white'
                  />
                </FormField>

                <FormField label='Condição' required>
                  <Select
                    value={form.watch('condicao')}
                    onValueChange={(value) =>
                      form.setValue(
                        'condicao',
                        value as 'NORMAL' | 'ANORMAL' | 'EMERGENCIA'
                      )
                    }
                  >
                    <SelectTrigger className='bg-white'>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='NORMAL'>Normal</SelectItem>
                      <SelectItem value='ANORMAL'>Anormal</SelectItem>
                      <SelectItem value='EMERGENCIA'>Emergência</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </FormRow>
            </FormSection>
          </CardContent>
        </Card>

        <Card className='border-gray-200'>
          <CardContent className='pt-6'>
            <FormSection
              title='Avaliação'
              description='Realize a avaliação do risco ou impacto'
            >
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField label='Fase do Projeto' required>
                  <Select
                    value={form.watch('faseProjecto')}
                    onValueChange={(value) =>
                      form.setValue(
                        'faseProjecto',
                        value as
                          | 'PRE_CONSTRUCAO'
                          | 'CONSTRUCAO'
                          | 'OPERACAO'
                          | 'DESATIVACAO'
                          | 'ENCERRAMENTO'
                          | 'RESTAURACAO'
                      )
                    }
                  >
                    <SelectTrigger className='bg-white'>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='PRE_CONSTRUCAO'>
                        Pre Construção
                      </SelectItem>
                      <SelectItem value='CONSTRUCAO'>Construção</SelectItem>
                      <SelectItem value='OPERACAO'>Operação</SelectItem>
                      <SelectItem value='DESATIVACAO'>Desativação</SelectItem>
                      <SelectItem value='ENCERRAMENTO'>Encerramento</SelectItem>
                      <SelectItem value='RESTAURACAO'>Restauração</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label='Estatuto' required>
                  <Select
                    value={form.watch('estatuto')}
                    onValueChange={(value) =>
                      form.setValue(
                        'estatuto',
                        value as 'POSITIVO' | 'NEGATIVO'
                      )
                    }
                  >
                    <SelectTrigger className='bg-white'>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='POSITIVO'>Positivo</SelectItem>
                      <SelectItem value='NEGATIVO'>Negativo</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label='Extensão' required>
                  <Select
                    value={form.watch('extensao')}
                    onValueChange={(value) =>
                      form.setValue(
                        'extensao',
                        value as 'LOCAL' | 'REGIONAL' | 'NACIONAL' | 'GLOBAL'
                      )
                    }
                  >
                    <SelectTrigger className='bg-white'>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='LOCAL'>Local</SelectItem>
                      <SelectItem value='REGIONAL'>Regional</SelectItem>
                      <SelectItem value='NACIONAL'>Nacional</SelectItem>
                      <SelectItem value='GLOBAL'>Global</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                <FormField label='Duração' required>
                  <Select
                    value={form.watch('duduacao')}
                    onValueChange={(value) =>
                      form.setValue(
                        'duduacao',
                        value as 'CURTO_PRAZO' | 'MEDIO_PRAZO' | 'LONGO_PRAZO'
                      )
                    }
                  >
                    <SelectTrigger className='bg-white'>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='CURTO_PRAZO'>Curto Prazo</SelectItem>
                      <SelectItem value='MEDIO_PRAZO'>Médio Prazo</SelectItem>
                      <SelectItem value='LONGO_PRAZO'>Longo Prazo</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label='Intensidade' required>
                  <Select
                    value={form.watch('intensidade')}
                    onValueChange={(value) =>
                      form.setValue(
                        'intensidade',
                        value as 'BAIXA' | 'MEDIA' | 'ALTA'
                      )
                    }
                  >
                    <SelectTrigger className='bg-white'>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='BAIXA'>Baixa</SelectItem>
                      <SelectItem value='MEDIA'>Média</SelectItem>
                      <SelectItem value='ALTA'>Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label='Probabilidade' required>
                  <Select
                    value={form.watch('probabilidade')}
                    onValueChange={(value) =>
                      form.setValue(
                        'probabilidade',
                        value as
                          | 'IMPROVAVEL'
                          | 'PROVAVEL'
                          | 'ALTAMENTE_PROVAVEL'
                          | 'DEFINITIVA'
                      )
                    }
                  >
                    <SelectTrigger className='bg-white'>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='IMPROVAVEL'>Improvável</SelectItem>
                      <SelectItem value='PROVAVEL'>Provável</SelectItem>
                      <SelectItem value='ALTAMENTE_PROVAVEL'>
                        Altamente Provável
                      </SelectItem>
                      <SelectItem value='DEFINITIVA'>Definitiva</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className='p-4 bg-gray-50 rounded-md mt-4 border border-gray-200'>
                <FormField label='Significância' required>
                  <div className='flex items-center gap-2'>
                    <Input
                      {...form.register('significancia')}
                      disabled
                      placeholder='Calculado automaticamente'
                      className='bg-white font-semibold'
                      value={
                        form.watch('significancia') ||
                        'Calculado automaticamente'
                      }
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className='text-blue-500'>
                            <InfoIcon className='h-4 w-4' />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            A significância é calculada automaticamente com base
                            na Intensidade e Probabilidade
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </FormField>
              </div>
            </FormSection>
          </CardContent>
        </Card>

        <Card className='border-gray-200'>
          <CardContent className='pt-6'>
            <FormSection
              title='Medidas e Controles'
              description='Defina as medidas para controle do risco ou impacto'
            >
              <FormRow>
                <FormField label='Duração do Risco'>
                  <Input
                    {...form.register('duracaoRisco')}
                    placeholder='Informe a duração do risco'
                    className='bg-white'
                  />
                </FormField>

                <FormField label='Prazo' required>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal bg-white',
                          !form.watch('prazo') && 'text-muted-foreground'
                        )}
                      >
                        {form.watch('prazo') ? (
                          format(form.watch('prazo'), 'PPP', { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={form.watch('prazo')}
                        onSelect={(date) => {
                          if (date) {
                            form.setValue('prazo', date);
                            setCalendarOpen(false);
                          }
                        }}
                        disabled={(date) => date < new Date('1900-01-01')}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </FormField>
              </FormRow>

              <FormField label='Descrição das Medidas' required>
                <Textarea
                  {...form.register('descricaoMedidas')}
                  placeholder='Descreva detalhadamente as medidas de controle ou mitigação'
                  className='min-h-[100px] bg-white'
                />
              </FormField>

              <FormRow>
                <FormField label='Responsável'>
                  <Input
                    {...form.register('respresponsavelonsible')}
                    placeholder='Nome do responsável'
                    className='bg-white'
                  />
                </FormField>

                <FormField label='Referência do Documento de Controle'>
                  <Input
                    {...form.register('referenciaDocumentoControl')}
                    placeholder='Ex: DOC-001'
                    className='bg-white'
                  />
                </FormField>
              </FormRow>

              <FormField label='Legislação Moçambicana Aplicável'>
                <Input
                  {...form.register('legislacaoMocambicanaAplicavel')}
                  placeholder='Informe a legislação aplicável'
                  className='bg-white'
                />
              </FormField>

              <FormField label='Observações' required>
                <Textarea
                  {...form.register('observacoes')}
                  placeholder='Observações adicionais importantes'
                  className='min-h-[80px] bg-white'
                />
              </FormField>
            </FormSection>
          </CardContent>
        </Card>

        {error && (
          <div className='bg-red-50 p-4 rounded-md border border-red-200 text-red-800 mb-4'>
            <p className='font-semibold'>Erro ao enviar o formulário:</p>
            <p>{error}</p>
          </div>
        )}

        <FormActions
          isSubmitting={isLoading || formApiLoading}
          onCancel={onCancel}
          submitLabel={initialData?.id ? 'Atualizar' : 'Criar'}
          className='sticky bottom-0 py-4 px-6 bg-white border-t border-gray-200 -mx-6 mt-8'
        />
      </form>
    </Form>
  );
}
