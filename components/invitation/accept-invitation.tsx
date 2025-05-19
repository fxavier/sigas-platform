// components/invitation/accept-invitation.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AcceptInvitationProps {
  token: string;
  email: string;
  tenantId: string;
  tenantName: string;
  role: string;
}

export function AcceptInvitation({
  token,
  email,
  tenantId,
  tenantName,
  role,
}: AcceptInvitationProps) {
  const router = useRouter();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);

  const isLoaded = signInLoaded && signUpLoaded;

  // Check if user already exists and sign them in, or create a new account
  const handleAcceptInvitation = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);

      // Try signing in first
      try {
        await signIn?.create({
          identifier: email,
          // This will redirect to the password page if the user exists
        });

        // If the user exists, they will be redirected to enter their password
        // After successful sign-in, we'll call the API to accept the invitation
        await axios.post(`/api/tenants/${tenantId}/invitations/${token}`);

        toast.success('Invitation accepted', {
          description: `You have successfully joined ${tenantName}.`,
        });

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (error) {
        // User doesn't exist, let's sign them up
        try {
          await signUp?.create({
            emailAddress: email,
            // This will redirect to the complete sign-up form
          });

          // After they complete sign-up, we'll handle the invitation acceptance
          // in the webhook when the user is created
        } catch (signUpError) {
          console.error('Error signing up:', signUpError);
          toast.error('Error', {
            description: 'Failed to create your account. Please try again.',
          });
        }
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error('Error', {
        description: 'Failed to accept the invitation. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>You're invited to join {tenantName}</CardTitle>
        <CardDescription>
          Accept this invitation to join the organization.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <p className='text-sm font-medium'>Email</p>
          <p className='text-gray-600'>{email}</p>
        </div>
        <div className='space-y-2'>
          <p className='text-sm font-medium'>Role</p>
          <Badge
            variant={
              role === 'ADMIN'
                ? 'default'
                : role === 'MANAGER'
                ? 'secondary'
                : 'outline'
            }
          >
            {role}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className='w-full'
          onClick={handleAcceptInvitation}
          disabled={isLoading || !isLoaded}
        >
          {isLoading ? 'Processing...' : 'Accept Invitation'}
        </Button>
      </CardFooter>
    </Card>
  );
}
