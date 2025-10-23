"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const method = searchParams?.get("method") || "unknown"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="p-8 bg-slate-800 border-slate-700 max-w-md w-full text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Thanh toán thành công!</h1>
        <p className="text-slate-400 mb-6">Đơn hàng của bạn đã được xử lý thành công qua {method}</p>

        <div className="bg-slate-700/50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-slate-400 mb-2">Mã đơn hàng:</p>
          <p className="text-white font-mono font-semibold">#ORD-{Date.now()}</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => router.push("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/orders")}
            className="w-full border-slate-600 text-white hover:bg-slate-700"
          >
            Xem đơn hàng của tôi
          </Button>
        </div>
      </Card>
    </div>
  )
}
