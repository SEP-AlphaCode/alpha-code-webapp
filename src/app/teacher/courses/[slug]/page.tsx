'use client'
import { CourseDescription } from '@/components/teacher/course/detail/course-desc'
import { CourseError } from '@/components/teacher/course/detail/course-error'
import { CourseHeader } from '@/components/teacher/course/detail/course-header'
import { CourseLessons } from '@/components/teacher/course/detail/course-lesson'
import { CourseSidebar } from '@/components/teacher/course/detail/course-sidebar'
import { CourseSkeleton } from '@/components/teacher/course/detail/course-skeleton'
import { useCourse } from '@/features/courses/hooks/use-course'
import { useLesson } from '@/features/courses/hooks/use-lesson'
import { AppDispatch } from '@/store/store'
import { setCurrentCourse } from '@/store/teacher-course-slice'
import { Lesson as CourseLesson } from '@/types/courses'
import { Lesson as ApiLesson } from '@/types/lesson'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'

export default function CoursePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const { data: courseData, isLoading: isCourseLoading } = useCourse().useGetCourseBySlug(slug);
  
  // Get lessons for this course using lesson API (get all lessons without pagination)
  const { data: lessonsData, isLoading: isLessonsLoading, error: lessonsError } = useLesson().useGetAllLessonsByCourse(courseData?.id || '');

  // Convert ApiLesson to CourseLesson format
  const mappedLessons = useMemo(() => {
    if (!lessonsData) return [];
    
    console.log('Raw lessons data from API:', lessonsData);
    
    return lessonsData.map((lesson: ApiLesson): CourseLesson => ({
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      content: lesson.content,
      contentType: lesson.typeText || 'default', // Map typeText to contentType
      requireRobot: lesson.requireRobot,
      duration: lesson.duration,
      orderNumber: lesson.orderNumber,
      solution: lesson.solution,
    }));
  }, [lessonsData]);

  useEffect(() => {
    console.log('Course data:', courseData);
    console.log('Lessons loading:', isLessonsLoading);
    console.log('Lessons error:', lessonsError);
    console.log('Mapped lessons:', mappedLessons);
  }, [courseData, isLessonsLoading, lessonsError, mappedLessons]);

  useEffect(() => {
    if (courseData) {
      dispatch(setCurrentCourse({ name: courseData.name, slug: courseData.slug }));
    }
    return () => { dispatch(setCurrentCourse(null)); }
  }, [courseData, dispatch]);

  // Show loading if either course or lessons are loading
  if (isCourseLoading || isLessonsLoading) return <CourseSkeleton />;
  if (!courseData) return <CourseError />;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li onClick={() => window.history.back()} className="hover:cursor-pointer hover:text-blue-600 transition-colors">
                Khóa học
              </li>
              <li>›</li>
              <li className="text-blue-600 font-medium">{courseData.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-gray-900">
                {courseData.name}
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {courseData.description}
              </p>
              
              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs">📚</span>
                  </div>
                  <span>{mappedLessons.length} bài học</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs">⏱️</span>
                  </div>
                  <span>Thời lượng {Math.floor(courseData.totalDuration / 60)} phút</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs">🎯</span>
                  </div>
                  <span>Trình độ cơ bản</span>
                </div>
              </div>

              {/* What You'll Learn */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Bạn sẽ học được gì?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                      <span className="text-xs text-white">✓</span>
                    </div>
                    <span className="text-gray-600">Các kiến thức cơ bản, nền móng của ngành IT</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                      <span className="text-xs text-white">✓</span>
                    </div>
                    <span className="text-gray-600">Các mô hình, kiến trúc cơ bản khi triển khai ứng dụng</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                      <span className="text-xs text-white">✓</span>
                    </div>
                    <span className="text-gray-600">Các khái niệm, thuật ngữ cốt lõi khi triển khai ứng dụng</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                      <span className="text-xs text-white">✓</span>
                    </div>
                    <span className="text-gray-600">Hiểu hơn về cách internet và máy vi tính hoạt động</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow border">
                      <span className="text-2xl ml-1">▶️</span>
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-gray-900 font-bold text-lg">Kiến Thức Nền Tảng</h3>
                    <p className="text-gray-600 text-sm">Kiến thức lập trình</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-orange-500">Miễn phí</span>
                  </div>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4">
                    ĐĂNG KÝ HỌC
                  </button>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">📊</span>
                      <span>Trình độ cơ bản</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">📺</span>
                      <span>Tổng số {mappedLessons.length} bài học</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">⏰</span>
                      <span>Thời lượng {Math.floor(courseData.totalDuration / 60)} phút</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">💻</span>
                      <span>Học mọi lúc, mọi nơi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Nội dung khóa học</h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Mở rộng tất cả
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              {mappedLessons.length} bài học • Thời lượng {Math.floor(courseData.totalDuration / 60)} phút
            </p>
          </div>

          {/* Lessons List */}
          <div className="divide-y divide-gray-100">
            {mappedLessons.map((lesson, index) => (
              <div 
                key={lesson.id} 
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => router.push(`/teacher/courses/${slug}/lessons/${lesson.id}`)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {lesson.content?.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <span>🎥</span>
                        Video
                      </span>
                      <span className="flex items-center gap-1">
                        <span>⏱️</span>
                        {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}
                      </span>
                      {lesson.requireRobot && (
                        <span className="flex items-center gap-1">
                          <span>🤖</span>
                          Cần robot
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <span className="text-gray-400">▶️</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Course Info */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Requirements */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Yêu cầu</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-400 mt-2"></span>
                <span className="text-gray-600">Máy tính kết nối internet (Windows, MacOS, hay Linux đều được)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-400 mt-2"></span>
                <span className="text-gray-600">Không cần kiến thức lập trình từ trước</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-400 mt-2"></span>
                <span className="text-gray-600">Đam mê học hỏi và khám phá công nghệ</span>
              </li>
            </ul>
          </div>

          {/* Course Features */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Đặc điểm khóa học</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600">Học online 100%</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600">Hỗ trợ học viên 24/7</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600">Cấp chứng chỉ hoàn thành</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600">Truy cập trọn đời</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}