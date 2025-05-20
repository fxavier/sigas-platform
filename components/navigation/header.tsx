// components/navigation/header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tenant, User } from '@prisma/client';
import { UserButton } from '@clerk/nextjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Bell, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface HeaderProps {
  tenant: Tenant;
  user: User;
}

export function Header({ tenant, user }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-6'>
      <div className='flex-1 flex items-center space-x-4'>
        <Link
          href={`/tenants/${tenant.slug}/dashboard`}
          className='font-bold text-xl'
        >
          {tenant.name}
        </Link>

        {/* Current section/page indicator */}
        {pathname.includes('/projects/') && (
          <div className='flex items-center text-gray-500 dark:text-gray-400'>
            <span className='mx-2'>/</span>
            <span>Projetos</span>
          </div>
        )}

        {pathname.includes('/settings') && (
          <div className='flex items-center text-gray-500 dark:text-gray-400'>
            <span className='mx-2'>/</span>
            <span>Configurações</span>
          </div>
        )}
      </div>

      <div className='flex items-center space-x-4'>
        {/* Search Button */}
        <Button variant='ghost' size='icon'>
          <Search className='h-5 w-5' />
        </Button>

        {/* Notifications */}
        <Button variant='ghost' size='icon'>
          <Bell className='h-5 w-5' />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Settings dropdown for admins and managers */}
        {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm'>
                Configurações
                <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Configurações</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href={`/tenants/${tenant.slug}/settings/users`}>
                  Gestão de Usuários
                </Link>
              </DropdownMenuItem>

              {user.role === 'ADMIN' && (
                <DropdownMenuItem asChild>
                  <Link href={`/tenants/${tenant.slug}/settings/general`}>
                    Configurações da Organização
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* User menu */}
        <UserButton afterSignOutUrl='/sign-in' />
      </div>
    </header>
  );
}
