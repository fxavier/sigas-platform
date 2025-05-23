// components/ui/custom-select.tsx
'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export type Option = {
  value: string;
  label: string;
};

interface CustomSelectProps {
  options: Option[];
  value: string | string[] | null;
  onValueChange: (value: string | string[] | null) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  allowClear?: boolean;
  multiple?: boolean;
  className?: string;
}

export function CustomSelect({
  options,
  value,
  onValueChange,
  placeholder = 'Selecione...',
  emptyMessage = 'Nenhuma opção encontrada.',
  disabled = false,
  allowClear = false,
  multiple = false,
  className,
}: CustomSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>(
    multiple && Array.isArray(value) ? value : value ? [value as string] : []
  );

  React.useEffect(() => {
    // Update internal state when external value changes
    if (multiple && Array.isArray(value)) {
      setSelected(value);
    } else if (value) {
      setSelected([value as string]);
    } else {
      setSelected([]);
    }
  }, [value, multiple]);

  // Handle selection change
  const handleSelect = (currentValue: string) => {
    if (multiple) {
      const updatedValue = selected.includes(currentValue)
        ? selected.filter((item) => item !== currentValue)
        : [...selected, currentValue];

      setSelected(updatedValue);
      onValueChange(updatedValue.length > 0 ? updatedValue : null);
    } else {
      // For single select
      const newValue = currentValue === value ? null : currentValue;
      setSelected(newValue ? [newValue] : []);
      onValueChange(newValue);
      setOpen(false);
    }
  };

  // Handle clearing the selection
  const handleClear = () => {
    setSelected([]);
    onValueChange(multiple ? [] : null);
  };

  // Get display text for the selected value(s)
  const getSelectedDisplay = () => {
    if (selected.length === 0) {
      return <span className='text-muted-foreground'>{placeholder}</span>;
    }

    if (multiple) {
      return (
        <div className='flex flex-wrap gap-1'>
          {selected.map((item) => {
            const option = options.find((opt) => opt.value === item);
            return (
              <Badge key={item} variant='secondary'>
                {option?.label || item}
              </Badge>
            );
          })}
        </div>
      );
    }

    const option = options.find((opt) => opt.value === selected[0]);
    return option?.label || selected[0];
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'w-full justify-between',
            selected.length > 0 ? 'text-foreground' : 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <div className='truncate flex-1 text-left'>
            {getSelectedDisplay()}
          </div>
          {allowClear && selected.length > 0 && (
            <X
              className='h-4 w-4 text-muted-foreground hover:text-foreground ml-1'
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0' align='start'>
        <Command>
          <CommandInput placeholder='Buscar...' />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      selected.includes(option.value)
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='h-4 w-4'
                    >
                      <polyline points='20 6 9 17 4 12' />
                    </svg>
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
