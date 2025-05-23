// components/ui/multi-select-with-add.tsx
'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectWithAddProps {
  options: Option[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  addButtonLabel?: string;
  onAddNew?: (value: string) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export function MultiSelectWithAdd({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = 'Selecione opções...',
  addButtonLabel = 'Adicionar Nova Opção',
  onAddNew,
  disabled = false,
  className,
}: MultiSelectWithAddProps) {
  const [open, setOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get selected options for display
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  // Handle selection toggle
  const handleSelect = (value: string) => {
    const isSelected = selectedValues.includes(value);

    if (isSelected) {
      // Remove from selection
      onSelectionChange(selectedValues.filter((v) => v !== value));
    } else {
      // Add to selection
      onSelectionChange([...selectedValues, value]);
    }
  };

  // Handle removing a selected item
  const handleRemove = (valueToRemove: string) => {
    onSelectionChange(selectedValues.filter((v) => v !== valueToRemove));
  };

  // Handle adding new option
  const handleAddNew = async () => {
    if (!newValue.trim() || !onAddNew) return;

    try {
      setIsSubmitting(true);
      await onAddNew(newValue.trim());
      setNewValue('');
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding new option:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Selected items display */}
      {selectedOptions.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant='secondary'
              className='flex items-center gap-1 pr-1'
            >
              <span className='text-xs'>{option.label}</span>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='h-4 w-4 p-0 hover:bg-transparent'
                onClick={() => handleRemove(option.value)}
                disabled={disabled}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Multi-select dropdown */}
      <div className='flex gap-2'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='flex-1 justify-between'
              disabled={disabled}
            >
              {selectedOptions.length > 0
                ? `${selectedOptions.length} selecionado(s)`
                : placeholder}
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-full p-0' align='start'>
            <Command>
              <CommandInput placeholder='Buscar...' />
              <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
              <CommandGroup className='max-h-64 overflow-auto'>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedValues.includes(option.value)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Add new button */}
        {onAddNew && (
          <Button
            type='button'
            variant='outline'
            size='icon'
            onClick={() => setIsAddDialogOpen(true)}
            disabled={disabled}
            className='shrink-0'
          >
            <Plus className='h-4 w-4' />
          </Button>
        )}
      </div>

      {/* Add new dialog */}
      {onAddNew && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{addButtonLabel}</DialogTitle>
            </DialogHeader>
            <div className='py-4'>
              <Label htmlFor='new-option'>Nome</Label>
              <Input
                id='new-option'
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder='Digite o nome'
                className='mt-2'
                autoComplete='off'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNew();
                  }
                }}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline' type='button'>
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                onClick={handleAddNew}
                disabled={!newValue.trim() || isSubmitting}
              >
                {isSubmitting ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
