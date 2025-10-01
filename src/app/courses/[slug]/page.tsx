'use client'
import { useCourse } from '@/hooks/use-course'
import { cn } from '@/lib/utils'
import { setCurrentCourse } from '@/store/course-slice'
import { AppDispatch } from '@/store/store'
import { formatTimespan, mapDifficulty } from '@/types/courses'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { use } from 'react'
import { useDispatch } from 'react-redux'

export default function CoursePage() {
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const slug = params.slug as string
  const { data, isLoading } = useCourse().useGetCourseBySlug(slug)

  // Set current course in Redux when data is loaded
  React.useEffect(() => {
    if (data) {
      dispatch(
        setCurrentCourse({
          name: data.name,
          slug: data.slug,
        }),
      )
    }

    // Clean up when component unmounts
    return () => {
      dispatch(setCurrentCourse(null))
    }
  }, [data, dispatch])

  // Skeleton Loader
  if (isLoading)
    return (
      <div className="space-y-6 min-h-screen" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <div className="h-8 md:h-10 bg-slate-200 rounded-xl w-3/4 animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded-lg w-full animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded-lg w-5/6 animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded-lg w-4/6 animate-pulse"></div>

              {/* Course Details Skeleton */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm border border-slate-200"
                  >
                    <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded-lg w-32 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <div className="h-64 bg-slate-200 rounded-xl animate-pulse shadow-md"></div>
              <div className="h-12 md:h-14 bg-slate-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )

  // Error State - Course not found
  if (!data)
    return (
      <div
        className="space-y-6 p-6 md:p-10 bg-red-50 min-h-screen flex items-center justify-center"
        suppressHydrationWarning
      >
        <div className="text-center max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-red-200">
          <div className="text-6xl md:text-8xl mb-4 md:mb-6 animate-bounce">😞</div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 md:mb-3">Không tìm thấy khóa học</h1>
          <p className="text-slate-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
            Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            href={"/courses"}
            className="inline-block px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
          >
            ← Quay lại trang trước
          </Link>
        </div>
      </div>
    )

  // Success State
  const diff = mapDifficulty(data.level)
  return (
    <div className="space-y-4 md:space-y-6 min-h-screen" suppressHydrationWarning>
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content - Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Course Title and Basic Info */}
            <header className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-slate-200">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{data.name}</h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm">
                <span className="flex items-center gap-2 bg-blue-50 px-3 md:px-4 py-2 rounded-full font-semibold text-blue-700">
                  <span className="text-base md:text-lg">📚</span> {data.totalLessons} bài học
                </span>
                <span className="flex items-center gap-2 bg-slate-50 px-3 md:px-4 py-2 rounded-full font-semibold text-slate-700">
                  <span className="text-base md:text-lg">⏱️</span> {formatTimespan(data.totalDuration)}
                </span>
                {data.requireLicense && (
                  <span className="flex items-center gap-2 bg-red-50 px-3 md:px-4 py-2 rounded-full font-semibold text-red-700">
                    <span className="text-base md:text-lg">🔒</span> Cần có giấy phép
                  </span>
                )}
              </div>
            </header>

            {/* Course Description */}
            <section className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-slate-200">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">Về khóa học này</h2>
              <div className="prose max-w-none text-slate-700 leading-relaxed">
                <p className="whitespace-pre-line text-sm md:text-base">{data.description}</p>
              </div>
            </section>

            {/* Course Details Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 md:p-6 rounded-xl shadow-md border border-green-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 shadow-sm">
                  <span className="text-xl md:text-2xl">📖</span>
                </div>
                <p className="text-xs md:text-sm text-slate-600 font-medium mb-1">Số bài học</p>
                <p className="font-bold text-xl md:text-2xl text-green-700">{data.totalLessons}</p>
              </div>

              <div className="bg-white p-5 md:p-6 rounded-xl shadow-md border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 shadow-sm">
                  <span className="text-xl md:text-2xl">⏰</span>
                </div>
                <p className="text-xs md:text-sm text-slate-600 font-medium mb-1">Thời lượng</p>
                <p className="font-bold text-xl md:text-2xl text-blue-700">{formatTimespan(data.totalDuration)}</p>
              </div>

              <div className="bg-white p-5 md:p-6 rounded-xl shadow-md border border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 shadow-sm">
                  <span className="text-xl md:text-2xl">🎯</span>
                </div>
                <p className="text-xs md:text-sm text-slate-600 font-medium mb-1">Mức độ</p>
                <p
                  className={cn(
                    "font-bold text-xl md:text-2xl",
                    data.level === 1 ? "text-green-600" : data.level === 2 ? "text-blue-600" : "text-orange-600",
                  )}
                >
                  {diff.text}
                </p>
              </div>
            </section>

            {/* Lessons Section */}
            <section className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-200">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">Nội dung khóa học</h2>
                <p className="text-slate-600 mt-2 font-medium text-sm md:text-base">
                  {data.lessons?.length || 0} bài • Tổng cộng{" "}
                  {formatTimespan((data.lessons ?? []).reduce((total, lesson) => total + lesson.duration, 0))}
                </p>
              </div>
              {data.lessons && data.lessons.length > 0 && (
                <div className="divide-y divide-slate-100">
                  {data.lessons
                    .sort((a, b) => a.orderNumber - b.orderNumber)
                    .map((lesson, index) => (
                      <div key={lesson.id} className="p-4 md:p-6 hover:bg-slate-50 transition-all duration-300 group">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                              <span className="text-white font-bold text-base md:text-lg">{index + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-base md:text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {lesson.title}
                              </h3>
                              <div className="flex items-center flex-wrap gap-2 md:gap-3 mb-2">
                                <span className="flex items-center gap-1 bg-blue-50 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold text-blue-700">
                                  {lesson.contentType === "video"
                                    ? "🎥"
                                    : lesson.contentType === "programming"
                                      ? "💻"
                                      : "📝"}
                                  {lesson.contentType}
                                </span>
                                <span className="flex items-center gap-1 bg-slate-50 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold text-slate-700">
                                  ⏱️ {formatTimespan(lesson.duration)}
                                </span>
                                {lesson.requireRobot && (
                                  <span className="flex items-center gap-1 bg-red-50 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold text-red-700">
                                    🤖 Cần có robot
                                  </span>
                                )}
                              </div>
                              {lesson.content && (
                                <p className="text-slate-700 text-xs md:text-sm leading-relaxed">{lesson.content}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-3 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm font-bold bg-slate-100 text-slate-700 shadow-sm">
                              Bài {lesson.orderNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar - Right Column (1/3 width) */}
          <div className="space-y-6">
            {/* Course Image */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden sticky top-6">
              {data.imageUrl ? (
                <div className="relative overflow-hidden">
                  <img
                    src={data.imageUrl || "/placeholder.svg"}
                    alt={data.name}
                    className="w-full h-48 md:h-56 object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 md:h-56 bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-400 text-5xl md:text-6xl">📚</span>
                </div>
              )}

              {/* Price and Register Button */}
              <div className="p-5 md:p-6">
                <div className="text-center mb-5 md:mb-6 bg-slate-50 rounded-xl p-5 md:p-6 border border-slate-200">
                  <span className="text-3xl md:text-4xl font-bold text-blue-600">{data.price} đ</span>
                  {data.price === 0 && (
                    <span className="ml-3 px-3 md:px-4 py-1 md:py-2 bg-green-500 text-white text-xs md:text-sm font-bold rounded-full shadow-md">
                      Miễn phí
                    </span>
                  )}
                </div>

                <button className="w-full bg-blue-600 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg font-bold text-base md:text-lg hover:bg-blue-700 hover:shadow-xl hover:scale-105 transition-all duration-300 transform shadow-md">
                  Đăng ký khóa học ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
