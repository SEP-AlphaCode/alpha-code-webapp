"use client"
import { useCourse } from '@/hooks/use-course';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'

export default function CourseBoardPage() {
  const [page, setPage] = useState(1);
  const size = 12;
  const { useGetCategories, useGetCourses } = useCourse();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get categories
  const { data: categoriesData, isLoading: loadingCategories } = useGetCategories();
  const categories = categoriesData?.data ?? [];

  // Get courses (page=1, size=12 for example)
  const { data: coursesData, isLoading: loadingCourses } = useGetCourses(page, 12, selectedCategory || undefined);
  const courses = coursesData?.data ?? [];
  const total = coursesData?.total_count ?? 0;
  const totalPages = Math.ceil(total / size);
  const setSearch = (search: string) => {
    const nextCat = (selectedCategory && selectedCategory === search) ? null : search
    if (nextCat) setPage(1)
    return nextCat
  }
  return (
    <div className="space-y-6">
      {/* Categories scroll bar */}
      <div
        className="overflow-x-auto"
        style={{
          scrollbarWidth: 'auto',
          scrollbarColor: '#aaaaaa transparent',
        }}>
        <div className="flex space-x-4 pb-2">
          {loadingCategories ? (
            <span>Loading categories...</span>
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(setSearch(cat.id))}
                className={`px-4 py-2 rounded-full whitespace-nowrap border ${selectedCategory === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Courses grid */}
      {loadingCourses ? (
        <p>Loading courses...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              return (
                <Link
                  href={`courses/${course.slug}`}
                  key={course.id}
                  className="hover:cursor-pointer bg-white shadow rounded-lg p-4 flex flex-col hover:shadow-md transition"
                >
                  <img
                    src={course.imageUrl || "/placeholder.png"}
                    alt={course.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
                  <p className="text-sm text-gray-600 flex-grow">{course.description}</p>
                  <span className="mt-3 text-sm font-medium text-blue-600 flex gap-2">
                    <Clock />{course.totalDuration}s
                  </span>
                </Link>
              )
            })}
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded border ${page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
                }`}
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {page} of {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className={`px-4 py-2 rounded border ${page === totalPages || totalPages === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
                }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}