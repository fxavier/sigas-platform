// components/settings/users-list.tsx
'use client';

import { useState } from 'react';
import { User, Tenant, UserInvitation } from '@prisma/client';
import { UserPlus, MoreHorizontal, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InviteUserModal } from '@/components/settings/invite-user-modal';
import { EditUserRoleModal } from '@/components/settings/edit-user-role-modal';
import { toast } from 'sonner';
import axios from 'axios';

interface UsersListProps {
  users: User[];
  invitations: UserInvitation[];
  currentUser: User;
  tenant: Tenant;
}

export function UsersList({
  users,
  invitations,
  currentUser,
  tenant,
}: UsersListProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = currentUser.role === 'ADMIN';

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      setIsLoading(true);

      await axios.delete(
        `/api/tenants/${tenant.id}/invitations/${invitationId}`
      );

      toast.success('Invitation canceled', {
        description: 'The invitation has been canceled successfully.',
      });

      // Refresh the page
      window.location.reload();
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to cancel the invitation.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      setIsLoading(true);

      await axios.post(
        `/api/tenants/${tenant.id}/invitations/${invitationId}/resend`
      );

      toast.success('Invitation resent', {
        description: 'The invitation has been resent successfully.',
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to resend the invitation.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // Show confirmation dialog
    if (
      !confirm(
        'Are you sure you want to remove this user? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);

      await axios.delete(`/api/users/${userId}`);

      toast.success('User removed', {
        description: 'The user has been removed successfully.',
      });

      // Refresh the page
      window.location.reload();
    } catch (error: any) {
      toast.error('Error', {
        description: error.response?.data || 'Failed to remove the user.',
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

  return (
    <div className='space-y-8'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage team members and their roles.
              </CardDescription>
            </div>
            <Button onClick={() => setIsInviteModalOpen(true)}>
              <UserPlus className='mr-2 h-4 w-4' />
              Invite User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='flex items-center space-x-3'>
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className='text-right'>
                    {/* Don't show actions for current user */}
                    {currentUser.id !== user.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          {isAdmin && (
                            <DropdownMenuItem
                              onClick={() => handleEditUser(user)}
                            >
                              Edit Role
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {isAdmin && (
                            <DropdownMenuItem
                              className='text-red-600'
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Remove User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>
              Users who have been invited but haven't accepted yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invitation.role === 'ADMIN'
                            ? 'default'
                            : invitation.role === 'MANAGER'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {invitation.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(invitation.expires).toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-right flex justify-end space-x-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleResendInvitation(invitation.id)}
                        disabled={isLoading}
                      >
                        <RefreshCw className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleCancelInvitation(invitation.id)}
                        disabled={isLoading}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        tenantId={tenant.id}
        canInviteAdmin={isAdmin}
      />

      {selectedUser && (
        <EditUserRoleModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={selectedUser}
          tenantId={tenant.id}
        />
      )}
    </div>
  );
}
