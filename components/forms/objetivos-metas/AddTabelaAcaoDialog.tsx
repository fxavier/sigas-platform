// components/forms/objetivos-metas/AddTabelaAcaoDialog.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AddTabelaAcaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddTabelaAcaoDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddTabelaAcaoDialogProps) {
  const { currentTenantId } = useTenantProjectContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    accao: '',
    pessoaResponsavel: '',
    prazo: new Date(),
    dataConclusao: new Date(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.accao.trim()) {
      toast.error('A ação é obrigatória');
      return;
    }

    if (!formData.pessoaResponsavel.trim()) {
      toast.error('A pessoa responsável é obrigatória');
      return;
    }

    if (!currentTenantId) {
      toast.error('Tenant ID é obrigatório');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/tabela-accoes?tenantId=${currentTenantId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Falha ao adicionar ação');
      }

      toast.success('Ação adicionada com sucesso');
      onSuccess();
      onOpenChange(false);
      // Reset form
      setFormData({
        accao: '',
        pessoaResponsavel: '',
        prazo: new Date(),
        dataConclusao: new Date(),
      });
    } catch (error) {
      console.error('Erro ao adicionar ação:', error);
      toast.error('Ocorreu um erro ao adicionar ação');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (
    field: 'prazo' | 'dataConclusao',
    date: Date | undefined
  ) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [field]: date,
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Adicionar Ação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='accao'>Ação *</Label>
              <Input
                id='accao'
                name='accao'
                value={formData.accao}
                onChange={handleChange}
                required
                placeholder='Descrição da ação'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='pessoaResponsavel'>Pessoa Responsável *</Label>
              <Input
                id='pessoaResponsavel'
                name='pessoaResponsavel'
                value={formData.pessoaResponsavel}
                onChange={handleChange}
                required
                placeholder='Nome do responsável'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='prazo'>Prazo</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-full justify-start text-left font-normal'
                    type='button'
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {format(formData.prazo, 'dd/MM/yyyy', {
                      locale: ptBR,
                    })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={formData.prazo}
                    onSelect={(date) => handleDateChange('prazo', date)}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='dataConclusao'>Data de Conclusão</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-full justify-start text-left font-normal'
                    type='button'
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {format(formData.dataConclusao, 'dd/MM/yyyy', {
                      locale: ptBR,
                    })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={formData.dataConclusao}
                    onSelect={(date) => handleDateChange('dataConclusao', date)}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
