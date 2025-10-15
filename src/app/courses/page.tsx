"use client"
import { useCourse } from '@/features/courses/hooks/use-course';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryFilter, setPage, setSearch, setCurrentCourse } from '@/store/course-slice';
import { AppDispatch, RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronDown } from 'lucide-react';
import { CourseFilter } from '@/components/course/category-list';
import { CourseGrid } from '@/components/course/course-grid';
import { Pagination } from '@/components/course/pagination';
import { getUserIdFromToken } from '@/utils/tokenUtils';
import { AccountCourse, Course } from '@/types/courses';

// CoursePage.tsx
export default function CoursePage() {
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const categoriesPerPage = 5;
  const dispatch = useDispatch<AppDispatch>();
  const { pagination, filters, currentCourse } = useSelector((s: RootState) => s.course);
  const { useGetCourses, useGetAccountCourses } = useCourse();
  const accessToken = sessionStorage.getItem('accessToken')
  if (!accessToken) {
    return (
      <div>
        !!!
      </div>
    )
  }
  const accId = getUserIdFromToken(accessToken) ?? ''
  // courses
  // const { data: coursesData, isLoading: loadingCourses } = useGetCourses(
  //   pagination.page,
  //   pagination.size,
  //   filters.search,
  // );
  const { data: coursesData, isLoading: loadingCourses } = useGetAccountCourses(accId, pagination.page, pagination.size)
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
      <div className="lg:col-span-4">
        {loadingCourses ? (
          <div className="py-12 text-center text-slate-600">Đang tải các khóa học...</div>
        ) : (
          <>
            <CourseGrid courses={courses} showProgress onCourseChosen={(c: AccountCourse) => dispatch(setCurrentCourse(({ id: c.courseId, slug: c.slug, name: c.name })))} />
            {totalPages > 1 && (
              <Pagination page={pagination.page} totalPages={totalPages} onPageChange={(p) => dispatch(setPage(p))} />
            )}
          </>
        )}
      </div>
    </div>
  );
}