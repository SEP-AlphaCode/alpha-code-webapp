"use client"
import { useCourse } from '@/features/courses/hooks/use-course';
import { useGetAllCategories } from '@/features/courses/hooks/use-category';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setPage, setSearch, setCategoryFilter } from '@/store/user-course-slice';
import { Pagination } from '@/components/parent/course/pagination';
import { CourseGrid } from '@/components/parent/course/course-grid';
import React, { useState, useMemo } from 'react'

export default function CoursePage() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { pagination, filters } = useSelector((state: RootState) => state.userCourse);
  const { useGetCourses } = useCourse();

  // Fetch courses
  const { data: coursesData, isLoading: loadingCourses } = useGetCourses(
    pagination.page,
    pagination.size,
    filters.search,
  );
  const courses = coursesData?.data ?? [];
  const total = coursesData?.total_count ?? 0;
  const totalPages = Math.ceil(total / pagination.size);

  // Fetch categories
  const { data: categoriesData, isLoading: loadingCategories } = useGetAllCategories({ page: 0, size: 20 });
  const categories = categoriesData?.data ?? [];

  // Filter courses by selected category
  const filteredCourses = useMemo(() => {
    if (!selectedCategory) {
      return courses;
    }
    return courses.filter((course) => course.categoryId === selectedCategory);
  }, [courses, selectedCategory]);

  // Separate free and paid courses
  const freeCourses = useMemo(() => {
    return courses.filter((course) => course.price === 0);
  }, [courses]);

  const paidCourses = useMemo(() => {
    return courses.filter((course) => course.price > 0);
  }, [courses]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearch(searchInput));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Khóa học <span className="text-orange-500">Alpha Code</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Học lập trình robot từ cơ bản đến nâng cao với những khóa học chất lượng
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm khóa học, bài viết, video, ..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loadingCategories ? (
            <div className="text-center py-4">
              <span className="text-gray-500">Đang tải danh mục...</span>
            </div>
          ) : (
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-orange-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Courses Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingCourses ? (
          <div className="py-12 text-center text-slate-600">Đang tải các khóa học...</div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Khóa học miễn phí</h2>
            <CourseGrid courses={freeCourses} />

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Khóa học trả phí</h2>
            <CourseGrid courses={paidCourses} />

            {totalPages > 1 && (
              <Pagination page={pagination.page} totalPages={totalPages} onPageChange={(p) => dispatch(setPage(p))} />
            )}
          </>
        )}
      </div>
    </div>
  );
}