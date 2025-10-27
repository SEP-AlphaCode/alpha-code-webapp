"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { paymentsHttp } from '@/utils/http';
import { getUserIdFromToken } from '@/utils/tokenUtils';
import { ValidateAddon } from '@/types/addon';

interface ProtectAddonProps {
  children: React.ReactNode;
  category?: number; //
  sessionKeyName?: string;
  validateFn?: (payload: ValidateAddon) => Promise<{ allowed: boolean; status?: string }>;
  purchaseUrl?: string;
}

export const ProtectAddon = ({
  children,
  category,
  sessionKeyName = 'key',
  validateFn,
  purchaseUrl = '/payment',
}: ProtectAddonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      setIsLoading(true);
      setErrorMsg(null);

      try {
        const sessionKey =
          typeof window !== 'undefined'
            ? sessionStorage.getItem(sessionKeyName) || undefined
            : undefined;

        const accessToken =
          typeof window !== 'undefined'
            ? sessionStorage.getItem('accessToken') || ''
            : '';

        const accountId = getUserIdFromToken(accessToken || '') || undefined;

        if (!accessToken) {
          router.push('/login');
          return;
        }

        const payload: ValidateAddon = { sessionKey, accountId, category };

        const doValidate = validateFn
          ? validateFn
          : async (p: ValidateAddon) => {
              const res = await paymentsHttp.post('/access/validate', p);
              return res.data as { allowed: boolean; status?: string };
            };

        const result = await Promise.race([
          doValidate(payload),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Validation timeout')), 8000)
          ),
        ]);

        if (mounted) {
          setIsAllowed(Boolean(result.allowed));
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('ProtectAddon: validation failed', err);
        if (mounted) {
          setErrorMsg(err?.message || 'Không thể kiểm tra quyền truy cập');
          setIsAllowed(false);
          setIsLoading(false);
        }
      }
    };

    checkAccess();
    return () => {
      mounted = false;
    };
  }, [category, sessionKeyName, validateFn, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isAllowed) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <h2 className="text-2xl font-semibold mb-2">Nội dung bị khóa</h2>
        <p className="text-neutral-600 mb-6">
          {errorMsg ?? 'Bạn chưa có quyền truy cập vào trang này. Hãy mua dịch vụ để mở khóa.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push(purchaseUrl)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Mua ngay
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 border rounded-md"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtectAddon;
