// app/tenant-selection/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Tenant } from '@prisma/client';

// Form schema for creating a tenant
const formSchema = z.object({
  tenantName: z.string().min(3, {
    message: 'Organization name must be at least 3 characters.',
  }),
  slug: z
    .string()
    .min(3, {
      message: 'Slug must be at least 3 characters.',
    })
    .regex(/^[a-z0-9-]+$/, {
      message: 'Slug can only contain lowercase letters, numbers, and hyphens.',
    }),
  description: z.string().optional(),
});

export default function TenantSelectionPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [activeTab, setActiveTab] = useState('join');

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantName: '',
      slug: '',
      description: '',
    },
  });

  // Fetch available tenants
  useEffect(() => {
    if (isLoaded && userId) {
      const fetchTenants = async () => {
        try {
          const response = await axios.get('/api/tenants/available');
          setTenants(response.data);

          // If no tenants available, switch to create tab
          if (response.data.length === 0) {
            setActiveTab('create');
          }

          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching tenants:', error);
          setIsLoading(false);
        }
      };

      fetchTenants();
    }
  }, [isLoaded, userId]);

  // Handle tenant creation
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const response = await axios.post('/api/tenants', {
        name: values.tenantName,
        slug: values.slug,
        description: values.description || `${values.tenantName} organization`,
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
    } finally {
      setIsLoading(false);
    }
  }

  // Handle joining a tenant
  const handleJoinTenant = async (tenantId: string) => {
    try {
      setIsLoading(true);

      await axios.post(`/api/tenants/${tenantId}/join`);

      toast.success('Success!', {
        description: 'You have joined the organization.',
      });

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error joining tenant:', error);

      toast.error('Failed to join organization', {
        description: error.response?.data || 'Please try again later.',
      });

      setIsLoading(false);
    }
  };

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

  if (!isLoaded || isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='container max-w-3xl mx-auto py-12 px-4'>
      <h1 className='text-3xl font-bold mb-6 text-center'>
        Welcome, {user?.firstName || 'User'}!
      </h1>
      <p className='text-muted-foreground text-center mb-8'>
        Join an existing organization or create your own.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='mx-auto'>
        <TabsList className='grid w-full grid-cols-2 mb-8'>
          <TabsTrigger value='join'>Join Organization</TabsTrigger>
          <TabsTrigger value='create'>Create Organization</TabsTrigger>
        </TabsList>

        <TabsContent value='join'>
          {tenants.length === 0 ? (
            <div className='text-center py-12 border rounded-lg'>
              <h3 className='text-lg font-medium mb-2'>
                No Organizations Available
              </h3>
              <p className='text-muted-foreground mb-4'>
                There are no organizations available to join.
              </p>
              <Button onClick={() => setActiveTab('create')}>
                Create Your Organization
              </Button>
            </div>
          ) : (
            <div className='grid gap-4'>
              {tenants.map((tenant) => (
                <Card key={tenant.id}>
                  <CardHeader>
                    <CardTitle>{tenant.name}</CardTitle>
                    <CardDescription>
                      {tenant.description || 'No description'}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      onClick={() => handleJoinTenant(tenant.id)}
                      disabled={isLoading}
                      className='ml-auto'
                    >
                      Join Organization
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='create'>
          <Card>
            <CardHeader>
              <CardTitle>Create New Organization</CardTitle>
              <CardDescription>
                Set up your organization to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-6'
                >
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

                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='Brief description of your organization'
                            disabled={isLoading}
                          />
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
