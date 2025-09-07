"use client";

import { LoginForm } from "@/components/login-form"
import { AuthRedirect } from "@/components/auth-redirect"
import { I18nProvider } from "@/lib/i18n/provider"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function LoginPage() {
  return (
    <>
      <AuthRedirect />
      <I18nProvider page="login">
        <div className="bg-gray-100 flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative">
          <div className="absolute top-4 right-4">
            <LanguageSwitcher variant="minimal" />
          </div>
          <div className="w-full max-w-sm md:max-w-3xl">
            <LoginForm />
          </div>
        </div>
      </I18nProvider>
    </>
  )
}
