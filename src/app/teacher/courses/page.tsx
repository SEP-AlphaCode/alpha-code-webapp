"use client"
import { useCourse } from '@/hooks/use-course';
import Link from 'next/link';
import React, { useState } from 'react'
import { cn } from '@/lib/utils';
import { formatTimespan, mapDifficulty } from '@/types/courses';

export default function CourseBoardPage() {
  const [page, setPage] = useState(1)
  const size = 12
  const { useGetCategories, useGetCourses } = useCourse()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Get categories
  const { data: categoriesData, isLoading: loadingCategories } = useGetCategories(1, size)
  const categories = categoriesData?.data ?? []

  // Get courses (page=1, size=12 for example)
  const { data: coursesData, isLoading: loadingCourses } = useGetCourses(page, 12, selectedCategory || undefined)
  const courses = coursesData?.data ?? []
  const total = coursesData?.total_count ?? 0
  const totalPages = Math.ceil(total / size)
  const setSearch = (search: string) => {
    const nextCat = selectedCategory && selectedCategory === search ? null : search
    if (nextCat) setPage(1)
    return nextCat
  }
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-10" suppressHydrationWarning>
      {/* Categories scroll bar */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">Danh mục khóa học</h2>
        <div
          className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #f1f5f9",
          }}
        >
          <div className="flex space-x-3 md:space-x-4 pb-2 w-max">
            {loadingCategories ? (
              <span className="px-4 py-2 text-slate-600">Đang tải các danh mục...</span>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(setSearch(cat.id))}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-full whitespace-nowrap font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Courses grid */}
      {loadingCourses ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="text-4xl md:text-6xl mb-4 animate-bounce">📚</div>
            <p className="text-slate-600 font-semibold text-base md:text-lg">Đang tải các khóa học...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {courses.map((course) => {
              const diff = mapDifficulty(course.level)
              return (
                <Link
                  href={`courses/${course.slug}`}
                  key={course.id}
                  className="group hover:cursor-pointer bg-white shadow-sm rounded-xl overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200 hover:border-blue-300"
                >
                  <div className="overflow-hidden relative">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl || "/placeholder.svg"}
                        alt={course.name}
                        className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className={cn(
                          "w-full h-40 md:h-48 flex items-center justify-center",
                          course.level === 1 ? "bg-green-500" : course.level === 2 ? "bg-blue-500" : "bg-orange-500",
                        )}
                      >
                        <span className="text-lg md:text-xl font-semibold text-white text-center px-4 drop-shadow-lg">
                          {course.name}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                      <span className={cn("text-xs md:text-sm font-bold", 'text-' + diff.color)}>{diff.text}</span>
                    </div>
                  </div>

                  <div className="flex-grow p-4 md:p-5">
                    <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 line-clamp-3 mb-3 md:mb-4 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-xs md:text-sm text-slate-600 bg-slate-50 rounded-lg p-2 md:p-3">
                      <span className="flex items-center gap-1 font-medium">
                        <span className="text-base md:text-lg">📚</span> {course.totalLessons} bài
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <span className="text-base md:text-lg">⏱️</span> {formatTimespan(course.totalDuration)}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 md:px-5 pb-4 md:pb-5">
                    <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3 md:p-4 border border-slate-200">
                      <span className="text-xl md:text-2xl font-bold text-blue-600">${course.price}</span>
                      <span className="text-blue-600 font-semibold text-sm md:text-base group-hover:translate-x-1 transition-transform">
                        Xem ngay →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center space-x-3 md:space-x-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm md:text-base ${
                page === 1
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700"
              }`}
            >
              ← Trước
            </button>
            <div className="bg-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-sm border border-slate-200">
              <span className="font-bold text-slate-700 text-sm md:text-base">
                Trang <span className="text-blue-600">{page}</span> / {totalPages || 1}
              </span>
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm md:text-base ${
                page === totalPages || totalPages === 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700"
              }`}
            >
              Sau →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
