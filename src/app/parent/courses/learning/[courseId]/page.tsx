"use client"
import React, { useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGetAccountCoursesByAccount } from '@/features/courses/hooks/use-account-course'
import { useSections } from '@/features/courses/hooks/use-section'
import { useCourse } from '@/features/courses/hooks/use-course'
import { getUserIdFromToken } from '@/utils/tokenUtils'

export default function LearningPageClient() {
  const params = useParams() as { courseId?: string }
  const router = useRouter()
  const courseId = params.courseId || ''

  // Try to infer logged-in account id from access token
  const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') || '' : ''
  const accountId = accessToken ? getUserIdFromToken(accessToken) : null

  // Fetch account courses for the account (use a larger page size to increase chance of finding the course)
  const { data: accountCoursesPaged, isLoading: isAccountCoursesLoading } = useGetAccountCoursesByAccount(
    accountId || '',
    1,
    100,
  )

  // Determine whether account has this course
  const isEnrolled = useMemo(() => {
    if (!accountCoursesPaged || !accountCoursesPaged.data) return false
    return accountCoursesPaged.data.some((ac) => ac.courseId === courseId)
  }, [accountCoursesPaged, courseId])

  // Fetch course details (to be able to redirect to detail page if not enrolled)
  const { data: courseData, isLoading: isCourseLoading } = useCourse().useGetCourseById(courseId)

  // Fetch sections for rendering when enrolled
  const { data: sectionsData, isLoading: isSectionsLoading, error: sectionsError } = useSections(courseId)

  // Redirect logic: if we finished loading account courses & not enrolled -> go to course detail
  useEffect(() => {
    // If we don't have accountId (not logged in), redirect to course detail
    if (!accountId && courseData) {
      router.replace(`/parent/courses/${courseData.slug}`)
      return
    }

    if (!isAccountCoursesLoading && courseData && !isEnrolled) {
      // Not enrolled: send to course detail so user can register or buy
      router.replace(`/parent/courses/${courseData.slug}`)
    }
  }, [accountId, isAccountCoursesLoading, isEnrolled, courseData, router])

  if (isAccountCoursesLoading || isCourseLoading || isSectionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isEnrolled) {
    // While redirecting, render nothing (or a small message)
    return null
  }

  if (sectionsError) {
    return (
      <div className="p-8 text-center text-red-600">Có lỗi xảy ra khi tải nội dung khóa học.</div>
    )
  }
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">{courseData?.name || 'Khóa học'}</h1>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Nội dung khóa học</h2>
            <p className="text-gray-600 mt-2">{sectionsData?.length || 0} Học Phần</p>
          </div>

          <div className="divide-y divide-gray-100">
            {Array.isArray(sectionsData) && sectionsData.length === 0 && (
              <div className="p-6 text-center text-gray-500">Chưa có chương học nào</div>
            )}

            {Array.isArray(sectionsData) && sectionsData.map((section, sIndex) => (
              <div key={section.id} className="border-b border-gray-200">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">{sIndex + 1}</div>
                    <h3 className="text-gray-900 font-medium">{section.title}</h3>
                  </div>
                  <div className="text-sm text-gray-500">{section.lessons?.length || 0} bài học</div>
                </div>

                {Array.isArray(section.lessons) && section.lessons.length > 0 && (
                  <ul className="divide-y divide-gray-200 bg-gray-50">
                    {section.lessons.map((lesson, lIndex) => (
                      <li key={lesson.id} className="p-4 flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => router.push(`/parent/courses/learning/${courseId}/lesson/${lesson.id}`)}>
                        <div className="flex items-center gap-4">
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">{lIndex + 1}</div>
                          <div>
                            <h4 className="text-gray-900 font-medium">{lesson.title}</h4>
                            <p className="text-sm text-gray-500">{lesson.duration} phút</p>
                          </div>
                        </div>
                        <div className="text-blue-600 font-medium">Bắt đầu</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
