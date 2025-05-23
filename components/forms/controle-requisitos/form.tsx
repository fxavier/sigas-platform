'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Upload, X, Info } from 'lucide-react';
import { FormSection } from '../form-section';
import { FormRow } from '../form-row';
import { FormField } from '../form-field';
import { FormActions } from '../form-actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField as FormFieldComponent,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  controleRequisitosSchema,
  type ControleRequisitosFormData,
} from '@/lib/validations/controle-requisitos';
import { uploadFileToS3 } from '@/lib/upload-service';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';

interface FormProps {
  initialData?: any;
  onSubmit: (data: ControleRequisitosFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ControleRequisitosForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: FormProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dataControleOpen, setDataControleOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  const form = useForm<ControleRequisitosFormData>({
    resolver: zodResolver(controleRequisitosSchema),
    defaultValues: {
      id: initialData?.id,
      tenantId: initialData?.tenantId || currentTenantId || '',
      projectId: initialData?.projectId || currentProjectId || '',
      numnumero: initialData?.numnumero || '',
      tituloDocumento: initialData?.tituloDocumento || '',
      descricao: initialData?.descricao
        ? new Date(initialData.descricao)
        : new Date(),
      revocacoesAlteracoes: initialData?.revocacoesAlteracoes || '',
      requisitoConformidade: initialData?.requisitoConformidade || '',
      dataControle: initialData?.dataControle
        ? new Date(initialData.dataControle)
        : new Date(),
      observation: initialData?.observation || '',
      ficheiroDaLei: initialData?.ficheiroDaLei || '',
    },
  });

  // Update form with tenant and project ID when they change
  useEffect(() => {
    if (currentTenantId) {
      form.setValue('tenantId', currentTenantId);
    }
    if (currentProjectId) {
      form.setValue('projectId', currentProjectId);
    }
  }, [currentTenantId, currentProjectId, form]);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const fileUrl = await uploadFileToS3(file);
      form.setValue('ficheiroDaLei', fileUrl);
      toast.success('Arquivo enviado com sucesso');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao enviar arquivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const removeFile = () => {
    form.setValue('ficheiroDaLei', '');
  };

  const onFormSubmit = async (data: ControleRequisitosFormData) => {
    if (!currentTenantId || !currentProjectId) {
      toast.error('Tenant e Projeto são obrigatórios');
      return;
    }

    try {
      // Ensure data has current tenant and project IDs
      const submissionData = {
        ...data,
        tenantId: currentTenantId,
        projectId: currentProjectId,
      };

      await onSubmit(submissionData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erro ao enviar formulário');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className='space-y-8'>
        {(!currentTenantId || !currentProjectId) && (
          <Alert variant='destructive'>
            <Info className='h-4 w-4' />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              É necessário selecionar um projeto para continuar.
            </AlertDescription>
          </Alert>
        )}

        <FormSection
          title='Informações do Requisito Legal'
          description='Informe os detalhes do requisito legal a ser controlado'
        >
          <FormRow>
            <FormFieldComponent
              control={form.control}
              name='numnumero'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Número
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading || isUploading}
                      placeholder='Ex: DL-54/2015'
                      className='bg-white'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormFieldComponent
              control={form.control}
              name='tituloDocumento'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título do Documento
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading || isUploading}
                      placeholder='Ex: Regulamento sobre o Processo de Avaliação de Impacto Ambiental'
                      className='bg-white'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          <FormFieldComponent
            control={form.control}
            name='descricao'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Data de Publicação
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal bg-white',
                          !field.value && 'text-muted-foreground'
                        )}
                        disabled={isLoading || isUploading}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date);
                            setCalendarOpen(false);
                          }
                        }}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Alert className='bg-blue-50 border-blue-200'>
            <Info className='h-4 w-4 text-blue-600' />
            <AlertTitle className='text-blue-600'>Informação</AlertTitle>
            <AlertDescription className='text-blue-700'>
              O controle de requisitos legais é uma parte fundamental do Sistema
              de Gestão Ambiental e Social (ESMS). Mantenha os requisitos
              atualizados para garantir a conformidade do projeto.
            </AlertDescription>
          </Alert>

          <FormFieldComponent
            control={form.control}
            name='revocacoesAlteracoes'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Revogações/Alterações</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    disabled={isLoading || isUploading}
                    placeholder='Indique quaisquer revogações ou alterações ao documento legal'
                    className='min-h-[80px] bg-white'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormFieldComponent
            control={form.control}
            name='requisitoConformidade'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requisito de Conformidade</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    disabled={isLoading || isUploading}
                    placeholder='Especifique os requisitos de conformidade que se aplicam ao projeto'
                    className='min-h-[100px] bg-white'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title='Controle e Documentação'
          description='Informações para acompanhamento e verificação de conformidade'
        >
          <FormFieldComponent
            control={form.control}
            name='dataControle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Data de Controle
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Popover
                    open={dataControleOpen}
                    onOpenChange={setDataControleOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal bg-white',
                          !field.value && 'text-muted-foreground'
                        )}
                        disabled={isLoading || isUploading}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date);
                            setDataControleOpen(false);
                          }
                        }}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormFieldComponent
            control={form.control}
            name='observation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    disabled={isLoading || isUploading}
                    placeholder='Observações adicionais sobre o requisito legal ou sua aplicação'
                    className='min-h-[80px] bg-white'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormFieldComponent
            control={form.control}
            name='ficheiroDaLei'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arquivo da Lei</FormLabel>
                <FormControl>
                  <div className='flex flex-col gap-2'>
                    {field.value ? (
                      <div className='flex items-center gap-2 bg-white p-2 rounded border'>
                        <div className='flex-1 overflow-hidden'>
                          <a
                            href={field.value}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-sm text-blue-600 hover:underline flex items-center gap-2'
                          >
                            <div className='flex-shrink-0'>
                              <Upload className='h-4 w-4' />
                            </div>
                            <span className='truncate'>
                              {field.value.split('/').pop()}
                            </span>
                          </a>
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={removeFile}
                          disabled={isLoading || isUploading}
                          className='flex-shrink-0'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <Input
                          type='file'
                          onChange={handleFileChange}
                          disabled={isLoading || isUploading}
                          className='w-full bg-white'
                          accept='.pdf,.doc,.docx,.xls,.xlsx'
                        />
                      </div>
                    )}
                    <p className='text-xs text-gray-500'>
                      Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX. Tamanho
                      máximo: 10MB
                    </p>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormActions
          isSubmitting={isLoading || isUploading}
          onCancel={onCancel}
          submitLabel={initialData?.id ? 'Atualizar' : 'Criar'}
          className='sticky bottom-0 py-4 px-6 bg-white border-t border-gray-200 -mx-6 mt-8'
        />
      </form>
    </Form>
  );
}
