"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();

  const success =
    String(searchParams.get("success") ?? "").toLowerCase() === "true";
  const method = searchParams.get("method") || undefined;
  const id = searchParams.get("id") || undefined;

  const detailLink =
    method && id
      ? `/payment/success?method=${encodeURIComponent(
          method
        )}&id=${encodeURIComponent(id)}`
      : "/payment";

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden
      ${
        success
          ? "bg-gradient-to-b from-white via-gray-50 to-green-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-green-900"
          : "bg-gradient-to-b from-white via-gray-50 to-red-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-red-900"
      }`}
    >
      {/* Grid pattern */}
      <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* Card */}
      <div className="max-w-md w-full p-10 bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-700 text-center space-y-6 relative z-10 animate-fadeIn">
        {success ? (
          <>
            <div className="flex justify-center relative">
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900 opacity-40 blur-2xl animate-pulse" />
              </div>
              <CheckCircle2 className="w-24 h-24 text-emerald-500 dark:text-emerald-400 relative animate-scaleIn" />
            </div>

            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              Thanh toán thành công
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
              Cảm ơn bạn! Giao dịch đã được ghi nhận và sẽ sớm được xử lý.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-sm transition"
              >
                Về trang chủ
              </Link>
              <Link
                href={detailLink}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-sm transition"
              >
                {method && id ? "Xem đơn hàng" : "Quay lại thanh toán"}
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center relative">
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900 opacity-40 blur-2xl animate-pulse" />
              </div>
              <XCircle className="w-24 h-24 text-red-500 dark:text-red-400 relative animate-scaleIn" />
            </div>

            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              Thanh toán thất bại
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
              Giao dịch bị hủy hoặc xảy ra lỗi. Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/payment"
                className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-sm transition"
              >
                Thử lại
              </Link>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-sm transition"
              >
                Về trang chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
