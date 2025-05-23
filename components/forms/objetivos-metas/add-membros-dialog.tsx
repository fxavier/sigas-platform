// components/forms/objetivos-metas/add-membros-dialog.tsx
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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserPlus, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface MembroEquipa {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
}

interface AddMembrosDialogProps {
  membrosEquipa: MembroEquipa[];
  selectedMembros: string[];
  onAdd: (membrosIds: string[]) => void;
  isLoading?: boolean;
}

export function AddMembrosDialog({
  membrosEquipa,
  selectedMembros,
  onAdd,
  isLoading = false,
}: AddMembrosDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [localSelectedMembros, setLocalSelectedMembros] = useState<string[]>(
    []
  );

  // Filter membros by search term
  const filteredMembros = membrosEquipa.filter(
    (membro) =>
      membro.nome.toLowerCase().includes(search.toLowerCase()) ||
      membro.cargo.toLowerCase().includes(search.toLowerCase()) ||
      membro.departamento.toLowerCase().includes(search.toLowerCase())
  );

  // Handle dialog open
  const handleOpen = () => {
    setLocalSelectedMembros([...selectedMembros]);
    setOpen(true);
  };

  // Handle checkbox change
  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setLocalSelectedMembros((prev) => [...prev, id]);
    } else {
      setLocalSelectedMembros((prev) =>
        prev.filter((membroid) => membroid !== id)
      );
    }
  };

  // Handle submit
  const handleSubmit = () => {
    onAdd(localSelectedMembros);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          onClick={handleOpen}
          disabled={isLoading}
        >
          <UserPlus className='h-4 w-4 mr-2' />
          Adicionar Membros
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Adicionar Membros da Equipa</DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          <div className='relative mb-4'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Buscar por nome, cargo ou departamento'
              className='pl-10'
            />
          </div>

          {isLoading ? (
            <div className='space-y-4'>
              <Skeleton className='h-16 w-full' />
              <Skeleton className='h-16 w-full' />
              <Skeleton className='h-16 w-full' />
            </div>
          ) : filteredMembros.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              Nenhum membro encontrado
            </div>
          ) : (
            <ScrollArea className='h-[300px]'>
              <div className='space-y-2'>
                {filteredMembros.map((membro) => (
                  <div
                    key={membro.id}
                    className='flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50'
                  >
                    <Checkbox
                      id={`membro-${membro.id}`}
                      checked={localSelectedMembros.includes(membro.id)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(membro.id, !!checked)
                      }
                    />
                    <div className='flex-1'>
                      <Label
                        htmlFor={`membro-${membro.id}`}
                        className='font-medium cursor-pointer'
                      >
                        {membro.nome}
                      </Label>
                      <div className='text-sm text-gray-500'>
                        {membro.cargo} • {membro.departamento}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' type='button'>
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isLoading}>
            Adicionar Selecionados
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
