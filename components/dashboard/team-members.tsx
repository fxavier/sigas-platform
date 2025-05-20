// components/dashboard/team-members.tsx
import { Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

interface TeamMember {
  name: string;
  role: string;
  online: boolean;
}

interface TeamMembersProps {
  members: TeamMember[];
}

export function TeamMembers({ members }: TeamMembersProps) {
  return (
    <Card className='animate-in fade-in duration-500'>
      <CardHeader>
        <CardTitle>Equipe</CardTitle>
        <CardDescription>
          Membros envolvidos nos projetos ativos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-4'>
          {members.map((member, index) => (
            <div
              key={index}
              className='flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3'
            >
              <div className='relative'>
                <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
                  <Users className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                </div>
                {member.online && (
                  <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full'></span>
                )}
              </div>
              <div>
                <p className='font-medium'>{member.name}</p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className='border-t border-gray-200 dark:border-gray-800 px-6 py-4'>
        <Link
          href='/users'
          className='text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
        >
          Ver toda a equipe
        </Link>
      </CardFooter>
    </Card>
  );
}
