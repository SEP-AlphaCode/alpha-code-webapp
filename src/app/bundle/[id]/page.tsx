// /app/bundles/[id]/page.tsx
"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft, CheckCircle, Package, User, Clock, DollarSign } from "lucide-react"
import LoadingGif from "@/components/ui/loading-gif"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { useQuery } from "@tanstack/react-query"
import { getBundleById } from "@/features/bundle/api/bundle-api" // Giả định API này có sẵn
import { useCoursesByBundle } from "@/features/bundle/hooks/use-course-bundle" // Hook lấy courses đã có
import { Course } from "@/types/course" // Giả định type Course có sẵn

const formatCurrency = (amount: number): string => {
  if (amount === 0) return "Miễn phí"
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

// Component hiển thị danh sách Course
const BundleCourseList = ({ courses, isLoading }) => (
    <div className="border border-indigo-200 rounded-xl p-6 bg-indigo-50/50">
        <h3 className="text-xl font-bold mb-4 text-indigo-700 flex items-center">
            <Package className="w-5 h-5 mr-2" /> 
            Khóa học bao gồm ({courses.length})
        </h3>
        {isLoading ? (
            <div className="flex justify-center py-6"><LoadingGif size="sm" /></div>
        ) : (
            <ul className="space-y-3">
                {courses.map((course: Course) => (
                    <li key={course.id} className="flex items-center p-3 bg-white rounded-lg border shadow-sm">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mr-3" />
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{course.name}</h4>
                            <p className="text-sm text-gray-500">
                                Giáo viên: {course.teacher || "Chưa xác định"} 
                            </p>
                        </div>
                        <span className="text-sm font-medium text-blue-600">
                            {formatCurrency(course.price)}
                        </span>
                    </li>
                ))}
            </ul>
        )}
    </div>
)


export default function BundleDetailPage() {
  const params = useParams()
  const router = useRouter()
  // Lấy ID từ URL parameter
  const id = params?.id as string

  // 1. Lấy thông tin chi tiết Bundle
  const { data: bundle, isLoading, error } = useQuery({
    queryKey: ["bundle", id],
    queryFn: () => getBundleById(id), // Giả định API này có sẵn
    enabled: !!id
  });

  // 2. Lấy danh sách Course (Tận dụng Hook cũ)
  const { data: courses = [], isLoading: coursesLoading } = useCoursesByBundle(
    id,
    !!bundle // Chỉ fetch khi có thông tin bundle
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingGif size="xl" />
      </div>
    )
  }

  if (error || !bundle) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-4">Không tìm thấy Bundle</div>
            <Button onClick={() => router.push("/bundles")} variant="outline">
              Quay lại danh sách
            </Button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // --- LÀM NỔI BẬT CÁC TRƯỜNG DỮ LIỆU CÓ SẴN ---

  const totalCoursePrice = courses.reduce((sum, course) => sum + course.price, 0);
  const savingAmount = totalCoursePrice > bundle.price ? totalCoursePrice - bundle.price : 0;
  const isAvailable = bundle.statusText === "Available"; // Giả định trạng thái

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/bundles")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách Bundle
          </Button>
        </div>

        {/* Content Grid: 2 cột */}
        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Cột Trái: Thông tin chi tiết Bundle (2/3 chiều rộng) */}
            <div className="lg:col-span-2 space-y-8">
                {/* Header Nổi bật */}
                <div className="bg-white rounded-2xl border shadow-xl overflow-hidden">
                    <div className="p-8 bg-gradient-to-r from-indigo-50 to-white">
                        <div className="flex items-start gap-6">
                            {/* Ảnh Cover */}
                            <img 
                                src={bundle.coverImage} 
                                alt={bundle.name} 
                                className="w-40 h-40 object-cover rounded-xl shadow-lg border-2 border-white flex-shrink-0"
                            />
                            <div className="flex-1">
                                <span className="inline-block bg-pink-100 text-pink-700 text-sm font-semibold px-3 py-1 rounded-full mb-2">
                                    {bundle.statusText || "Gói Đặc Biệt"}
                                </span>
                                <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                                    {bundle.name}
                                </h1>
                                <p className="text-xl text-gray-600 mt-2 line-clamp-2">
                                    {bundle.description_short || "Không có mô tả ngắn"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Nội dung chi tiết */}
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
                            Chi Tiết Gói Khóa Học
                        </h2>
                        {/* Giữ lại nguy cơ XSS */}
                        <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: bundle.description || "Nội dung chi tiết đang được cập nhật." }} />
                    </div>
                </div>

                {/* Danh sách Khóa học đi kèm */}
                <BundleCourseList courses={courses} isLoading={coursesLoading} />

            </div>

            {/* Cột Phải: Thanh toán (Sticky Sidebar, 1/3 chiều rộng) */}
            <div className="lg:col-span-1 lg:sticky lg:top-8 self-start">
                <div className="bg-white rounded-2xl border-4 border-indigo-500 shadow-2xl p-6 space-y-6">
                    
                    <h3 className="text-2xl font-bold text-gray-900 border-b pb-3">Tóm Tắt Đơn Hàng</h3>

                    {/* Chi tiết giá */}
                    <div className="space-y-2 text-lg">
                        <div className="flex justify-between text-gray-600">
                            <span>Giá trị Khóa học lẻ:</span>
                            <span className="font-semibold">{formatCurrency(totalCoursePrice)}</span>
                        </div>
                        {savingAmount > 0 && (
                            <div className="flex justify-between font-bold text-green-600">
                                <span>Tiết kiệm (Giảm):</span>
                                <span className="font-extrabold">- {formatCurrency(savingAmount)}</span>
                            </div>
                        )}
                        <hr className="my-3 border-dashed" />
                        <div className="flex justify-between items-center text-2xl font-extrabold text-red-600">
                            <span className="flex items-center gap-2"><DollarSign className="w-6 h-6" /> Giá Bundle:</span>
                            <span>{formatCurrency(bundle.price)}</span>
                        </div>
                    </div>
                    
                    {/* CTA Mua Ngay */}
                    <Link
                        href={`/payment?category=bundle&id=${encodeURIComponent(bundle.id)}`}
                        className="block"
                    >
                        <Button 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-xl font-bold"
                            disabled={!isAvailable}
                        >
                            {isAvailable ? (
                                <>
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    MUA NGAY GÓI BUNDLE
                                </>
                            ) : (
                                "Tạm thời hết hàng"
                            )}
                        </Button>
                    </Link>

                    <div className="text-center text-sm text-gray-500">
                        {isAvailable ? "Thanh toán một lần, sở hữu trọn đời." : "Vui lòng quay lại sau."}
                    </div>
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </>
  )
}