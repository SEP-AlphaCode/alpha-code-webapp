// /app/bundles/[id]/page.tsx
"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  ArrowLeft,
  CheckCircle,
  Package,
  DollarSign,
  Tag, // Icon mới: Tiết kiệm
  Info, // Icon mới: Mô tả
} from "lucide-react"
import LoadingGif from "@/components/ui/loading-gif"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { Separator } from "@/components/ui/separator" // Component Shadcn mới

// ************ SỬ DỤNG HOOK CỦA BẠN ************
import { useBundle } from "@/features/bundle/hooks/use-bundle"
// ***********************************************

import { useCoursesByBundle } from "@/features/bundle/hooks/use-course-bundle"
import { Course } from "@/types/courses"
import { Bundle } from "@/types/bundle"
import Link from "next/link"

const formatCurrency = (amount: number): string => {
  if (amount === 0) return "Miễn phí"
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

// Component hiển thị danh sách Course
type BundleCourseListProps = {
  courses: Course[]
  isLoading: boolean
}

const BundleCourseList = ({ courses, isLoading }: BundleCourseListProps) => (
  <div className="rounded-xl p-6 border-2 border-gray-100 bg-white shadow-lg">
    <h3 className="text-2xl font-extrabold mb-5 text-indigo-800 flex items-center">
      <Package className="w-6 h-6 mr-3 text-indigo-500" />
      Khóa học bao gồm ({courses ? courses.length : 0})
    </h3>
    <Separator className="mb-5" />

    {isLoading ? (
      <div className="flex justify-center py-8">
        <LoadingGif size="sm" />
      </div>
    ) : (
      <ul className="space-y-4">
        {courses &&
          courses.map((course: Course) => (
            <li
              key={course.id}
              className="flex items-start p-4 border border-gray-100 rounded-lg transition duration-200 hover:shadow-md"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mr-4 mt-1" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-lg">
                  {course.name}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {/* Giả định có trường summary/short_description */}
                  {/* Thay bằng mô tả ngắn của khóa học nếu có */}
                  Nội dung khóa học chi tiết sẽ giúp bạn...
                </p>
              </div>
              <span className="text-md font-semibold text-blue-600 ml-4 flex-shrink-0">
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
  const id = params?.id as string

  const { useGetActiveBundleById } = useBundle()

  // 1. Lấy thông tin chi tiết Bundle
  const {
    data: bundle,
    isLoading: isBundleLoading,
    error: bundleError,
  } = useGetActiveBundleById(id)

  // 2. Lấy danh sách Course
  const { data: courses = [], isLoading: coursesLoading } =
    useCoursesByBundle(id, !!bundle)

  // Trạng thái Loading chung
  if (isBundleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingGif size="xl" />
      </div>
    )
  }

  // Xử lý lỗi hoặc không tìm thấy Bundle
  if (bundleError || !bundle) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-xl font-semibold text-red-600 mb-4">
              Không tìm thấy Gói khóa học đang hoạt động
            </div>
            <Button onClick={() => router.push("/bundles")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </Button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const activeBundle = bundle as Bundle

  // Tính toán giá trị
  const totalCoursePrice = courses.reduce(
    (sum, course) => sum + course.price,
    0
  )
  const savingAmount =
    totalCoursePrice > activeBundle.price
      ? totalCoursePrice - activeBundle.price
      : 0
  const isAvailable = activeBundle.statusText === "Available"

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="link" onClick={() => router.push("/bundles")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách Bundle
          </Button>
        </div>

        {/* Content Grid: 3 cột (2 cho nội dung, 1 cho thanh toán) */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cột Trái: Thông tin chi tiết Bundle (2/3 chiều rộng) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header Nổi bật */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden p-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Ảnh Cover */}
                <img
                  src={activeBundle.coverImage}
                  alt={activeBundle.name}
                  className="w-full md:w-60 h-auto md:h-60 object-cover rounded-xl shadow-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <span className="inline-block bg-indigo-500 text-white text-sm font-semibold px-4 py-1 rounded-full mb-3 tracking-wider uppercase">
                    {activeBundle.statusText || "Gói Đặc Biệt"}
                  </span>
                  <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                    {activeBundle.name}
                  </h1>
                  <p className="text-xl text-gray-600">
                    Sự kết hợp hoàn hảo giữa các khóa học hàng đầu.
                  </p>
                </div>
              </div>
            </div>

            {/* Chi tiết Gói Khóa Học */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-3 text-indigo-500" />
                Mô tả chi tiết
              </h2>
              <Separator className="mb-5" />
              {/* Giữ lại nguy cơ XSS */}
              <div
                className="text-gray-700 leading-relaxed space-y-4 prose prose-indigo max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    activeBundle.description ||
                    "Nội dung chi tiết đang được cập nhật.",
                }}
              />
            </div>

            {/* Danh sách Khóa học đi kèm */}
            <BundleCourseList courses={courses} isLoading={coursesLoading} />
          </div>

          {/* Cột Phải: Thanh toán (Sticky Sidebar, 1/3 chiều rộng) */}
          <div className="lg:col-span-1 lg:sticky lg:top-10 self-start">
            <div className="bg-white rounded-2xl border-4 border-indigo-400/50 shadow-2xl p-8 space-y-6">
              <h3 className="text-3xl font-extrabold text-gray-900 border-b pb-4 mb-4 flex items-center gap-2">
                <DollarSign className="w-7 h-7 text-indigo-600" />
                Tóm Tắt Đơn Hàng
              </h3>

              {/* Chi tiết giá */}
              <div className="space-y-3">
                <div className="flex justify-between text-lg text-gray-600">
                  <span>Giá Khóa học lẻ:</span>
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(totalCoursePrice)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-600 flex items-center gap-1">
                    <Tag className="w-4 h-4 text-indigo-500" /> Giá Gói Bundle:
                  </span>
                  <span
                    className={`text-2xl font-extrabold ${
                      savingAmount > 0
                        ? "text-red-500 line-through"
                        : "text-red-500"
                    }`}
                  >
                    {formatCurrency(totalCoursePrice)}
                  </span>
                </div>

                {savingAmount > 0 && (
                  <div className="flex justify-between text-xl font-extrabold text-green-600 p-2 bg-green-50 rounded-lg border-green-200 border">
                    <span>Bạn tiết kiệm:</span>
                    <span className="font-extrabold">
                      {formatCurrency(savingAmount)}
                    </span>
                  </div>
                )}

                <Separator className="my-4 border-dashed" />

                <div className="flex justify-between items-center text-3xl font-extrabold text-indigo-700">
                  <span className="flex items-center gap-2">
                    Tổng thanh toán:
                  </span>
                  <span>{formatCurrency(activeBundle.price)}</span>
                </div>
              </div>

              {/* CTA Mua Ngay */}
              <Link
                href={`/payment?category=bundle&id=${encodeURIComponent(
                  activeBundle.id
                )}`}
                className="block pt-2"
              >
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 text-xl font-extrabold transition duration-300 transform hover:scale-[1.01]"
                  disabled={!isAvailable}
                >
                  {isAvailable ? (
                    <>
                      <ShoppingCart className="mr-3 h-6 w-6" />
                      MUA TRỌN BỘ KHOÁ HỌC
                    </>
                  ) : (
                    "Tạm thời hết hàng"
                  )}
                </Button>
              </Link>

              <div className="text-center text-sm text-gray-500 mt-4">
                {isAvailable
                  ? "Thanh toán một lần, sở hữu trọn đời. Bắt đầu học ngay!"
                  : "Vui lòng quay lại sau để cập nhật trạng thái."}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}