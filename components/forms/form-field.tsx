// components/forms/form-field.tsx
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Control, Controller } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </Label>
      {children}
    </div>
  );
}

interface CustomFormFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'select' | 'number';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  className?: string;
}

export function CustomFormField({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  options,
  required,
  className,
}: CustomFormFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('space-y-2', className)}>
          <Label>
            {label}
            {required && <span className='text-red-500 ml-1'>*</span>}
          </Label>
          {type === 'textarea' ? (
            <Textarea
              {...field}
              placeholder={placeholder}
              className={cn(error && 'border-red-500')}
            />
          ) : type === 'select' ? (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={cn(error && 'border-red-500')}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : type === 'number' ? (
            <Input
              {...field}
              type='number'
              placeholder={placeholder}
              className={cn(error && 'border-red-500')}
              onChange={(e) => {
                const value =
                  e.target.value === '' ? '' : Number(e.target.value);
                field.onChange(value);
              }}
              value={field.value === '' ? '' : field.value}
            />
          ) : (
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className={cn(error && 'border-red-500')}
            />
          )}
          {error && <p className='text-sm text-red-500'>{error.message}</p>}
        </div>
      )}
    />
  );
}
