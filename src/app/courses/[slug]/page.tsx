'use client'
import { CourseDescription } from '@/components/course/detail/course-desc'
import { CourseError } from '@/components/course/detail/course-error'
import { CourseHeader } from '@/components/course/detail/course-header'
import { CourseLessons } from '@/components/course/detail/course-lesson'
import { CourseSkeleton } from '@/components/course/detail/course-skeleton'
import { useCourse } from '@/features/courses/hooks/use-course'
import { setCurrentCourse } from '@/store/course-slice'
import { AppDispatch, RootState } from '@/store/store'
import { useParams } from 'next/navigation'
import React, { use, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'


export default function CoursePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse } = useSelector((s: RootState) => s.course);
  const { slug } = useParams<{ slug: string }>();
  const { useGetCourseBySlug, useGetLessons } = useCourse();

  // Decide whether to fetch the course (if state is empty or mismatched)
  const shouldFetchCourse = !currentCourse || currentCourse.slug !== slug;
  console.log(shouldFetchCourse);


  // Fetch only if needed
  const { data: courseData, isLoading } = useGetCourseBySlug(shouldFetchCourse ? slug : '', {
    enabled: shouldFetchCourse, // prevent firing with empty slug
  });

  // Final course to use
  const course = shouldFetchCourse ? courseData : currentCourse;

  // Fetch lessons only when we have course ID
  const { data: lessons } = useGetLessons(course?.id ?? '', {
    enabled: shouldFetchCourse && !!course?.id,
  });

  // Sync Redux store if we fetched a course
  useEffect(() => {
    if (courseData) {
      dispatch(
        setCurrentCourse({
          id: courseData.id,
          name: courseData.name,
          slug: courseData.slug,
        })
      );
    }
    return
  }, [courseData, dispatch]);

  // Handle states
  if (isLoading && shouldFetchCourse) return <CourseSkeleton />;
  if (!course) return <CourseError />;

  return (
    <div className="h-screen overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] h-full">
        {/* Sidebar */}
        <aside className="border-r border-slate-200 h-full overflow-y-auto px-6">
          <CourseLessons
            lessons={lessons?.data ?? []}
            lessonCount={-1}
            totalDuration={1}
            courseId={course.id ?? ''}
          />
        </aside>

        {/* Main content */}
        <main className="h-full overflow-y-auto p-6 lg:p-10 bg-white">
        </main>
      </div>
    </div>
  );

}
