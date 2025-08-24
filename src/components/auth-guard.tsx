'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isValidToken, clearAuthData } from '@/utils/tokenUtils';
import { getRoleFromToken, getAccountDataFromStorage } from '@/utils/roleUtils';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = sessionStorage.getItem('accessToken');

      if (!accessToken) {
        clearAuthData();
        router.push('/login');
        return;
      }

      // Validate token format and expiry
      if (!isValidToken(accessToken)) {
        console.log('Invalid or expired token, redirecting to login');
        clearAuthData();
        router.push('/login');
        return;
      }

      // Check role-based access
      if (allowedRoles && allowedRoles.length > 0) {
        // First try to get account data from session storage
        const accountData = getAccountDataFromStorage();
        
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
              router.push('/student');
            }
            return;
          }
        } else {
          // Fallback: try to get role from token directly
          const roleFromToken = getRoleFromToken(accessToken);
          console.log('Role from token:', roleFromToken);
          
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
                router.push('/student');
              }
              return;
            }
          } else {
            console.log('No role found, allowing access');
          }
        }
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
