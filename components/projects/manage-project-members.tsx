// components/projects/manage-project-members.tsx
'use client';

import { useState, useEffect } from 'react';
import { Project, Tenant, User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, X, Search, RefreshCw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface ManageProjectMembersProps {
  project: Project;
  tenant: Tenant;
  currentUser: User;
}

export function ManageProjectMembers({
  project,
  tenant,
  currentUser,
}: ManageProjectMembersProps) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if current user can manage project members
  const canManageMembers =
    currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER';

  // Fetch current project members
  const {
    data: projectMembers = [],
    isLoading: isLoadingMembers,
    refetch: refetchMembers,
  } = useQuery({
    queryKey: ['projectMembers', project.id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/tenants/${tenant.id}/projects/${project.id}/users`
      );
      return response.data;
    },
  });

  // Fetch tenant users who are not assigned to this project
  const {
    data: availableUsers = [],
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ['availableUsers', tenant.id, project.id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/tenants/${tenant.id}/users/available?projectId=${project.id}`
      );
      return response.data;
    },
    enabled: isAssignDialogOpen, // Only fetch when dialog is open
  });

  // Filtered available users based on search
  const filteredUsers = searchQuery
    ? availableUsers.filter(
        (user: User) =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableUsers;

  // Toggle user selection
  const toggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Assign users to project
  const handleAssignUsers = async () => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected', {
        description:
          'Please select at least one user to assign to the project.',
      });
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        `/api/tenants/${tenant.id}/projects/${project.id}/users`,
        {
          userIds: selectedUsers,
        }
      );

      toast.success('Users assigned', {
        description: `${selectedUsers.length} user(s) have been assigned to the project.`,
      });

      // Reset and close dialog
      setSelectedUsers([]);
      setIsAssignDialogOpen(false);

      // Refresh the member list
      refetchMembers();
    } catch (error: any) {
      toast.error('Error', {
        description:
          error.response?.data || 'Failed to assign users to the project.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove user from project
  const handleRemoveUser = async (userId: string) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `/api/tenants/${tenant.id}/projects/${project.id}/users/${userId}`
      );

      toast.success('User removed', {
        description: 'The user has been removed from the project.',
      });

      // Refresh the member list
      refetchMembers();
    } catch (error: any) {
      toast.error('Error', {
        description:
          error.response?.data || 'Failed to remove user from the project.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get initials from name or email
  const getInitials = (user: User) => {
    if (user.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }

    return user.email.substring(0, 2).toUpperCase();
  };

  // Reset selected users when dialog opens
  useEffect(() => {
    if (isAssignDialogOpen) {
      setSelectedUsers([]);
      setSearchQuery('');
      refetchUsers();
    }
  }, [isAssignDialogOpen, refetchUsers]);

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle>Project Members</CardTitle>
          <CardDescription>
            Manage users assigned to this project
          </CardDescription>
        </div>
        {canManageMembers && (
          <Button onClick={() => setIsAssignDialogOpen(true)}>
            <Plus className='h-4 w-4 mr-2' />
            Assign Users
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoadingMembers ? (
          <div className='flex justify-center py-8'>
            <RefreshCw className='h-6 w-6 animate-spin text-primary' />
          </div>
        ) : projectMembers.length === 0 ? (
          <div className='text-center py-8 border rounded-lg'>
            <p className='text-muted-foreground'>
              No users are assigned to this project yet.
            </p>
            {canManageMembers && (
              <Button
                variant='outline'
                className='mt-4'
                onClick={() => setIsAssignDialogOpen(true)}
              >
                <Plus className='h-4 w-4 mr-2' />
                Assign Users
              </Button>
            )}
          </div>
        ) : (
          <div className='space-y-4'>
            {projectMembers.map((user: User) => (
              <div
                key={user.id}
                className='flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50'
              >
                <div className='flex items-center space-x-3'>
                  <Avatar>
                    <AvatarImage src={user.imageUrl || undefined} />
                    <AvatarFallback>{getInitials(user)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='font-medium'>
                      {user.name || 'Anonymous'}
                    </div>
                    <div className='text-sm text-gray-500'>{user.email}</div>
                  </div>
                  <Badge
                    variant={
                      user.role === 'ADMIN'
                        ? 'default'
                        : user.role === 'MANAGER'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {user.role}
                  </Badge>
                </div>
                {canManageMembers && user.id !== currentUser.id && (
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleRemoveUser(user.id)}
                    disabled={isLoading}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Assign Users Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Assign Users to Project</DialogTitle>
              <DialogDescription>
                Select users to assign to "{project.name}".
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4 py-4'>
              <div className='relative'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search users...'
                  className='pl-8'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {isLoadingUsers ? (
                <div className='flex justify-center py-8'>
                  <RefreshCw className='h-6 w-6 animate-spin text-primary' />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className='text-center py-4'>
                  <p className='text-muted-foreground'>
                    {searchQuery
                      ? 'No matching users found.'
                      : 'All users are already assigned to this project.'}
                  </p>
                </div>
              ) : (
                <ScrollArea className='h-[300px] rounded-md border'>
                  <div className='p-4 space-y-3'>
                    {filteredUsers.map((user: User) => (
                      <div
                        key={user.id}
                        className='flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-100'
                      >
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUser(user.id)}
                        />
                        <Avatar className='h-8 w-8'>
                          <AvatarImage src={user.imageUrl || undefined} />
                          <AvatarFallback>{getInitials(user)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='font-medium'>
                            {user.name || 'Anonymous'}
                          </div>
                          <div className='text-xs text-gray-500'>
                            {user.email}
                          </div>
                        </div>
                        <Badge
                          variant={
                            user.role === 'ADMIN'
                              ? 'default'
                              : user.role === 'MANAGER'
                              ? 'secondary'
                              : 'outline'
                          }
                          className='ml-auto'
                        >
                          {user.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            <div className='flex justify-between items-center mt-4'>
              <div className='text-sm text-muted-foreground'>
                {selectedUsers.length} user(s) selected
              </div>
              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  onClick={() => setIsAssignDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignUsers}
                  disabled={isLoading || selectedUsers.length === 0}
                >
                  {isLoading ? 'Assigning...' : 'Assign to Project'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
