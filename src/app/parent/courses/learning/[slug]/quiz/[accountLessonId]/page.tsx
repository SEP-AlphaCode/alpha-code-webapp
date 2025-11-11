"use client"
import { useGetAccountLessonById, useMarkAccountLessonComplete } from '@/features/courses/hooks/use-account-lessons'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Clock, BookOpen, FileText, CheckCircle, ArrowLeft, AlertCircle, Trophy, Target, Play } from 'lucide-react'
import { SubmissionPanel } from '@/components/course/submission-panel'

export default function QuizPageLearning() {
  const router = useRouter()
  const { slug, accountLessonId } = useParams<{ slug: string; accountLessonId: string }>()
  
  // State for quiz
  const [isStarted, setIsStarted] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Get account lesson detail by account lesson ID
  const { data: accountLessonData, isLoading, error } = useGetAccountLessonById(accountLessonId || '')
  const markComplete = useMarkAccountLessonComplete()
  
  // Extract lesson data from account lesson
  const lessonData = accountLessonData?.lesson

  useEffect(() => {
    // Check if already completed
    if (accountLessonData?.status === 2) {
      setIsSubmitted(true)
    }
  }, [accountLessonData?.status])

  const handleStartQuiz = () => {
    setIsStarted(true)
  }

  const handleSubmitQuiz = () => {
    setIsSubmitted(true)
    
    // if (accountLessonId) {
    //   markComplete.mutate(accountLessonId)
    // }
  }

  const handleRetryQuiz = () => {
    setIsStarted(false)
    setIsSubmitted(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse">
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !lessonData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="text-red-500 text-6xl mb-4">😕</div>
            <CardTitle className="text-2xl">Không tìm thấy bài kiểm tra</CardTitle>
            <CardDescription>
              Bài kiểm tra này có thể đã bị xóa hoặc không tồn tại.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.back()} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại khóa học
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getStatusVariant = (status: number) => {
    switch (status) {
      case 1:
        return 'default'
      case 2:
        return 'secondary'
      case 0:
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => router.push('/parent/courses')}
                  className="cursor-pointer hover:text-gray-900 transition-colors"
                >
                  Khóa học
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => router.push(`/parent/courses/learning/${slug}`)}
                  className="cursor-pointer hover:text-gray-900 transition-colors"
                >
                  Chi tiết khóa học
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">{lessonData.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => router.push(`/parent/courses/learning/${slug}`)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại khóa học
          </Button>

          {/* Quiz Header Card */}
          <Card className="shadow-md">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="space-y-4 flex-1">
                  <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Bài kiểm tra</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {lessonData.title}
                  </h1>
                  
                  {/* Quiz Meta */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(lessonData.duration)}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Bài {lessonData.orderNumber}</span>
                    </Badge>
                    <Badge variant={getStatusVariant(lessonData.status)}>
                      {lessonData.statusText}
                    </Badge>
                  </div>
                </div>
                
                {accountLessonData?.status === 2 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 min-w-[160px]">
                    <div className="text-center space-y-2">
                      <Trophy className="w-12 h-12 mx-auto text-green-600" />
                      <div className="text-2xl font-bold text-green-700">100%</div>
                      <div className="text-xs text-green-600">Hoàn thành</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quiz Content Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quiz Introduction / Instructions */}
            {!isStarted && !isSubmitted && (
              <Card className="shadow-md">
                <CardHeader className="border-b bg-gray-50">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Target className="w-6 h-6 text-gray-700" />
                    Hướng dẫn làm bài
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-8 space-y-6">
                  <div className="prose prose-lg max-w-none">
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: lessonData.content }}
                    />
                  </div>

                  <div className="flex justify-center pt-6">
                    <Button 
                      size="lg"
                      className="text-lg px-10 py-6 rounded-lg shadow-md"
                      onClick={handleStartQuiz}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Bắt đầu làm bài
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quiz Questions (when started) */}
            {isStarted && !isSubmitted && (
              <>
                <Card className="shadow-md">
                  <CardHeader className="border-b bg-gray-50">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <FileText className="w-5 h-5 text-gray-700" />
                      Nội dung bài kiểm tra
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8 space-y-6">
                    <div className="prose prose-lg max-w-none">
                      <div 
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: lessonData.content }}
                      />
                    </div>

                    {/* Solution/Answer Area */}
                    {lessonData.solution && (
                      <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-gray-600" />
                          Khu vực trả lời
                        </h3>
                        <textarea 
                          className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none transition-all bg-white"
                          placeholder="Nhập câu trả lời của bạn vào đây..."
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Submission Panel */}
                <SubmissionPanel 
                  accountLessonId={accountLessonId}
                  onSubmissionSuccess={handleSubmitQuiz}
                />

                <div className="flex justify-end gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => setIsStarted(false)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                  </Button>
                </div>
              </>
            )}

            {/* Quiz Results (when submitted) */}
            {isSubmitted && (
              <Card className="shadow-md">
                <CardHeader className="border-b bg-gray-50">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Đã nộp bài thành công
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-12 pb-12 space-y-8">
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
                      <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-3xl font-bold text-gray-900">
                        Bài làm đã được nộp! ✅
                      </h3>
                      <p className="text-lg text-gray-600 max-w-md mx-auto">
                        Giáo viên sẽ chấm điểm và phản hồi sớm nhất có thể.
                      </p>
                    </div>

                    <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 mb-1">Lưu ý quan trọng</p>
                          <p className="text-sm text-gray-600">
                            Bạn có thể kiểm tra kết quả và nhận xét của giáo viên trong phần lịch sử nộp bài.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    <Button 
                      size="lg"
                      onClick={() => router.push(`/parent/courses/learning/${slug}`)}
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Quay lại khóa học
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quiz Info Card */}
            <Card className="shadow-md sticky top-6">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-gray-700" />
                  Thông tin chi tiết
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Thời lượng
                    </span>
                    <Badge variant="outline">
                      {formatDuration(lessonData.duration)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Thứ tự
                    </span>
                    <Badge variant="outline">
                      Bài {lessonData.orderNumber}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Loại bài</span>
                    <Badge variant="secondary">
                      Kiểm tra
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tiến độ</span>
                    <Badge variant={getStatusVariant(accountLessonData?.status || 0)}>
                      {accountLessonData?.statusText || 'Chưa bắt đầu'}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Trạng thái</span>
                    <Badge variant={isSubmitted ? 'default' : isStarted ? 'secondary' : 'outline'}>
                      {isSubmitted ? 'Đã nộp bài' : isStarted ? 'Đang làm' : 'Chưa bắt đầu'}
                    </Badge>
                  </div>
                </div>

                {accountLessonData?.status === 2 && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3 text-green-700">
                      <Trophy className="w-5 h-5" />
                      <div>
                        <p className="font-bold">Đã hoàn thành!</p>
                        <p className="text-xs text-green-600">Xuất sắc</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="shadow-md bg-gray-50">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="w-5 h-5 text-gray-700" />
                  Mẹo hữu ích
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 text-sm text-gray-700">
                  {[
                    'Đọc kỹ đề bài trước khi trả lời',
                    'Kiểm tra lại câu trả lời trước khi nộp',
                    'Nộp bài đúng hạn để đảm bảo điểm số',
                    'Liên hệ giáo viên nếu có thắc mắc'
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-gray-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
