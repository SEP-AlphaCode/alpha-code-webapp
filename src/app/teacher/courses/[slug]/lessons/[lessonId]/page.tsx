'use client'
import { useLesson } from '@/features/courses/hooks/use-lesson'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function LessonDetailPage() {
  const router = useRouter()
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>()
  
  // Get lesson detail by ID
  const { data: lessonData, isLoading, error } = useLesson().useGetLessonById(lessonId)

  useEffect(() => {
    console.log('Lesson data:', lessonData)
    console.log('Loading:', isLoading)
    console.log('Error:', error)
  }, [lessonData, isLoading, error])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading Skeleton */}
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="aspect-video bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !lessonData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài học</h2>
            <p className="text-gray-600 mb-6">Bài học này có thể đã bị xóa hoặc không tồn tại.</p>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay lại khóa học
            </button>
          </div>
        </div>
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return 'text-green-600 bg-green-100'
      case 2:
        return 'text-yellow-600 bg-yellow-100'
      case 0:
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li 
                onClick={() => router.push('/teacher/courses')} 
                className="hover:cursor-pointer hover:text-blue-600 transition-colors"
              >
                Khóa học
              </li>
              <li>›</li>
              <li 
                onClick={() => router.back()} 
                className="hover:cursor-pointer hover:text-blue-600 transition-colors"
              >
                {courseSlug}
              </li>
              <li>›</li>
              <li className="text-blue-600 font-medium">{lessonData.title}</li>
            </ol>
          </nav>

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <span className="text-lg">←</span>
            <span>Quay lại khóa học</span>
          </button>

          {/* Lesson Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {lessonData.title}
            </h1>
            
            {/* Lesson Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>⏰</span>
                <span>Thời lượng: {formatDuration(lessonData.duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📖</span>
                <span>Thứ tự: Bài {lessonData.orderNumber}</span>
              </div>
              {lessonData.requireRobot && (
                <div className="flex items-center gap-2">
                  <span>🤖</span>
                  <span>Yêu cầu robot</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lessonData.status)}`}>
                  {lessonData.statusText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
              {/* Video Container */}
              <div className="aspect-video bg-gray-900 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all transform hover:scale-105">
                    <span className="text-4xl ml-1">▶️</span>
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black bg-opacity-50 rounded-lg p-3">
                    <h3 className="text-white font-semibold">{lessonData.title}</h3>
                    <p className="text-white text-sm opacity-80">{lessonData.typeText}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nội dung bài học</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {lessonData.content}
                </p>
              </div>

              {/* Solution Section */}
              {lessonData.solution && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <span>✅</span>
                    Lời giải
                  </h3>
                  <div className="text-blue-800">
                    <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded border">
                      {lessonData.solution}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Lesson Info Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin bài học</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời lượng:</span>
                  <span className="font-medium">{formatDuration(lessonData.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thứ tự:</span>
                  <span className="font-medium">Bài {lessonData.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loại bài:</span>
                  <span className="font-medium">{lessonData.typeText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lessonData.status)}`}>
                    {lessonData.statusText}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Yêu cầu robot:</span>
                  <span className="font-medium">
                    {lessonData.requireRobot ? (
                      <span className="text-orange-600">Có</span>
                    ) : (
                      <span className="text-green-600">Không</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tiến độ học tập</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Hoàn thành:</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                  Đánh dấu hoàn thành
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}