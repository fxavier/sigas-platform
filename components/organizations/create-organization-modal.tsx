// components/organizations/create-organization-modal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome da organização deve ter pelo menos 3 caracteres.',
  }),
  slug: z
    .string()
    .min(3, {
      message: 'O slug deve ter pelo menos 3 caracteres.',
    })
    .regex(/^[a-z0-9-]+$/, {
      message: 'O slug só pode conter letras minúsculas, números e hífens.',
    }),
  description: z.string().optional(),
});

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateOrganizationModal({
  isOpen,
  onClose,
}: CreateOrganizationModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  // Auto-generate slug from organization name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, ''); // Remove special characters

    form.setValue('slug', slug);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const response = await axios.post('/api/tenants', {
        name: values.name,
        slug: values.slug,
        description: values.description,
      });

      toast.success('Organização criada', {
        description: 'A organização foi criada com sucesso.',
      });

      onClose();
      form.reset();

      // Refresh the organizations list
      router.refresh();

      // Redirect to the new organization's dashboard
      router.push(`/tenants/${response.data.slug}/dashboard`);
    } catch (error: any) {
      console.error('Error creating organization:', error);

      toast.error(error.response?.data || 'Falha ao criar a organização.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Criar Nova Organização</DialogTitle>
          <DialogDescription>
            Crie uma nova organização para gerenciar seus projetos.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Organização</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Minha Organização'
                      {...field}
                      onChange={handleNameChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='slug'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL)</FormLabel>
                  <FormControl>
                    <div className='flex items-center'>
                      <span className='text-muted-foreground bg-muted px-3 py-2 border border-r-0 rounded-l-md'>
                        /tenants/
                      </span>
                      <Input
                        className='rounded-l-none'
                        placeholder='minha-organizacao'
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
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
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Uma breve descrição da sua organização'
                      className='resize-none'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='mt-6'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Criando...
                  </>
                ) : (
                  'Criar Organização'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
