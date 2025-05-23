'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  disabled?: boolean;
}

export function TimePicker({
  date,
  setDate,
  disabled = false,
}: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  // Initialize with current date or default to current time
  const currentDate = date || new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  const [hour, setHour] = React.useState<string>(
    hours.toString().padStart(2, '0')
  );
  const [minute, setMinute] = React.useState<string>(
    minutes.toString().padStart(2, '0')
  );

  // Update the date when hour or minute changes
  const updateTime = () => {
    if (!date) return;

    const newDate = new Date(date);
    newDate.setHours(parseInt(hour || '0', 10));
    newDate.setMinutes(parseInt(minute || '0', 10));
    setDate(newDate);
  };

  // Handle hour input
  const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHour = event.target.value.replace(/\D/g, '').slice(0, 2);

    if (newHour === '') {
      setHour('');
      return;
    }

    const hourValue = parseInt(newHour, 10);
    if (hourValue >= 0 && hourValue <= 23) {
      setHour(newHour.padStart(2, '0'));

      if (newHour.length === 2) {
        minuteRef.current?.focus();
      }
    }
  };

  // Handle minute input
  const handleMinuteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMinute = event.target.value.replace(/\D/g, '').slice(0, 2);

    if (newMinute === '') {
      setMinute('');
      return;
    }

    const minuteValue = parseInt(newMinute, 10);
    if (minuteValue >= 0 && minuteValue <= 59) {
      setMinute(newMinute.padStart(2, '0'));
    }
  };

  // Update time when inputs lose focus
  const handleBlur = () => {
    // Ensure values are padded
    setHour((h) => h.padStart(2, '0'));
    setMinute((m) => m.padStart(2, '0'));
    updateTime();
  };

  // Handle key press for navigation
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    type: 'hour' | 'minute'
  ) => {
    // Update on Enter
    if (event.key === 'Enter') {
      updateTime();
    }

    // Allow navigation between inputs with arrow keys
    if (type === 'hour' && event.key === 'ArrowRight' && hour.length === 2) {
      minuteRef.current?.focus();
    } else if (
      type === 'minute' &&
      event.key === 'ArrowLeft' &&
      minute.length === 0
    ) {
      hourRef.current?.focus();
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
          disabled={disabled}
        >
          <Clock className='mr-2 h-4 w-4' />
          {date ? (
            format(date, 'HH:mm', { locale: ptBR })
          ) : (
            <span>Selecione um horário</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-4' align='start'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='time'>Horário</Label>
            <div className='flex gap-2 items-center'>
              <Input
                ref={hourRef}
                id='hour'
                className='w-12 text-center'
                value={hour}
                onChange={handleHourChange}
                onBlur={handleBlur}
                onKeyDown={(e) => handleKeyDown(e, 'hour')}
                maxLength={2}
                inputMode='numeric'
                disabled={disabled}
              />
              <span className='text-lg font-medium'>:</span>
              <Input
                ref={minuteRef}
                id='minute'
                className='w-12 text-center'
                value={minute}
                onChange={handleMinuteChange}
                onBlur={handleBlur}
                onKeyDown={(e) => handleKeyDown(e, 'minute')}
                maxLength={2}
                inputMode='numeric'
                disabled={disabled}
              />
            </div>
          </div>
          <div className='flex justify-end'>
            <Button size='sm' onClick={updateTime} disabled={disabled}>
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
