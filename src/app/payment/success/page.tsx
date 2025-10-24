import { Suspense } from 'react'
import PaymentSuccess from "@/components/payment/payment-success"

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccess />
    </Suspense>
  )
}
