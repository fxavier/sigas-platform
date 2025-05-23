// components/forms/form-actions.tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
  submitLabel?: string;
}

export function FormActions({
  onCancel,
  isSubmitting,
  className,
  submitLabel = 'Salvar',
}: FormActionsProps) {
  return (
    <div className={cn('flex items-center justify-end space-x-4', className)}>
      {onCancel && (
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      )}
      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : submitLabel}
      </Button>
    </div>
  );
}
