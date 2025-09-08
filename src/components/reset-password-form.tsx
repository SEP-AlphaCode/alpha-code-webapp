"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useQueryString } from "@/utils/utils"
import { Lock, Eye, EyeOff, ArrowLeft, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { resetPassword } from "@/api/account-api"
import { useRouter } from "next/navigation"
import { useResetPasswordTranslation } from "@/lib/i18n/hooks/use-translation"
import { toast } from "sonner"

export default function ResetPasswordForm() {
  const { t, isLoading: translationLoading } = useResetPasswordTranslation()
  const router = useRouter()
  const queryString: { token?: string } = useQueryString();
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null)

  // Check token existence
  useEffect(() => {
    if (typeof queryString.token === "string" && queryString.token.length > 0) {
      setTokenValid(true)
    } else {
      setTokenValid(false)
    }
  }, [queryString.token])

  // Validate passwords match
  useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setError(t('reset.messages.passwordMismatch'))
    } else {
      setError(null)
    }
  }, [newPassword, confirmPassword, t])

  // Check password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(null)
      return
    }
    
    const hasLower = /[a-z]/.test(newPassword)
    const hasUpper = /[A-Z]/.test(newPassword)
    const hasNumber = /\d/.test(newPassword)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    const isLongEnough = newPassword.length >= 6

    const score = [hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough].filter(Boolean).length

    if (score < 3) setPasswordStrength('weak')
    else if (score < 5) setPasswordStrength('medium')
    else setPasswordStrength('strong')
  }, [newPassword])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return

    if (!newPassword || !confirmPassword) {
      setError(t('reset.messages.passwordTooShort'))
      return
    }

    if (newPassword !== confirmPassword) {
      setError(t('reset.messages.passwordMismatch'))
      return
    }

    if (passwordStrength === 'weak') {
      setError(t('reset.messages.passwordTooShort'))
      return
    }

    if (!tokenValid) {
      setError(t('reset.messages.invalidToken'))
      return
    }

    setError(null)
    try {
      setLoading(true)
      const response = await resetPassword(queryString.token as string, newPassword)
      toast.success(response || t('reset.messages.success'))
      setNewPassword("")
      setConfirmPassword("")
      router.push("/login")
    } catch (error) {
      let message = t('reset.messages.error');
      if (typeof error === "object" && error !== null) {
        if ("response" in error && typeof error.response === "object" && error.response !== null && "msg" in error.response) {
          message = (error.response as { msg?: string }).msg || message;
        } else if ("message" in error && typeof (error as { message?: string }).message === "string") {
          message = (error as { message?: string }).message || message;
        }
      }
      setError(message);
    } finally {
      setLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 shadow-2xl shadow-gray-500/20">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg">
                <AlertCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t('reset.messages.invalidToken')}</h2>
            <p className="text-gray-600">
              {t('reset.description')}
            </p>
            <div className="pt-4">
              <Link href="/reset-password/request">
                <Button className="w-full text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800">
                  {t('request.form.submitButton')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'strong': return 'bg-green-500'
      default: return 'bg-gray-300'
    }
  }

  const getPasswordStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak': return 'w-1/3'
      case 'medium': return 'w-2/3'
      case 'strong': return 'w-full'
      default: return 'w-0'
    }
  }

  if (translationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 shadow-2xl shadow-gray-500/20">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-gray-200 rounded-full animate-pulse">
                  <div className="h-12 w-12 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mx-auto"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 shadow-2xl shadow-gray-500/20">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg shadow-green-400/30">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('reset.subtitle')}</h1>
              <p className="text-gray-600 mt-2">
                {t('reset.description')}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                {t('reset.form.password.label')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder={t('reset.form.password.placeholder')}
                  className="pl-10 pr-10 h-11 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength === 'weak' ? 'text-red-500' :
                      passwordStrength === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {passwordStrength?.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()} ${getPasswordStrengthWidth()}`}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                {t('reset.form.confirmPassword.label')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder={t('reset.form.confirmPassword.placeholder')}
                  className="pl-10 pr-10 h-11 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Match Indicator */}
              {confirmPassword && (
                <div className="flex items-center space-x-2 text-xs">
                  {newPassword === confirmPassword ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      <span className="text-red-600">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              className="w-full h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg shadow-green-400/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {t('reset.form.submitting')}
                </div>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  {t('reset.form.submitButton')}
                </>
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="text-center pt-4 border-t border-gray-200">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              {t('reset.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}