"use client"

import React, { useEffect, useState } from "react"
import { getKeyPrice } from "@/features/config/api/key-price-api"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getUserIdFromToken } from "@/utils/tokenUtils"
import { Footer } from "@/components/home/footer"
import { Header } from "@/components/home/header"

type KeyPriceShape = {
    id: string
    price: number
    currency?: string
    note?: string
}

export default function LicenseKeyPage() {
    const [keyPrice, setKeyPrice] = useState<KeyPriceShape | null>(null)
    const [loading, setLoading] = useState(false)
    const [buying, setBuying] = useState(false)

    const router = useRouter()

    useEffect(() => {
        let mounted = true
        setLoading(true)
        getKeyPrice()
            .then((res) => {
                if (!mounted) return
                setKeyPrice(res || null)
            })
            .catch(() => {
                toast.error("Không thể lấy thông tin giá license. Vui lòng thử lại sau.")
            })
            .finally(() => mounted && setLoading(false))

        return () => { mounted = false }
    }, [])

    const handlePurchase = async () => {
        try {
            setBuying(true)
            const accessToken = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") || "" : ""
            const accountId = getUserIdFromToken(accessToken || "")
            if (!accountId) {
                toast.error("Vui lòng đăng nhập để tiếp tục mua license.")
                setBuying(false)
                return
            }

            if (!keyPrice) {
                toast.error("Không có gói license để mua.")
                setBuying(false)
                return
            }

            router.push(`/payment?category=key&id=${encodeURIComponent(keyPrice.id)}`)
        } catch {
            toast.error("Không thể chuyển tới trang thanh toán. Vui lòng thử lại sau.")
        } finally { setBuying(false) }
    }

    return (
        <>
            <Header />

            <div className="relative bg-gradient-to-b from-blue-50 to-white min-h-screen py-16 px-6 md:px-12">
                {/* Hero Section */}
                <div className="max-w-5xl mx-auto text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                        Trải nghiệm Multi-Robot ngay hôm nay
                    </h1>
                    <p className="text-gray-700 text-lg md:text-xl">
                        Kích hoạt Multi Mode để điều khiển nhiều robot cùng lúc, quản lý trên nhiều thiết bị và trải nghiệm các tính năng cao cấp.
                    </p>
                    <Button
                        onClick={handlePurchase}
                        disabled={buying || !keyPrice}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg transition-all"
                    >
                        {buying ? "Đang chuyển tới thanh toán..." : "Trải nghiệm ngay"}
                    </Button>
                </div>

                {/* Feature Section */}
                <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">🤖</div>
                        <h3 className="text-xl font-semibold mb-2">Điều khiển nhiều robot</h3>
                        <p className="text-gray-600 text-sm">
                            Điều khiển đồng thời nhiều robot từ cùng một tài khoản, tiết kiệm thời gian và năng suất cao.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">📱</div>
                        <h3 className="text-xl font-semibold mb-2">Quản lý đa thiết bị</h3>
                        <p className="text-gray-600 text-sm">
                            Truy cập và quản lý robot trên nhiều thiết bị hoặc child profiles dễ dàng.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">⚡</div>
                        <h3 className="text-xl font-semibold mb-2">Hỗ trợ & cập nhật ưu tiên</h3>
                        <p className="text-gray-600 text-sm">
                            Nhận hỗ trợ kỹ thuật ưu tiên và cập nhật các tính năng Multi-Robot mới nhất.
                        </p>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="mt-20 max-w-3xl mx-auto bg-gradient-to-r from-blue-100 to-white border border-blue-200 rounded-3xl shadow-xl p-10 text-center">
                    {loading ? (
                        <div className="text-gray-500 text-lg">Đang tải thông tin giá...</div>
                    ) : keyPrice ? (
                        <>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Gói License Multi-Robot</h2>
                            <div className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: keyPrice.currency || "VND" }).format(keyPrice.price)}
                            </div>
                            {keyPrice.note && <p className="text-gray-700 mb-6">{keyPrice.note}</p>}
                            <Button
                                onClick={handlePurchase}
                                disabled={buying}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg transition-all"
                            >
                                {buying ? "Đang chuyển tới thanh toán..." : "Trải nghiệm ngay"}
                            </Button>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-700 mb-4">Hiện chưa có cấu hình giá cho license key.</p>
                            <Button onClick={() => window.open("/contact", "_blank")} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl">
                                Liên hệ
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}
