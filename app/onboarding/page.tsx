// app/onboarding/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  tenantName: z.string().min(3, {
    message: 'Tenant name must be at least 3 characters long.',
  }),
  slug: z
    .string()
    .min(3, {
      message: 'Slug must be at least 3 characters long.',
    })
    .regex(/^[a-z0-9-]+$/, {
      message: 'Slug can only contain lowercase letters, numbers, and hyphens.',
    }),
});

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantName: '',
      slug: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const response = await axios.post('/api/tenants', {
        name: values.tenantName,
        slug: values.slug,
        description: `${values.tenantName} organization`, // Optional
      });

      toast.success('Organization created!', {
        description: 'Your organization has been created successfully.',
      });

      router.push(`/tenants/${response.data.slug}/dashboard`);
    } catch (error: any) {
      console.error('Error creating tenant:', error);

      toast.error('Failed to create organization', {
        description: error.response?.data || 'Please try again later.',
      });

      // If the error is due to a duplicate slug, suggest a different one
      if (
        error.response?.status === 400 &&
        error.response?.data?.includes('Slug is already taken')
      ) {
        const newSlug = `${values.slug}-${Math.floor(Math.random() * 1000)}`;
        form.setValue('slug', newSlug);

        toast('Slug already taken', {
          description: `We've suggested a new slug: ${newSlug}`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Auto-generate slug from tenant name
  const handleTenantNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('tenantName', name);

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, ''); // Remove special characters

    form.setValue('slug', slug);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        <h1 className='text-2xl font-bold text-center mb-6'>
          Welcome to Our App
        </h1>
        <p className='text-gray-600 text-center mb-8'>
          Let's create your organization to get started.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='tenantName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Acme Inc.'
                      onChange={handleTenantNameChange}
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
                  <FormLabel>URL Identifier</FormLabel>
                  <FormControl>
                    <div className='flex items-center'>
                      <span className='text-gray-500 bg-gray-100 px-3 py-2 border border-r-0 rounded-l-md'>
                        example.com/tenants/
                      </span>
                      <Input
                        {...field}
                        className='rounded-l-none'
                        placeholder='acme-inc'
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Organization'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
