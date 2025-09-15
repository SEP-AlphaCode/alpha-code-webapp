'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTokenPayload, isValidToken } from '@/utils/tokenUtils';
import { getRoleFromToken } from '@/utils/roleUtils';

export const AuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const accessToken = sessionStorage.getItem('accessToken');

      // If user is already logged in, redirect to appropriate dashboard
      if (accessToken && await isValidToken(accessToken)) {
        // First try to get account data from session storage
        const accountData = getTokenPayload(accessToken);
        
        if (accountData && accountData.roleName) {
          const roleNameLower = accountData.roleName.toLowerCase();
          if (roleNameLower === 'admin') {
            router.push('/admin');
          } else if (roleNameLower === 'teacher') {
            router.push('/teacher');
          } else {
            router.push('/student');
          }
        } else {
          // Fallback: get role from token
          const roleFromToken = getRoleFromToken(accessToken);
          
          if (roleFromToken) {
            const roleNameLower = roleFromToken.toLowerCase();
            if (roleNameLower === 'admin') {
              router.push('/admin');
            } else if (roleNameLower === 'teacher') {
              router.push('/teacher');
            } else {
              router.push('/student');
            }
          } else {
            // If no role found, redirect to admin by default
            router.push('/admin');
          }
        }
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return null;
};
