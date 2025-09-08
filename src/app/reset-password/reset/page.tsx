"use client"

import { Suspense } from "react";
import ResetPasswordForm from "@/components/reset-password-form";
import { Spinner } from "@/components/ui/spinner";
import { I18nProvider } from "@/lib/i18n/provider"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function ResetPasswordPage() {
  return (
    <I18nProvider page="reset-password">
      <Suspense fallback={<Spinner />}>
        <div className="flex flex-col items-center justify-center gap-6 bg-background p-6 my-8 md:p-10 relative">
          <div className="absolute top-4 right-4">
            <LanguageSwitcher variant="minimal" />
          </div>
          <div className="w-full max-w-sm">
            <ResetPasswordForm />
          </div>
        </div>
      </Suspense>
    </I18nProvider>
  )
}