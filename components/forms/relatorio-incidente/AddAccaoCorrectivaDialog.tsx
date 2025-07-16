// components/forms/relatorio-incidente/AddAccaoCorrectivaDialog.tsx
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
import { Textarea } from '@/components/ui/textarea';
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

interface AddAccaoCorrectivaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddAccaoCorrectivaDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddAccaoCorrectivaDialogProps) {
  const { currentTenantId } = useTenantProjectContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    accao: '',
    responsavel: '',
    prazo: new Date(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.accao.trim()) {
      toast.error('A ação é obrigatória');
      return;
    }

    if (!formData.responsavel.trim()) {
      toast.error('O responsável é obrigatório');
      return;
    }

    if (!currentTenantId) {
      toast.error('Tenant ID é obrigatório');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/accoes-correctivas?tenantId=${currentTenantId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Falha ao adicionar ação correctiva');
      }

      toast.success('Ação correctiva adicionada com sucesso');
      onSuccess();
      onOpenChange(false);
      // Reset form
      setFormData({
        accao: '',
        responsavel: '',
        prazo: new Date(),
      });
    } catch (error) {
      console.error('Erro ao adicionar ação corretiva:', error);
      toast.error('Ocorreu um erro ao adicionar ação correctiva');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        prazo: date,
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Adicionar Ação Correctiva Permanente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='accao'>Ação Correctiva *</Label>
              <Textarea
                id='accao'
                name='accao'
                value={formData.accao}
                onChange={handleChange}
                required
                placeholder='Descreva a ação correctiva a ser implementada'
                className='min-h-[80px]'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='responsavel'>Responsável *</Label>
              <Input
                id='responsavel'
                name='responsavel'
                value={formData.responsavel}
                onChange={handleChange}
                required
                placeholder='Nome do responsável pela implementação'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='prazo'>Prazo *</Label>
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
                    onSelect={handleDateChange}
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
