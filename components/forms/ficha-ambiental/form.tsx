// components/forms/ficha-ambiental/form.tsx
'use client';

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
import { CustomSelect } from '@/components/ui/custom-select';
import {
  fichaInformacaoAmbientalSchema,
  FichaInformacaoAmbientalFormValues,
  TipoAtividadeEnum,
  MeioInsercaoEnum,
  EnquadramentoOrcamentoTerritorialEnum,
  ProvinciasEnum,
  CaracteristicasFisicasEnum,
  EcossistemasEnum,
  LocationZoneEnum,
  VegetacaoEnum,
  UsoSoloEnum,
} from '@/lib/validations/ficha-ambiental';

interface FichaAmbientalFormProps {
  initialData?: any;
  onSubmit: (data: FichaInformacaoAmbientalFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function FichaAmbientalForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: FichaAmbientalFormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  const form = useForm<FichaInformacaoAmbientalFormValues>({
    resolver: zodResolver(fichaInformacaoAmbientalSchema),
    defaultValues: {
      id: initialData?.id,
      tenantId: currentTenantId || '',
      projectId: currentProjectId || '',

      // Activity information
      nomeActividade: initialData?.nomeActividade || '',
      tipoActividade: initialData?.tipoActividade || 'TURISTICA',
      proponentes: initialData?.proponentes || '',

      // Contact information
      endereco: initialData?.endereco || '',
      telefone: initialData?.telefone || '',
      fax: initialData?.fax || '',
      telemovel: initialData?.telemovel || '',
      email: initialData?.email || '',

      // Location information
      bairroActividade: initialData?.bairroActividade || '',
      vilaActividade: initialData?.vilaActividade || '',
      cidadeActividade: initialData?.cidadeActividade || '',
      localidadeActividade: initialData?.localidadeActividade || '',
      distritoActividade: initialData?.distritoActividade || '',
      provinciaActividade: initialData?.provinciaActividade || 'MAPUTO',
      coordenadasGeograficas: initialData?.coordenadasGeograficas || '',

      // Environmental context
      meioInsercao: initialData?.meioInsercao || 'URBANO',
      enquadramentoOrcamentoTerritorial:
        initialData?.enquadramentoOrcamentoTerritorial || 'ESPACO_HABITACIONAL',

      // Activity description
      descricaoActividade: initialData?.descricaoActividade || '',
      actividadesAssociadas: initialData?.actividadesAssociadas || '',
      descricaoTecnologiaConstrucaoOperacao:
        initialData?.descricaoTecnologiaConstrucaoOperacao || '',
      actividadesComplementaresPrincipais:
        initialData?.actividadesComplementaresPrincipais || '',

      // Resources and materials
      tipoQuantidadeOrigemMaoDeObra:
        initialData?.tipoQuantidadeOrigemMaoDeObra || '',
      tipoQuantidadeOrigemProvenienciaMateriasPrimas:
        initialData?.tipoQuantidadeOrigemProvenienciaMateriasPrimas || '',
      quimicosUtilizados: initialData?.quimicosUtilizados || '',
      tipoOrigemConsumoAguaEnergia:
        initialData?.tipoOrigemConsumoAguaEnergia || '',
      origemCombustiveisLubrificantes:
        initialData?.origemCombustiveisLubrificantes || '',
      outrosRecursosNecessarios: initialData?.outrosRecursosNecessarios || '',

      // Land and locations
      posseDeTerra: initialData?.posseDeTerra || '',
      alternativasLocalizacaoActividade:
        initialData?.alternativasLocalizacaoActividade || '',

      // Environmental situation
      descricaoBreveSituacaoAmbientalReferenciaLocalRegional:
        initialData?.descricaoBreveSituacaoAmbientalReferenciaLocalRegional ||
        '',
      caracteristicasFisicasLocalActividade:
        initialData?.caracteristicasFisicasLocalActividade || null,
      ecosistemasPredominantes: initialData?.ecosistemasPredominantes || null,
      zonaLocalizacao: initialData?.zonaLocalizacao || null,
      tipoVegetacaoPredominante: initialData?.tipoVegetacaoPredominante || null,
      usoSolo: initialData?.usoSolo || null,

      // Infrastructure and complementary information
      infraestruturaExistenteAreaActividade:
        initialData?.infraestruturaExistenteAreaActividade || '',
      informacaoComplementarAtravesMaps:
        initialData?.informacaoComplementarAtravesMaps || '',

      // Investment value
      valorTotalInvestimento: initialData?.valorTotalInvestimento || null,
    },
  });

  // Helper function to translate enum values for display
  const translateEnum = (enumValue: string, type: string): string => {
    const translations: Record<string, Record<string, string>> = {
      tipoActividade: {
        TURISTICA: 'Turística',
        INDUSTRIAL: 'Industrial',
        AGRO_PECUARIA: 'Agro-Pecuária',
        ENERGETICA: 'Energética',
        SERVICOS: 'Serviços',
        OUTRA: 'Outra',
      },
      meioInsercao: {
        RURAL: 'Rural',
        URBANO: 'Urbano',
        PERIURBANO: 'Periurbano',
      },
      enquadramentoOrcamentoTerritorial: {
        ESPACO_HABITACIONAL: 'Espaço Habitacional',
        INDUSTRIAL: 'Industrial',
        SERVICOS: 'Serviços',
        OUTRO: 'Outro',
      },
      provincia: {
        MAPUTO: 'Maputo',
        MAPUTO_CIDADE: 'Maputo Cidade',
        GAZA: 'Gaza',
        INHAMBANE: 'Inhambane',
        SOFALA: 'Sofala',
        MANICA: 'Manica',
        TETE: 'Tete',
        ZAMBEZIA: 'Zambézia',
        NAMPULA: 'Nampula',
        CABO_DELGADO: 'Cabo Delgado',
        NIASSA: 'Niassa',
      },
      caracteristicasFisicas: {
        PLANICIE: 'Planície',
        PLANALTO: 'Planalto',
        VALE: 'Vale',
        MONTANHA: 'Montanha',
      },
      ecossistemas: {
        FLUVIAL: 'Fluvial',
        LACUSTRE: 'Lacustre',
        MARINHO: 'Marinho',
        TERRESTRE: 'Terrestre',
      },
      zonaLocalizacao: {
        COSTEIRA: 'Costeira',
        INTERIOR: 'Interior',
        ILHA: 'Ilha',
      },
      vegetacao: {
        FLORESTA: 'Floresta',
        SAVANA: 'Savana',
        OUTRO: 'Outro',
      },
      usoSolo: {
        AGROPECUARIO: 'Agropecuário',
        HABITACIONAL: 'Habitacional',
        INDUSTRIAL: 'Industrial',
        PROTECCAO: 'Proteção',
        OUTRO: 'Outro',
      },
    };

    return translations[type]?.[enumValue] || enumValue;
  };

  // Handle form submission
  const handleFormSubmit = async (data: FichaInformacaoAmbientalFormValues) => {
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
      console.error('Error submitting form:', error);
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

        {/* Activity Information Section */}
        <FormSection
          title='Informações da Actividade'
          description='Dados básicos sobre a actividade e proponente'
        >
          <FormRow>
            <FormField
              control={form.control}
              name='nomeActividade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome da Actividade
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ex: Construção de Hotel'
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
              name='tipoActividade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tipo de Actividade
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
                        {Object.values(TipoAtividadeEnum.Values).map(
                          (value) => (
                            <SelectItem key={value} value={value}>
                              {translateEnum(value, 'tipoActividade')}
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

          <FormField
            control={form.control}
            name='proponentes'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proponentes</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Nomes dos proponentes'
                    {...field}
                    value={field.value || ''}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Contact Information Section */}
        <FormSection
          title='Informações de Contacto'
          description='Dados para contacto e comunicação'
        >
          <FormField
            control={form.control}
            name='endereco'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Endereço
                  <span className='text-destructive ml-1'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Endereço completo'
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
              name='telefone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Número de telefone'
                      {...field}
                      value={field.value || ''}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='telemovel'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telemóvel</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Número de telemóvel'
                      {...field}
                      value={field.value || ''}
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
              name='fax'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fax</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Número de fax'
                      {...field}
                      value={field.value || ''}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='Email de contacto'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>
        </FormSection>

        {/* Location Information Section */}
        <FormSection
          title='Localização da Actividade'
          description='Informações sobre a localização da actividade'
        >
          <FormRow>
            <FormField
              control={form.control}
              name='bairroActividade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Bairro
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Bairro'
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
              name='vilaActividade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Vila/Posto Administrativo
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Vila ou Posto Administrativo'
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
              name='cidadeActividade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Cidade
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Cidade'
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
              name='localidadeActividade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localidade</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Localidade'
                      {...field}
                      value={field.value || ''}
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
              name='distritoActividade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distrito</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Distrito'
                      {...field}
                      value={field.value || ''}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='provinciaActividade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Província
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
                        {Object.values(ProvinciasEnum.Values).map((value) => (
                          <SelectItem key={value} value={value}>
                            {translateEnum(value, 'provincia')}
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

          <FormField
            control={form.control}
            name='coordenadasGeograficas'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coordenadas Geográficas</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Ex: Latitude, Longitude'
                    {...field}
                    value={field.value || ''}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Preencha as coordenadas no formato Latitude, Longitude (Ex:
                  -25.9692, 32.5732)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormRow>
            <FormField
              control={form.control}
              name='meioInsercao'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Meio de Inserção
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
                        {Object.values(MeioInsercaoEnum.Values).map((value) => (
                          <SelectItem key={value} value={value}>
                            {translateEnum(value, 'meioInsercao')}
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
              name='enquadramentoOrcamentoTerritorial'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Enquadramento no Ordenamento Territorial
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
                          EnquadramentoOrcamentoTerritorialEnum.Values
                        ).map((value) => (
                          <SelectItem key={value} value={value}>
                            {translateEnum(
                              value,
                              'enquadramentoOrcamentoTerritorial'
                            )}
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
        </FormSection>

        {/* Activity Description Section */}
        <FormSection
          title='Descrição da Actividade'
          description='Informações detalhadas sobre a actividade'
        >
          <FormField
            control={form.control}
            name='descricaoActividade'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição da Actividade</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva a actividade em detalhes'
                    className='min-h-[100px]'
                    {...field}
                    value={field.value || ''}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='actividadesAssociadas'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actividades Associadas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva as actividades associadas'
                    className='min-h-[80px]'
                    {...field}
                    value={field.value || ''}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='descricaoTecnologiaConstrucaoOperacao'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Descrição da Tecnologia de Construção/Operação
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva as tecnologias utilizadas'
                    className='min-h-[80px]'
                    {...field}
                    value={field.value || ''}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='actividadesComplementaresPrincipais'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actividades Complementares Principais</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva as actividades complementares principais'
                    className='min-h-[80px]'
                    {...field}
                    value={field.value || ''}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Resources and Materials Section */}
        <FormSection
          title='Recursos e Materiais'
          description='Informações sobre recursos e materiais utilizados'
        >
          <FormField
            control={form.control}
            name='tipoQuantidadeOrigemMaoDeObra'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo, Quantidade e Origem da Mão de Obra</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva a mão de obra que será utilizada'
                    className='min-h-[80px]'
                    {...field}
                    value={field.value || ''}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='tipoQuantidadeOrigemProvenienciaMateriasPrimas'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tipo, Quantidade, Origem e Proveniência de Matérias-Primas
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva as matérias-primas utilizadas'
                    className='min-h-[80px]'
                    {...field}
                    value={field.value || ''}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='quimicosUtilizados'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Produtos Químicos Utilizados</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Liste os produtos químicos utilizados, se aplicável'
                    className='min-h-[80px]'
                    {...field}
                    value={field.value || ''}
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
              name='tipoOrigemConsumoAguaEnergia'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tipo e Origem do Consumo de Água e Energia
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Descreva o consumo de água e energia'
                      className='min-h-[80px]'
                      {...field}
                      value={field.value || ''}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='origemCombustiveisLubrificantes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origem dos Combustíveis e Lubrificantes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Descreva a origem dos combustíveis e lubrificantes'
                      className='min-h-[80px]'
                      {...field}
                      value={field.value || ''}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          <FormField
            control={form.control}
            name='outrosRecursosNecessarios'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outros Recursos Necessários</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva outros recursos necessários'
                    className='min-h-[80px]'
                    {...field}
                    value={field.value || ''}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Land and Locations Section */}
        <FormSection
          title='Posse de Terra e Alternativas de Localização'
          description='Informações sobre posse de terra e alternativas de localização'
        >
          <FormRow>
            <FormField
              control={form.control}
              name='posseDeTerra'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posse de Terra</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Descreva a situação da posse de terra'
                      className='min-h-[80px]'
                      {...field}
                      value={field.value || ''}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='alternativasLocalizacaoActividade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Alternativas de Localização da Actividade
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Descreva alternativas de localização consideradas'
                      className='min-h-[80px]'
                      {...field}
                      value={field.value || ''}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>
        </FormSection>

        {/* Environmental Situation Section */}
        <FormSection
          title='Situação Ambiental'
          description='Informações sobre a situação ambiental de referência'
        >
          <FormField
            control={form.control}
            name='descricaoBreveSituacaoAmbientalReferenciaLocalRegional'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Descrição Breve da Situação Ambiental de Referência
                  Local/Regional
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva a situação ambiental de referência'
                    className='min-h-[100px]'
                    {...field}
                    value={field.value || ''}
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
              name='caracteristicasFisicasLocalActividade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Características Físicas do Local da Actividade
                  </FormLabel>
                  <FormControl>
                    <CustomSelect
                      value={field.value || null}
                      onValueChange={field.onChange}
                      placeholder='Selecione as características físicas'
                      options={Object.values(
                        CaracteristicasFisicasEnum.Values
                      ).map((value) => ({
                        value,
                        label: translateEnum(value, 'caracteristicasFisicas'),
                      }))}
                      disabled={isLoading}
                      allowClear={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='ecosistemasPredominantes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ecossistemas Predominantes</FormLabel>
                  <FormControl>
                    <CustomSelect
                      value={field.value || null}
                      onValueChange={field.onChange}
                      placeholder='Selecione os ecossistemas predominantes'
                      options={Object.values(EcossistemasEnum.Values).map(
                        (value) => ({
                          value,
                          label: translateEnum(value, 'ecossistemas'),
                        })
                      )}
                      disabled={isLoading}
                      allowClear={true}
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
              name='zonaLocalizacao'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zona de Localização</FormLabel>
                  <FormControl>
                    <CustomSelect
                      value={field.value || null}
                      onValueChange={field.onChange}
                      placeholder='Selecione a zona de localização'
                      options={Object.values(LocationZoneEnum.Values).map(
                        (value) => ({
                          value,
                          label: translateEnum(value, 'zonaLocalizacao'),
                        })
                      )}
                      disabled={isLoading}
                      allowClear={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='tipoVegetacaoPredominante'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Vegetação Predominante</FormLabel>
                  <FormControl>
                    <CustomSelect
                      value={field.value || null}
                      onValueChange={field.onChange}
                      placeholder='Selecione o tipo de vegetação'
                      options={Object.values(VegetacaoEnum.Values).map(
                        (value) => ({
                          value,
                          label: translateEnum(value, 'vegetacao'),
                        })
                      )}
                      disabled={isLoading}
                      allowClear={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          <FormField
            control={form.control}
            name='usoSolo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Uso do Solo</FormLabel>
                <FormControl>
                  <Select
                    disabled={isLoading}
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className='bg-white'>
                      <SelectValue placeholder='Seleciona a opção' />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(UsoSoloEnum.Values).map((value) => (
                        <SelectItem key={value} value={value}>
                          {translateEnum(value, 'usoSolo')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Additional Information Section */}
        <FormSection
          title='Informações Complementares'
          description='Informações complementares e valor do investimento'
        >
          <FormField
            control={form.control}
            name='infraestruturaExistenteAreaActividade'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Infraestrutura Existente na Área da Actividade
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva a infraestrutura existente na área'
                    className='min-h-[80px]'
                    {...field}
                    value={field.value || ''}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='informacaoComplementarAtravesMaps'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Informação Complementar Através de Mapas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva informações complementares através de mapas'
                    className='min-h-[80px]'
                    {...field}
                    value={field.value || ''}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='valorTotalInvestimento'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Total do Investimento (MZN)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Valor em MZN'
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value =
                        e.target.value === '' ? null : Number(e.target.value);
                      field.onChange(value);
                    }}
                    disabled={isLoading}
                  />
                </FormControl>
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
