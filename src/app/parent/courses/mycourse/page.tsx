"use client"
import React, { useMemo, useState } from 'react'
import { useGetAccountCoursesByAccount } from '@/features/courses/hooks/use-account-course'
import { getUserIdFromToken } from '@/utils/tokenUtils'
import { Pagination } from '@/components/parent/course/pagination'
import { Button } from '@/components/ui/button'
import LoadingState from '@/components/loading-state'
import { useRouter } from 'next/navigation'

export default function MyCoursePage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const size = 12

  const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') || '' : ''
  const accountId = accessToken ? getUserIdFromToken(accessToken) : null

  const { data: paged, isLoading } = useGetAccountCoursesByAccount(accountId || '', page, size)

  const courses = paged?.data ?? []
  const total = paged?.total_count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / size))

  const handleOpenLearning = (courseSlug: string) => {
    router.push(`/parent/courses/learning/${courseSlug}`)
  }

  if (!accountId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Bạn chưa đăng nhập</h2>
          <p className="text-sm text-gray-600 mb-6">Vui lòng đăng nhập để xem các khoá học bạn đã đăng ký hoặc mua.</p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => router.push('/login')}>Đăng nhập</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Khoá học của tôi</h1>
            <p className="text-sm text-gray-600 mt-2">Danh sách các khoá học bạn đã đăng ký hoặc mua.</p>
          </div>
          <Button 
            onClick={() => router.push('/course')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2"
          >
            Mua khóa học
          </Button>
        </div>

        {isLoading ? (
          <div className="py-12">
            <LoadingState message="Đang tải các khoá học..." />
          </div>
        ) : courses.length === 0 ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Bạn chưa có khoá học nào</h3>
            <p className="text-gray-600 mb-6">Hãy khám phá và đăng ký khoá học để bắt đầu học ngay!</p>
            <Button 
              onClick={() => router.push('/course')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3"
            >
              Khám phá khóa học
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
              {courses.map((c) => (
                <div key={c.id} className="group bg-white shadow-sm rounded-xl overflow-hidden flex flex-col border border-slate-200">
                  <div className="relative overflow-hidden h-40">
                    {c.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">{c.name}</div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2">{c.name}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-sm text-gray-500">{c.totalLesson} bài</div>
                      <Button onClick={() => handleOpenLearning(c.slug)} className="ml-2">Bắt đầu học</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
