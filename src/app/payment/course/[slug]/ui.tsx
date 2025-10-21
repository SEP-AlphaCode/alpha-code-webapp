import { Footer } from "@/components/home/footer"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Course } from "@/types/courses"
import { Badge, BarChart3, BookOpen, CheckCircle2, Clock, CreditCard, List, Loader2, Shield, ShieldCheck, Star, X } from "lucide-react"

interface CoursePaymentUIProps {
    course?: Course,
    onGetPaymentLink?: () => void
    onClosePayment?: () => void
    isCreatingLink?: boolean
    isPaymentOpen?: boolean
    checkoutUrl?: string
    isProcessing?: boolean
    error?: string
}

const CoursePaymentUI = ({
    course,
    onGetPaymentLink,
    onClosePayment,
    isCreatingLink = false,
    isPaymentOpen = false,
    checkoutUrl,
    isProcessing = false,
    error
}: CoursePaymentUIProps) => {
    if (!course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Đang tải thông tin khóa học...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Course Information - Left Side */}
                        <div className="lg:col-span-2">
                            <Card className="overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                                {/* Hero Section */}
                                <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
                                    {course.imageUrl && (
                                        <img
                                            src={course.imageUrl}
                                            alt={course.name}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h1 className="text-3xl font-bold leading-tight mb-2">{course.name}</h1>
                                        <p className="text-sm text-white/90 mb-3">Mã khóa học: #{course.id.slice(0, 8)}</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                                <Star className="w-4 h-4 text-yellow-300 fill-current" />
                                                <span className="text-white font-medium">4.8</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="p-6 space-y-6">
                                    {/* Course Description */}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-blue-600" />
                                            Mô tả khóa học
                                        </h3>
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                                            <p className="text-gray-700 leading-relaxed">
                                                {course.description || 'Khóa học cung cấp kiến thức chuyên sâu và kỹ năng thực tế.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Course Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 text-center border border-orange-100">
                                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <BookOpen className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-sm text-gray-500 mb-1">Tổng bài học</p>
                                            <p className="font-bold text-gray-900">{course.totalLessons} bài</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center border border-green-100">
                                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <Clock className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-sm text-gray-500 mb-1">Thời lượng</p>
                                            <p className="font-bold text-gray-900">{course.totalDuration} phút</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 text-center border border-blue-100">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <BarChart3 className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-sm text-gray-500 mb-1">Cấp độ</p>
                                            <p className="font-bold text-gray-900">{course.level}/10</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center border border-purple-100">
                                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <Shield className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-sm text-gray-500 mb-1">Giấy phép</p>
                                            <p className="font-bold text-gray-900">{course.requireLicense ? 'Cần' : 'Không cần'}</p>
                                        </div>
                                    </div>

                                    {/* Lessons Preview */}
                                    {/* {course.lessons && course.lessons.length > 0 && (
                                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <List className="w-5 h-5 text-indigo-600" />
                                                Danh sách bài học ({course.lessons.length})
                                            </h3>
                                            <div className="space-y-3">
                                                {course.lessons.slice(0, 5).map((lesson, index) => (
                                                    <div key={lesson.id} className="flex items-center gap-3 bg-white/50 rounded-lg p-3">
                                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{lesson.title}</p>
                                                            <p className="text-sm text-gray-600">{lesson.duration} phút</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {course.lessons.length > 5 && (
                                                    <p className="text-center text-gray-600 text-sm">
                                                        +{course.lessons.length - 5} bài học khác...
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )} */}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Payment Section - Right Side */}
                        <div className="lg:col-span-1">
                            <Card className="overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-sm sticky top-8">
                                {/* Price Header */}
                                <CardHeader className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white text-center p-6">
                                    <div className="space-y-2">
                                        <p className="text-green-100 font-medium mb-3">Giá khóa học</p>
                                        <CardTitle className="text-4xl font-bold">
                                            {course.price.toLocaleString("vi-VN")} ₫
                                        </CardTitle>
                                        <p className="text-green-100 text-sm">Trọn đời • Hỗ trợ 24/7</p>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 space-y-6">
                                    {/* Course Features */}
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <span className="text-gray-700">{course.totalLessons} bài học chất lượng</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <span className="text-gray-700">Học mọi lúc, mọi nơi</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <span className="text-gray-700">Certificate hoàn thành</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <span className="text-gray-700">Hỗ trợ giảng viên 1-1</span>
                                        </div>
                                    </div>

                                    {/* Payment Button */}
                                    {!isPaymentOpen ? (
                                        <Button
                                            onClick={onGetPaymentLink}
                                            disabled={isCreatingLink}
                                            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            {isCreatingLink ? (
                                                <>
                                                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                                                    Đang tạo link thanh toán...
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className="w-6 h-6 mr-2" />
                                                    Thanh toán ngay
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={onClosePayment}
                                            variant="outline"
                                            className="w-full h-12 border-2 hover:bg-gray-50"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Đóng thanh toán
                                        </Button>
                                    )}
                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    {isPaymentOpen && (
                                        <div
                                            id="embedded-payment-container"
                                            style={{ height: "330px", position: "relative" }}
                                        >
                                            {/* Processing overlay and loading states */}
                                        </div>
                                    )}

                                    {/* Security Features */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                                <span className="font-medium">Bảo mật</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                <span className="font-medium">Đảm bảo</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CoursePaymentUI