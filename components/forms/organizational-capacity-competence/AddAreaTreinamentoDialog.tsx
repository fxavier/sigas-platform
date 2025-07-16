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

interface AddAreaTreinamentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddAreaTreinamentoDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddAreaTreinamentoDialogProps) {
  const { currentTenantId } = useTenantProjectContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Nome da área de treinamento é obrigatório');
      return;
    }

    if (!currentTenantId) {
      toast.error('Tenant não encontrado');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/areas-treinamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          tenantId: currentTenantId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar área de treinamento');
      }

      toast.success('Área de treinamento criada com sucesso');
      setFormData({ name: '' });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar área de treinamento:', error);
      toast.error('Erro ao criar área de treinamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Área de Treinamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Nome *</Label>
              <Input
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                placeholder='Nome da área de treinamento'
              />
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
