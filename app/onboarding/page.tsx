// app/onboarding/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

const formSchema = z.object({
  organizationName: z.string().min(3, {
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

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: '',
      slug: '',
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      // Create tenant
      const response = await axios.post('/api/tenants', {
        name: values.organizationName,
        slug: values.slug,
        description: values.description,
      });

      toast.success('Organização criada', {
        description: 'Sua organização foi criada com sucesso.',
      });

      router.push(`/tenants/${response.data.slug}/dashboard`);
    } catch (error: any) {
      console.error('Error creating tenant:', error);

      toast.error(error.response?.data || 'Falha ao criar a organização.');
    } finally {
      setIsLoading(false);
    }
  }

  // Auto-generate slug from organization name
  const handleOrganizationNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = e.target.value;
    form.setValue('organizationName', name);

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, ''); // Remove special characters

    form.setValue('slug', slug);
  };

  if (!isLoaded) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-muted/40'>
      <div className='w-full max-w-md p-8 bg-card rounded-lg shadow-lg'>
        <h1 className='text-2xl font-bold text-center mb-2'>
          Bem-vindo ao Sistema SGAS
        </h1>
        <p className='text-muted-foreground text-center mb-8'>
          Vamos criar sua organização para começar.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='organizationName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Organização</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Minha Organização'
                      {...field}
                      onChange={handleOrganizationNameChange}
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
                  <FormLabel>Identificador URL</FormLabel>
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

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Criando...
                </>
              ) : (
                'Criar Organização'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
