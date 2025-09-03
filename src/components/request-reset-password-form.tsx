"use client"

import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { requestResetPassword } from "../api/account-api"
import { useState } from "react"
import { Mail, ArrowLeft, Loader2, Shield } from "lucide-react"
import { toast } from "react-toastify"

export function RequestResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false)

  async function handleRequestReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return

    const form = e.currentTarget
    const formData = new FormData(form)
    const email = formData.get("email") as string

    if (!email) {
      toast.error("Please enter a valid email")
      return
    }

    try {
      setLoading(true)
      const result = await requestResetPassword(email)
      toast.success(result || "Password reset link sent successfully")
      form.reset()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred, please try again"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("max-w-md mx-auto", className)} {...props}>
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-2xl shadow-gray-500/20">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full shadow-lg shadow-gray-400/30">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
              <p className="text-gray-600 mt-2 text-balance">
                Enter your email address and we&apos;ll send you a link to reset your password
              </p>
            </div>
          </div>

          <form onSubmit={handleRequestReset} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                  disabled={loading}
                  className="pl-10 h-11 bg-gray-50 border-gray-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium shadow-lg shadow-gray-400/30 hover:shadow-xl hover:shadow-gray-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Link
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
