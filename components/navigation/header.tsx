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
import { ChevronDown } from 'lucide-react';

interface HeaderProps {
  tenant: Tenant;
  user: User;
}

export function Header({ tenant, user }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className='bg-white border-b h-16 flex items-center px-6'>
      <div className='flex-1 flex items-center space-x-4'>
        <Link
          href={`/tenants/${tenant.slug}/dashboard`}
          className='font-bold text-xl'
        >
          {tenant.name}
        </Link>

        {/* Current section/page indicator */}
        {pathname.includes('/projects/') && (
          <div className='flex items-center text-gray-500'>
            <span className='mx-2'>/</span>
            <span>Project</span>
          </div>
        )}

        {pathname.includes('/settings') && (
          <div className='flex items-center text-gray-500'>
            <span className='mx-2'>/</span>
            <span>Settings</span>
          </div>
        )}
      </div>

      <div className='flex items-center space-x-4'>
        {/* Settings dropdown for admins and managers */}
        {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm'>
                Settings
                <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Organization Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href={`/tenants/${tenant.slug}/settings/users`}>
                  User Management
                </Link>
              </DropdownMenuItem>

              {user.role === 'ADMIN' && (
                <DropdownMenuItem asChild>
                  <Link href={`/tenants/${tenant.slug}/settings/general`}>
                    Organization Settings
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
