// components/settings/invite-user-modal.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTenantProjects } from '@/hooks/use-tenant-projects';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    ),
  role: z.enum(['ADMIN', 'MANAGER', 'USER'], {
    message: 'Please select a valid role.',
  }),
  projectIds: z.array(z.string()).optional(),
});

interface Project {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  canInviteAdmin: boolean;
}

export function InviteUserModal({
  isOpen,
  onClose,
  tenantId,
  canInviteAdmin,
}: InviteUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { projects } = useTenantProjects(tenantId);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      role: 'USER',
      projectIds: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      console.log('Form values being submitted:', {
        ...values,
        password: '[REDACTED]',
        tenantId,
      });

      const response = await axios.post('/api/users', {
        ...values,
        tenantId,
      });
      console.log('User created successfully:', response.data);

      toast.success('User created successfully', {
        description: `User ${values.email} has been created and assigned to the tenant.`,
      });

      form.reset();
      onClose();
      router.refresh();
    } catch (error: any) {
      console.error('Error creating user:', error);
      console.error('Error response:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // Show more specific error message
      const errorMessage =
        error.response?.data?.details ||
        error.response?.data?.error ||
        'Failed to create user';
      toast.error('Error creating user', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new user</DialogTitle>
          <DialogDescription>
            Create a new user and assign them to your organization.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='user@example.com'
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='John Doe'
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                      placeholder='Enter password'
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleciona a opção' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {canInviteAdmin && (
                        <SelectItem value='ADMIN'>Admin</SelectItem>
                      )}
                      <SelectItem value='MANAGER'>Manager</SelectItem>
                      <SelectItem value='USER'>User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='projectIds'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projects</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={(value) => {
                      const currentValues = field.value || [];
                      if (currentValues.includes(value)) {
                        field.onChange(
                          currentValues.filter((id) => id !== value)
                        );
                      } else {
                        field.onChange([...currentValues, value]);
                      }
                    }}
                    value={field.value?.[0]}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleciona a opção' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects?.map((project: Project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {field.value?.map((projectId) => {
                      const project = projects?.find(
                        (p: Project) => p.id === projectId
                      );
                      return project ? (
                        <div
                          key={project.id}
                          className='flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm'
                        >
                          {project.name}
                          <button
                            type='button'
                            onClick={() => {
                              field.onChange(
                                field.value?.filter((id) => id !== project.id)
                              );
                            }}
                            className='ml-1 text-muted-foreground hover:text-foreground'
                          >
                            ×
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
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
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
