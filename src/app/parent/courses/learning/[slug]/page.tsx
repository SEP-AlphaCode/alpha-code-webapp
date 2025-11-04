"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGetSectionByAccountIdAndCourseSlug } from '@/features/courses/hooks/use-section'
import { useCreateAccountLesson } from '@/features/courses/hooks/use-account-lessons'
import { getUserIdFromToken } from '@/utils/tokenUtils'
import LoadingState from '@/components/loading-state'
import { BookOpen, Pencil, FileText, GraduationCap, BookMarked, Calculator, Star, Trophy, Check, Clock, Video, Bot, Play, ArrowLeft } from 'lucide-react'

export default function LearningPageClient() {
  const params = useParams() as { slug?: string }
  const router = useRouter()
  const slug = params.slug || ''
  const [processingLessonId, setProcessingLessonId] = useState<string | null>(null)

  // Try to infer logged-in account id from access token
  const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') || '' : ''
  const accountId = accessToken ? getUserIdFromToken(accessToken) : null

  // Fetch sections with account lessons by slug (includes enrollment check + progress info)
  // The hook already has enabled: !!accountId && !!slug inside
  const { data: sectionsData, isLoading: isSectionsLoading, error: sectionsError } = useGetSectionByAccountIdAndCourseSlug(
    accountId || '',
    slug || ''
  )

  // Hook to create account lesson
  const createAccountLesson = useCreateAccountLesson()

  // Determine whether account has this course based on sectionsData
  const isEnrolled = useMemo(() => {
    // If we got sections data back, user is enrolled
    return !!sectionsData && sectionsData.length >= 0
  }, [sectionsData])

  // Calculate total lessons - MUST be before any return statements
  const totalLessons = useMemo(() => {
    return sectionsData?.reduce((total, section) => total + (section.accountLessons?.length || 0), 0) || 0
  }, [sectionsData])

  // Calculate completed lessons - MUST be before any return statements
  const completedLessons = useMemo(() => {
    return sectionsData?.reduce((total, section) => {
      const completed = section.accountLessons?.filter(al => al.status === 2)?.length || 0
      return total + completed
    }, 0) || 0
  }, [sectionsData])

  // Handle lesson click - Check if account lesson exists, create if not, then navigate
  const handleLessonClick = async (lessonId: string, accountLessonId: string | null) => {
    if (!accountId) return

    try {
      setProcessingLessonId(lessonId)

      // If account lesson doesn't exist (id is null), create it first
      if (!accountLessonId) {
        const newAccountLesson = await createAccountLesson.mutateAsync({
          accountId: accountId,
          lessonId: lessonId,
          status: 1, // Set status to "In Progress"
        })
        
        // Navigate with the newly created accountLessonId
        router.push(`/parent/courses/learning/${slug}/lesson/${lessonId}`)
      } else {
        // Account lesson already exists, navigate with existing id
        router.push(`/parent/courses/learning/${slug}/lesson/${lessonId}`)
      }
    } catch (error) {
      console.error('Error handling lesson click:', error)
      // Still navigate even if creation fails
      router.push(`/parent/courses/learning/${slug}/lesson/${lessonId}`)
    } finally {
      setProcessingLessonId(null)
    }
  }

  // Redirect logic: if not logged in or got error (not enrolled) -> go to course detail
  useEffect(() => {
    // If we don't have accountId (not logged in), redirect to course detail
    if (!accountId && slug) {
      router.replace(`/parent/courses/${slug}`)
      return
    }

    // If finished loading and got error (likely not enrolled), redirect to detail
    if (!isSectionsLoading && sectionsError) {
      router.replace(`/parent/courses/${slug}`)
    }
  }, [accountId, isSectionsLoading, sectionsError, slug, router])

  if (isSectionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <LoadingState message="Đang tải nội dung khóa học..." />
        </div>
      </div>
    )
  }

  if (sectionsError) {
    // While redirecting, render nothing
    return null
  }

  if (!isEnrolled) {
    // While redirecting, render nothing
    return null
  }

  // Calculate progress percentage
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-orange-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Simple Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/parent/courses')}
            className="mb-4 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-gray-700 font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 flex items-center gap-3">
            <GraduationCap className="w-10 h-10 text-blue-600" />
            Bài học của bạn
          </h1>

          {/* Simple Progress Bar */}
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="w-7 h-7 text-yellow-500 fill-yellow-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-800">Đã học được {completedLessons}/{totalLessons} bài</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    Cố lên nào! 
                    <Trophy className="w-4 h-4 text-orange-500" />
                  </p>
                </div>
              </div>
              <div className="text-4xl font-bold text-yellow-500">
                {progressPercent}%
              </div>
            </div>
            
            {/* Fun Progress Bar */}
            <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                style={{ width: `${progressPercent}%` }}
              >
                {progressPercent > 10 && <Star className="w-4 h-4 text-white fill-white" />}
              </div>
            </div>
          </div>
        </div>

        {/* Sections List - Kid Friendly */}
        <div className="space-y-5">
          {Array.isArray(sectionsData) && sectionsData.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
              <div className="text-7xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Chưa có bài học nào</h3>
              <p className="text-gray-600 text-lg">Bài học sẽ sớm có thôi! 🎉</p>
            </div>
          )}

          {Array.isArray(sectionsData) && sectionsData.map((section, sIndex) => {
            const sectionCompleted = section.accountLessons?.filter(al => al.status === 2)?.length || 0
            const sectionTotal = section.accountLessons?.length || 0
            
            // Icon array for sections
            const sectionIcons = [
              <BookOpen key="book" className="w-8 h-8 text-blue-600" />,
              <Pencil key="pencil" className="w-8 h-8 text-purple-600" />,
              <FileText key="file" className="w-8 h-8 text-pink-600" />,
              <GraduationCap key="grad" className="w-8 h-8 text-indigo-600" />,
              <BookMarked key="bookmark" className="w-8 h-8 text-orange-600" />,
              <Calculator key="calc" className="w-8 h-8 text-green-600" />
            ]

            return (
              <div key={section.id} className="bg-white rounded-3xl shadow-lg overflow-hidden">
                {/* Section Header - Simple & Fun */}
                <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-md">
                      {sectionIcons[sIndex % 6]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{section.title}</h3>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">{sectionTotal}</span> bài học • 
                        <span className="font-semibold text-green-600"> {sectionCompleted}</span> đã hoàn thành
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lessons List - Large & Easy to Read */}
                {Array.isArray(section.accountLessons) && section.accountLessons.length > 0 && (
                  <div className="p-3 space-y-2">
                    {section.accountLessons.map((accountLesson, lIndex) => {
                      const lesson = accountLesson.lesson
                      const isCompleted = accountLesson.status === 2
                      const isInProgress = accountLesson.status === 1
                      const isProcessing = processingLessonId === lesson.id
                      
                      return (
                        <div 
                          key={lesson.id} 
                          className={`rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                            isProcessing
                              ? 'opacity-60 cursor-wait'
                              : isCompleted 
                              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-300' 
                              : isInProgress 
                              ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:border-yellow-300' 
                              : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                          onClick={() => !isProcessing && handleLessonClick(lesson.id, accountLesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            {/* Large Status Icon */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${
                              isCompleted 
                                ? 'bg-green-500 text-white' 
                                : isInProgress 
                                ? 'bg-yellow-400 text-white' 
                                : 'bg-white text-gray-700 border-2 border-gray-300'
                            }`}>
                              {isCompleted ? (
                                <Check className="w-8 h-8" />
                              ) : (
                                <span className="text-2xl font-bold">{lIndex + 1}</span>
                              )}
                            </div>

                            {/* Lesson Info - Large Text */}
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-800 mb-1">
                                {lesson.title}
                              </h4>
                              
                              <div className="flex items-center gap-2 flex-wrap">
                                {lesson.videoUrl && (
                                  <span className="inline-flex items-center gap-1 text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">
                                    <Video className="w-3 h-3" />
                                    Có video
                                  </span>
                                )}
                                {lesson.requireRobot && (
                                  <span className="inline-flex items-center gap-1 text-sm px-2 py-1 bg-purple-100 text-purple-700 rounded-lg font-medium">
                                    <Bot className="w-3 h-3" />
                                    Cần robot
                                  </span>
                                )}
                                <span className="text-sm text-gray-600 font-medium flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {Math.floor(lesson.duration / 60)} phút
                                </span>
                              </div>
                            </div>

                            {/* Large Action Button */}
                            <div className="flex-shrink-0">
                              <button 
                                disabled={isProcessing}
                                className={`px-6 py-3 rounded-2xl font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center gap-2 ${
                                  isProcessing
                                    ? 'bg-gray-400 text-white cursor-wait'
                                    : isCompleted 
                                    ? 'bg-green-500 text-white hover:bg-green-600' 
                                    : isInProgress 
                                    ? 'bg-yellow-400 text-gray-800 hover:bg-yellow-500' 
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                              >
                                {isProcessing ? (
                                  <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Đang tải...
                                  </>
                                ) : isCompleted ? (
                                  <>
                                    <Check className="w-5 h-5" />
                                    Học lại
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-5 h-5" />
                                    {isInProgress ? 'Tiếp tục' : 'Bắt đầu'}
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
