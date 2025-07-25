// components/projects/project-members.tsx
'use client';

import { useState } from 'react';
import { Project, Tenant, User } from '@prisma/client';
import axios from 'axios';
import { UserPlus, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectMembersProps {
  projectUsers: User[];
  tenantUsers: User[];
  project: Project;
  tenant: Tenant;
  currentUser: User;
}

export function ProjectMembers({
  projectUsers,
  tenantUsers,
  project,
  tenant,
  currentUser,
}: ProjectMembersProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddUsersOpen, setIsAddUsersOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const canManageMembers =
    currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER';

  // Filter out users who are already members of the project
  const availableUsers = tenantUsers.filter(
    (user) => !projectUsers.some((pu) => pu.id === user.id)
  );

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

  // Toggle user selection in the dialog
  const toggleUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  // Add selected users to project
  const addUsersToProject = async () => {
    if (selectedUsers.size === 0) {
      toast.error('Nenhum usuário selecionado', {
        description: 'Por favor selecione pelo menos um usuário para adicionar ao projeto.',
      });
      return;
    }

    try {
      setIsLoading(true);

      await axios.post(
        `/api/tenants/${tenant.id}/projects/${project.id}/users`,
        {
          userIds: Array.from(selectedUsers),
        }
      );

      toast.success('Usuários adicionados', {
        description: `${selectedUsers.size} usuário(s) foi(foram) adicionado(s) ao projeto.`,
      });

      setIsAddUsersOpen(false);
      setSelectedUsers(new Set());

      // Refresh the page to show the updated members
      window.location.reload();
    } catch (error: any) {
      toast.error('Erro', {
        description:
          error.response?.data || 'Falha ao adicionar usuários ao projeto.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove user from project
  const removeUserFromProject = async (userId: string) => {
    try {
      setIsLoading(true);

      await axios.delete(
        `/api/tenants/${tenant.id}/projects/${project.id}/users/${userId}`
      );

      toast.success('Usuário removido', {
        description: 'O usuário foi removido do projeto.',
      });

      // Refresh the page to show the updated members
      window.location.reload();
    } catch (error: any) {
      toast.error('Erro', {
        description:
          error.response?.data || 'Falha ao remover usuário do projeto.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Membros do Projeto</CardTitle>
            <CardDescription>
              Pessoas que têm acesso a este projeto.
            </CardDescription>
          </div>
          {canManageMembers && (
            <Button
              onClick={() => setIsAddUsersOpen(true)}
              disabled={availableUsers.length === 0}
            >
              <UserPlus className='h-4 w-4 mr-2' />
              Adicionar Membros
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {projectUsers.length === 0 ? (
          <div className='text-center p-6 bg-gray-50 rounded-lg'>
            <p className='text-gray-500'>
              Nenhum membro atribuído a este projeto ainda.
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {projectUsers.map((user) => (
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
                      {user.name || 'Anônimo'}
                    </div>
                    <div className='text-sm text-gray-500'>{user.email}</div>
                  </div>
                </div>
                {canManageMembers && user.id !== currentUser.id && (
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => removeUserFromProject(user.id)}
                    disabled={isLoading}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add Users Dialog */}
      <Dialog open={isAddUsersOpen} onOpenChange={setIsAddUsersOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Adicionar Membros do Projeto</DialogTitle>
            <DialogDescription>
              Adicione membros para dar-lhes acesso a este projeto.
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <Command className='rounded-lg border shadow-md'>
              <CommandInput placeholder='Pesquisar usuários...' />
              <CommandList>
                <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className='h-72'>
                    {availableUsers.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.id}
                        onSelect={() => toggleUser(user.id)}
                        className='flex items-center space-x-2 p-2'
                      >
                        <Checkbox
                          checked={selectedUsers.has(user.id)}
                          onCheckedChange={() => toggleUser(user.id)}
                          id={`user-${user.id}`}
                          className='mr-2'
                        />
                        <Avatar className='h-8 w-8'>
                          <AvatarImage src={user.imageUrl || undefined} />
                          <AvatarFallback>{getInitials(user)}</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                          <span className='font-medium'>
                            {user.name || 'Anônimo'}
                          </span>
                          <span className='text-sm text-gray-500'>
                            {user.email}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          <DialogFooter className='sm:justify-between'>
            <div className='flex items-center text-sm text-gray-500'>
              {selectedUsers.size} usuário(s) selecionado(s)
            </div>
            <div className='flex space-x-2'>
              <Button
                variant='outline'
                onClick={() => setIsAddUsersOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={addUsersToProject}
                disabled={isLoading || selectedUsers.size === 0}
              >
                {isLoading ? 'Adicionando...' : 'Adicionar ao Projeto'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
