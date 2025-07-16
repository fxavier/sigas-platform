// components/forms/matriz-stakeholder/form.tsx
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
import { FormSection } from '../form-section';
import { FormRow } from '../form-row';
import { FormActions } from '../form-actions';
import { AddOptionDialog } from '@/components/forms/add-option-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

import {
  matrizStakeholderSchema,
  MatrizStakeholderFormData,
  AlcanceEnum,
  PercepcaoOuPosicionamentoEnum,
  PotenciaImpactoEnum,
} from '@/lib/validations/matriz-stakeholder';
import { toast } from 'sonner';

interface MatrizStakeholderFormProps {
  initialData?: any;
  onSubmit: (data: MatrizStakeholderFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

interface Categoria {
  id: string;
  nome: string;
}

interface AreaActuacao {
  id: string;
  nome: string;
}

interface PrincipaisInteresses {
  id: string;
  nome: string;
}

export function MatrizStakeholderForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: MatrizStakeholderFormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [areasActuacao, setAreasActuacao] = useState<AreaActuacao[]>([]);
  const [principaisInteresses, setPrincipaisInteresses] = useState<
    PrincipaisInteresses[]
  >([]);

  const [isLoadingCategorias, setIsLoadingCategorias] = useState(false);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [isLoadingInteresses, setIsLoadingInteresses] = useState(false);

  const form = useForm<MatrizStakeholderFormData>({
    resolver: zodResolver(matrizStakeholderSchema),
    defaultValues: {
      id: initialData?.id,
      tenantId: currentTenantId || '',
      projectId: currentProjectId || '',
      stakeholder: initialData?.stakeholder || '',
      categoriaId: initialData?.categoriaId || '',
      alcance: initialData?.alcance || 'LOCAL',
      areaActuacaoId: initialData?.areaActuacaoId || '',
      descricao: initialData?.descricao || '',
      historico_relacionamento: initialData?.historico_relacionamento || '',
      percepcaoEmRelacaoAoEmprendedor:
        initialData?.percepcaoEmRelacaoAoEmprendedor || '',
      principaisInteressesId: initialData?.principaisInteressesId || '',
      oportunidades_associadas: initialData?.oportunidades_associadas || '',
      riscos_associados: initialData?.riscos_associados || '',
      percepcaoOuPosicionamento:
        initialData?.percepcaoOuPosicionamento || 'NEUTRO',
      potenciaImpacto: initialData?.potenciaImpacto || 'MEDIO',
      diagnostico_directriz_posicionamento:
        initialData?.diagnostico_directriz_posicionamento || '',
      interlocutor_responsavel_por_relacionamento:
        initialData?.interlocutor_responsavel_por_relacionamento || '',
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

  // Fetch categorias
  useEffect(() => {
    const fetchCategorias = async () => {
      if (!currentTenantId) return;

      setIsLoadingCategorias(true);
      try {
        const response = await fetch(
          `/api/categorias?tenantId=${currentTenantId}`
        );

        if (!response.ok) {
          throw new Error('Falha ao carregar categorias');
        }

        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        toast.error('Erro ao carregar categorias');
        setCategorias([]);
      } finally {
        setIsLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, [currentTenantId]);

  // Fetch areas de actuacao
  useEffect(() => {
    const fetchAreasActuacao = async () => {
      if (!currentTenantId) return;

      setIsLoadingAreas(true);
      try {
        const response = await fetch(
          `/api/areas-actuacao?tenantId=${currentTenantId}`
        );

        if (!response.ok) {
          throw new Error('Falha ao carregar áreas de atuação');
        }

        const data = await response.json();
        setAreasActuacao(data);
      } catch (error) {
        console.error('Erro ao carregar áreas de atuação:', error);
        toast.error('Erro ao carregar áreas de actuação');
        setAreasActuacao([]);
      } finally {
        setIsLoadingAreas(false);
      }
    };

    fetchAreasActuacao();
  }, [currentTenantId]);

  // Fetch principais interesses
  useEffect(() => {
    const fetchPrincipaisInteresses = async () => {
      if (!currentTenantId) return;

      setIsLoadingInteresses(true);
      try {
        const response = await fetch(
          `/api/principais-interesses?tenantId=${currentTenantId}`
        );

        if (!response.ok) {
          throw new Error('Falha ao carregar principais interesses');
        }

        const data = await response.json();
        setPrincipaisInteresses(data);
      } catch (error) {
        console.error('Erro ao carregar principais interesses:', error);
        toast.error('Erro ao carregar principais interesses');
        setPrincipaisInteresses([]);
      } finally {
        setIsLoadingInteresses(false);
      }
    };

    fetchPrincipaisInteresses();
  }, [currentTenantId]);

  // Helper function to translate enum values for display
  const translateEnum = (enumValue: string, type: string): string => {
    const translations: Record<string, Record<string, string>> = {
      alcance: {
        LOCAL: 'Local',
        REGIONAL: 'Regional',
        NACIONAL: 'Nacional',
        INTERNACIONAL: 'Internacional',
      },
      percepcaoOuPosicionamento: {
        POSITIVO: 'Positivo',
        NEGATIVO: 'Negativo',
        NEUTRO: 'Neutro',
      },
      potenciaImpacto: {
        BAIXO: 'Baixo',
        MEDIO: 'Médio',
        ALTO: 'Alto',
      },
    };

    return translations[type]?.[enumValue] || enumValue;
  };

  // Handle form submission
  const handleFormSubmit = async (data: MatrizStakeholderFormData) => {
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
      console.error('Erro ao enviar formulário:', error);
    }
  };

  // Handle adding new options
  const handleAddNewOption = async (type: string, value: string) => {
    if (!value || !currentTenantId) {
      toast.error('Valor e tenant ID são obrigatórios');
      return;
    }

    try {
      let endpoint = '';
      let body: any = {};
      let params = new URLSearchParams();
      params.append('tenantId', currentTenantId);

      switch (type) {
        case 'categoria':
          endpoint = '/api/categorias';
          body = {
            nome: value,
            tenantId: currentTenantId,
          };
          break;
        case 'area-actuacao':
          endpoint = '/api/areas-actuacao';
          body = {
            nome: value,
            tenantId: currentTenantId,
          };
          break;
        case 'principais-interesses':
          endpoint = '/api/principais-interesses';
          body = {
            nome: value,
            tenantId: currentTenantId,
          };
          break;
        default:
          toast.error('Tipo não suportado');
          return;
      }

      const response = await fetch(`${endpoint}?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao adicionar nova opção');
      }

      const result = await response.json();

      // Update state based on the type
      switch (type) {
        case 'categoria':
          setCategorias((prev) => [...prev, result]);
          break;
        case 'area-actuacao':
          setAreasActuacao((prev) => [...prev, result]);
          break;
        case 'principais-interesses':
          setPrincipaisInteresses((prev) => [...prev, result]);
          break;
      }

      toast.success('Item adicionado com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar nova opção:', error);
      toast.error(
        `Erro ao adicionar novo item: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        }`
      );
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

        {/* Identificação do Stakeholder */}
        <FormSection
          title='Identificação do Stakeholder'
          description='Informações básicas sobre o stakeholder'
        >
          <FormField
            control={form.control}
            name='stakeholder'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nome do Stakeholder
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Ex: Associação de Moradores, Empresa XYZ'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormRow>
            <FormField
              control={form.control}
              name='categoriaId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Categoria
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <div className='flex items-center gap-2'>
                    <FormControl>
                      <Select
                        disabled={isLoading || isLoadingCategorias}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className='bg-white w-full'>
                          <SelectValue placeholder='Seleciona a opção' />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingCategorias ? (
                            <div className='p-2'>
                              <Skeleton className='h-8 w-full' />
                            </div>
                          ) : categorias.length === 0 ? (
                            <div className='p-2 text-sm text-muted-foreground text-center'>
                              Nenhuma categoria encontrada
                            </div>
                          ) : (
                            categorias.map((categoria) => (
                              <SelectItem
                                key={categoria.id}
                                value={categoria.id}
                              >
                                {categoria.nome}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <AddOptionDialog
                      type='Categoria'
                      onAdd={(value) => handleAddNewOption('categoria', value)}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='alcance'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Alcance
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
                        {Object.values(AlcanceEnum.Values).map((value) => (
                          <SelectItem key={value} value={value}>
                            {translateEnum(value, 'alcance')}
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
              name='areaActuacaoId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Área de Actuação
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <div className='flex items-center gap-2'>
                    <FormControl>
                      <Select
                        disabled={isLoading || isLoadingAreas}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className='bg-white w-full'>
                          <SelectValue placeholder='Seleciona a opção' />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingAreas ? (
                            <div className='p-2'>
                              <Skeleton className='h-8 w-full' />
                            </div>
                          ) : areasActuacao.length === 0 ? (
                            <div className='p-2 text-sm text-muted-foreground text-center'>
                              Nenhuma área de actuação encontrada
                            </div>
                          ) : (
                            areasActuacao.map((area) => (
                              <SelectItem key={area.id} value={area.id}>
                                {area.nome}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <AddOptionDialog
                      type='Área de Actuação'
                      onAdd={(value) =>
                        handleAddNewOption('area-actuacao', value)
                      }
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='principaisInteressesId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Principais Interesses
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <div className='flex items-center gap-2'>
                    <FormControl>
                      <Select
                        disabled={isLoading || isLoadingInteresses}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className='bg-white w-full'>
                          <SelectValue placeholder='Seleciona a opção' />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingInteresses ? (
                            <div className='p-2'>
                              <Skeleton className='h-8 w-full' />
                            </div>
                          ) : principaisInteresses.length === 0 ? (
                            <div className='p-2 text-sm text-muted-foreground text-center'>
                              Nenhum interesse encontrado
                            </div>
                          ) : (
                            principaisInteresses.map((interesse) => (
                              <SelectItem
                                key={interesse.id}
                                value={interesse.id}
                              >
                                {interesse.nome}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <AddOptionDialog
                      type='Principais Interesses'
                      onAdd={(value) =>
                        handleAddNewOption('principais-interesses', value)
                      }
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>
        </FormSection>

        {/* Descrição e Histórico */}
        <FormSection
          title='Descrição e Histórico'
          description='Informações detalhadas sobre o stakeholder'
        >
          <FormField
            control={form.control}
            name='descricao'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Descrição
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva o stakeholder, suas características e importância'
                    className='min-h-[100px]'
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
            name='historico_relacionamento'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Histórico de Relacionamento
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva o histórico de relacionamento com este stakeholder'
                    className='min-h-[100px]'
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
            name='percepcaoEmRelacaoAoEmprendedor'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Percepção em Relação ao Empreendedor
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva como este stakeholder percebe o empreendedor/projeto'
                    className='min-h-[100px]'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Análise de Impacto */}
        <FormSection
          title='Análise de Impacto'
          description='Análise de oportunidades, riscos e impactos'
        >
          <FormRow>
            <FormField
              control={form.control}
              name='oportunidades_associadas'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Oportunidades Associadas
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Descreva as oportunidades que este stakeholder pode oferecer'
                      className='min-h-[100px]'
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
              name='riscos_associados'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Riscos Associados
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Descreva os riscos que este stakeholder pode representar'
                      className='min-h-[100px]'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          <FormRow>
            <FormField
              control={form.control}
              name='percepcaoOuPosicionamento'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Percepção ou Posicionamento
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
                        {Object.values(
                          PercepcaoOuPosicionamentoEnum.Values
                        ).map((value) => (
                          <SelectItem key={value} value={value}>
                            {translateEnum(value, 'percepcaoOuPosicionamento')}
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
              name='potenciaImpacto'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Potência de Impacto
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
                        {Object.values(PotenciaImpactoEnum.Values).map(
                          (value) => (
                            <SelectItem key={value} value={value}>
                              {translateEnum(value, 'potenciaImpacto')}
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
        </FormSection>

        {/* Estratégia de Relacionamento */}
        <FormSection
          title='Estratégia de Relacionamento'
          description='Plano de relacionamento e responsabilidades'
        >
          <FormField
            control={form.control}
            name='diagnostico_directriz_posicionamento'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Diagnóstico/Directriz de Posicionamento
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva o diagnóstico e as diretrizes para o posicionamento estratégico'
                    className='min-h-[100px]'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Inclua estratégias de engajamento, comunicação e gestão do
                  relacionamento
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='interlocutor_responsavel_por_relacionamento'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Interlocutor Responsável por Relacionamento
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Nome da pessoa responsável pelo relacionamento'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Pessoa da equipe responsável por manter o relacionamento com
                  este stakeholder
                </FormDescription>
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
