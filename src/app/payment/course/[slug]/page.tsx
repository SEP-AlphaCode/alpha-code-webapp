'use client'

import { useCourse } from '@/features/courses/hooks/use-course';
import { useParams } from 'next/navigation'
import { usePayOS } from "@payos/payos-checkout"

import CoursePaymentUI from './ui';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function CoursePaymentPage() {
    const { slug } = useParams<{ slug: string }>();
    console.log(slug);

    const { useGetCourseBySlug } = useCourse()

    const { data: course, isLoading, error } = useGetCourseBySlug(slug)

    const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>()
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [isCreatingLink, setIsCreatingLink] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentError, setPaymentError] = useState<string | undefined>()

    const paymentOpenedRef = useRef(false)

    // PayOS config
    const payOSConfig = useMemo(() => ({
        RETURN_URL: `${process.env.NEXT_PUBLIC_WEB_URL}/payments/pay-result?success=true`,
        ELEMENT_ID: "embedded-payment-container",
        CHECKOUT_URL: checkoutUrl || "",
        embedded: true,
        onSuccess: async () => {
            setIsProcessing(true)
            console.log("Course payment successful, processing...")

            try {
                // Create payment record in database
                // const payment = await addPayment({
                //   customerId: 0, // You might want to get this from user context
                //   courseId: course?.id || "",
                //   price: course?.price || 0,
                //   paymentMethod: "PayOS",
                //   invoiceId: `course_${course?.id}_${Date.now()}`
                // })

                // if (payment) {
                //   // Update payment status
                //   await updatePaymentStatus(payment.invoiceId, "paid")

                //   // Add delay to show processing state
                //   setTimeout(() => {
                //     setIsPaymentOpen(false)
                //     setCheckoutUrl(null)
                //     paymentOpenedRef.current = false
                //     window.location.href = `/payment/pay-result?success=true&courseId=${course?.id}&paymentId=${payment.paymentId}`
                //   }, 2000)
                // }
            } catch (error) {
                console.error("Course payment error:", error)
                setPaymentError("Có lỗi xảy ra khi xử lý thanh toán")
            }
        },
        onCancel: () => {
            window.location.href = `/payment/pay-result?success=false&courseId=${course?.id}`
            handleClosePayment()
        },
        onExit: () => {
            window.location.href = `/payment/pay-result?success=false&courseId=${course?.id}`
            handleClosePayment()
        }
    }), [checkoutUrl, course?.id, course?.price])

    const { open, exit } = usePayOS(payOSConfig)

    // Handle payment link creation
    const handleGetPaymentLink = async () => {
        if (!course) return

        setIsCreatingLink(true)
        setPaymentError(undefined)

        try {
            // Exit any existing payment session
            try {
                exit()
            } catch (e) {
                console.log("Exit error (ignorable):", e)
            }
            paymentOpenedRef.current = false

            // Create payment link with course details
            //   const paymentLink = await createEmbeddedPaymentLink(
            //     course.price,
            //     `course_${course.id}`,
            //     course.name
            //   )

            //   if (paymentLink) {
            //     setCheckoutUrl(paymentLink)
            //     setIsPaymentOpen(true)
            //   } else {
            //     throw new Error("Không nhận được link thanh toán")
            //   }

        } catch (error) {
            console.error("Error creating payment link:", error)
            setPaymentError("Lỗi kết nối thanh toán. Vui lòng thử lại.")
        } finally {
            setIsCreatingLink(false)
        }
    }

    const handleClosePayment = () => {
        setIsPaymentOpen(false)
        setCheckoutUrl(undefined)
        paymentOpenedRef.current = false
        exit()
    }

    // Open payment when checkoutUrl is available
    useEffect(() => {
        if (checkoutUrl && !paymentOpenedRef.current && isPaymentOpen) {
            const timer = setTimeout(() => {
                const container = document.getElementById("embedded-payment-container")
                if (container) {
                    paymentOpenedRef.current = true
                    try {
                        open()
                    } catch (error) {
                        console.error("Error opening PayOS:", error)
                        setPaymentError("Không thể mở giao diện thanh toán. Vui lòng thử lại.")
                    }
                }
            }, 100)

            return () => clearTimeout(timer)
        }
    }, [checkoutUrl, open, isPaymentOpen])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Đang tải thông tin khóa học...</p>
                </div>
            </div>
        )
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
                <div className="max-w-md mx-auto p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-600 text-2xl">⚠</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy khóa học</h2>
                    <p className="text-gray-600 mb-6">
                        {error?.message || 'Khóa học không tồn tại hoặc đã bị xóa.'}
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ← Quay lại
                    </button>
                </div>
            </div>
        )
    }

    return <CoursePaymentUI
        course={course}
        onGetPaymentLink={handleGetPaymentLink}
        onClosePayment={handleClosePayment}
        isCreatingLink={isCreatingLink}
        isPaymentOpen={isPaymentOpen}
        checkoutUrl={checkoutUrl}
        isProcessing={isProcessing}
        error={paymentError}
    />
}