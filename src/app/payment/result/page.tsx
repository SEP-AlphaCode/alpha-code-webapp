"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();

  const success = String(searchParams.get("success") ?? "").toLowerCase() === "true";
  const method = searchParams.get("method") || undefined;
  const id = searchParams.get("id") || undefined;

  const detailLink =
    method && id
      ? `/payment/success?method=${encodeURIComponent(method)}&id=${encodeURIComponent(id)}`
      : "/payment";

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F4F4F4" }}>
      <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg text-center">
        {success ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/pulling_down_2.gif" alt="Thanh toán thành công" className="mx-auto w-36 h-36 object-contain mb-6" />
            <h1 className="text-2xl font-bold text-foreground">Thanh toán thành công</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Cảm ơn bạn đã hoàn tất thanh toán. Giao dịch của bạn đã được ghi nhận.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <Link href="/" className="px-4 py-2 rounded-lg bg-muted/20 hover:bg-muted/30 text-foreground">
                Về trang chủ
              </Link>
              <Link href={detailLink} className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-95">
                {method && id ? "Xem chi tiết đơn hàng" : "Quay lại thanh toán"}
              </Link>
            </div>
          </>
        ) : (
          <>
            <img src="/img_prompt.webp" alt="Thanh toán thất bại" className="mx-auto w-36 h-36 object-contain mb-6" />
            <h1 className="text-2xl font-bold text-foreground">Thanh toán không thành công</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Có lỗi xảy ra hoặc giao dịch đã bị hủy. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu cần.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <Link href="/payment" className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-95">
                Thử lại
              </Link>
              <Link href="/" className="px-4 py-2 rounded-lg bg-muted/20 hover:bg-muted/30 text-foreground">
                Về trang chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
