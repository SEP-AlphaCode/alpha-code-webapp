import PaymentResultPage from "@/components/payment/payment-result-page";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PaymentResultPage />
    </Suspense>
  );
}
