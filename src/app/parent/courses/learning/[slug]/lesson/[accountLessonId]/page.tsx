"use client"
import { useGetAccountLessonById, useMarkAccountLessonComplete } from '@/features/courses/hooks/use-account-lessons'
import { useGetSectionByAccountIdAndCourseSlug } from '@/features/courses/hooks/use-section'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Play, Pause, RotateCcw, Clock, BookOpen, Bot, Video, CheckCircle, ArrowLeft, List, ChevronDown, ChevronUp } from 'lucide-react'
import { getUserIdFromToken } from '@/utils/tokenUtils'

export default function LessonDetailPageLearning() {
  const router = useRouter()
  const { slug, accountLessonId } = useParams<{ slug: string; accountLessonId: string }>()
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Video states
  const [isVideoLoading, setIsVideoLoading] = useState(false)
  const [hasVideoError, setHasVideoError] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  // Persistent lesson progress (stored locally when no backend available)
  const [storedProgress, setStoredProgress] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Sidebar states
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  
  // Get account lesson detail by account lesson ID
  const { data: accountLessonData, isLoading, error } = useGetAccountLessonById(accountLessonId || '')
  const markComplete = useMarkAccountLessonComplete()
  
  // Extract lesson data from account lesson
  const lessonData = accountLessonData?.lesson
  
  // Get user ID from token
  const accountId = useMemo(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('accessToken')
      return token ? getUserIdFromToken(token) : null
    }
    return null
  }, [])
  
  // Get sections and lessons for sidebar
  const { data: sections } = useGetSectionByAccountIdAndCourseSlug(accountId || '', slug || '')

  // Auto-expand section containing current lesson
  useEffect(() => {
    if (sections && accountLessonId) {
      const currentSection = sections.find(section => 
        section.accountLessons?.some(lesson => lesson.id === accountLessonId)
      )
      if (currentSection) {
        setExpandedSections(prev => new Set([...prev, currentSection.id]))
      }
    }
  }, [sections, accountLessonId])

  // Toggle section expand/collapse
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  useEffect(() => {
  }, [lessonData, isLoading, error])

  // Video event handlers
  const handleVideoLoadStart = () => {
    setIsVideoLoading(true)
    setHasVideoError(false)
  }

  const handleVideoCanPlay = () => {
    setIsVideoLoading(false)
  }

  const handleVideoError = () => {
    setIsVideoLoading(false)
    setHasVideoError(true)
  }

  const handleVideoTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration > 0) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setVideoProgress(progress)
    }
  }

  const handleVideoEnded = () => {
    setVideoProgress(100)
    setIsPlaying(false)
    // Mark lesson as completed when video ends
    setStoredProgress(100)
    setIsCompleted(true)
    // Mark complete via API
    if (accountLessonId) {
      markComplete.mutate(accountLessonId)
      try {
        sessionStorage.setItem(`lesson-progress:${accountLessonId}`, JSON.stringify({ percent: 100, completed: true }))
      } catch (e) {
        // ignore storage errors
      }
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
      setPlaybackSpeed(speed)
    }
  }

  // Load stored progress on mount (if any) and check backend status
  useEffect(() => {
    if (!accountLessonId) return
    
    // Check backend completion status first
    if (accountLessonData?.status === 2) {
      // Status 2 = completed from backend
      setStoredProgress(100)
      setIsCompleted(true)
    } else {
      // Load from localStorage if backend says not completed
      try {
        const raw = sessionStorage.getItem(`lesson-progress:${accountLessonId}`)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (typeof parsed.percent === 'number') setStoredProgress(parsed.percent)
          if (typeof parsed.completed === 'boolean') setIsCompleted(parsed.completed)
        }
      } catch (e) {
        // ignore parse errors
      }
    }
  }, [accountLessonId, accountLessonData?.status])

  // Sync stored progress to sessionStorage whenever it changes
  useEffect(() => {
    if (!accountLessonId) return
    try {
      sessionStorage.setItem(`lesson-progress:${accountLessonId}`, JSON.stringify({ percent: storedProgress, completed: isCompleted }))
    } catch (e) {
      // ignore
    }
  }, [accountLessonId, storedProgress, isCompleted])

  // When video progress updates, sync to storedProgress (if video exists)
  useEffect(() => {
    if (!lessonData || !lessonData.videoUrl) return
    // update stored progress with video progress
    setStoredProgress(Math.max(storedProgress, Math.round(videoProgress)))
    if (videoProgress >= 80) {
      setIsCompleted(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoProgress, lessonData?.videoUrl])

  const markCompleted = () => {
    setStoredProgress(100)
    setIsCompleted(true)
    // Mark complete via API
    if (accountLessonId) {
      markComplete.mutate(accountLessonId)
    }
  }

  const resetProgress = () => {
    setStoredProgress(0)
    setIsCompleted(false)
    try {
      if (accountLessonId) sessionStorage.removeItem(`lesson-progress:${accountLessonId}`)
    } catch (e) {}
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
                    <div className="aspect-video bg-slate-200 rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      </div>
                    ))}
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
            <CardTitle className="text-2xl">Không tìm thấy bài học</CardTitle>
            <CardDescription>
              Bài học này có thể đã bị xóa hoặc không tồn tại.
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

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return 'text-green-600 bg-green-100'
      case 2:
        return 'text-yellow-600 bg-yellow-100'
      case 0:
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
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

          {/* Lesson Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              {lessonData.title}
            </h1>
            
            {/* Lesson Meta */}
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {formatDuration(lessonData.duration)}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <BookOpen className="w-3 h-3" />
                Bài {lessonData.orderNumber}
              </Badge>
              {lessonData.requireRobot && (
                <Badge variant="outline" className="flex items-center gap-2">
                  <Bot className="w-3 h-3" />
                  Yêu cầu robot
                </Badge>
              )}
              {lessonData.videoUrl && (
                <Badge variant="outline" className="flex items-center gap-2">
                  <Video className="w-3 h-3" />
                  Có video
                </Badge>
              )}
              <Badge variant={getStatusVariant(lessonData.status)}>
                {lessonData.statusText}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2 space-y-6">
            {lessonData.videoUrl && (
              <Card>
                <CardContent className="p-0">
                  {/* Video Container */}
                  <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 relative rounded-t-lg overflow-hidden">
                    {/* Video Loading Overlay */}
                    {isVideoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                          <div className="text-white text-sm font-medium">Đang tải video...</div>
                        </div>
                      </div>
                    )}

                    {/* Video Error Overlay */}
                    {hasVideoError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10">
                        <div className="text-destructive text-6xl mb-4">⚠️</div>
                        <div className="text-white text-lg font-medium mb-2">Không thể tải video</div>
                        <div className="text-white/80 text-sm mb-4">Vui lòng thử lại sau</div>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setHasVideoError(false)
                            if (videoRef.current) {
                              videoRef.current.load()
                            }
                          }}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Thử lại
                        </Button>
                      </div>
                    )}

                    <video 
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                      onLoadStart={handleVideoLoadStart}
                      onCanPlay={handleVideoCanPlay}
                      onError={handleVideoError}
                      onTimeUpdate={handleVideoTimeUpdate}
                      onEnded={handleVideoEnded}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    >
                      <source src={lessonData.videoUrl} type="video/mp4" />
                      <source src={lessonData.videoUrl} type="video/webm" />
                      <source src={lessonData.videoUrl} type="video/ogg" />
                      Trình duyệt của bạn không hỗ trợ video player.
                    </video>
                  </div>

                  {/* Video Controls */}
                  <div className="p-4 bg-card border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePlayPause}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          <span className="ml-2">{isPlaying ? 'Tạm dừng' : 'Phát'}</span>
                        </Button>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Tốc độ:</span>
                          <select 
                            value={playbackSpeed}
                            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                            className="text-sm border border-input bg-background rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            <option value={0.5}>0.5x</option>
                            <option value={0.75}>0.75x</option>
                            <option value={1}>1x</option>
                            <option value={1.25}>1.25x</option>
                            <option value={1.5}>1.5x</option>
                            <option value={2}>2x</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {videoRef.current && (
                          <span>
                            {Math.floor((videoRef.current.currentTime || 0) / 60)}:
                            {Math.floor((videoRef.current.currentTime || 0) % 60).toString().padStart(2, '0')} / 
                            {formatDuration(lessonData.duration)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lesson Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Nội dung bài học
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: lessonData.content }}>
                  </p>
                </div>

                {/* Solution Section */}
                {lessonData.solution && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Lời giải
                    </h3>
                    <div className="text-blue-800 dark:text-blue-200">
                      <pre className="whitespace-pre-wrap text-sm bg-white dark:bg-slate-900 p-3 rounded border font-mono">
                        {lessonData.solution}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress Card - Different display based on lesson type */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Tiến độ bài học
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Type 2 (Video): Show progress bar based on video time */}
                {lessonData.type === 2 && lessonData.videoUrl ? (
                  <>
                    {!isCompleted && (
                      <>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-gray-700">Hoàn thành:</span>
                            <span className="text-2xl font-bold text-gray-900">
                              {Math.round(storedProgress)}%
                            </span>
                          </div>

                          <div className="relative">
                            <Progress value={storedProgress} className="h-4" />
                          </div>
                        </div>

                        {/* Video time info */}
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-600 font-medium">
                              <Video className="w-4 h-4" />
                              Thời gian xem:
                            </span>
                            <span className="font-semibold text-gray-900">
                              {videoRef.current
                                ? `${Math.floor((videoRef.current.currentTime || 0) / 60)}:${Math.floor((videoRef.current.currentTime || 0) % 60)
                                    .toString()
                                    .padStart(2, "0")}`
                                : "0:00"}{" "}
                              / {formatDuration(lessonData.duration)}
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex flex-col gap-2 pt-2">
                      {isCompleted || storedProgress >= 80 ? (
                        <Button
                          className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold shadow-md"
                          onClick={() => markCompleted()}
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Đã hoàn thành
                        </Button>
                      ) : (
                        <Button
                          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                          onClick={() => markCompleted()}
                          disabled={storedProgress < 80}
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Đánh dấu đã hoàn thành
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  /* Type 1 (Lesson): Only show completion button */
                  <>
                    <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                      <div className="mb-4">
                        {isCompleted ? (
                          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <p className="text-base font-semibold text-gray-900 mb-2">
                        {isCompleted ? 'Bạn đã hoàn thành bài học này! 🎉' : 'Đọc xong nội dung bài học?'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isCompleted ? 'Bạn có thể xem lại bất cứ lúc nào' : 'Đánh dấu hoàn thành khi bạn đã học xong'}
                      </p>
                    </div>

                    {isCompleted ? (
                      <Button
                        className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold shadow-md"
                        onClick={() => markCompleted()}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Đã hoàn thành
                      </Button>
                    ) : (
                      <Button
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                        onClick={() => markCompleted()}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Đánh dấu đã hoàn thành
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Course Content Tracking */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-4">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <List className="w-5 h-5" />
                  Nội dung khóa học
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto scrollbar-hide">
                  {sections?.map((section, sectionIndex) => (
                    <div key={section.id} className="border-b last:border-b-0">
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-gray-900">
                            {sectionIndex + 1}. {section.title}
                          </span>
                        </div>
                        {expandedSections.has(section.id) ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </button>

                      {/* Lessons List */}
                      {expandedSections.has(section.id) && (
                        <div className="bg-gray-50">
                          {section.accountLessons?.map((lesson, lessonIndex) => {
                            const isCurrentLesson = lesson.id === accountLessonId
                            const isLessonCompleted = lesson.status === 3
                            
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => {
                                  if (lesson.lesson?.type === 3) {
                                    // Quiz
                                    router.push(`/parent/courses/learning/${slug}/quiz/${lesson.id}`)
                                  } else {
                                    // Lesson
                                    router.push(`/parent/courses/learning/${slug}/lesson/${lesson.id}`)
                                  }
                                }}
                                className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-100 transition-colors text-left ${
                                  isCurrentLesson ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                }`}
                              >
                                {/* Status Icon */}
                                <div className="flex-shrink-0 mt-0.5">
                                  {isLessonCompleted ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                      <span className="text-xs text-gray-500">{lessonIndex + 1}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Lesson Info */}
                                <div className="flex-1 min-w-0">
                                  <div className={`text-sm font-medium mb-1 ${
                                    isCurrentLesson ? 'text-blue-700' : 'text-gray-900'
                                  }`}>
                                    {lesson.lesson?.title}
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {lesson.lesson?.type === 3 ? (
                                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Quiz
                                      </Badge>
                                    ) : lesson.lesson?.type === 2 ? (
                                      <Badge variant="secondary" className="text-xs px-1.5 py-0 flex items-center gap-1">
                                        <Video className="w-3 h-3" />
                                        {Math.floor((lesson.lesson?.duration || 0) / 60)}m
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary" className="text-xs px-1.5 py-0 flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" />
                                        {Math.floor((lesson.lesson?.duration || 0) / 60)}m
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
