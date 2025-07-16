// components/forms/objetivos-metas/AddMembroEquipaDialog.tsx
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

interface AddMembroEquipaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddMembroEquipaDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddMembroEquipaDialogProps) {
  const { currentTenantId } = useTenantProjectContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    departamento: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      toast.error('O nome é obrigatório');
      return;
    }

    if (!currentTenantId) {
      toast.error('Tenant ID é obrigatório');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/membros-equipa?tenantId=${currentTenantId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Falha ao adicionar membro');
      }

      toast.success('Membro adicionado com sucesso');
      onSuccess();
      onOpenChange(false);
      // Reset form
      setFormData({
        nome: '',
        cargo: '',
        departamento: '',
      });
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      toast.error('Ocorreu um erro ao adicionar membro');
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Adicionar Membro da Equipa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='nome'>Nome *</Label>
              <Input
                id='nome'
                name='nome'
                value={formData.nome}
                onChange={handleChange}
                required
                placeholder='Nome do membro'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='cargo'>Cargo</Label>
              <Input
                id='cargo'
                name='cargo'
                value={formData.cargo}
                onChange={handleChange}
                placeholder='Cargo do membro'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='departamento'>Departamento</Label>
              <Input
                id='departamento'
                name='departamento'
                value={formData.departamento}
                onChange={handleChange}
                placeholder='Departamento do membro'
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
