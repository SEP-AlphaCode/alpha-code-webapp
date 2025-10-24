import Link from 'next/link'

type Props = {
  searchParams?: {
    success?: string
    method?: string
    id?: string
  }
}

export default function PaymentResultPage({ searchParams }: Props) {
  const success = String(searchParams?.success ?? '').toLowerCase() === 'true'
  const method = typeof searchParams?.method === 'string' ? searchParams?.method : undefined
  const id = typeof searchParams?.id === 'string' ? searchParams?.id : undefined

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F4F4' }}>
      <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg text-center">
        {success ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/pulling_down_2.gif" alt="Thanh toán thành công" className="mx-auto w-36 h-36 object-contain mb-6" />
            <h1 className="text-2xl font-bold text-foreground">Thanh toán thành công</h1>
            <p className="text-sm text-muted-foreground mt-2">Cảm ơn bạn đã hoàn tất thanh toán. Giao dịch của bạn đã được ghi nhận.</p>

            <div className="mt-6 flex justify-center gap-3">
              <Link href="/" className="px-4 py-2 rounded-lg bg-muted/20 hover:bg-muted/30 text-foreground">
                Về trang chủ
              </Link>

              {method && id ? (
                <Link href={`/payment/success?method=${encodeURIComponent(method)}&id=${encodeURIComponent(id)}`} className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-95">
                  Xem chi tiết đơn hàng
                </Link>
              ) : (
                <Link href="/payment" className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-95">
                  Quay lại thanh toán
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-6">
              {/* simple X mark */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-foreground">Thanh toán không thành công</h1>
            <p className="text-sm text-muted-foreground mt-2">Có lỗi xảy ra hoặc giao dịch đã bị hủy. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu cần.</p>

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
  )
}
