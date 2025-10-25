'use client'
import { useLessonById } from '@/features/courses/hooks/use-lesson'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Play, Pause, RotateCcw, Clock, BookOpen, Bot, Video, CheckCircle, ArrowLeft } from 'lucide-react'

export default function LessonDetailPage() {
  const router = useRouter()
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>()
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Video states
  const [isVideoLoading, setIsVideoLoading] = useState(false)
  const [hasVideoError, setHasVideoError] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Get lesson detail by ID
  const { data: lessonData, isLoading, error } = useLessonById(lessonId)

  useEffect(() => {
    console.log('Lesson data:', lessonData)
    console.log('Loading:', isLoading)
    console.log('Error:', error)
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
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setVideoProgress(progress)
    }
  }

  const handleVideoEnded = () => {
    setVideoProgress(100)
    setIsPlaying(false)
    // Có thể thêm logic đánh dấu hoàn thành bài học ở đây
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
                  onClick={() => router.push('/teacher/courses')}
                  className="cursor-pointer"
                >
                  Khóa học
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => router.back()}
                  className="cursor-pointer"
                >
                  {courseSlug}
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
            onClick={() => router.back()}
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
            <Card>
              <CardContent className="p-0">
                {/* Video Container */}
                <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 relative rounded-t-lg overflow-hidden">
                  {lessonData.videoUrl ? (
                    <>
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
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Video className="w-16 h-16 text-slate-400 mb-4" />
                      <div className="text-white text-lg font-medium mb-2">Chưa có video cho bài học này</div>
                      <div className="text-white/80 text-sm">Video sẽ được cập nhật sớm</div>
                    </div>
                  )}
                </div>

                {/* Video Controls */}
                {lessonData.videoUrl && (
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
                )}
              </CardContent>
            </Card>

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
                  <p className="text-muted-foreground leading-relaxed">
                    {lessonData.content}
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Lesson Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Thông tin bài học
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
                  <Badge variant="secondary">{lessonData.typeText}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <Badge variant={getStatusVariant(lessonData.status)}>
                    {lessonData.statusText}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    Robot:
                  </span>
                  <Badge variant={lessonData.requireRobot ? "destructive" : "default"}>
                    {lessonData.requireRobot ? "Yêu cầu" : "Không cần"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Video:
                  </span>
                  <Badge variant={lessonData.videoUrl ? "default" : "secondary"}>
                    {lessonData.videoUrl ? "Có sẵn" : "Chưa có"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Progress Card */}
            {lessonData.videoUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Tiến độ học tập
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Hoàn thành:</span>
                      <span className="text-sm font-bold text-foreground">{Math.round(videoProgress)}%</span>
                    </div>
                    <Progress value={videoProgress} className="h-4 progress-enhanced" />
                    
                    {/* Video Progress Info */}
                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                      <span>
                        {videoRef.current
                          ? `${Math.floor((videoRef.current.currentTime || 0) / 60)}:${Math.floor((videoRef.current.currentTime || 0) % 60)
                              .toString()
                              .padStart(2, "0")}`
                          : "0:00"}{" "}
                        / {formatDuration(lessonData.duration)}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    variant={videoProgress >= 80 ? "default" : "outline"}
                    onClick={() => {
                      console.log('Lesson completed!')
                    }}
                    disabled={videoProgress < 80}
                  >
                    {videoProgress >= 80 ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Hoàn thành bài học
                      </>
                    ) : (
                      'Xem thêm để hoàn thành'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}