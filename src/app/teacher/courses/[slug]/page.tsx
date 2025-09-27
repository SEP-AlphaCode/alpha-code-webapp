'use client'
import { useCourse } from '@/hooks/use-course'
import { cn } from '@/lib/utils'
import { formatTimespan, mapDifficulty } from '@/types/class'
import React from 'react'
interface Props {
  params: {
    slug: string
  }
}
export default function CoursePage({ params }: Props) {
  const { slug } = params
  const { data, isLoading } = useCourse().useGetCourseBySlug(slug)

  // Skeleton Loader
  if (isLoading)
    return (
      <div className="space-y-6 p-10 min-h-screen" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Skeleton */}
          <div className="mb-6">
            <div className="h-4 bg-gray-300 rounded w-48 mb-2 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse"></div>

              {/* Course Details Skeleton */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-6 w-6 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <div className="h-64 bg-gray-300 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  // Error State - Course not found
  if (!data)
    return (
      <div className="space-y-6 p-10 bg-red-50 min-h-screen flex items-center justify-center" suppressHydrationWarning>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-red-800 mb-2">Course Not Found</h1>
          <p className="text-red-600 mb-6">
            The course you're looking for doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )

  // Success State
  const diff = mapDifficulty(data.level)
  return (
    <div className="space-y-6 p-10 min-h-screen" suppressHydrationWarning>
      <div className="">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li onClick={() => window.history.back()} className='hover:cursor-pointer'>Courses</li>
            <li>›</li>
            <li className="text-blue-600 font-medium">{data.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Title and Basic Info */}
            <header>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{data.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center">
                  📚 {data.totalLessons} lessons
                </span>
                <span className="flex items-center">
                  ⏱️ {formatTimespan(data.totalDuration)}
                </span>
                {data.requireLicense && (
                  <span className="flex items-center text-red-600">
                    🔒 License Required
                  </span>
                )}
              </div>
            </header>

            {/* Course Description */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">About This Course</h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                <p className="whitespace-pre-line">{data.description}</p>
              </div>
            </section>

            {/* Course Details Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  📖
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Lessons</p>
                  <p className="font-semibold text-lg">{data.totalLessons} lessons</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  ⏰
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold text-lg">
                    {formatTimespan(data.totalDuration)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  🎯
                </div>
                <div>
                  <p className="text-sm text-gray-500">Level</p>
                  <p className={cn("font-semibold text-lg", "text-" + diff.textColor)}>
                    {diff.text}
                  </p>
                </div>
              </div>
            </section>

            {/* Lessons Section - Added this new section */}
            <section className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold">Course Lessons</h2>
                <p className="text-gray-600 mt-1">{data.lessons?.length || 0} lessons • {formatTimespan((data.lessons ?? []).reduce((total, lesson) => total + lesson.duration, 0))} total</p>
              </div>
              {/* Lessons Section - Added this new section */}
              {data.lessons && data.lessons.length > 0 && (
                <div className="divide-y">
                  {data.lessons
                    .sort((a, b) => a.orderNumber - b.orderNumber)
                    .map((lesson, index) => (
                      <div key={lesson.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">{index + 1}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">{lesson.title}</h3>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center">
                                  {lesson.contentType === 'video' ? '🎥' :
                                    lesson.contentType === 'programming' ? '💻' : '📝'}
                                  {lesson.contentType}
                                </span>
                                <span className="flex items-center">
                                  ⏱️ {formatTimespan(lesson.duration)}
                                </span>
                                {lesson.requireRobot && (
                                  <span className="flex items-center text-red-600">
                                    🤖 Robot Required
                                  </span>
                                )}
                              </div>
                              {lesson.content && (
                                <p className="text-gray-700 mt-2 text-sm">{lesson.content}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Lesson {lesson.orderNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </section>
          </div>

          {/* Sidebar - Right Column (1/3 width) */}
          <div className="space-y-6">
            {/* Course Image */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {data.imageUrl ? (
                <img
                  src={data.imageUrl}
                  alt={data.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">📚</span>
                </div>
              )}

              {/* Price and Register Button */}
              <div className="p-6">
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-gray-900">${data.price}</span>
                  {data.price === 0 && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                      Free
                    </span>
                  )}
                </div>

                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg">
                  Register Now
                </button>

                {/* Additional Info */}
                <div className="mt-4 text-center text-sm text-gray-600">
                  <p>✅ Lifetime access</p>
                  <p>✅ Certificate of completion</p>
                  <p>✅ 30-day money-back guarantee</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-3">Course Includes</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {data.totalLessons} on-demand videos
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Downloadable resources
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Full lifetime access
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Access on mobile and TV
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Certificate of completion
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}