"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { getUserIdFromToken } from '@/utils/tokenUtils'
import { getAccountCourseByCourseAndAccount } from '@/features/courses/api/account-course-api'
import type { Course } from '@/types/courses'
import type { AccountCourse } from '@/types/account-course'
import { cn } from '@/lib/utils'
import { BookOpen } from 'lucide-react'
import { AvailableCourse } from '@/types/dashboard'

// Accept either a core Course or an AccountCourse (enrolled view)
export type CourseLike = Course | AccountCourse | AvailableCourse

interface Props {
  course: CourseLike;
  variant?: 'grid' | 'list' | 'compact';
  /** base path to navigate to — e.g. '/parent/courses' or '/courses'. If not provided default to '/parent/courses' */
  basePath?: string;
  /** optional callback when user selects the card; if provided, navigation is delegated to caller */
  onSelect?: (course: CourseLike) => void;
}

export default function CourseCard({ course, variant = 'grid', basePath = '/parent/courses', onSelect }: Props) {
  const router = useRouter()
  // normalize fields between Course and AccountCourse unions
  const totalLessons = 'totalLesson' in course ? course.totalLesson : ('totalLessons' in course ? course.totalLessons : 0)
  const progressPercent = 'progressPercent' in course ? course.progressPercent : undefined
  const price = 'price' in course ? (course.price as number) : undefined

  const handleClick = async () => {
    const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') || '' : ''
    const accountId = accessToken ? getUserIdFromToken(accessToken) : null

    // If caller provided onSelect, delegate navigation to caller
    if (onSelect) {
      onSelect(course)
      return
    }

    // If not logged in -> go to course detail
    if (!accountId) {
      router.push(`${basePath}/${course.slug}`)
      return
    }

    try {
      // If we're given an AccountCourse, its `courseId` is the underlying course identifier.
      const courseIdToCheck = 'courseId' in course ? course.courseId : course.id
      const accountCourse = await getAccountCourseByCourseAndAccount(courseIdToCheck, accountId)
      if (accountCourse) {
        router.push(`${basePath}/learning/${course.slug}`)
      } else {
        router.push(`${basePath}/${course.slug}`)
      }
    } catch (err) {
      console.error('Error checking enrollment:', err)
      // fallback to the provided basePath so children pages don't get redirected to parent
      router.push(`${basePath}/${course.slug}`)
    }
  }

    if (variant === 'compact') {
    return (
      <div className="flex gap-3 items-center">
        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
          {course.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover rounded" />
          ) : (
            <BookOpen className="w-6 h-6 text-gray-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 line-clamp-2">{course.name}</h4>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
            <span>{totalLessons} bài</span>
            {typeof progressPercent !== 'undefined' && (
              <span className="font-medium text-blue-600">{progressPercent}%</span>
            )}
          </div>
        </div>
        <button onClick={handleClick} className="ml-3 text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded">
          {progressPercent ? 'Tiếp tục' : 'Xem'}
        </button>
      </div>
    )
  }

  // grid / default variant
  return (
    <div className={cn(
      "group bg-white shadow-sm rounded-xl overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200 hover:border-blue-300 cursor-pointer relative",
      variant === 'list' ? 'flex-row' : 'flex-col'
    )} onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleClick() }}>

      <div className={cn('relative overflow-hidden', variant === 'list' ? 'w-32 h-24 flex-shrink-0' : 'h-40 md:h-48') }>
        {course.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl p-6 text-center">
            {course.name}
          </div>
        )}
      </div>

      <div className={cn('p-4 flex-1 flex flex-col', variant === 'list' ? 'pl-4' : '')}>
        <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{course.name}</h3>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600 font-medium">
              <BookOpen className="w-4 h-4" />
              {totalLessons} bài
            </span>
            {typeof progressPercent !== 'undefined' ? (
              <span className="text-blue-600 font-bold text-base">{progressPercent}%</span>
            ) : (
              <span className="text-blue-600 font-bold text-base">{(typeof price !== 'undefined' && price === 0) ? 'Miễn phí' : (typeof price !== 'undefined' ? new Intl.NumberFormat('vi-VN').format(price) + 'đ' : '')}</span>
            )}
          </div>

          {variant !== 'list' && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-500 shadow-sm" style={{ width: `${progressPercent ?? 0}%` }} />
            </div>
          )}

          <div>
            <button onClick={(e) => { e.stopPropagation(); handleClick() }} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all group">
              {progressPercent && progressPercent > 0 ? 'Tiếp tục học' : 'Xem chi tiết'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
