'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthData, getTokenPayload, isValidToken } from '@/utils/tokenUtils';
import { getRoleFromToken } from '@/utils/roleUtils';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const checkAuth = async () => {
      const accessToken = sessionStorage.getItem('accessToken');

      // If no token, redirect to login
      if (!accessToken) {
        clearAuthData();
        router.push('/login');
        return;
      }

      const accountData = getTokenPayload(accessToken || '');
      // Validate token format and expiry
      if (!(await isValidToken(accessToken))) {
        clearAuthData();
        router.push('/login');
        return;
      }

      // If accountData is null (token decode failed), redirect to login
      if (!accountData) {
        clearAuthData();
        router.push('/login');
        return;
      }

      // Check role-based access
      if (allowedRoles && allowedRoles.length > 0) {
        // First try to get account data from session storage        
        if (accountData && accountData.roleName) {
          const userRole = accountData.roleName.toLowerCase();
          const hasRequiredRole = allowedRoles.some(role => 
            role.toLowerCase() === userRole
          );
          
          if (!hasRequiredRole) {
            // Redirect to appropriate page based on user's role
            if (userRole === 'admin') {
              router.push('/admin');
            } else if (userRole === 'teacher') {
              router.push('/teacher');
            } else {
              router.push('/courses');
            }
            return;
          }
        } else {
          // Fallback: try to get role from token directly
          const roleFromToken = getRoleFromToken(accessToken || '');
          
          if (roleFromToken) {
            const userRole = roleFromToken.toLowerCase();
            const hasRequiredRole = allowedRoles.some(role => 
              role.toLowerCase() === userRole
            );
            
            if (!hasRequiredRole) {
              // Redirect to appropriate page based on user's role
              if (userRole === 'admin') {
                router.push('/admin');
              } else if (userRole === 'teacher') {
                router.push('/teacher');
              } else {
                router.push('/courses');
              }
              return;
            }
          }
        }
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, allowedRoles, isMounted]);

  // Don't render anything until component is mounted
  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" suppressHydrationWarning>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" suppressHydrationWarning></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
