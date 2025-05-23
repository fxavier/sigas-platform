// components/forms/relatorio-incidente/AddPessoaEnvolvidaDialog.tsx
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

interface AddPessoaEnvolvidaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddPessoaEnvolvidaDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddPessoaEnvolvidaDialogProps) {
  const { currentTenantId } = useTenantProjectContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    funcao: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      toast.error('O nome é obrigatório');
      return;
    }

    if (!formData.funcao.trim()) {
      toast.error('A função é obrigatória');
      return;
    }

    if (!currentTenantId) {
      toast.error('Tenant ID é obrigatório');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/pessoas-envolvidas?tenantId=${currentTenantId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Falha ao adicionar pessoa');
      }

      toast.success('Pessoa adicionada com sucesso');
      onSuccess();
      onOpenChange(false);
      // Reset form
      setFormData({
        nome: '',
        funcao: '',
      });
    } catch (error) {
      console.error('Error adding pessoa:', error);
      toast.error('Ocorreu um erro ao adicionar pessoa');
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
          <DialogTitle>Adicionar Pessoa Envolvida na Investigação</DialogTitle>
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
                placeholder='Nome da pessoa'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='funcao'>Função *</Label>
              <Input
                id='funcao'
                name='funcao'
                value={formData.funcao}
                onChange={handleChange}
                required
                placeholder='Função ou cargo'
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
