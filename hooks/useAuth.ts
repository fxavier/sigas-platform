// hooks/useAuth.ts
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '@prisma/client';

export const useAuth = () => {
  const { userId, isLoaded, isSignedIn } = useClerkAuth();

  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await axios.get('/api/users/me');
      return response.data;
    },
    enabled: !!userId && isLoaded && isSignedIn,
  });

  return {
    user,
    isLoading: !isLoaded || isLoadingUser,
    isSignedIn,
  };
};
