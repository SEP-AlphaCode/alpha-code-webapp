"use client"
import { useCourse } from '@/hooks/use-course';
import Link from 'next/link';
import React, { useState } from 'react'
import { cn } from '@/lib/utils';
import { formatTimespan, mapDifficulty } from '@/types/courses';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryFilter, setPage } from '@/store/teacher-course-slice';
import { AppDispatch, RootState } from '@/store/store';

export default function CourseBoardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const size = 12
  const { useGetCategories, useGetCourses } = useCourse()
  const { pagination, filters } = useSelector((state: RootState) => state.course)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [appliedSearch, setAppliedSearch] = useState<string>("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    filters.categoryId ? [filters.categoryId] : []
  )
  const [categoriesPage, setCategoriesPage] = useState(1)
  const categoriesPageSize = 10
  const [accumulatedCategories, setAccumulatedCategories] = useState<any[]>([])
  // Get categories
  const { data: categoriesData, isLoading: loadingCategories } = useGetCategories(categoriesPage, categoriesPageSize)
  const fetchedCategories = categoriesData?.data ?? []
  // accumulate pages
  React.useEffect(() => {
    if (!fetchedCategories || fetchedCategories.length === 0) return

    setAccumulatedCategories((prev) => {
      // append unique items by id
      const ids = new Set(prev.map((c: any) => c.id))
      const next = [...prev]
      for (const c of fetchedCategories) {
        if (!ids.has(c.id)) {
          ids.add(c.id)
          next.push(c)
        }
      }
      return next
    })
  }, [fetchedCategories])
  const categories = accumulatedCategories
  const categoriesHasNext = !!categoriesData && (categoriesData.has_next ?? (categoriesData.total_pages ? categoriesPage < categoriesData.total_pages : false))

  // Get courses (page=1, size=12 for example)
  const { data: coursesData, isLoading: loadingCourses } = useGetCourses(
    pagination.page,
    size,
    appliedSearch,
  )
  const courses = coursesData?.data ?? []
  const total = coursesData?.total_count ?? 0
  const totalPages = Math.ceil(total / size)

  const handlePageChange = (page: number) => {
    dispatch(setPage(page))
  }

  return (
    <div className="p-4 md:p-6 lg:p-10" suppressHydrationWarning>
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 ">Danh mục khóa học</h2>
      {/* Categories scroll bar */}
      <div className="md:flex items-start gap-3 w-full py-3">
        {/* Dropdown to add a category to selected list */}
        <select
          aria-label="Chọn danh mục"
          defaultValue=""
          onChange={(e) => {
            const id = e.target.value
            if (!id) return
            if (id === "__load_more__") {
              setCategoriesPage((p) => p + 1)
              // reset select visually
              e.target.value = ""
              return
            }
            // reset native select to placeholder
            e.target.value = ""
            if (selectedCategories.includes(id)) return
            const next = [...selectedCategories, id]
            setSelectedCategories(next)
            // update redux: keep filtering by the last selected category to preserve backend behavior
            dispatch(setPage(1))
            dispatch(setCategoryFilter(id))
          }}
          className="focus:outline-none focus:ring-0 focus:border-slate-200 px-4 md:px-6 py-2 md:py-3 rounded-md border border-slate-200 bg-white text-slate-700 text-sm flex-none mb-3 md:mb-0"
        >
          <option value="" disabled>Chọn danh mục...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
          {categoriesHasNext && <option value="__load_more__">Tải thêm...</option>}
        </select>

        {/* Selected categories row (scrollable) */}
        <div className="flex-1 overflow-x-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 #f1f5f9" }}>
          <div className="flex  space-x-3 min-w-max">
            {/* {selectedCategories.length === 0 && (
                        <span className="px-6 py-3 text-slate-600 font-medium">Chưa chọn danh mục</span>
                      )} */}
            {selectedCategories.map((id) => {
              const cat = categories.find((c) => c.id === id)
              return (
                <button
                  key={id}
                  onClick={() => {
                    const next = selectedCategories.filter((c) => c !== id)
                    setSelectedCategories(next)
                    // if removing the current redux filter, update filter to last selected or null
                    const newFilter = next.length ? next[next.length - 1] : null
                    dispatch(setPage(1))
                    dispatch(setCategoryFilter(newFilter))
                  }}
                  className="px-2 md:px-4 py-2 md:py-3 rounded-full whitespace-nowrap transition-all duration-300 transform border-[1] hover:border-blue-400 hover:shadow-sm hover:shadow-blue-300 inline-block text-sm"
                  title={`Bỏ chọn ${cat?.name || id}`}
                >
                  {cat?.name ?? id} &nbsp; ✕
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="courses-search" className="sr-only">Tìm khóa học</label>
        <input
          id="courses-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // apply search
              const next = searchTerm.trim()
              setAppliedSearch(next)
              dispatch(setPage(1))
            }
          }}
          placeholder="Tìm kiếm khóa học và nội dung..."
          className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-0 focus:border-slate-200"
        />
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
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-3 md:space-x-4 mt-8 md:mt-10">
              <button
                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm md:text-base ${pagination.page === 1
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700"
                  }`}
              >
                ← Trước
              </button>

              <div className="bg-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-sm border border-slate-200">
                <span className="font-bold text-slate-700 text-sm md:text-base">
                  Trang <span className="text-blue-600">{pagination.page}</span> / {totalPages}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, pagination.page + 1))}
                disabled={pagination.page === totalPages || totalPages === 0}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm md:text-base ${pagination.page === totalPages || totalPages === 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700"
                  }`}
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
