// components/forms/add-option-dialog.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';

interface AddOptionDialogProps {
  type: string;
  onAdd: (value: string) => void;
  disabled?: boolean;
}

export function AddOptionDialog({
  type,
  onAdd,
  disabled = false,
}: AddOptionDialogProps) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!value.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd(value.trim());
      setValue('');
      setOpen(false);
    } catch (error) {
      console.error('Error adding option:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          type='button'
          disabled={disabled}
          className='flex-shrink-0'
        >
          <PlusCircle className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo {type}</DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          <Label htmlFor='new-option'>Nome do {type}</Label>
          <Input
            id='new-option'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Digite o nome do ${type.toLowerCase()}`}
            className='mt-2'
            autoComplete='off'
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' type='button'>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={!value.trim() || isSubmitting}
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
