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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const responsavelSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  funcao: z.string().min(1, 'Função é obrigatória'),
  contacto: z.string().min(1, 'Contacto é obrigatório'),
  data: z.string().min(1, 'Data é obrigatória'),
  assinatura: z.string().optional(),
});

type ResponsavelFormData = z.infer<typeof responsavelSchema>;

interface AddResponsavelDialogProps {
  type: 'preenchimento' | 'verificacao';
  onAdd: (data: ResponsavelFormData) => Promise<void>;
  disabled?: boolean;
}

export function AddResponsavelDialog({
  type,
  onAdd,
  disabled = false,
}: AddResponsavelDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResponsavelFormData>({
    resolver: zodResolver(responsavelSchema),
    defaultValues: {
      nome: '',
      funcao: '',
      contacto: '',
      data: new Date().toISOString().split('T')[0],
      assinatura: '',
    },
  });

  const handleSubmit = async (data: ResponsavelFormData) => {
    setIsSubmitting(true);
    try {
      await onAdd(data);
      form.reset();
      setOpen(false);
      toast.success(
        `Responsável ${
          type === 'preenchimento' ? 'pelo preenchimento' : 'pela verificação'
        } adicionado com sucesso`
      );
    } catch (error) {
      console.error('Error adding responsavel:', error);
      toast.error('Erro ao adicionar responsável');
    } finally {
      setIsSubmitting(false);
    }
  };

  const title =
    type === 'preenchimento'
      ? 'Responsável pelo Preenchimento'
      : 'Responsável pela Verificação';

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
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Adicionar Novo {title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='nome'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Digite o nome completo'
                      {...field}
                      className='bg-white'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='funcao'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Função <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Digite a função/cargo'
                      {...field}
                      className='bg-white'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='contacto'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contacto <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Telefone, email ou outro contacto'
                      {...field}
                      className='bg-white'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='data'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Data <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type='date' {...field} className='bg-white' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='assinatura'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assinatura (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Assinatura digital ou observações'
                      {...field}
                      className='bg-white min-h-[80px]'
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
