// components/forms/ficha-registo-queixas-reclamacoes/form.tsx
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
import { CalendarIcon, Plus, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  fichaRegistoQueixasReclamacoesSchema,
  FichaRegistoQueixasReclamacoesFormData,
} from '@/lib/validations/ficha-registo-queixas-reclamacoes';
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
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FichaRegistoQueixasReclamacoesFormProps {
  initialData?: FichaRegistoQueixasReclamacoesFormData;
  onSubmit: (data: FichaRegistoQueixasReclamacoesFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function FichaRegistoQueixasReclamacoesForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: FichaRegistoQueixasReclamacoesFormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  // Reference data states
  const [categoriasQueixas, setCategoriasQueixas] = useState<any[]>([]);
  const [subcategoriasQueixas, setSubcategoriasQueixas] = useState<any[]>([]);
  const [resolucoesQueixas, setResolucoesQueixas] = useState<any[]>([]);
  const [fotosDocumentos, setFotosDocumentos] = useState<any[]>([]);

  // Selected relationships
  const [selectedSubcategorias, setSelectedSubcategorias] = useState<string[]>(
    []
  );
  const [selectedResolucoes, setSelectedResolucoes] = useState<string[]>([]);
  const [selectedFotosDocumentos, setSelectedFotosDocumentos] = useState<
    string[]
  >([]);

  // Command states
  const [commandSubcategoriasOpen, setCommandSubcategoriasOpen] =
    useState(false);
  const [commandResolucoesOpen, setCommandResolucoesOpen] = useState(false);
  const [commandFotosOpen, setCommandFotosOpen] = useState(false);

  // Loading states
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(false);
  const [isLoadingSubcategorias, setIsLoadingSubcategorias] = useState(false);
  const [isLoadingResolucoes, setIsLoadingResolucoes] = useState(false);
  const [isLoadingFotos, setIsLoadingFotos] = useState(false);

  const defaultValues: Partial<FichaRegistoQueixasReclamacoesFormData> = {
    tenantId: currentTenantId || '',
    projectId: currentProjectId || '',
    numeroQueixa: '',
    genero: 'MASCULINO',
    idade: 0,
    celular: '',
    email: '',
    endereco: '',
    quarteirao: '',
    bairro: '',
    localidade: '',
    postoAdministrativo: '',
    distrito: '',
    local: '',
    dataReclamacao: new Date(),
    hora: '',
    breveDescricaoFactos: '',
    queixaAceita: 'SIM',
    subcategoriaQueixaIds: [],
    resolucaoQueixaIds: [],
    fotosDocumentosComprovativoEncerramentoIds: [],
  };

  const form = useForm<FichaRegistoQueixasReclamacoesFormData>({
    resolver: zodResolver(fichaRegistoQueixasReclamacoesSchema),
    defaultValues: initialData || defaultValues,
  });

  // Watch for conditional fields
  const queixaAceita = form.watch('queixaAceita');
  const reclamanteNotificado = form.watch('reclamanteNotificado');
  const metodoNotificacao = form.watch('metodoNotificacao');
  const monitoriaAposEncerramento = form.watch('monitoriaAposEncerramento');
  const selectedCategoriaId = form.watch('categoriaQueixaId');

  // Fetch functions
  const fetchCategoriasQueixas = useCallback(async () => {
    if (!currentTenantId || !currentProjectId) return;

    setIsLoadingCategorias(true);
    try {
      const response = await fetch(
        `/api/categorias-queixas?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );
      if (!response.ok) {
        throw new Error('Falha ao buscar categorias de queixas');
      }
      const data = await response.json();
      setCategoriasQueixas(data);
    } catch (error) {
      console.error('Error fetching categorias queixas:', error);
      toast.error('Erro ao carregar categorias de queixas');
    } finally {
      setIsLoadingCategorias(false);
    }
  }, [currentTenantId, currentProjectId]);

  const fetchSubcategoriasQueixas = useCallback(
    async (categoriaId?: string) => {
      if (!currentTenantId || !currentProjectId) return;

      setIsLoadingSubcategorias(true);
      try {
        const url = categoriaId
          ? `/api/subcategorias-queixas?tenantId=${currentTenantId}&projectId=${currentProjectId}&categoriaId=${categoriaId}`
          : `/api/subcategorias-queixas?tenantId=${currentTenantId}&projectId=${currentProjectId}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Falha ao buscar subcategorias de queixas');
        }
        const data = await response.json();
        setSubcategoriasQueixas(data);
      } catch (error) {
        console.error('Error fetching subcategorias queixas:', error);
        toast.error('Erro ao carregar subcategorias de queixas');
      } finally {
        setIsLoadingSubcategorias(false);
      }
    },
    [currentTenantId, currentProjectId]
  );

  const fetchResolucoesQueixas = useCallback(async () => {
    if (!currentTenantId || !currentProjectId) return;

    setIsLoadingResolucoes(true);
    try {
      const response = await fetch(
        `/api/resolucoes-queixas?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );
      if (!response.ok) {
        throw new Error('Falha ao buscar resoluções de queixas');
      }
      const data = await response.json();
      setResolucoesQueixas(data);
    } catch (error) {
      console.error('Error fetching resolucoes queixas:', error);
      toast.error('Erro ao carregar resoluções de queixas');
    } finally {
      setIsLoadingResolucoes(false);
    }
  }, [currentTenantId, currentProjectId]);

  const fetchFotosDocumentos = useCallback(async () => {
    if (!currentTenantId || !currentProjectId) return;

    setIsLoadingFotos(true);
    try {
      const response = await fetch(
        `/api/fotos-documentos-comprovativo-encerramento?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );
      if (!response.ok) {
        throw new Error('Falha ao buscar fotos e documentos');
      }
      const data = await response.json();
      setFotosDocumentos(data);
    } catch (error) {
      console.error('Error fetching fotos documentos:', error);
      toast.error('Erro ao carregar fotos e documentos');
    } finally {
      setIsLoadingFotos(false);
    }
  }, [currentTenantId, currentProjectId]);

  // Fetch all data on mount
  useEffect(() => {
    fetchCategoriasQueixas();
    fetchResolucoesQueixas();
    fetchFotosDocumentos();
  }, [fetchCategoriasQueixas, fetchResolucoesQueixas, fetchFotosDocumentos]);

  // Fetch subcategorias when categoria changes
  useEffect(() => {
    if (selectedCategoriaId) {
      fetchSubcategoriasQueixas(selectedCategoriaId);
    } else {
      fetchSubcategoriasQueixas();
    }
    // Clear selected subcategorias when categoria changes
    setSelectedSubcategorias([]);
  }, [selectedCategoriaId, fetchSubcategoriasQueixas]);

  // Set selected items when initialData is available
  useEffect(() => {
    if (initialData) {
      if (
        initialData.subcategoriaQueixaIds &&
        Array.isArray(initialData.subcategoriaQueixaIds)
      ) {
        setSelectedSubcategorias(initialData.subcategoriaQueixaIds);
      }
      if (
        initialData.resolucaoQueixaIds &&
        Array.isArray(initialData.resolucaoQueixaIds)
      ) {
        setSelectedResolucoes(initialData.resolucaoQueixaIds);
      }
      if (
        initialData.fotosDocumentosComprovativoEncerramentoIds &&
        Array.isArray(initialData.fotosDocumentosComprovativoEncerramentoIds)
      ) {
        setSelectedFotosDocumentos(
          initialData.fotosDocumentosComprovativoEncerramentoIds
        );
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (currentTenantId && currentProjectId) {
      form.setValue('tenantId', currentTenantId);
      form.setValue('projectId', currentProjectId);
    }
  }, [currentTenantId, currentProjectId, form]);

  const handleSubmit = async (data: FichaRegistoQueixasReclamacoesFormData) => {
    try {
      // Add selected relationships to form data
      data.subcategoriaQueixaIds = selectedSubcategorias;
      data.resolucaoQueixaIds = selectedResolucoes;
      data.fotosDocumentosComprovativoEncerramentoIds = selectedFotosDocumentos;

      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Toggle functions for multi-select
  const toggleSubcategoria = (id: string) => {
    if (selectedSubcategorias.includes(id)) {
      setSelectedSubcategorias(selectedSubcategorias.filter((s) => s !== id));
    } else {
      setSelectedSubcategorias([...selectedSubcategorias, id]);
    }
  };

  const toggleResolucao = (id: string) => {
    if (selectedResolucoes.includes(id)) {
      setSelectedResolucoes(selectedResolucoes.filter((r) => r !== id));
    } else {
      setSelectedResolucoes([...selectedResolucoes, id]);
    }
  };

  const toggleFotoDocumento = (id: string) => {
    if (selectedFotosDocumentos.includes(id)) {
      setSelectedFotosDocumentos(
        selectedFotosDocumentos.filter((f) => f !== id)
      );
    } else {
      setSelectedFotosDocumentos([...selectedFotosDocumentos, id]);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
      <FormSection title='Informações do Reclamante'>
        <FormRow>
          <FormField label='Número da Queixa' required>
            <Controller
              control={form.control}
              name='numeroQueixa'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Digite o número da queixa'
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Nome Completo do Reclamante'>
            <Controller
              control={form.control}
              name='nomeCompletoReclamante'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    value={field.value || ''}
                    className={cn(error && 'border-red-500')}
                    placeholder='Nome completo (opcional)'
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
          <FormField label='Gênero' required>
            <Controller
              control={form.control}
              name='genero'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className={cn(error && 'border-red-500')}>
                      <SelectValue placeholder='Selecione o gênero' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='MASCULINO'>Masculino</SelectItem>
                      <SelectItem value='FEMININO'>Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Idade' required>
            <Controller
              control={form.control}
              name='idade'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    type='number'
                    {...field}
                    value={field.value?.toString() || ''}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    className={cn(error && 'border-red-500')}
                    placeholder='Idade do reclamante'
                    min='1'
                    max='120'
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
          <FormField label='Celular' required>
            <Controller
              control={form.control}
              name='celular'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Número de celular'
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Email' required>
            <Controller
              control={form.control}
              name='email'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    type='email'
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Endereço de email'
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

      <FormSection title='Endereço'>
        <FormRow>
          <FormField label='Endereço' required>
            <Controller
              control={form.control}
              name='endereco'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Endereço completo'
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Quarteirão' required>
            <Controller
              control={form.control}
              name='quarteirao'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Quarteirão'
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
          <FormField label='Bairro' required>
            <Controller
              control={form.control}
              name='bairro'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Bairro'
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Localidade' required>
            <Controller
              control={form.control}
              name='localidade'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Localidade'
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
          <FormField label='Posto Administrativo' required>
            <Controller
              control={form.control}
              name='postoAdministrativo'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Posto Administrativo'
                  />
                  {error && (
                    <p className='text-sm text-red-500'>{error.message}</p>
                  )}
                </div>
              )}
            />
          </FormField>

          <FormField label='Distrito' required>
            <Controller
              control={form.control}
              name='distrito'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Distrito'
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
          <FormField label='Local' required>
            <Controller
              control={form.control}
              name='local'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Local específico'
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

      <FormSection title='Detalhes da Reclamação'>
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

          <FormField label='Hora' required>
            <Controller
              control={form.control}
              name='hora'
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
          <FormField label='Breve Descrição dos Factos' required>
            <Controller
              control={form.control}
              name='breveDescricaoFactos'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Textarea
                    {...field}
                    className={cn(error && 'border-red-500')}
                    placeholder='Descreva brevemente os factos da reclamação'
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

      <FormSection title='Categoria da Queixa'>
        <FormRow>
          <FormField label='Categoria da Queixa'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Label>Categoria Principal</Label>
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
                      <DialogTitle>Adicionar Categoria de Queixa</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const data = {
                          nome: formData.get('nome'),
                        };

                        try {
                          const response = await fetch(
                            `/api/categorias-queixas?tenantId=${currentTenantId}&projectId=${currentProjectId}`,
                            {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(data),
                            }
                          );

                          if (!response.ok)
                            throw new Error('Falha ao adicionar categoria');

                          const newCategoria = await response.json();
                          setCategoriasQueixas([
                            ...categoriasQueixas,
                            newCategoria,
                          ]);
                          toast.success('Categoria adicionada com sucesso');
                          e.currentTarget.reset();
                        } catch (error) {
                          toast.error('Erro ao adicionar categoria');
                        }
                      }}
                      className='space-y-4'
                    >
                      <div className='space-y-2'>
                        <Label htmlFor='nome'>Nome da Categoria</Label>
                        <Input id='nome' name='nome' required />
                      </div>
                      <Button type='submit' className='w-full'>
                        Adicionar
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Controller
                control={form.control}
                name='categoriaQueixaId'
                render={({ field, fieldState: { error } }) => (
                  <div className='space-y-1'>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      disabled={isLoadingCategorias}
                    >
                      <SelectTrigger className={cn(error && 'border-red-500')}>
                        <SelectValue placeholder='Selecione uma categoria' />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriasQueixas.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            {categoria.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {error && (
                      <p className='text-sm text-red-500'>{error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Subcategorias'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Label>Subcategorias da Queixa</Label>
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
                        <DialogTitle>
                          Adicionar Subcategoria de Queixa
                        </DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const data = {
                            nome: formData.get('nome'),
                            categoriaQueixaId: selectedCategoriaId,
                          };

                          if (!selectedCategoriaId) {
                            toast.error('Selecione uma categoria primeiro');
                            return;
                          }

                          try {
                            const response = await fetch(
                              `/api/subcategorias-queixas?tenantId=${currentTenantId}&projectId=${currentProjectId}`,
                              {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(data),
                              }
                            );

                            if (!response.ok)
                              throw new Error(
                                'Falha ao adicionar subcategoria'
                              );

                            const newSubcategoria = await response.json();
                            setSubcategoriasQueixas([
                              ...subcategoriasQueixas,
                              newSubcategoria,
                            ]);
                            toast.success(
                              'Subcategoria adicionada com sucesso'
                            );
                            e.currentTarget.reset();
                          } catch (error) {
                            toast.error('Erro ao adicionar subcategoria');
                          }
                        }}
                        className='space-y-4'
                      >
                        <div className='space-y-2'>
                          <Label htmlFor='nome'>Nome da Subcategoria</Label>
                          <Input id='nome' name='nome' required />
                        </div>
                        <Button
                          type='submit'
                          className='w-full'
                          disabled={!selectedCategoriaId}
                        >
                          Adicionar
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setCommandSubcategoriasOpen(true)}
                    disabled={!selectedCategoriaId}
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Selecionar Subcategoria
                  </Button>
                </div>
              </div>

              <div className='flex flex-wrap gap-2'>
                {selectedSubcategorias.map((id) => {
                  const subcategoria = subcategoriasQueixas.find(
                    (s) => s.id === id
                  );
                  return (
                    <Badge
                      key={id}
                      variant='secondary'
                      className='flex items-center gap-1'
                    >
                      {subcategoria?.nome}
                      <button
                        type='button'
                        onClick={() => toggleSubcategoria(id)}
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
                  commandSubcategoriasOpen ? 'block' : 'hidden'
                )}
              >
                <CommandInput placeholder='Buscar subcategoria...' />
                <CommandList>
                  <CommandEmpty>Nenhuma subcategoria encontrada.</CommandEmpty>
                  <CommandGroup>
                    {subcategoriasQueixas.map((subcategoria) => (
                      <CommandItem
                        key={subcategoria.id}
                        onSelect={() => {
                          toggleSubcategoria(subcategoria.id);
                          setCommandSubcategoriasOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedSubcategorias.includes(subcategoria.id)
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {subcategoria.nome}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </FormField>
        </FormRow>
      </FormSection>

      <FormSection title='Aceitação da Queixa'>
        <FormRow>
          <FormField label='Queixa Aceita?' required>
            <Controller
              control={form.control}
              name='queixaAceita'
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

          {queixaAceita === 'NAO' && (
            <FormField label='Justificativa para Rejeição' required>
              <Controller
                control={form.control}
                name='justificativaParaRejeicao'
                render={({ field, fieldState: { error } }) => (
                  <div className='space-y-1'>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      className={cn(error && 'border-red-500')}
                      placeholder='Explique por que a queixa foi rejeitada'
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

      <FormSection title='Notificação do Reclamante'>
        <FormRow>
          <FormField label='Reclamante Notificado?'>
            <Controller
              control={form.control}
              name='reclamanteNotificado'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
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

          {reclamanteNotificado === 'SIM' && (
            <FormField label='Método de Notificação'>
              <Controller
                control={form.control}
                name='metodoNotificacao'
                render={({ field, fieldState: { error } }) => (
                  <div className='space-y-1'>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <SelectTrigger className={cn(error && 'border-red-500')}>
                        <SelectValue placeholder='Selecione o método' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='CARTA'>Carta</SelectItem>
                        <SelectItem value='EMAIL'>Email</SelectItem>
                        <SelectItem value='WHATSAPP'>WhatsApp</SelectItem>
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
          )}
        </FormRow>

        {metodoNotificacao === 'OUTRO' && (
          <FormRow>
            <FormField label='Especificar Outro Método'>
              <Controller
                control={form.control}
                name='outroMetodoNotificacao'
                render={({ field, fieldState: { error } }) => (
                  <div className='space-y-1'>
                    <Input
                      {...field}
                      value={field.value || ''}
                      className={cn(error && 'border-red-500')}
                      placeholder='Especifique o método utilizado'
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

      <FormSection title='Investigação e Resolução'>
        <FormRow>
          <FormField label='Descrição dos Factos Após Investigação'>
            <Controller
              control={form.control}
              name='descricao_factos_apos_investigacao'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    className={cn(error && 'border-red-500')}
                    placeholder='Descreva os factos após a investigação'
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
        </FormRow>
      </FormSection>

      <FormSection title='Resoluções'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label>Resoluções da Queixa</Label>
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
                    <DialogTitle>Adicionar Resolução de Queixa</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = {
                        accao_correctiva: formData.get('accao_correctiva'),
                        responsavel: formData.get('responsavel'),
                        prazo: formData.get('prazo'),
                        estado: formData.get('estado'),
                      };

                      try {
                        const response = await fetch(
                          `/api/resolucoes-queixas?tenantId=${currentTenantId}&projectId=${currentProjectId}`,
                          {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data),
                          }
                        );

                        if (!response.ok)
                          throw new Error('Falha ao adicionar resolução');

                        const newResolucao = await response.json();
                        setResolucoesQueixas([
                          ...resolucoesQueixas,
                          newResolucao,
                        ]);
                        toast.success('Resolução adicionada com sucesso');
                        e.currentTarget.reset();
                      } catch (error) {
                        toast.error('Erro ao adicionar resolução');
                      }
                    }}
                    className='space-y-4'
                  >
                    <div className='space-y-2'>
                      <Label htmlFor='accao_correctiva'>Ação Corretiva</Label>
                      <Textarea
                        id='accao_correctiva'
                        name='accao_correctiva'
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='responsavel'>Responsável</Label>
                      <Input id='responsavel' name='responsavel' required />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='prazo'>Prazo</Label>
                      <Input id='prazo' name='prazo' required />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='estado'>Estado</Label>
                      <Input id='estado' name='estado' required />
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
                onClick={() => setCommandResolucoesOpen(true)}
              >
                <Plus className='mr-2 h-4 w-4' />
                Selecionar Resolução
              </Button>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {selectedResolucoes.map((id) => {
              const resolucao = resolucoesQueixas.find((r) => r.id === id);
              return (
                <Badge
                  key={id}
                  variant='secondary'
                  className='flex items-center gap-1'
                >
                  {resolucao?.accao_correctiva}
                  <button
                    type='button'
                    onClick={() => toggleResolucao(id)}
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
              commandResolucoesOpen ? 'block' : 'hidden'
            )}
          >
            <CommandInput placeholder='Buscar resolução...' />
            <CommandList>
              <CommandEmpty>Nenhuma resolução encontrada.</CommandEmpty>
              <CommandGroup>
                {resolucoesQueixas.map((resolucao) => (
                  <CommandItem
                    key={resolucao.id}
                    onSelect={() => {
                      toggleResolucao(resolucao.id);
                      setCommandResolucoesOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedResolucoes.includes(resolucao.id)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {resolucao.accao_correctiva}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </FormSection>

      <FormSection title='Encerramento'>
        <FormRow>
          <FormField label='Reclamante Notificado Sobre Encerramento?'>
            <Controller
              control={form.control}
              name='reclamanteNotificadoSobreEncerramento'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
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

          <FormField label='Reclamante Satisfeito?'>
            <Controller
              control={form.control}
              name='reclamanteSatisfeito'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
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
          <FormField label='Recursos Gastos na Reparação da Reclamação'>
            <Controller
              control={form.control}
              name='recursosGastosReparacaoReclamacao'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    className={cn(error && 'border-red-500')}
                    placeholder='Descreva os recursos utilizados'
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
          <FormField label='Data de Encerramento da Reclamação'>
            <Controller
              control={form.control}
              name='dataEncerramentoReclamacao'
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

          <FormField label='Dias Desde Queixa ao Encerramento'>
            <Controller
              control={form.control}
              name='diasDesdeQueixaAoEncerramento'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    type='number'
                    {...field}
                    value={field.value?.toString() || ''}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || null)
                    }
                    className={cn(error && 'border-red-500')}
                    placeholder='Número de dias'
                    min='0'
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

      <FormSection title='Fotos e Documentos Comprobativos'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label>Fotos e Documentos de Encerramento</Label>
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
                    <DialogTitle>Adicionar Foto/Documento</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const file = formData.get('foto') as File;

                      if (!file || file.size === 0) {
                        toast.error('Por favor, selecione um arquivo');
                        return;
                      }

                      try {
                        toast.info('Enviando arquivo...');

                        // Create FormData for upload
                        const uploadFormData = new FormData();
                        uploadFormData.append('file', file);

                        // Upload using dedicated API route that leverages your S3 services
                        const response = await fetch(
                          `/api/upload/ficha-registo-queixas?tenantId=${currentTenantId}&projectId=${currentProjectId}`,
                          {
                            method: 'POST',
                            body: uploadFormData,
                          }
                        );

                        if (!response.ok) {
                          const errorData = await response
                            .json()
                            .catch(() => ({}));

                          // Handle fallback to local storage if AWS not configured
                          if (errorData.fallback) {
                            toast.warning(errorData.error);
                            // Could implement local upload fallback here if needed
                            return;
                          }

                          throw new Error(
                            errorData.error ||
                              'Falha ao fazer upload do arquivo'
                          );
                        }

                        const newFotoDocumento = await response.json();
                        setFotosDocumentos([
                          ...fotosDocumentos,
                          newFotoDocumento,
                        ]);
                        toast.success('Foto/documento adicionado com sucesso');
                        e.currentTarget.reset();
                      } catch (error) {
                        console.error('Error uploading file:', error);

                        // Handle specific errors
                        if (error instanceof Error) {
                          if (
                            error.message.includes('AWS credentials') ||
                            error.message.includes('Configuração')
                          ) {
                            toast.error(
                              'Serviço de upload não disponível. Contacte o administrador.'
                            );
                          } else if (
                            error.message.includes('Arquivo muito grande')
                          ) {
                            toast.error(
                              'Arquivo muito grande. Tamanho máximo: 5MB'
                            );
                          } else if (error.message.includes('Formato')) {
                            toast.error('Formato de arquivo não suportado');
                          } else {
                            toast.error(error.message);
                          }
                        } else {
                          toast.error('Erro ao adicionar foto/documento');
                        }
                      }
                    }}
                    className='space-y-4'
                  >
                    <div className='space-y-2'>
                      <Label htmlFor='foto'>Foto/Documento</Label>
                      <Input
                        id='foto'
                        name='foto'
                        type='file'
                        accept='image/*,.pdf,.doc,.docx'
                        required
                        className='cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80'
                      />
                      <p className='text-sm text-muted-foreground'>
                        Formatos aceitos: JPG, PNG, GIF, PDF, DOC, DOCX.
                        <br />
                        Tamanho máximo: 5MB
                      </p>
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
                onClick={() => setCommandFotosOpen(true)}
              >
                <Plus className='mr-2 h-4 w-4' />
                Selecionar Arquivo
              </Button>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {selectedFotosDocumentos.map((id) => {
              const fotoDoc = fotosDocumentos.find((f) => f.id === id);
              if (!fotoDoc) return null;

              // Extract filename from URL or use a default
              const fileName =
                fotoDoc.fileName || fotoDoc.foto.split('/').pop() || 'Arquivo';

              // Get file extension for icon display
              const extension = fileName.split('.').pop()?.toLowerCase() || '';
              const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
              const isPdf = extension === 'pdf';
              const isDoc = ['doc', 'docx'].includes(extension);

              return (
                <Badge
                  key={id}
                  variant='secondary'
                  className='flex items-center gap-2 max-w-xs'
                >
                  <div className='flex items-center gap-1'>
                    {isImage && '🖼️'}
                    {isPdf && '📄'}
                    {isDoc && '📝'}
                    {!isImage && !isPdf && !isDoc && '📎'}
                    <span
                      className='truncate text-xs max-w-24'
                      title={fileName}
                    >
                      {fileName}
                    </span>
                  </div>
                  <button
                    type='button'
                    onClick={() => toggleFotoDocumento(id)}
                    className='ml-1 rounded-full p-1 hover:bg-gray-200'
                    title='Remover arquivo'
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
              commandFotosOpen ? 'block' : 'hidden'
            )}
          >
            <CommandInput placeholder='Buscar arquivo...' />
            <CommandList>
              <CommandEmpty>Nenhum arquivo encontrado.</CommandEmpty>
              <CommandGroup>
                {fotosDocumentos.map((fotoDoc) => {
                  const fileName =
                    fotoDoc.fileName ||
                    fotoDoc.foto.split('/').pop() ||
                    'Arquivo';

                  const extension =
                    fileName.split('.').pop()?.toLowerCase() || '';
                  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(
                    extension
                  );
                  const isPdf = extension === 'pdf';
                  const isDoc = ['doc', 'docx'].includes(extension);

                  return (
                    <CommandItem
                      key={fotoDoc.id}
                      onSelect={() => {
                        toggleFotoDocumento(fotoDoc.id);
                        setCommandFotosOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedFotosDocumentos.includes(fotoDoc.id)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      <div className='flex items-center gap-2'>
                        {isImage && '🖼️'}
                        {isPdf && '📄'}
                        {isDoc && '📝'}
                        {!isImage && !isPdf && !isDoc && '📎'}
                        <span className='truncate'>{fileName}</span>
                        {fotoDoc.fileSize && (
                          <span className='text-xs text-muted-foreground'>
                            ({Math.round(fotoDoc.fileSize / 1024)}KB)
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </FormSection>

      <FormSection title='Monitoria Pós-Encerramento'>
        <FormRow>
          <FormField label='Monitoria Após Encerramento?'>
            <Controller
              control={form.control}
              name='monitoriaAposEncerramento'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
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

        {monitoriaAposEncerramento === 'SIM' && (
          <>
            <FormRow>
              <FormField label='Ação de Monitoria Após Encerramento'>
                <Controller
                  control={form.control}
                  name='accaoMonitoriaAposEncerramento'
                  render={({ field, fieldState: { error } }) => (
                    <div className='space-y-1'>
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        className={cn(error && 'border-red-500')}
                        placeholder='Descreva a ação de monitoria'
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
              <FormField label='Responsável pela Monitoria'>
                <Controller
                  control={form.control}
                  name='responsavelMonitoriaAposEncerramento'
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

              <FormField label='Prazo da Monitoria'>
                <Controller
                  control={form.control}
                  name='prazoMonitoriaAposEncerramento'
                  render={({ field, fieldState: { error } }) => (
                    <div className='space-y-1'>
                      <Input
                        {...field}
                        value={field.value || ''}
                        className={cn(error && 'border-red-500')}
                        placeholder='Prazo para monitoria'
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
              <FormField label='Estado da Monitoria'>
                <Controller
                  control={form.control}
                  name='estadoMonitoriaAposEncerramento'
                  render={({ field, fieldState: { error } }) => (
                    <div className='space-y-1'>
                      <Input
                        {...field}
                        value={field.value || ''}
                        className={cn(error && 'border-red-500')}
                        placeholder='Estado atual da monitoria'
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

      <FormSection title='Ações Preventivas'>
        <FormRow>
          <FormField label='Ações Preventivas Sugeridas'>
            <Controller
              control={form.control}
              name='accoesPreventivasSugeridas'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    className={cn(error && 'border-red-500')}
                    placeholder='Descreva as ações preventivas sugeridas'
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

        <FormRow>
          <FormField label='Responsável pelas Ações Preventivas'>
            <Controller
              control={form.control}
              name='responsavelAccoesPreventivasSugeridas'
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

          <FormField label='Prazo das Ações Preventivas'>
            <Controller
              control={form.control}
              name='prazoAccoesPreventivasSugeridas'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    value={field.value || ''}
                    className={cn(error && 'border-red-500')}
                    placeholder='Prazo para implementação'
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
          <FormField label='Estado das Ações Preventivas'>
            <Controller
              control={form.control}
              name='estadoAccoesPreventivasSugeridas'
              render={({ field, fieldState: { error } }) => (
                <div className='space-y-1'>
                  <Input
                    {...field}
                    value={field.value || ''}
                    className={cn(error && 'border-red-500')}
                    placeholder='Estado atual das ações'
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

      <FormActions
        submitLabel='Salvar'
        onCancel={onCancel}
        isSubmitting={isLoading}
      />
    </form>
  );
}
