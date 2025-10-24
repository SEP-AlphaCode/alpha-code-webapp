import { Suspense } from 'react'
import PaymentPageClient from "@/components/payment/payment-page-client"

export default function PaymentPage() {
  return (
    <Suspense fallback={null}>
      <PaymentPageClient />
    </Suspense>
  )
}
