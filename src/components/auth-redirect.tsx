'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isValidToken } from '@/utils/tokenUtils';
import { getRoleFromToken, getAccountDataFromStorage } from '@/utils/roleUtils';

export const AuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const accessToken = sessionStorage.getItem('accessToken');

      // If user is already logged in, redirect to appropriate dashboard
      if (accessToken && isValidToken(accessToken)) {
        // First try to get account data from session storage
        const accountData = getAccountDataFromStorage();
        
        if (accountData && accountData.roleName) {
          console.log('User already logged in, redirecting based on stored role:', accountData.roleName);
          
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
          console.log('User already logged in, role from token:', roleFromToken);
          
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
            console.log('No role found, redirecting to admin dashboard');
            router.push('/admin');
          }
        }
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return null;
};
