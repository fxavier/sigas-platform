// components/projects/create-project-modal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome do projeto deve ter pelo menos 3 caracteres.',
  }),
  description: z.string().min(10, {
    message: 'A descrição deve ter pelo menos 10 caracteres.',
  }),
});

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  tenantSlug: string;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  tenantId,
  tenantSlug,
}: CreateProjectModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `/api/tenants/${tenantId}/projects`,
        values
      );

      toast.success('Projeto criado', {
        description: 'Seu projeto foi criado com sucesso.',
      });

      onClose();
      form.reset();

      // Redirect to the new project
      router.push(`/tenants/${tenantSlug}/projects/${response.data.id}`);
      router.refresh();
    } catch (error: any) {
      toast.error('Erro', {
        description: error.response?.data || 'Algo deu errado.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar um novo projeto</DialogTitle>
          <DialogDescription>
            Adicione um novo projeto à sua organização.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Projeto</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Ex: Redesign do Website'
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Descreva o projeto e seus objetivos'
                      rows={4}
                      disabled={isLoading}
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
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Criando...' : 'Criar Projeto'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
