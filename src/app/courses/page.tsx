"use client"
import { useCourse } from '@/hooks/use-course';
import { cn } from '@/lib/utils';
import { formatTimespan, mapDifficulty } from '@/types/class';
import Link from 'next/link';
import React, { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { setCategoryFilter, setPage } from '@/store/course-slice';
import { AppDispatch, RootState } from '@/store/store';

export default function CoursePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { pagination, filters } = useSelector((state: RootState) => state.course);

  const { useGetCategories, useGetCourses } = useCourse();
  const size = 12;

  // Get categories - using React Query
  const { data: categoriesData, isLoading: loadingCategories } = useGetCategories(1, size);
  const categories = categoriesData?.data ?? [];

  // Get courses - using React Query with Redux state
  const { data: coursesData, isLoading: loadingCourses } = useGetCourses(
    pagination.page,
    size,
    filters.categoryId || undefined
  );
  const courses = coursesData?.data ?? [];
  const total = coursesData?.total_count ?? 0;
  const totalPages = Math.ceil(total / size);

  const setSearch = (search: string) => {
    const nextCat = (filters.categoryId && filters.categoryId === search) ? null : search;
    if (nextCat) dispatch(setPage(1));
    return nextCat;
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  return (
    <div className="w-full max-w-full overflow-hidden" suppressHydrationWarning>
      {/* Categories Scroll Section */}
      <div className="mb-8">
        <div
          className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db #f3f4f6",
          }}
        >
          <div className="flex space-x-4 pb-2 w-max">
            {loadingCategories ? (
              <span className="px-4 py-2">Đang tải các danh mục...</span>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => dispatch(setCategoryFilter(setSearch(cat.id)))}
                  className={`px-4 py-2 rounded-full whitespace-nowrap border transition-colors ${filters.categoryId === cat.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                    }`}
                >
                  {cat.name}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Courses Grid Section */}
      {loadingCourses ? (
        <div className="flex justify-center py-8">
          <p className="text-gray-600">Đang tải các khóa học...</p>
        </div>
      ) : (
        <>
          <div className="w-full max-w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {courses.map((course) => {
                const diff = mapDifficulty(course.level)
                return (
                  <Link
                    href={`courses/${course.slug}`}
                    key={course.id}
                    className="group hover:cursor-pointer bg-white shadow-sm rounded-lg p-4 flex flex-col hover:shadow-md transition-all duration-200 border border-gray-100"
                  >
                    <div className="overflow-hidden rounded-md mb-3">
                      {course.imageUrl ? (
                        <img
                          src={course.imageUrl || "/placeholder.svg"}
                          alt={course.name}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div
                          className={cn(
                            "w-full rounded-lg h-40 flex items-center justify-center",
                            `bg-${diff.textColor}`,
                          )}
                        >
                          <span className="text-xl font-semibold text-white text-center px-2">{course.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{course.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">{course.description}</p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">📚 {course.totalLessons} lessons</span>
                        <span className="flex items-center">⏱️ {formatTimespan(course.totalDuration)}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${diff.textColor}`}>{diff.text}</span>
                        <span className="text-lg font-bold text-blue-600">${course.price}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-lg border transition-colors ${pagination.page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                  }`}
              >
                Trước
              </button>

              <span className="text-gray-600 min-w-[100px] text-center">
                Trang {pagination.page} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, pagination.page + 1))}
                disabled={pagination.page === totalPages || totalPages === 0}
                className={`px-4 py-2 rounded-lg border transition-colors ${pagination.page === totalPages || totalPages === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                  }`}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}