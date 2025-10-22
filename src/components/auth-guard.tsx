'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthData, getTokenPayload, isValidToken, isTokenExpired } from '@/utils/tokenUtils';
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
      try {
        console.log('AuthGuard: Starting auth check...');
        const accessToken = sessionStorage.getItem('accessToken');

        // If no token, redirect to login
        if (!accessToken) {
          clearAuthData();
          router.push('/login');
          return;
        }

        const accountData = getTokenPayload(accessToken || '');
        
        // Quick token validation without network calls first
        if (isTokenExpired(accessToken)) {
          // Token is expired, try to refresh with timeout
          try {
            const isValid = await Promise.race([
              isValidToken(accessToken),
              new Promise<boolean>((_, reject) => 
                setTimeout(() => reject(new Error('Auth check timeout')), 5000)
              )
            ]);

            if (!isValid) {
              clearAuthData();
              router.push('/login');
              return;
            }
          } catch (error) {
            // If refresh fails or times out, clear auth and redirect
            console.error('Token refresh failed or timed out:', error);
            clearAuthData();
            router.push('/login');
            return;
          }
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
            const hasRequiredRole = allowedRoles.some((role: string) => 
              role.toLowerCase() === userRole
            );
            
            if (!hasRequiredRole) {
              // Redirect to appropriate page based on user's role
              if (userRole === 'admin') {
                router.push('/admin');
              } else if (userRole === 'parent' || userRole === 'user') {
                router.push('/user');
              } else if (userRole === 'staff') {
                router.push('/staff');
              } else if (userRole === 'children') {
                router.push('/children');
              } else {
                router.push('/user');
              }
              return;
            }
          } else {
            // Fallback: try to get role from token directly
            const roleFromToken = getRoleFromToken(accessToken || '');
            
            if (roleFromToken) {
              const userRole = roleFromToken.toLowerCase();
              const hasRequiredRole = allowedRoles.some((role: string) => 
                role.toLowerCase() === userRole
              );
              
              if (!hasRequiredRole) {
                // Redirect to appropriate page based on user's role
                if (userRole === 'admin') {
                  router.push('/admin');
                } else if (userRole === 'parent' || userRole === 'user') {
                  router.push('/user');
                } else if (userRole === 'staff') {
                  router.push('/staff');
                } else if (userRole === 'children') {
                  router.push('/children');
                } else {
                  router.push('/user');
                }
                return;
              }
            }
          }
        }
        
        console.log('AuthGuard: Auth check successful, setting authenticated');
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();
        router.push('/login');
      }
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
