"use client"
import { useGetAccountLessonById, useMarkAccountLessonComplete } from '@/features/courses/hooks/use-account-lessons'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Clock, BookOpen, FileText, CheckCircle, ArrowLeft, AlertCircle, Trophy, Target } from 'lucide-react'

export default function QuizPageLearning() {
  const router = useRouter()
  const { slug, accountLessonId } = useParams<{ slug: string; accountLessonId: string }>()
  
  // State for quiz
  const [isStarted, setIsStarted] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  
  // Get account lesson detail by account lesson ID
  const { data: accountLessonData, isLoading, error } = useGetAccountLessonById(accountLessonId || '')
  const markComplete = useMarkAccountLessonComplete()
  
  // Extract lesson data from account lesson
  const lessonData = accountLessonData?.lesson

  useEffect(() => {
    // Check if already completed
    if (accountLessonData?.status === 2) {
      setIsSubmitted(true)
      setScore(100) // Default score for completed quiz
    }
  }, [accountLessonData?.status])

  const handleStartQuiz = () => {
    setIsStarted(true)
  }

  const handleSubmitQuiz = () => {
    // In a real implementation, calculate the actual score
    // For now, we'll just mark as completed
    setIsSubmitted(true)
    setScore(85) // Mock score
    
    if (accountLessonId) {
      markComplete.mutate(accountLessonId)
    }
  }

  const handleRetryQuiz = () => {
    setIsStarted(false)
    setIsSubmitted(false)
    setScore(null)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => router.push('/parent/courses')}
                  className="cursor-pointer"
                >
                  Khóa học
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => router.push(`/parent/courses/learning/${slug}`)}
                  className="cursor-pointer"
                >
                  Khóa học
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{lessonData.title}</BreadcrumbPage>
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

          {/* Quiz Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              {lessonData.title}
            </h1>
            
            {/* Quiz Meta */}
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {formatDuration(lessonData.duration)}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <BookOpen className="w-3 h-3" />
                Bài {lessonData.orderNumber}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <FileText className="w-3 h-3" />
                Bài kiểm tra
              </Badge>
              <Badge variant={getStatusVariant(lessonData.status)}>
                {lessonData.statusText}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quiz Content Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quiz Introduction / Instructions */}
            {!isStarted && !isSubmitted && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Target className="w-6 h-6" />
                    Hướng dẫn làm bài
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="prose max-w-none">
                    <p className="text-lg text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: lessonData.content }}>
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Lưu ý quan trọng
                    </h3>
                    <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Đọc kỹ đề bài và các câu hỏi trước khi trả lời</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Thời gian làm bài: {formatDuration(lessonData.duration)}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Bạn có thể làm lại bài kiểm tra nhiều lần</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Đạt tối thiểu 70% để hoàn thành bài kiểm tra</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button 
                      size="lg"
                      className="text-lg px-8 py-6 rounded-xl shadow-lg"
                      onClick={handleStartQuiz}
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Bắt đầu làm bài
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quiz Questions (when started) */}
            {isStarted && !isSubmitted && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Nội dung bài kiểm tra
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="prose max-w-none">
                    <div 
                      className="text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: lessonData.content }}
                    />
                  </div>

                  {/* Solution/Answer Area */}
                  {lessonData.solution && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Khu vực trả lời</h3>
                      <textarea 
                        className="w-full min-h-[200px] p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="Nhập câu trả lời của bạn vào đây..."
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-4 pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setIsStarted(false)}
                    >
                      Hủy
                    </Button>
                    <Button 
                      onClick={handleSubmitQuiz}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Nộp bài
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quiz Results (when submitted) */}
            {isSubmitted && score !== null && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Trophy className="w-6 h-6" />
                    Kết quả bài kiểm tra
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="text-center space-y-4">
                    <div className="inline-block p-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl">
                      <div className="text-6xl font-bold text-green-600">{score}%</div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">
                        {score >= 70 ? 'Chúc mừng! 🎉' : 'Tiếp tục cố gắng! 💪'}
                      </h3>
                      <p className="text-lg text-muted-foreground">
                        {score >= 70 
                          ? 'Bạn đã hoàn thành bài kiểm tra xuất sắc!' 
                          : 'Bạn cần đạt tối thiểu 70% để hoàn thành bài kiểm tra.'}
                      </p>
                    </div>
                  </div>

                  {/* Show solution after submission */}
                  {lessonData.solution && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Đáp án tham khảo
                      </h3>
                      <div className="text-blue-800 dark:text-blue-200">
                        <pre className="whitespace-pre-wrap text-sm bg-white dark:bg-slate-900 p-3 rounded border font-mono">
                          {lessonData.solution}
                        </pre>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center gap-4 pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => router.push(`/parent/courses/learning/${slug}`)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Quay lại khóa học
                    </Button>
                    {score < 70 && (
                      <Button 
                        onClick={handleRetryQuiz}
                      >
                        Làm lại
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quiz Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Thông tin bài kiểm tra
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Thời lượng:
                  </span>
                  <Badge variant="outline">{formatDuration(lessonData.duration)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Thứ tự:
                  </span>
                  <Badge variant="outline">Bài {lessonData.orderNumber}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Loại bài:</span>
                  <Badge variant="secondary">
                    Bài kiểm tra
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tiến độ của bạn:</span>
                  <Badge variant={getStatusVariant(accountLessonData?.status || 0)}>
                    {accountLessonData?.statusText || 'Chưa bắt đầu'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Trạng thái bài:</span>
                  <Badge variant={getStatusVariant(lessonData.status)}>
                    {lessonData.statusText}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Tiến độ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Trạng thái:</span>
                  <span className="text-sm font-bold text-foreground">
                    {isSubmitted ? (score && score >= 70 ? 'Đã hoàn thành' : 'Chưa đạt') : isStarted ? 'Đang làm bài' : 'Chưa bắt đầu'}
                  </span>
                </div>

                {isSubmitted && score !== null && (
                  <>
                    <Progress value={score} className="h-4" />
                    <div className="text-center text-sm text-muted-foreground">
                      Điểm số: {score}/100
                    </div>
                  </>
                )}

                {accountLessonData?.status === 2 && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-700">
                      <Trophy className="w-5 h-5" />
                      <span className="font-semibold">Đã hoàn thành!</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Mẹo làm bài
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>Đọc kỹ đề bài trước khi trả lời</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>Kiểm tra lại câu trả lời trước khi nộp bài</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>Nếu không đạt, hãy xem lại đáp án và làm lại</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>Học từ sai lầm để cải thiện kết quả</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
