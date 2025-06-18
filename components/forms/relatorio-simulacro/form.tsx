// components/forms/relatorio-simulacro/form.tsx
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { FormSection } from '../form-section';
import { FormRow } from '../form-row';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  relatorioSimulacroSchema,
  type RelatorioSimulacroFormData,
  type AvaliacaoClassificacaoEmergenciaFormData,
  type RecomendacoesFormData,
} from '@/lib/validations/relatorio-simulacro';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { FormActions } from '../form-actions';
import { Badge } from '@/components/ui/badge';

interface RelatorioSimulacroFormProps {
  initialData?: any;
  onSubmit: (data: RelatorioSimulacroFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

interface PerguntaAvaliacao {
  id: string;
  codigo: string;
  pergunta: string;
}

export function RelatorioSimulacroForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: RelatorioSimulacroFormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  const [perguntasAvaliacao, setPerguntasAvaliacao] = useState<
    PerguntaAvaliacao[]
  >([]);
  const [isLoadingPerguntas, setIsLoadingPerguntas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse the initial data for avaliacoes and recomendacoes if available
  const parseAvaliacoes = () => {
    if (!initialData?.relatorioDeSimulacroOnAvaliacaoClassificacaoEmergencia)
      return [];

    return initialData.relatorioDeSimulacroOnAvaliacaoClassificacaoEmergencia.map(
      (item: any) => ({
        perguntaId: item.avaliacaoClassificacaoEmergencia.perguntaId,
        resposta: item.avaliacaoClassificacaoEmergencia.resposta,
        comentarios: item.avaliacaoClassificacaoEmergencia.comentarios || '',
      })
    );
  };

  const parseRecomendacoes = () => {
    if (!initialData?.relatorioDeSimulacroOnRecomendacoes) return [];

    return initialData.relatorioDeSimulacroOnRecomendacoes.map((item: any) => ({
      acao: item.recomendacoes.acao,
      responsavel: item.recomendacoes.responsavel,
      prazo: item.recomendacoes.prazo,
    }));
  };

  const form = useForm<RelatorioSimulacroFormData>({
    resolver: zodResolver(relatorioSimulacroSchema),
    defaultValues: {
      tenantId: currentTenantId || '',
      projectId: currentProjectId || '',
      local: initialData?.local || '',
      tipoEmergenciaSimulada: initialData?.tipoEmergenciaSimulada || undefined,
      objectoDoSimulacro: initialData?.objectoDoSimulacro || undefined,
      descricaoDocenario: initialData?.descricaoDocenario || '',
      assinaturaCoordenadorEmergencia:
        initialData?.assinaturaCoordenadorEmergencia || '',
      outraAssinatura: initialData?.outraAssinatura || '',
      avaliacaoClassificacaoEmergencia: parseAvaliacoes(),
      recomendacoes: parseRecomendacoes(),
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

  // Fetch perguntas de avaliacao
  useEffect(() => {
    const fetchPerguntas = async () => {
      if (!currentTenantId || !currentProjectId) return;

      setIsLoadingPerguntas(true);
      try {
        const response = await fetch(
          `/api/perguntas-avaliacao?tenantId=${currentTenantId}&projectId=${currentProjectId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch perguntas de avaliacao');
        }

        const data = await response.json();
        console.log('Perguntas de avaliação loaded:', data);
        setPerguntasAvaliacao(data);

        // Initialize form values for avaliacoes if they don't exist
        if (data.length > 0 && !initialData) {
          const initialAvaliacoes = data.map((pergunta: PerguntaAvaliacao) => ({
            perguntaId: pergunta.id,
            resposta: 'NAO' as const,
            comentarios: '',
          }));

          form.setValue('avaliacaoClassificacaoEmergencia', initialAvaliacoes);
        }
      } catch (error) {
        console.error('Error fetching perguntas:', error);
        toast.error('Erro ao carregar perguntas de avaliação');
        setPerguntasAvaliacao([]);
      } finally {
        setIsLoadingPerguntas(false);
      }
    };

    fetchPerguntas();
  }, [currentTenantId, currentProjectId, form, initialData]);

  const handleFormSubmit = async (data: RelatorioSimulacroFormData) => {
    if (!currentTenantId || !currentProjectId) {
      toast.error('Tenant e Projeto são obrigatórios');
      return;
    }

    setIsSubmitting(true);
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
      toast.error('Erro ao salvar formulário');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to get pergunta by ID
  const getPerguntaById = (id: string) => {
    return perguntasAvaliacao.find((p) => p.id === id);
  };

  // Add new recomendacao
  const addRecomendacao = () => {
    const currentRecomendacoes = form.getValues('recomendacoes') || [];
    form.setValue('recomendacoes', [
      ...currentRecomendacoes,
      { acao: '', responsavel: '', prazo: '' },
    ]);
  };

  // Remove recomendacao
  const removeRecomendacao = (index: number) => {
    const currentRecomendacoes = form.getValues('recomendacoes') || [];
    form.setValue(
      'recomendacoes',
      currentRecomendacoes.filter((_, i) => i !== index)
    );
  };

  const tipoEmergenciaOptions = [
    { value: 'SAUDE_E_SEGURANCA', label: 'Saúde e Segurança' },
    { value: 'AMBIENTAL', label: 'Ambiental' },
  ];

  const objectoSimulacroOptions = [
    {
      value: 'DISPOSITIVOS_DE_EMERGENCIA',
      label: 'Dispositivos de Emergência',
    },
    { value: 'REACAO_DOS_COLABORADORES', label: 'Reação dos Colaboradores' },
    {
      value: 'ACTUACAO_DA_EQUIPA_DE_EMERGENCIA',
      label: 'Atuação da Equipa de Emergência',
    },
  ];

  const respostaAvaliacaoOptions = [
    { value: 'SIM', label: 'Sim' },
    { value: 'NAO', label: 'Não' },
    { value: 'N_A', label: 'N/A' },
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className='space-y-8'
      >
        {(!currentTenantId || !currentProjectId) && (
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertTitle>Projeto não selecionado</AlertTitle>
            <AlertDescription>
              É necessário selecionar um projeto para continuar.
            </AlertDescription>
          </Alert>
        )}

        <FormSection
          title='Informações Básicas'
          description='Dados do simulacro de emergência'
        >
          <FormRow>
            <FormField
              control={form.control}
              name='local'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Local
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Local onde foi realizado o simulacro'
                      className='bg-white'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='tipoEmergenciaSimulada'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tipo de Emergência Simulada
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
                        {tipoEmergenciaOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          <FormRow>
            <FormField
              control={form.control}
              name='objectoDoSimulacro'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Objeto do Simulacro
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
                        {objectoSimulacroOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='assinaturaCoordenadorEmergencia'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Coordenador de Emergência
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nome do coordenador de emergência'
                      className='bg-white'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          <FormField
            control={form.control}
            name='outraAssinatura'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outra Assinatura (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Outra assinatura'
                    className='bg-white'
                    disabled={isLoading}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='descricaoDocenario'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Descrição do Cenário
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva o cenário simulado'
                    className='min-h-[100px] bg-white'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Alert className='bg-blue-50 border-blue-200'>
          <Info className='h-4 w-4 text-blue-600' />
          <AlertTitle className='text-blue-600'>Informação</AlertTitle>
          <AlertDescription className='text-blue-700'>
            O relatório de simulacro é essencial para avaliar a preparação da
            equipe para situações de emergência e identificar áreas de melhoria
            nos procedimentos.
          </AlertDescription>
        </Alert>

        <FormSection
          title='Avaliação e Classificação de Emergência'
          description='Responda às perguntas de avaliação baseadas no simulacro'
        >
          {isLoadingPerguntas ? (
            <div className='space-y-4'>
              <Skeleton className='h-24 w-full' />
              <Skeleton className='h-24 w-full' />
              <Skeleton className='h-24 w-full' />
            </div>
          ) : (
            perguntasAvaliacao.map((pergunta, index) => (
              <Card
                key={pergunta.id}
                className='mb-4 border-gray-200 overflow-hidden'
              >
                <CardContent className='pt-6'>
                  <div className='mb-4'>
                    <h4 className='text-base font-medium flex items-center gap-2'>
                      {pergunta.codigo}
                      <Badge variant='outline' className='font-normal text-xs'>
                        ID: {pergunta.id.substring(0, 6)}...
                      </Badge>
                    </h4>
                    <p className='text-sm text-gray-600 mt-2'>
                      {pergunta.pergunta}
                    </p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name={
                        `avaliacaoClassificacaoEmergencia.${index}.resposta` as const
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resposta</FormLabel>
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
                                {respostaAvaliacaoOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={
                        `avaliacaoClassificacaoEmergencia.${index}.comentarios` as const
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comentários</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Comentários opcionais'
                              className='bg-white'
                              disabled={isLoading}
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <input
                    type='hidden'
                    {...form.register(
                      `avaliacaoClassificacaoEmergencia.${index}.perguntaId` as const
                    )}
                    value={pergunta.id}
                  />
                </CardContent>
              </Card>
            ))
          )}

          {perguntasAvaliacao.length === 0 && !isLoadingPerguntas && (
            <Alert>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>Sem perguntas</AlertTitle>
              <AlertDescription>
                Não há perguntas de avaliação cadastradas para este projeto.
                Adicione perguntas no módulo de configuração.
              </AlertDescription>
            </Alert>
          )}
        </FormSection>

        <FormSection
          title='Recomendações'
          description='Adicione recomendações baseadas no simulacro'
        >
          <div className='space-y-4'>
            {form.watch('recomendacoes')?.map((_, index) => (
              <Card key={index} className='border-gray-200'>
                <CardContent className='pt-6'>
                  <div className='flex justify-between items-start mb-4'>
                    <h4 className='text-base font-medium'>
                      Recomendação {index + 1}
                    </h4>
                    {(form.watch('recomendacoes')?.length ?? 0) > 1 && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => removeRecomendacao(index)}
                        className='text-red-500 hover:text-red-700'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    )}
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <FormField
                      control={form.control}
                      name={`recomendacoes.${index}.acao` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ação</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Descrição da ação'
                              className='bg-white'
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`recomendacoes.${index}.responsavel` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsável</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Nome do responsável'
                              className='bg-white'
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`recomendacoes.${index}.prazo` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prazo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Ex: 30 dias, 2 semanas'
                              className='bg-white'
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )) || []}

            <Button
              type='button'
              variant='outline'
              onClick={addRecomendacao}
              className='w-full'
              disabled={isLoading}
            >
              <Plus className='h-4 w-4 mr-2' />
              Adicionar Recomendação
            </Button>
          </div>
        </FormSection>

        <FormActions
          isSubmitting={isSubmitting || isLoading}
          onCancel={onCancel}
          submitLabel={initialData?.id ? 'Atualizar' : 'Criar'}
          className='sticky bottom-0 py-4 px-6 bg-white border-t border-gray-200 -mx-6 mt-8'
        />
      </form>
    </Form>
  );
}
