'use client'
import { CourseDescription } from '@/components/user/course/detail/course-desc'
import { CourseError } from '@/components/user/course/detail/course-error'
import { CourseHeader } from '@/components/user/course/detail/course-header'
import { CourseLessons } from '@/components/user/course/detail/course-lesson'
import { CourseSidebar } from '@/components/user/course/detail/course-sidebar'
import { CourseSkeleton } from '@/components/user/course/detail/course-skeleton'
import { useCourse } from '@/features/courses/hooks/use-course'
import { AppDispatch } from '@/store/store'
import { setCurrentCourse } from '@/store/user-course-slice'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export default function CoursePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useCourse().useGetCourseBySlug(slug);

  useEffect(() => {
    if (data) {
      dispatch(setCurrentCourse({ name: data.name, slug: data.slug }));
    }
    return () => { dispatch(setCurrentCourse(null)); }
  }, [data, dispatch]);

  if (isLoading) return <CourseSkeleton />;
  if (!data) return <CourseError />;

  return (
    <div className="space-y-4 md:space-y-6 min-h-screen p-4 md:p-6 lg:p-10">
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-slate-500">
          <li onClick={() => window.history.back()} className="hover:cursor-pointer hover:text-blue-600">
            Khóa học
          </li>
          <li>›</li>
          <li className="text-blue-600 font-medium">{data.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <CourseHeader data={data} />
          <CourseDescription data={data} />
          {/* <CourseHighlights data={data} /> */}
          {/* <CourseLessons lessons={data.lessons ?? []} /> */}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <CourseSidebar data={data} />
        </div>
      </div>
    </div>
  );
}