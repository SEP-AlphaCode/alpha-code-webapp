'use client'
import { CourseDescription } from '@/components/course/detail/course-desc'
import { CourseError } from '@/components/course/detail/course-error'
import { CourseHeader } from '@/components/course/detail/course-header'
import { CourseLessons } from '@/components/course/detail/course-lesson'
import { CourseSidebar } from '@/components/course/detail/course-sidebar'
import { CourseSkeleton } from '@/components/course/detail/course-skeleton'
import { useCourse } from '@/features/courses/hooks/use-course'
import { cn } from '@/lib/utils'
import { setCurrentCourse } from '@/store/course-slice'
import { AppDispatch } from '@/store/store'
import { formatTimespan, mapDifficulty } from '@/types/courses'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { use, useEffect } from 'react'
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
    <div className="space-y-4 md:space-y-6 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <CourseHeader data={data} />
          <CourseDescription data={data} />
          {/* <CourseHighlights data={data} /> */}
          <CourseLessons lessons={data.lessons ?? []} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <CourseSidebar data={data} />
        </div>
      </div>
    </div>
  );
}