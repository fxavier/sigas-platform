// lib/context/auth-context.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useUser as useClerkUser } from '@clerk/nextjs';
import { User } from '@prisma/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const { isLoaded } = useClerkUser();

  return (
    <AuthContext.Provider value={{ user: initialUser, isLoading: !isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
