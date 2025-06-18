'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const resultadoTriagemSchema = z.object({
  categoriaRisco: z.string().min(1, 'Categoria de risco é obrigatória'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  instrumentosASeremDesenvolvidos: z
    .string()
    .min(1, 'Instrumentos a serem desenvolvidos é obrigatório'),
  subprojectoId: z.string().optional(),
});

type ResultadoTriagemFormData = z.infer<typeof resultadoTriagemSchema>;

interface AddResultadoTriagemDialogProps {
  onAdd: (data: ResultadoTriagemFormData) => Promise<void>;
  subprojectos: Array<{ id: string; nome: string }>;
  disabled?: boolean;
}

export function AddResultadoTriagemDialog({
  onAdd,
  subprojectos,
  disabled = false,
}: AddResultadoTriagemDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResultadoTriagemFormData>({
    resolver: zodResolver(resultadoTriagemSchema),
    defaultValues: {
      categoriaRisco: '',
      descricao: '',
      instrumentosASeremDesenvolvidos: '',
      subprojectoId: 'none',
    },
  });

  const handleSubmit = async (data: ResultadoTriagemFormData) => {
    setIsSubmitting(true);
    try {
      // Convert 'none' back to undefined for optional subprojectoId
      const submitData = {
        ...data,
        subprojectoId:
          data.subprojectoId === 'none' ? undefined : data.subprojectoId,
      };
      await onAdd(submitData);
      form.reset();
      setOpen(false);
      toast.success('Resultado de triagem adicionado com sucesso');
    } catch (error) {
      console.error('Error adding resultado triagem:', error);
      toast.error('Erro ao adicionar resultado de triagem');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Predefined risk categories based on common environmental screening results
  const categoriesRisco = [
    'Categoria A - Alto Risco',
    'Categoria B - Médio Risco',
    'Categoria C - Baixo Risco',
    'Categoria D - Risco Mínimo',
    'Sem Categoria Definida',
  ];

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
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Resultado de Triagem</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='categoriaRisco'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Categoria de Risco{' '}
                    <span className='text-destructive'>*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='bg-white'>
                        <SelectValue placeholder='Selecione a categoria de risco' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesRisco.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='subprojectoId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subprojecto (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='bg-white'>
                        <SelectValue placeholder='Selecione um subprojecto (opcional)' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='none'>
                        Nenhum subprojecto específico
                      </SelectItem>
                      {subprojectos
                        .filter(
                          (subprojecto) =>
                            subprojecto.id && subprojecto.id.trim() !== ''
                        )
                        .map((subprojecto) => (
                          <SelectItem
                            key={subprojecto.id}
                            value={subprojecto.id}
                          >
                            {subprojecto.nome}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='descricao'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Descrição <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Descrição detalhada do resultado da triagem ambiental e social'
                      {...field}
                      className='bg-white min-h-[100px]'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='instrumentosASeremDesenvolvidos'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Instrumentos a Serem Desenvolvidos{' '}
                    <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Ex: EIA/RIMA, PGS, PGAS, Plano de Reassentamento, etc.'
                      {...field}
                      className='bg-white min-h-[100px]'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
