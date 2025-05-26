'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RelatorioInicialIncidenteForm } from '@/components/forms/relatorio-inicial-incidente';
import { createRelatorioInicialIncidenteColumns } from '@/components/forms/relatorio-inicial-incidente/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Info,
  AlertTriangle,
  FileX,
  Users,
  Building2,
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  useRelatorioInicialIncidente,
  type RelatorioInicialIncidente,
} from '@/hooks/use-relatorio-inicial-incidente';
import { RelatorioInicialIncidenteFormData } from '@/lib/validations/relatorio-inicial-incidente';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { Badge } from '@/components/ui/badge';

export default function RelatorioInicialIncidentePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<RelatorioInicialIncidente | null>(null);

  const {
    data: relatorios = [],
    isLoading,
    create,
    update,
    remove,
  } = useRelatorioInicialIncidente();

  // Statistics calculations
  const totalRelatorios = relatorios.length;
  const reportaveis = relatorios.filter(
    (r) => r.incidenteReportavel === 'SIM'
  ).length;
  const necessitamInvestigacao = relatorios.filter(
    (r) => r.necessitaDeInvestigacaoAprofundada === 'SIM'
  ).length;
  const comEmpregados = relatorios.filter((r) => r.empregado === 'SIM').length;
  const comSubcontratados = relatorios.filter(
    (r) => r.subcontratante === 'SIM'
  ).length;

  // Incident type breakdown
  const tipoIncidenteStats = relatorios.reduce((acc, relatorio) => {
    const tipo = relatorio.tipoIncidente;
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleSuccess = async (data: RelatorioInicialIncidenteFormData) => {
    try {
      if (editingRecord) {
        await update(editingRecord.id, data);
        toast.success('Relatório atualizado com sucesso');
      } else {
        await create(data);
        toast.success('Relatório criado com sucesso');
      }
      setShowForm(false);
      setEditingRecord(null);
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Erro ao salvar relatório');
    }
  };

  const handleEdit = (relatorio: RelatorioInicialIncidente) => {
    setEditingRecord(relatorio);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast.success('Relatório excluído com sucesso');
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Erro ao excluir relatório');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  const columns = createRelatorioInicialIncidenteColumns(
    handleEdit,
    handleDelete
  );

  if (!currentTenantId || !currentProjectId) {
    return (
      <div className='container mx-auto py-6'>
        <Alert>
          <AlertTriangle className='h-4 w-4' />
          <AlertTitle>Projeto não selecionado</AlertTitle>
          <AlertDescription>
            Por favor, selecione um projeto para acessar os relatórios iniciais
            de incidente.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className='container mx-auto py-6'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold'>
            {editingRecord ? 'Editar' : 'Criar'} Relatório Inicial de Incidente
          </h1>
          <p className='text-muted-foreground'>
            FR.AS.028 - Relatório Inicial de Incidente
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {editingRecord ? 'Editar Relatório' : 'Novo Relatório'}
            </CardTitle>
            <CardDescription>
              Preencha as informações do relatório inicial de incidente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RelatorioInicialIncidenteForm
              initialData={editingRecord || undefined}
              onSubmit={handleSuccess}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Relatórios Iniciais de Incidente</h1>
        <p className='text-muted-foreground'>
          FR.AS.028 - Gestão de relatórios iniciais de incidentes
        </p>
      </div>

      {/* Statistics Dashboard */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total de Relatórios
            </CardTitle>
            <FileX className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalRelatorios}</div>
            <p className='text-xs text-muted-foreground'>
              Relatórios registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Reportáveis</CardTitle>
            <AlertTriangle className='h-4 w-4 text-red-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>{reportaveis}</div>
            <p className='text-xs text-muted-foreground'>
              Incidentes reportáveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Investigação</CardTitle>
            <Info className='h-4 w-4 text-blue-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              {necessitamInvestigacao}
            </div>
            <p className='text-xs text-muted-foreground'>
              Necessitam investigação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Empregados</CardTitle>
            <Users className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {comEmpregados}
            </div>
            <p className='text-xs text-muted-foreground'>
              Envolvendo empregados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Subcontratados
            </CardTitle>
            <Building2 className='h-4 w-4 text-orange-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-orange-600'>
              {comSubcontratados}
            </div>
            <p className='text-xs text-muted-foreground'>
              Envolvendo subcontratados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Incident Type Breakdown */}
      {Object.keys(tipoIncidenteStats).length > 0 && (
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Distribuição por Tipo de Incidente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {Object.entries(tipoIncidenteStats).map(([tipo, count]) => {
                const tipoLabels: Record<string, string> = {
                  FATALIDADE: 'Fatalidade',
                  OCORRENCIA_PERIGOSA: 'Ocorrência Perigosa',
                  INCIDENTE_QUASE_ACIDENTE: 'Incidente/Quase Acidente',
                  TEMPO_PERDIDO: 'Tempo Perdido',
                  INCIDENTE_AMBIENTAL: 'Incidente Ambiental',
                  SEGURANCA: 'Segurança',
                  RECLAMACAO_EXTERNA: 'Reclamação Externa',
                  NOTIFICACAO_DO_REGULADOR_VIOLACAO:
                    'Notificação do Regulador/Violação',
                  DERAMAMENTO_LBERACAO_DESCONTROLADA:
                    'Derramamento/Liberação Descontrolada',
                  DANOS_PERDAS: 'Danos/Perdas',
                  FLORA_FAUNA: 'Flora/Fauna',
                  AUDITORIA_NAO_CONFORMIDADE: 'Auditoria/Não Conformidade',
                };

                return (
                  <Badge key={tipo} variant='outline' className='text-sm'>
                    {tipoLabels[tipo] || tipo}: {count}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Relatórios Iniciais de Incidente</CardTitle>
              <CardDescription>
                Lista de todos os relatórios iniciais de incidente registrados
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Novo Relatório
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={relatorios}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
