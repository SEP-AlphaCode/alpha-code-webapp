"use client";

import RegisterForm from "@/components/register-form";
import { AuthRedirect } from "@/components/auth-redirect";

export default function SignupPage() {
  return (
    <>
      <AuthRedirect />
      <div className="bg-gray-100 flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative">
        <div className="w-full max-w-sm md:max-w-3xl">
          <RegisterForm />
        </div>
      </div>
    </>
  );
}
