// components/forms/triagem-ambiental/form.tsx
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
import { Info, AlertTriangle } from 'lucide-react';
import { FormSection } from '../form-section';
import { FormRow } from '../form-row';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  triagemAmbientalSchema,
  type TriagemAmbientalFormData,
  type IdentificacaoRiscoFormData,
} from '@/lib/validations/triagem-ambiental';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { FormActions } from '../form-actions';
import { AddOptionDialog } from '@/components/forms/add-option-dialog';
import { AddResponsavelDialog } from './add-responsavel-dialog';
import { AddSubprojectoDialog } from './add-subprojecto-dialog';
import { AddResultadoTriagemDialog } from './add-resultado-triagem-dialog';
// Debug log for component rendering
console.log('TriagemAmbientalForm rendering');
import { Badge } from '@/components/ui/badge';

interface TriagemAmbientalFormProps {
  initialData?: any;
  onSubmit: (data: TriagemAmbientalFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

interface Responsavel {
  id: string;
  nome: string;
  funcao: string;
  contacto: string;
  data: Date;
  assinatura?: string;
}

interface Subprojecto {
  id: string;
  nome: string;
  referenciaDoContracto?: string;
  nomeEmpreiteiro?: string;
  custoEstimado?: number;
  localizacao: string;
  coordenadasGeograficas?: string;
  tipoSubprojecto: string;
  areaAproximada: string;
}

interface ResultadoTriagem {
  id: string;
  subprojectoId: string;
  categoriaRisco: string;
  descricao: string;
  instrumentosASeremDesenvolvidos: string;
}

interface BiodiversidadeRecurso {
  id: string;
  reference: string;
  description: string;
}

export function TriagemAmbientalForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: TriagemAmbientalFormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  const [responsaveisPreenchimento, setResponsaveisPreenchimento] = useState<
    Responsavel[]
  >([]);
  const [responsaveisVerificacao, setResponsaveisVerificacao] = useState<
    Responsavel[]
  >([]);
  const [subprojectos, setSubprojectos] = useState<Subprojecto[]>([]);
  const [resultadosTriagem, setResultadosTriagem] = useState<
    ResultadoTriagem[]
  >([]);
  const [biodiversidadeRecursos, setBiodiversidadeRecursos] = useState<
    BiodiversidadeRecurso[]
  >([]);

  const [isLoadingResponsaveis, setIsLoadingResponsaveis] = useState(false);
  const [isLoadingSubprojectos, setIsLoadingSubprojectos] = useState(false);
  const [isLoadingResultados, setIsLoadingResultados] = useState(false);
  const [isLoadingRecursos, setIsLoadingRecursos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse the initial data for identificacaoRiscos if available
  const parseIdentificacaoRiscos = () => {
    if (!initialData?.identificacaoRiscos) return [];
    console.log(
      'Parsing initialData identificacaoRiscos:',
      initialData.identificacaoRiscos
    );

    return initialData.identificacaoRiscos.map((item: any) => ({
      biodiversidadeRecursosNaturaisId:
        item.identificacaoRiscos.biodiversidadeRecursosNaturaisId,
      resposta: item.identificacaoRiscos.resposta,
      comentario: item.identificacaoRiscos.comentario || '',
      normaAmbientalSocial: item.identificacaoRiscos.normaAmbientalSocial || '',
    }));
  };

  const form = useForm<TriagemAmbientalFormData>({
    resolver: zodResolver(triagemAmbientalSchema),
    defaultValues: {
      tenantId: currentTenantId || '',
      projectId: currentProjectId || '',
      responsavelPeloPreenchimentoId:
        initialData?.responsavelPeloPreenchimentoId || '',
      responsavelPelaVerificacaoId:
        initialData?.responsavelPelaVerificacaoId || '',
      subprojectoId: initialData?.subprojectoId || '',
      consultaEngajamento: initialData?.consultaEngajamento || '',
      accoesRecomendadas: initialData?.accoesRecomendadas || '',
      resultadoTriagemId: initialData?.resultadoTriagemId || '',
      identificacaoRiscos: parseIdentificacaoRiscos(),
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

  // Fetch responsáveis (people responsible)
  useEffect(() => {
    const fetchResponsaveis = async () => {
      if (!currentTenantId) return;

      setIsLoadingResponsaveis(true);
      try {
        // Fetch responsáveis pelo preenchimento
        const responsePreenchimento = await fetch(
          `/api/responsaveis?tenantId=${currentTenantId}&tipo=preenchimento`
        );

        // Fetch responsáveis pela verificação
        const responseVerificacao = await fetch(
          `/api/responsaveis?tenantId=${currentTenantId}&tipo=verificacao`
        );

        if (!responsePreenchimento.ok || !responseVerificacao.ok) {
          throw new Error('Failed to fetch responsáveis');
        }

        const dataPreenchimento = await responsePreenchimento.json();
        const dataVerificacao = await responseVerificacao.json();

        console.log(
          'Responsáveis pelo preenchimento loaded:',
          dataPreenchimento
        );
        console.log('Responsáveis pela verificação loaded:', dataVerificacao);

        setResponsaveisPreenchimento(dataPreenchimento);
        setResponsaveisVerificacao(dataVerificacao);
      } catch (error) {
        console.error('Error fetching responsaveis:', error);
        toast.error('Erro ao carregar responsáveis');
        setResponsaveisPreenchimento([]);
        setResponsaveisVerificacao([]);
      } finally {
        setIsLoadingResponsaveis(false);
      }
    };

    fetchResponsaveis();
  }, [currentTenantId]);

  // Fetch subprojectos
  useEffect(() => {
    const fetchSubprojectos = async () => {
      if (!currentTenantId) return;

      setIsLoadingSubprojectos(true);
      try {
        const response = await fetch(
          `/api/subprojectos?tenantId=${currentTenantId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch subprojectos');
        }
        const data = await response.json();
        console.log('Subprojetos loaded:', data);
        setSubprojectos(data);
      } catch (error) {
        console.error('Error fetching subprojectos:', error);
        toast.error('Erro ao carregar subprojetos');
        setSubprojectos([]);
      } finally {
        setIsLoadingSubprojectos(false);
      }
    };

    fetchSubprojectos();
  }, [currentTenantId]);

  // Fetch resultados triagem
  useEffect(() => {
    const fetchResultadosTriagem = async () => {
      if (!currentTenantId) return;

      setIsLoadingResultados(true);
      try {
        const response = await fetch(
          `/api/resultados-triagem?tenantId=${currentTenantId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch resultados triagem');
        }
        const data = await response.json();
        console.log('Resultados triagem loaded:', data);
        setResultadosTriagem(data);
      } catch (error) {
        console.error('Error fetching resultados triagem:', error);
        toast.error('Erro ao carregar resultados da triagem');
        setResultadosTriagem([]);
      } finally {
        setIsLoadingResultados(false);
      }
    };

    fetchResultadosTriagem();
  }, [currentTenantId]);

  // Fetch biodiversidade recursos
  useEffect(() => {
    const fetchBiodiversidadeRecursos = async () => {
      if (!currentTenantId) return;

      setIsLoadingRecursos(true);
      try {
        const response = await fetch(
          `/api/biodiversidade-recursos?tenantId=${currentTenantId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch biodiversidade recursos');
        }
        const data = await response.json();
        console.log('Biodiversidade recursos loaded:', data);
        setBiodiversidadeRecursos(data);

        // Initialize form values for identificacao riscos if they don't exist
        if (data.length > 0 && !initialData) {
          const initialRiscos = data.map((recurso: BiodiversidadeRecurso) => ({
            biodiversidadeRecursosNaturaisId: recurso.id,
            resposta: 'NAO' as const,
            comentario: '',
            normaAmbientalSocial: '',
          }));

          form.setValue('identificacaoRiscos', initialRiscos);
        }
      } catch (error) {
        console.error('Error fetching biodiversidade recursos:', error);
        toast.error('Erro ao carregar recursos de biodiversidade');
        setBiodiversidadeRecursos([]);
      } finally {
        setIsLoadingRecursos(false);
      }
    };

    fetchBiodiversidadeRecursos();
  }, [currentTenantId, form, initialData]);

  const handleFormSubmit = async (data: TriagemAmbientalFormData) => {
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

  // Helper to get responsible person name
  const getResponsavelNome = (
    id: string,
    type: 'preenchimento' | 'verificacao'
  ) => {
    const list =
      type === 'preenchimento'
        ? responsaveisPreenchimento
        : responsaveisVerificacao;
    return list.find((r) => r.id === id)?.nome || 'Não encontrado';
  };

  // Helper to get subproject name
  const getSubprojectoNome = (id: string) => {
    return subprojectos.find((s) => s.id === id)?.nome || 'Não encontrado';
  };

  // Helper to get resultado triagem
  const getResultadoTriagem = (id: string) => {
    const resultado = resultadosTriagem.find((r) => r.id === id);
    return resultado ? resultado.categoriaRisco : 'Não encontrado';
  };

  // Get resource by ID
  const getRecursoById = (id: string) => {
    return biodiversidadeRecursos.find((r) => r.id === id);
  };

  // Handler for adding new responsavel with comprehensive form
  const handleAddResponsavel = async (
    type: 'preenchimento' | 'verificacao',
    data: any
  ) => {
    if (!currentTenantId) {
      toast.error('Tenant ID é obrigatório');
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append('tenantId', currentTenantId);
      params.append('tipo', type);

      const body = {
        ...data,
        data: new Date(data.data),
        tenantId: currentTenantId,
      };

      const response = await fetch(`/api/responsaveis?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add responsavel');
      }

      const result = await response.json();

      // Update state based on the type
      if (type === 'preenchimento') {
        setResponsaveisPreenchimento((prev) => [...prev, result]);
      } else {
        setResponsaveisVerificacao((prev) => [...prev, result]);
      }
    } catch (error) {
      console.error('Error adding responsavel:', error);
      throw error;
    }
  };

  // Handler for adding new subprojecto with comprehensive form
  const handleAddSubprojecto = async (data: any) => {
    if (!currentTenantId) {
      toast.error('Tenant ID é obrigatório');
      return;
    }

    try {
      const body = {
        ...data,
        custoEstimado: data.custoEstimado
          ? parseFloat(data.custoEstimado)
          : null,
        tenantId: currentTenantId,
      };

      const response = await fetch(
        `/api/subprojectos?tenantId=${currentTenantId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add subprojecto');
      }

      const result = await response.json();
      setSubprojectos((prev) => [...prev, result]);
    } catch (error) {
      console.error('Error adding subprojecto:', error);
      throw error;
    }
  };

  // Handler for adding new resultado triagem with comprehensive form
  const handleAddResultadoTriagem = async (data: any) => {
    if (!currentTenantId) {
      toast.error('Tenant ID é obrigatório');
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append('tenantId', currentTenantId);
      if (currentProjectId) {
        params.append('projectId', currentProjectId);
      }

      const body = {
        ...data,
        tenantId: currentTenantId,
        subprojectoId: data.subprojectoId || null,
      };

      const response = await fetch(
        `/api/resultados-triagem?${params.toString()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add resultado triagem');
      }

      const result = await response.json();
      setResultadosTriagem((prev) => [...prev, result]);
    } catch (error) {
      console.error('Error adding resultado triagem:', error);
      throw error;
    }
  };

  // Legacy handler for simple add option dialog (kept for backward compatibility)
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

      console.log(
        `Adding new ${type} with value "${value}" and tenantId "${currentTenantId}"`
      );

      switch (type) {
        case 'responsável-preenchimento':
          endpoint = '/api/responsaveis';
          params.append('tipo', 'preenchimento');
          body = {
            nome: value,
            funcao: 'Nova função',
            contacto: '',
            data: new Date(),
            tenantId: currentTenantId,
          };
          break;
        case 'responsável-verificacao':
          endpoint = '/api/responsaveis';
          params.append('tipo', 'verificacao');
          body = {
            nome: value,
            funcao: 'Nova função',
            contacto: '',
            data: new Date(),
            tenantId: currentTenantId,
          };
          break;
        case 'subprojeto':
          endpoint = '/api/subprojectos';
          body = {
            nome: value,
            tenantId: currentTenantId,
          };
          break;
        case 'resultado':
          endpoint = '/api/resultados-triagem';
          params.append('projectId', currentProjectId || '');
          body = {
            categoriaRisco: value,
            descricao: 'Nova categoria de risco',
            instrumentosASeremDesenvolvidos: '',
            tenantId: currentTenantId,
            subprojectoId: form.getValues('subprojectoId') || null,
          };
          console.log('Sending request to:', endpoint);
          console.log('Request body:', JSON.stringify(body));
          console.log('Request URL:', `${endpoint}?${params.toString()}`);
          break;
        default:
          toast.error('Tipo não suportado');
          return;
      }

      console.log('Sending request to:', endpoint + '?' + params.toString());
      console.log('Request body:', JSON.stringify(body));

      const response = await fetch(`${endpoint}?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('Response status:', response.status);
      console.log(
        'Response headers:',
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.error || 'Failed to add new option');
      }

      const result = await response.json();
      console.log('Server response:', result);

      // Update state based on the type
      switch (type) {
        case 'responsável-preenchimento':
          setResponsaveisPreenchimento((prev) => [...prev, result]);
          break;
        case 'responsável-verificacao':
          setResponsaveisVerificacao((prev) => [...prev, result]);
          break;
        case 'subprojeto':
          setSubprojectos((prev) => [...prev, result]);
          break;
        case 'resultado':
          setResultadosTriagem((prev) => [...prev, result]);
          break;
      }

      toast.success('Item adicionado com sucesso');
    } catch (error) {
      console.error('Error adding new option:', error);
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
        {(!currentTenantId || !currentProjectId) && (
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertTitle>Projeto não selecionado</AlertTitle>
            <AlertDescription>
              É necessário selecionar um projeto para continuar.
            </AlertDescription>
          </Alert>
        )}

        {/* 1. Responsável pelo Preenchimento */}
        <FormSection
          title='1. Responsável pelo Preenchimento'
          description='Pessoa responsável pelo preenchimento do formulário'
        >
          <FormField
            control={form.control}
            name='responsavelPeloPreenchimentoId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Responsável pelo Preenchimento
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <div className='flex items-center gap-2'>
                  <FormControl>
                    <Select
                      disabled={isLoading || isLoadingResponsaveis}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className='bg-white w-full'>
                        <SelectValue placeholder='Seleciona a opção'>
                          {field.value
                            ? getResponsavelNome(field.value, 'preenchimento')
                            : 'Seleciona a opção'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingResponsaveis ? (
                          <div className='p-2'>
                            <Skeleton className='h-8 w-full' />
                          </div>
                        ) : responsaveisPreenchimento.length === 0 ? (
                          <div className='p-2 text-sm text-muted-foreground text-center'>
                            Nenhum responsável encontrado
                          </div>
                        ) : (
                          responsaveisPreenchimento
                            .filter(
                              (responsavel) =>
                                responsavel.id && responsavel.id.trim() !== ''
                            )
                            .map((responsavel) => (
                              <SelectItem
                                key={responsavel.id}
                                value={responsavel.id}
                              >
                                {responsavel.nome}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <AddResponsavelDialog
                    type='preenchimento'
                    onAdd={(data) =>
                      handleAddResponsavel('preenchimento', data)
                    }
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* 2. Responsável pela Verificação */}
        <FormSection
          title='2. Responsável pela Verificação'
          description='Pessoa responsável pela verificação do formulário'
        >
          <FormField
            control={form.control}
            name='responsavelPelaVerificacaoId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Responsável pela Verificação
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <div className='flex items-center gap-2'>
                  <FormControl>
                    <Select
                      disabled={isLoading || isLoadingResponsaveis}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className='bg-white w-full'>
                        <SelectValue placeholder='Seleciona a opção'>
                          {field.value
                            ? getResponsavelNome(field.value, 'verificacao')
                            : 'Seleciona a opção'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingResponsaveis ? (
                          <div className='p-2'>
                            <Skeleton className='h-8 w-full' />
                          </div>
                        ) : responsaveisVerificacao.length === 0 ? (
                          <div className='p-2 text-sm text-muted-foreground text-center'>
                            Nenhum responsável encontrado
                          </div>
                        ) : (
                          responsaveisVerificacao
                            .filter(
                              (responsavel) =>
                                responsavel.id && responsavel.id.trim() !== ''
                            )
                            .map((responsavel) => (
                              <SelectItem
                                key={responsavel.id}
                                value={responsavel.id}
                              >
                                {responsavel.nome}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <AddResponsavelDialog
                    type='verificacao'
                    onAdd={(data) => handleAddResponsavel('verificacao', data)}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* 3. Subprojeto */}
        <FormSection
          title='3. Subprojeto'
          description='Seleção do subprojeto relacionado à triagem'
        >
          <FormField
            control={form.control}
            name='subprojectoId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Subprojeto
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <div className='flex items-center gap-2'>
                  <FormControl>
                    <Select
                      disabled={isLoading || isLoadingSubprojectos}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className='bg-white w-full'>
                        <SelectValue placeholder='Seleciona a opção'>
                          {field.value
                            ? getSubprojectoNome(field.value)
                            : 'Seleciona a opção'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingSubprojectos ? (
                          <div className='p-2'>
                            <Skeleton className='h-8 w-full' />
                          </div>
                        ) : subprojectos.length === 0 ? (
                          <div className='p-2 text-sm text-muted-foreground text-center'>
                            Nenhum subprojeto encontrado
                          </div>
                        ) : (
                          subprojectos
                            .filter(
                              (subprojeto) =>
                                subprojeto.id && subprojeto.id.trim() !== ''
                            )
                            .map((subprojeto) => (
                              <SelectItem
                                key={subprojeto.id}
                                value={subprojeto.id}
                              >
                                {subprojeto.nome}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <AddSubprojectoDialog onAdd={handleAddSubprojecto} />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* 4. Identificação de Riscos */}
        <FormSection
          title='4. Identificação de Riscos'
          description='Avalie os riscos ambientais e sociais para cada categoria'
        >
          {isLoadingRecursos ? (
            <div className='space-y-4'>
              <Skeleton className='h-24 w-full' />
              <Skeleton className='h-24 w-full' />
              <Skeleton className='h-24 w-full' />
            </div>
          ) : (
            biodiversidadeRecursos.map((recurso, index) => (
              <Card
                key={recurso.id}
                className='mb-4 border-gray-200 overflow-hidden'
              >
                <CardContent className='pt-6'>
                  <div className='mb-4'>
                    <h4 className='text-base font-medium flex items-center gap-2'>
                      {recurso.reference}
                      <Badge variant='outline' className='font-normal text-xs'>
                        ID: {recurso.id.substring(0, 6)}...
                      </Badge>
                    </h4>
                    <p className='text-sm text-gray-500'>
                      {recurso.description}
                    </p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <FormField
                      control={form.control}
                      name={`identificacaoRiscos.${index}.resposta` as const}
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
                                <SelectItem value='SIM'>Sim</SelectItem>
                                <SelectItem value='NAO'>Não</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`identificacaoRiscos.${index}.comentario` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comentário</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Comentário opcional'
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
                      name={
                        `identificacaoRiscos.${index}.normaAmbientalSocial` as const
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Norma Ambiental Social</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Ex: NAS 1, NAS 2, etc.'
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
                      `identificacaoRiscos.${index}.biodiversidadeRecursosNaturaisId` as const
                    )}
                    value={recurso.id}
                  />
                </CardContent>
              </Card>
            ))
          )}

          {biodiversidadeRecursos.length === 0 && !isLoadingRecursos && (
            <Alert>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>Sem recursos</AlertTitle>
              <AlertDescription>
                Não há recursos de biodiversidade cadastrados para este tenant.
                Adicione recursos no módulo de cadastro de recursos.
              </AlertDescription>
            </Alert>
          )}
        </FormSection>

        {/* 5. Consulta de Engajamento */}
        <FormSection
          title='5. Consulta de Engajamento'
          description='Descrição da consulta e engajamento com as partes interessadas'
        >
          <FormField
            control={form.control}
            name='consultaEngajamento'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consulta de Engajamento</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva a consulta e o engajamento realizado com as partes interessadas'
                    className='min-h-[100px] bg-white'
                    disabled={isLoading}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* 6. Ações Recomendadas */}
        <FormSection
          title='6. Ações Recomendadas'
          description='Ações recomendadas com base na triagem realizada'
        >
          <FormField
            control={form.control}
            name='accoesRecomendadas'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ações Recomendadas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva as ações recomendadas com base na triagem'
                    className='min-h-[100px] bg-white'
                    disabled={isLoading}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* 7. Resultado da Triagem */}
        <FormSection
          title='7. Resultado da Triagem'
          description='Resultado final da triagem ambiental e social'
        >
          <FormField
            control={form.control}
            name='resultadoTriagemId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Resultado da Triagem
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <div className='flex items-center gap-2'>
                  <FormControl>
                    <Select
                      disabled={isLoading || isLoadingResultados}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className='bg-white w-full'>
                        <SelectValue placeholder='Seleciona a opção'>
                          {field.value
                            ? getResultadoTriagem(field.value)
                            : 'Seleciona a opção'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingResultados ? (
                          <div className='p-2'>
                            <Skeleton className='h-8 w-full' />
                          </div>
                        ) : resultadosTriagem.length === 0 ? (
                          <div className='p-2 text-sm text-muted-foreground text-center'>
                            Nenhum resultado de triagem encontrado. Adicione um
                            resultado primeiro.
                          </div>
                        ) : (
                          resultadosTriagem
                            .filter(
                              (resultado) =>
                                resultado.id && resultado.id.trim() !== ''
                            )
                            .map((resultado) => (
                              <SelectItem
                                key={resultado.id}
                                value={resultado.id}
                              >
                                {resultado.categoriaRisco}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <AddResultadoTriagemDialog
                    onAdd={handleAddResultadoTriagem}
                    subprojectos={subprojectos}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Alert className='bg-blue-50 border-blue-200'>
          <Info className='h-4 w-4 text-blue-600' />
          <AlertTitle className='text-blue-600'>Informação</AlertTitle>
          <AlertDescription className='text-blue-700'>
            A triagem ambiental é um processo importante para identificar e
            avaliar os potenciais impactos ambientais e sociais de um projeto. O
            resultado da triagem determina quais instrumentos ambientais serão
            necessários.
          </AlertDescription>
        </Alert>

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
