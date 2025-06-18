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
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const subprojectoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  referenciaDoContracto: z.string().optional(),
  nomeEmpreiteiro: z.string().optional(),
  custoEstimado: z.string().optional(),
  localizacao: z.string().min(1, 'Localização é obrigatória'),
  coordenadasGeograficas: z.string().optional(),
  tipoSubprojecto: z.string().min(1, 'Tipo de subprojecto é obrigatório'),
  areaAproximada: z.string().min(1, 'Área aproximada é obrigatória'),
});

type SubprojectoFormData = z.infer<typeof subprojectoSchema>;

interface AddSubprojectoDialogProps {
  onAdd: (data: SubprojectoFormData) => Promise<void>;
  disabled?: boolean;
}

export function AddSubprojectoDialog({
  onAdd,
  disabled = false,
}: AddSubprojectoDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubprojectoFormData>({
    resolver: zodResolver(subprojectoSchema),
    defaultValues: {
      nome: '',
      referenciaDoContracto: '',
      nomeEmpreiteiro: '',
      custoEstimado: '',
      localizacao: '',
      coordenadasGeograficas: '',
      tipoSubprojecto: '',
      areaAproximada: '',
    },
  });

  const handleSubmit = async (data: SubprojectoFormData) => {
    setIsSubmitting(true);
    try {
      await onAdd(data);
      form.reset();
      setOpen(false);
      toast.success('Subprojecto adicionado com sucesso');
    } catch (error) {
      console.error('Error adding subprojecto:', error);
      toast.error('Erro ao adicionar subprojecto');
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
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Subprojecto</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                        placeholder='Nome do subprojecto'
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
                name='referenciaDoContracto'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referência do Contracto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ex: CONT-2024-001'
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
                name='nomeEmpreiteiro'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Empreiteiro</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nome da empresa empreiteira'
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
                name='custoEstimado'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo Estimado (MT)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='0.00'
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
                name='tipoSubprojecto'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tipo de Subprojecto{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ex: Infraestrutura, Ambiental, Social'
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
                name='areaAproximada'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Área Aproximada{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ex: 100 hectares, 50 km²'
                        {...field}
                        className='bg-white'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='localizacao'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Localização <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Descrição detalhada da localização do subprojecto'
                      {...field}
                      className='bg-white min-h-[80px]'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='coordenadasGeograficas'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordenadas Geográficas</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ex: -25.9653, 32.5892 ou UTM'
                      {...field}
                      className='bg-white'
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
