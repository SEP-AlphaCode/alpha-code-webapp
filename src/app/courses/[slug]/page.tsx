'use client'
import { CourseDescription } from '@/components/course/detail/course-desc'
import { CourseError } from '@/components/course/detail/course-error'
import { CourseHeader } from '@/components/course/detail/course-header'
import { CourseLessons } from '@/components/course/detail/course-lesson'
import { CourseSkeleton } from '@/components/course/detail/course-skeleton'
import { useCourse } from '@/features/courses/hooks/use-course'
import { setCurrentCourse } from '@/store/course-slice'
import { AppDispatch, RootState } from '@/store/store'
import { Lesson } from '@/types/courses'
import { useParams } from 'next/navigation'
import React, { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'


export default function CoursePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { slug } = useParams<{ slug: string }>();
  const { useGetCourseBySlug, useGetLessons } = useCourse();

  // Fetch only if needed
  const { data: courseData, isLoading } = useGetCourseBySlug(slug, {
    enabled: true, // prevent firing with empty slug
  });

  // Final course to use
  const course = courseData

  // Fetch lessons only when we have course ID
  const { data: lessons } = useGetLessons(course?.id ?? '', {
    enabled: true
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
  if (isLoading) return <CourseSkeleton />;
  if (!course) return <CourseError />;

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex flex-col lg:grid lg:grid-cols-12 h-full">
        {/* Mobile dropdown - positioned above main content */}
        <div className="block lg:hidden p-4 border-b border-slate-200">
          <CourseLessonsDropdown
            lessons={lessons?.data ?? []}
            courseId={course.id ?? ''}
          />
        </div>

        {/* Main content */}
        <main className="h-full overflow-y-auto p-6 lg:p-10 lg:col-span-10">
          {/* Your lesson content will go here */}
        </main>

        {/* Desktop sidebar - hidden on mobile */}
        <aside className="hidden lg:block border-x border-slate-200 h-full overflow-y-auto col-span-2">
          <CourseLessons
            lessons={lessons?.data ?? []}
            lessonCount={-1}
            totalDuration={1}
            courseId={course.id ?? ''}
          />
        </aside>
      </div>
    </div>
  );
}

// Extract dropdown into separate component for mobile
function CourseLessonsDropdown({
  lessons,
  courseId
}: {
  lessons: Lesson[];
  courseId: string
}) {
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  return (
    <select
      className="w-full border border-slate-300 rounded-lg p-3 text-slate-800"
      value={activeLesson || ""}
      onChange={(e) => setActiveLesson(e.target.value)}
    >
      <option value="">Chọn bài học...</option>
      {lessons.map((lesson) => (
        <option key={lesson.id} value={lesson.id}>
          {lesson.title}
        </option>
      ))}
    </select>
  );
}