"use client"

import React, { useMemo, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCourse } from '@/features/courses/hooks/use-course'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function formatCurrency(v: number) {
  try {
    return v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  } catch (e) {
    return `${v} VND`
  }
}

type PaymentType = 'course' | 'plan' | 'addon' | 'key' | 'bundle'
type PaymentMethod = 'payos' | 'credit_card' | 'bank_transfer' | 'momo' | 'zalopay'

export default function PaymentPageClient() {
  const { slug } = useParams()
  const router = useRouter()
  const { useGetCourseBySlug } = useCourse()
  const slugStr = Array.isArray(slug) ? slug[0] : slug || ''
  const { data: course, isLoading } = useGetCourseBySlug(slugStr)

  const [paymentType, setPaymentType] = useState<PaymentType>('course')
  const [method, setMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const mounted = useRef(false)

  const price = useMemo(() => {
    // For demo choose course.price or fallback
    if (!course) return 0
    switch (paymentType) {
      case 'course':
        return course.price || 0
      case 'plan':
        return course.price || 0
      case 'addon':
        return (course.price && Math.round(course.price * 0.25)) || 0
      case 'key':
        return 10000
      case 'bundle':
        return (course.price && Math.round(course.price * 1.8)) || 0
      default:
        return course.price || 0
    }
  }, [course, paymentType])

  const methods: { key: PaymentMethod; label: string }[] = [
    { key: 'payos', label: 'PayOS (embedded)' },
    { key: 'credit_card', label: 'Credit / Debit Card' },
    { key: 'bank_transfer', label: 'Bank transfer' },
    { key: 'momo', label: 'MoMo' },
    { key: 'zalopay', label: 'ZaloPay' },
  ]

  const onConfirm = async () => {
    if (!method) return alert('Vui lòng chọn phương thức thanh toán')
    if (!course) return
    setIsProcessing(true)
    try {
      // Prepare payload to be sent to API (not implemented). We'll simulate behavior.
      const payload = {
        paymentType,
        paymentMethod: method,
        amount: price,
        courseId: course.id,
        courseSlug: course.slug,
      }

      console.log('Prepared payment payload', payload)
      // Demo: route to a result page or open external link depending on method
      if (method === 'payos') {
        // Simulate opening embedded checkout
        router.push(`/payment/processing?type=${paymentType}&method=${method}&courseId=${course.id}`)
      } else {
        // For other methods navigate to a placeholder result
        router.push(`/payment/pay-result?success=true&method=${method}&courseId=${course.id}`)
      }
    } catch (err) {
      console.error(err)
      alert('Lỗi khi tạo yêu cầu thanh toán. Vui lòng thử lại.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Đang tải thông tin khóa học...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Không tìm thấy khóa học</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-2">{course.name}</h2>
            <p className="text-muted-foreground mb-4">{course.description}</p>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Chọn loại thanh toán</h3>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {(['course', 'plan', 'addon', 'key', 'bundle'] as PaymentType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setPaymentType(t)}
                      className={`px-3 py-1 rounded-md border ${paymentType === t ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                      {t === 'course' ? 'Khóa học' : t === 'plan' ? 'Gói' : t === 'addon' ? 'Addon' : t === 'key' ? 'Key' : 'Bundle'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium">Chọn phương thức thanh toán</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {methods.map((m) => (
                    <label key={m.key} className={`flex items-center gap-3 p-3 rounded-lg border ${method === m.key ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}>
                      <input type="radio" name="method" value={m.key} checked={method === m.key} onChange={() => setMethod(m.key)} />
                      <div className="flex-1">
                        <div className="font-medium">{m.label}</div>
                        <div className="text-sm text-muted-foreground">Phương thức {m.label}</div>
                      </div>
                      <div className="text-sm font-semibold">{formatCurrency(price)}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Tổng thanh toán</div>
                  <div className="text-2xl font-bold">{formatCurrency(price)}</div>
                </div>
                <div>
                  <Button disabled={isProcessing} onClick={onConfirm} className="px-6 py-3">
                    {isProcessing ? 'Đang xử lý...' : 'Thanh toán ngay'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <aside>
          <Card className="p-4">
            <h4 className="font-medium mb-2">Chi tiết</h4>
            <div className="text-sm text-muted-foreground">Giá gốc: {formatCurrency(course.price || 0)}</div>
            <div className="text-sm text-muted-foreground">Loại: {paymentType}</div>
            <div className="mt-4 text-xs text-muted-foreground">Lưu ý: giao diện demo chỉ mô phỏng luồng thanh toán. Việc tạo link / gọi API chưa được triển khai.</div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
