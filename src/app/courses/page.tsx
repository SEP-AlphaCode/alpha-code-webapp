"use client"
import { useCourse } from '@/hooks/use-course';
import { cn } from '@/lib/utils';
import { Category, Course, formatPrice, formatTimespan, mapDifficulty } from '@/types/courses';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryFilter, setPage } from '@/store/course-slice';
import { AppDispatch, RootState } from '@/store/store';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function CoursePage() {
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { pagination, filters } = useSelector((state: RootState) => state.course)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [usedSearchTerm, setUsedSearchTerm] = useState<string>("") // New state to track the search term used for fetching
  const { useGetCategories, useGetCourses } = useCourse()
  const size = 12
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);
  // categories pagination for dropdown
  const [categoriesPage, setCategoriesPage] = useState(1)
  const categoriesPageSize = 10
  const [accumulatedCategories, setAccumulatedCategories] = useState<Category[]>([])

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    []
  )

  // Get categories - using React Query (paginated)
  const { data: categoriesData, isLoading: loadingCategories } = useGetCategories(categoriesPage, categoriesPageSize)
  const fetchedCategories = categoriesData?.data ?? []
  // accumulate pages
  useEffect(() => {
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

  // new: continuously fetch next pages while the API indicates more pages exist
  useEffect(() => {
    if (!categoriesData) return
    const hasNext = categoriesData.has_next ?? (categoriesData.total_pages ? categoriesPage < categoriesData.total_pages : false)
    if (hasNext) {
      // fetch next page
      setCategoriesPage((p) => p + 1)
    }
  }, [categoriesData]) // intentionally only depends on the latest response

  // Get courses - using React Query with Redux state
  const { data: coursesData, isLoading: loadingCourses } = useGetCourses(
    pagination.page,
    size,
    usedSearchTerm.trim(),
  )
  const courses = coursesData?.data ?? []
  const total = coursesData?.total_count ?? 0
  const totalPages = Math.ceil(total / size)

  // Update displayedCourses only after successful fetch
  useEffect(() => {
    console.log("coursesData changed");
    if (!loadingCourses && coursesData) {
      setDisplayedCourses(c => [...courses]); // Update displayed courses when new data is fetched
    }
  }, [coursesData?.data]);

  // Memoize displayedCourses to persist previous data during loading
  const coursesToDisplay = useMemo(() => {
    return loadingCourses ? displayedCourses : courses;
  }, [loadingCourses, displayedCourses, courses]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page))
  }

  // Add a handler for pressing Enter to trigger the search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      dispatch(setPage(1)); // Reset to the first page
      setUsedSearchTerm(searchTerm); 
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden" suppressHydrationWarning>
      {/* New responsive layout: left = categories, right = search + courses */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column: Categories */}
        <div className="lg:col-span-1 flex flex-col">
          {/* Mobile/Tablet: Categories Button to open modal */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-between"
              onClick={() => setIsCategoriesModalOpen(true)}
            >
              <span>Danh mục khóa học</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </div>

          {/* Desktop: Original Sidebar (hidden on mobile) */}
          <div className="hidden lg:flex flex-col h-min">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">Danh mục khóa học</h2>
            <div
              className="overflow-y-scroll max-h-[80vh] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 #f1f5f9" }}
            >
              {loadingCategories && categories.length === 0 ? (
                <div className="px-6 py-3 text-slate-600 font-medium">Đang tải các danh mục...</div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-1 gap-2">
                    {categories.map((cat) => {
                      const isSelected = selectedCategories.includes(cat.id)
                      return (
                        <label
                          key={cat.id}
                          className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer"
                          title={cat.name}
                        >
                          <Checkbox
                            className={cn('border-[1] size-[20px]')}
                            checked={isSelected}
                            style={{
                              color: "#ffffff",
                              backgroundColor: isSelected ? "#2563eb" : undefined,
                              fontWeight: isSelected ? "600" : "400",
                            }}
                            onCheckedChange={(ch) => {
                              if (ch) {
                                const next = [...selectedCategories, cat.id]
                                setSelectedCategories(next)
                                dispatch(setPage(1))
                                dispatch(setCategoryFilter(next))
                              } else {
                                const next = selectedCategories.filter((c) => c !== cat.id)
                                setSelectedCategories(next)
                                dispatch(setPage(1))
                                dispatch(setCategoryFilter(next))
                              }
                            }}
                          />
                          <span className="text-sm text-slate-700 truncate">{cat.name}</span>
                        </label>
                      )
                    })}
                  </div>

                  {categoriesHasNext && (
                    <div className="px-3 py-2 text-sm text-slate-600 font-medium">Đang tải thêm danh mục...</div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile Modal */}
          <Dialog open={isCategoriesModalOpen} onOpenChange={setIsCategoriesModalOpen}>
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col">
              <h2 className="text-xl font-bold text-slate-800">Danh mục khóa học</h2>

              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                {loadingCategories && categories.length === 0 ? (
                  <div className="px-6 py-3 text-slate-600 font-medium">Đang tải các danh mục...</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-2 py-3">
                      {categories.map((cat) => {
                        const isSelected = selectedCategories.includes(cat.id)
                        return (
                          <label
                            key={cat.id}
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer"
                            title={cat.name}
                          >
                            <Checkbox
                              className={cn('border-[1] size-[20px]')}
                              checked={isSelected}
                              style={{
                                color: "#ffffff",
                                backgroundColor: isSelected ? "#2563eb" : undefined,
                                fontWeight: isSelected ? "600" : "400",
                              }}
                              onCheckedChange={(ch) => {
                                if (ch) {
                                  const next = [...selectedCategories, cat.id]
                                  setSelectedCategories(next)
                                  dispatch(setPage(1))
                                  dispatch(setCategoryFilter(next))
                                } else {
                                  const next = selectedCategories.filter((c) => c !== cat.id)
                                  setSelectedCategories(next)
                                  dispatch(setPage(1))
                                  dispatch(setCategoryFilter(next))
                                }
                              }}
                            />
                            <span className="text-sm text-slate-700 truncate">{cat.name}</span>
                          </label>
                        )
                      })}
                    </div>

                    {categoriesHasNext && (
                      <div className="px-3 py-2 text-sm text-slate-600 font-medium">Đang tải thêm danh mục...</div>
                    )}
                  </>
                )}
              </div>

              {/* Close Button at bottom for better UX */}
              <div className="pt-4 border-t border-slate-200">
                <Button
                  className="w-full"
                  onClick={() => setIsCategoriesModalOpen(false)}
                >
                  Đóng
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Right column: Search + Courses */}
        <div className="lg:col-span-3">
          {/* Search moved to right column */}
          <div className="mb-6">
            <label htmlFor="courses-search" className="sr-only">Tìm khóa học</label>
            <input
              id="courses-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown} // Trigger search on Enter
              placeholder="Tìm kiếm khóa học và nội dung..."
              className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-0 focus:border-slate-200"
            />
          </div>

          {/* Courses Grid Section */}
          {(loadingCourses && displayedCourses.length === 0) ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="text-4xl md:text-6xl mb-4 animate-bounce">📚</div>
                <p className="text-slate-600 font-semibold text-base md:text-lg">Đang tải các khóa học...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full max-w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                  {coursesToDisplay.map((course) => {
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
                            <span
                              className={cn(
                                "text-xs md:text-sm font-bold", "text-" + diff.color
                              )}
                            >
                              {diff.text}
                            </span>
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
                          <div className="flex bg-blue-50 rounded-lg p-3 md:p-4 border border-slate-200 text-xl md:text-2xl font-bold text-blue-600 justify-center">
                            {formatPrice(course.price)}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Pagination */}
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
      </div>
    </div>
  )
}
