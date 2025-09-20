"use client";

import { RequestResetPasswordForm } from "@/components/request-reset-password-form"
import { I18nProvider } from "@/lib/i18n/provider"

export default function Page() {
  return (
    <I18nProvider page="reset-password">
      <main className="min-h-screen bg-background flex items-center justify-center p-4 relative">
        <RequestResetPasswordForm />
      </main>
    </I18nProvider>
  )
}
