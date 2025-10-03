"use client"
import { useCourse } from '@/features/courses/hooks/use-course';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryFilter, setPage, setSearch } from '@/store/course-slice';
import { AppDispatch, RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronDown } from 'lucide-react';
import { CourseFilter } from '@/components/course/category-list';
import { CourseGrid } from '@/components/course/course-grid';
import { Pagination } from '@/components/course/pagination';

// CoursePage.tsx
export default function CoursePage() {
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const categoriesPerPage = 5;
  const dispatch = useDispatch<AppDispatch>();
  const { pagination, filters } = useSelector((s: RootState) => s.course);
  const { useGetCourses } = useCourse();

  // courses
  const { data: coursesData, isLoading: loadingCourses } = useGetCourses(
    pagination.page,
    pagination.size,
    filters.search,
  );
  const courses = coursesData?.data ?? [];
  const total = coursesData?.total_count ?? 0;
  const totalPages = Math.ceil(total / pagination.size);

  const filter = (<CourseFilter
    selected={filters.categoryIds}
    onChange={(ids) => dispatch(setCategoryFilter(ids))}
    size={categoriesPerPage}
    currentSearchTerm={filters.search}
    onSearchEnter={(term) => dispatch(setSearch(term))}
    onSearchEmpty={() => dispatch(setSearch(''))}
  />)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Categories */}
      <div className="lg:col-span-1">
        <div className="lg:hidden mb-4">
          <Button variant="outline" className="w-full flex justify-between"
            onClick={() => setIsCategoriesModalOpen(true)}>
            <span>Danh mục khóa học</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="hidden lg:block">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Danh mục khóa học</h2>
          {filter}
        </div>

        <Dialog open={isCategoriesModalOpen} onOpenChange={setIsCategoriesModalOpen}>
          <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
            <h2 className="text-xl font-bold text-slate-800">Danh mục khóa học</h2>
            {filter}
            <div className="pt-4 border-t">
              <Button className="w-full" onClick={() => setIsCategoriesModalOpen(false)}>Đóng</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses */}
      <div className="lg:col-span-3">
        {loadingCourses ? (
          <div className="py-12 text-center text-slate-600">Đang tải các khóa học...</div>
        ) : (
          <>
            <CourseGrid courses={courses} />
            {totalPages > 1 && (
              <Pagination page={pagination.page} totalPages={totalPages} onPageChange={(p) => dispatch(setPage(p))} />
            )}
          </>
        )}
      </div>
    </div>
  );
}