"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { paymentsHttp } from "@/utils/http";
import { getUserIdFromToken } from "@/utils/tokenUtils";
import { ValidateAddon } from "@/types/addon";

interface ProtectAddonProps {
  children: React.ReactNode;
  category?: number;
  sessionKeyName?: string;
  validateFn?: (payload: ValidateAddon) => Promise<{ allowed: boolean; status?: string }>;
  purchaseUrl?: string;
}

export const ProtectAddon = ({
  children,
  category,
  sessionKeyName = "key",
  validateFn,
  purchaseUrl = "/payment",
}: ProtectAddonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      setIsLoading(true);

      try {
        const sessionKey =
          typeof window !== "undefined"
            ? sessionStorage.getItem(sessionKeyName) || undefined
            : undefined;

        const accessToken =
          typeof window !== "undefined"
            ? sessionStorage.getItem("accessToken") || ""
            : "";

        const accountId = getUserIdFromToken(accessToken || "") || undefined;

        if (!accessToken) {
          router.push("/login");
          return;
        }

        const payload: ValidateAddon = { sessionKey, accountId, category };

        const doValidate = validateFn
          ? validateFn
          : async (p: ValidateAddon) => {
              const res = await paymentsHttp.post("/license-key-addons/validate", p);
              return res.data as { allowed: boolean; status?: string };
            };

        const result = await Promise.race([
          doValidate(payload),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Validation timeout")), 8000)
          ),
        ]);

        if (mounted) {
          setIsAllowed(Boolean(result.allowed));
          setIsLoading(false);
        }
      } catch (err) {
        console.error("ProtectAddon: validation failed", err);
        if (mounted) {
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

  if (!isAllowed) {
    return (
      <div className="relative min-h-screen">
        {/* Overlay — gradient nhẹ, không blur */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/60 flex flex-col items-center justify-center z-20 transition-opacity duration-300">
          <div className="bg-white/5 border border-white/20 rounded-xl p-8 text-center max-w-md mx-auto">
            {/* Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 mb-4 text-blue-400 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c1.657 0 3-1.343 3-3V5a3 3 0 10-6 0v3c0 1.657 1.343 3 3 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z"
              />
            </svg>

            <h2 className="text-2xl font-bold text-white mb-2">
              Nội dung bị khóa
            </h2>
            <p className="text-gray-200 mb-6 text-sm leading-relaxed">
              Bạn chưa có quyền truy cập vào trang này.<br />
              Hãy mua dịch vụ để mở khóa nội dung này.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push(purchaseUrl)}
                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md transition-all hover:bg-blue-700 hover:scale-105"
              >
                Mua ngay
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-5 py-2 border border-gray-300 text-gray-100 rounded-md transition-all hover:bg-gray-100 hover:text-black hover:scale-105"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>

        {/* Background mờ nhẹ */}
        <div className="filter brightness-75 pointer-events-none">{children}</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectAddon;
