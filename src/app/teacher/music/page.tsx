"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, Music, Video, X, Play, Pause, Volume2, FileAudio, FileVideo, Sparkles, Clock, Bot, Zap } from "lucide-react"
import { getDancePlan } from "@/features/users/api/music-api"
import { toast } from "sonner"
import UpLoadingState from "@/components/uploading-state"

export default function MusicPage() {
  const router = useRouter()
  const [fileUrl, setFileUrl] = useState<string>("")
  const [fileType, setFileType] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [fileSize, setFileSize] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFileChange = (file: File) => {
    if (file) {
      const url = URL.createObjectURL(file)
      setFileUrl(url)
      setFileType(file.type)
      setFileName(file.name)
      setFileSize(file.size)
      setIsPlaying(false)
      setCurrentFile(file) // Store the actual file for API calls
      
      // Thông báo tải file thành công
      toast.success(`Tải file "${file.name}" thành công!`)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileChange(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("audio/") || file.type.startsWith("video/")) {
        handleFileChange(file)
      }
    }
  }

  const removePreview = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl)
    }
    const fileName = currentFile?.name
    setFileUrl("")
    setFileType("")
    setFileName("")
    setFileSize(0)
    setIsPlaying(false)
    setCurrentFile(null)
    setStartTime("")
    setEndTime("")
    setCurrentTime(0)
    setDuration(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    
    // Thông báo xóa file thành công
    if (fileName) {
      toast.info(`Đã xóa file "${fileName}"`)
    }
  }

  const togglePlayPause = () => {
    if (isAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } else if (isVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const parseTimeToSeconds = (timeString: string): number => {
    if (!timeString) return 0
    
    // If it's already a number, return as is
    if (!isNaN(parseFloat(timeString)) && !timeString.includes(':')) {
      return parseFloat(timeString)
    }
    
    // If it's in mm:ss format, convert to seconds
    const parts = timeString.split(':')
    if (parts.length === 2) {
      const minutes = parseInt(parts[0]) || 0
      const seconds = parseInt(parts[1]) || 0
      return minutes * 60 + seconds
    }
    
    return 0
  }

  const handleSetStartTime = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime
      setStartTime(formatTime(time))
      toast.success(`Đã đặt thời gian bắt đầu: ${formatTime(time)}`)
    } else if (videoRef.current) {
      const time = videoRef.current.currentTime
      setStartTime(formatTime(time))
      toast.success(`Đã đặt thời gian bắt đầu: ${formatTime(time)}`)
    }
  }

  const handleSetEndTime = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime
      setEndTime(formatTime(time))
      toast.success(`Đã đặt thời gian kết thúc: ${formatTime(time)}`)
    } else if (videoRef.current) {
      const time = videoRef.current.currentTime
      setEndTime(formatTime(time))
      toast.success(`Đã đặt thời gian kết thúc: ${formatTime(time)}`)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    } else if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    } else if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleGenerateDancePlan = async () => {
    if (!currentFile) {
      toast.error("Vui lòng tải lên file trước!")
      return
    }

    if (!isAudio && !isVideo) {
      toast.error("Vui lòng tải lên file audio hoặc video để tạo dance plan!")
      return
    }

    // Parse start and end time if provided
    const startTimeNum = startTime ? parseTimeToSeconds(startTime) : undefined
    const endTimeNum = endTime ? parseTimeToSeconds(endTime) : undefined
    
    // Validate if both are provided
    if (startTime && endTime) {
      if (isNaN(startTimeNum!) || isNaN(endTimeNum!)) {
        toast.error("Vui lòng nhập đúng định dạng thời gian (mm:ss hoặc giây)!")
        return
      }
      if (startTimeNum! >= endTimeNum!) {
        toast.error("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!")
        return
      }
      if (startTimeNum! < 0) {
        toast.error("Thời gian bắt đầu phải lớn hơn hoặc bằng 0!")
        return
      }
    }

    // Start generation
    setIsGeneratingPlan(true)

    try {
      console.log("Generating dance plan for:", currentFile.name)
      if (startTime && endTime) {
        console.log("Using time range:", startTimeNum, "to", endTimeNum)
      }
      
      const result = await getDancePlan(currentFile, startTimeNum, endTimeNum)
      console.log("Dance plan generated:", result)
      
      // Hiển thị thông báo thành công
      toast.success("Tạo dance plan thành công! Đang chuyển hướng...")
      
      // Chuyển hướng đến trang preview activities với data
      const params = new URLSearchParams()
      params.set('data', encodeURIComponent(JSON.stringify(result)))
      params.set('file', encodeURIComponent(currentFile.name))
      
      if (startTime && endTime) {
        const timeRangeText = `${startTime.includes(':') ? startTime : formatTime(parseFloat(startTime))} - ${endTime.includes(':') ? endTime : formatTime(parseFloat(endTime))} (${(parseTimeToSeconds(endTime) - parseTimeToSeconds(startTime)).toFixed(1)}s)`
        params.set('range', encodeURIComponent(timeRangeText))
      }
      
      // Chờ một chút để user thấy thông báo rồi chuyển hướng
      setTimeout(() => {
        router.push(`/teacher/music/previewactivities?${params.toString()}`)
      }, 1000)
    } catch (error: unknown) {
      console.error("Failed to generate dance plan:", error)
      
      let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!'
      
      if (error && typeof error === 'object' && 'response' in error) {
        const httpError = error as { response: { status: number; data?: unknown } }
        // Server responded with error status
        const status = httpError.response.status
        switch (status) {
          case 413:
            errorMessage = 'File quá lớn! Vui lòng chọn file nhỏ hơn.'
            break
          case 400:
            errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại file và thời gian.'
            break
          case 401:
            errorMessage = 'Bạn cần đăng nhập lại.'
            break
          case 403:
            errorMessage = 'Bạn không có quyền thực hiện chức năng này.'
            break
          case 500:
            errorMessage = 'Lỗi server. Vui lòng thử lại sau.'
            break
          default:
            errorMessage = `Lỗi server (${status}). Vui lòng thử lại sau.`
        }
      } else if (error && typeof error === 'object' && 'request' in error) {
        // Network error
        const networkError = error as { code?: string; message?: string }
        if (networkError.code === 'ERR_NETWORK') {
          if (networkError.message?.includes('CORS')) {
            errorMessage = 'Lỗi CORS: Server chưa cấu hình cho phép truy cập từ localhost. Vui lòng liên hệ admin.'
          } else {
            errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet hoặc liên hệ admin.'
          }
        } else {
          errorMessage = 'Lỗi kết nối mạng. Vui lòng thử lại.'
        }
      }
      
      toast.error(errorMessage)
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  const isAudio = fileType.startsWith("audio/")
  const isVideo = fileType.startsWith("video/")

  return (
    <div className="min-h-screen bg-white relative overflow-hidden p-10" suppressHydrationWarning>
      {/* Full-screen Loading Overlay */}
      {isGeneratingPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
            <UpLoadingState message="Đang phân tích âm nhạc và tạo động tác nhảy. Quá trình này có thể mất đến 5 phút..." />
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>
      
      {/* Decorative Grid Squares - Music Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Left Squares */}
        <div className="absolute top-20 left-20 w-16 h-16 border-2 border-purple-200 rounded-lg rotate-12 opacity-50 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-12 h-12 border-2 border-pink-200 rounded-md rotate-45 opacity-45 animate-bounce"></div>
        <div className="absolute top-60 left-10 w-8 h-8 border-2 border-violet-200 rounded-sm -rotate-12 opacity-55 animate-spin" style={{animationDuration: '8s'}}></div>
        
        {/* Top Right Squares */}
        <div className="absolute top-32 right-24 w-20 h-20 border-2 border-fuchsia-200 rounded-xl -rotate-6 opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-16 right-48 w-14 h-14 border-2 border-rose-200 rounded-lg rotate-30 opacity-50 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-72 right-16 w-10 h-10 border-2 border-indigo-200 rounded-md -rotate-45 opacity-45 animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}></div>
        
        {/* Bottom Left Squares */}
        <div className="absolute bottom-40 left-32 w-18 h-18 border-2 border-cyan-200 rounded-lg rotate-15 opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-16 w-12 h-12 border-2 border-teal-200 rounded-md -rotate-30 opacity-55 animate-bounce" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-60 left-60 w-8 h-8 border-2 border-emerald-200 rounded-sm rotate-60 opacity-45 animate-spin" style={{animationDuration: '10s'}}></div>
        
        {/* Bottom Right Squares */}
        <div className="absolute bottom-32 right-40 w-16 h-16 border-2 border-purple-200 rounded-lg -rotate-20 opacity-50 animate-pulse" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute bottom-16 right-20 w-14 h-14 border-2 border-pink-200 rounded-md rotate-45 opacity-45 animate-bounce" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-48 right-64 w-10 h-10 border-2 border-violet-200 rounded-sm -rotate-15 opacity-55 animate-spin" style={{animationDuration: '7s', animationDirection: 'reverse'}}></div>
        
        {/* Center Area Squares - Music themed */}
        <div className="absolute top-1/2 left-1/4 w-6 h-6 border border-purple-200 rounded-sm rotate-45 opacity-35 animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 border border-pink-200 rounded-md -rotate-30 opacity-35 animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-1/3 left-1/2 w-4 h-4 border border-violet-200 rounded-sm rotate-12 opacity-40 animate-pulse" style={{animationDelay: '1.2s'}}></div>
        
        {/* Musical Note Styled Squares */}
        <div className="absolute top-1/4 left-1/3 w-10 h-10 border-2 border-fuchsia-300 rounded-full rotate-0 opacity-30 animate-bounce" style={{animationDelay: '2.8s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 border-2 border-rose-300 rounded-full rotate-0 opacity-35 animate-pulse" style={{animationDelay: '3.5s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          {/* Alpha Mini Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white backdrop-blur-sm border border-gray-200 text-gray-700 rounded-2xl text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            Alpha Mini Studio
            <Sparkles className="w-5 h-5 text-gray-600" />
          </div>
          
          {/* Main Title */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Âm Nhạc & Nhảy Múa 
              <span className="block text-gray-700 py-2">
                Studio Sáng Tạo
              </span>
            </h1>
            
            {/* Enhanced Description */}
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium">
                Biến âm nhạc của bạn thành những màn trình diễn nhảy múa tuyệt vời
              </p>
              <p className="text-lg text-gray-500 leading-relaxed">
                Tải lên file âm thanh và xem AI tạo ra vũ đạo đồng bộ cho robot Alpha Mini
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Hỗ trợ AI</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
                <span className="text-sm font-medium text-gray-700">Phân tích thời gian thực</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-500"></div>
                <span className="text-sm font-medium text-gray-700">Custom Choreography</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Upload Area */}
        <Card className="mb-12 overflow-hidden border-0 bg-white/80 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-700 group relative">
          {/* Animated Border */}
          <div className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          <div className="relative bg-white rounded-xl m-0.5">
            <CardContent className="p-0">
              <div
                className={`relative transition-all duration-700 ${
                  isDragOver 
                    ? "bg-gray-50 border-2 border-gray-300 border-dashed scale-[1.02]" 
                    : "hover:bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {/* Floating Music Notes */}
                  <div className="absolute top-12 left-12 opacity-20">
                    <Music className="w-6 h-6 text-gray-400 animate-bounce" />
                  </div>
                  <div className="absolute top-20 right-20 opacity-15">
                    <Music className="w-4 h-4 text-gray-400 animate-bounce delay-500" />
                  </div>
                  <div className="absolute bottom-16 left-24 opacity-25">
                    <Music className="w-5 h-5 text-gray-400 animate-bounce delay-1000" />
                  </div>
                  
                  {/* Animated Circles */}
                  <div className="absolute top-16 right-32 w-3 h-3 bg-gray-200 rounded-full opacity-30 animate-ping"></div>
                  <div className="absolute bottom-24 right-16 w-4 h-4 bg-gray-200 rounded-full opacity-25 animate-ping delay-700"></div>
                  <div className="absolute top-32 left-32 w-2 h-2 bg-gray-200 rounded-full opacity-35 animate-ping delay-300"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center space-y-8 py-20 px-8">
                  {/* Enhanced Icon with Animation */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gray-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                    <div className="relative p-8 bg-gray-600 rounded-3xl shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500">
                      <Upload className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  
                  {/* Enhanced Text Content */}
                  <div className="space-y-6 text-center max-w-2xl">
                    <h3 className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                      Thả Nhạc Của Bạn Ở Đây
                    </h3>
                    <div className="space-y-3">
                      <p className="text-lg text-gray-600 leading-relaxed">
                        Kéo & thả file âm thanh của bạn hoặc nhấp để duyệt máy tính
                      </p>
                      <p className="text-sm text-gray-500">
                        Hỗ trợ MP3, WAV, M4A và các định dạng âm thanh phổ biến khác lên đến 100MB
                      </p>
                    </div>
                    
                    {/* Enhanced Feature Tags */}
                    <div className="flex flex-wrap gap-3 justify-center">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                        <Music className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Phân Tích Âm Thanh</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                        <Bot className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Vũ Đạo AI</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                        <Zap className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Xem Trước Ngay Lập Tức</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Upload Button */}
                  <div className="pt-4">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="lg"
                      className="bg-gray-600 hover:bg-gray-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Upload className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                      Chọn Nhạc Của Bạn
                    </Button>
                  </div>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,video/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Enhanced Media Preview */}
        {fileUrl && (
          <Card className="overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-xl mb-12 group hover:shadow-3xl transition-all duration-700">
            {/* Enhanced Header with Gradient */}
            <CardHeader className="bg-gray-600 text-white relative overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-2 right-2 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-2 left-2 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-500"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Enhanced File Icon */}
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
                    {isAudio ? (
                      <FileAudio className="w-8 h-8" />
                    ) : (
                      <FileVideo className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold mb-1">{fileName}</CardTitle>
                    <div className="flex items-center gap-3 text-white/80 text-sm">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        {formatFileSize(fileSize)}
                      </span>
                      <span>•</span>
                      <span className="px-2 py-1 bg-white/20 rounded-md font-medium">
                        {fileType}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={removePreview}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-200 hover:scale-110"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              {/* Enhanced Audio Player */}
              {isAudio && (
                <div className="space-y-8">
                  {/* Audio Visualization Area */}
                  <div className="relative overflow-hidden rounded-3xl bg-gray-50 border border-gray-200 shadow-inner">
                    <div className="absolute inset-0 bg-gray-100/30"></div>
                    
                    <div className="relative flex items-center justify-center p-16">
                      {/* Animated Background Elements */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 border-4 border-gray-200 rounded-full animate-pulse"></div>
                        <div className="absolute w-36 h-36 border-2 border-gray-300 rounded-full animate-ping"></div>
                        <div className="absolute w-24 h-24 border border-gray-400 rounded-full animate-pulse delay-500"></div>
                      </div>
                      
                      {/* Central Music Icon */}
                      <div className="relative z-10 text-center">
                        <div className="w-28 h-28 bg-gray-600 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-500 group-hover:rotate-3">
                          <Music className="w-14 h-14 text-white" />
                        </div>
                        
                        <div className="space-y-3">
                          <Badge className="bg-gray-100 text-gray-800 px-4 py-2 font-semibold border border-gray-200 shadow-sm">
                            <Music className="w-4 h-4 mr-2" />
                            Sẵn Sàng Phân Tích
                          </Badge>
                          <p className="text-base text-gray-700 font-medium">
                            Hệ Thống Tạo Vũ Đạo Alpha Mini
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Audio Controls */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <audio
                      ref={audioRef}
                      controls
                      src={fileUrl}
                      className="w-full h-14 rounded-xl shadow-md"
                      preload="metadata"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                    >
                      Your browser does not support audio playback.
                    </audio>
                    
                    {/* Current Time Display */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                      <span>Current Time: {formatTime(currentTime)}</span>
                      <span>Duration: {formatTime(duration)}</span>
                    </div>
                  </div>
                  
                  {/* Enhanced AI Dance Configuration */}
                  <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-gray-600 rounded-xl shadow-lg">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">AI Dance Configuration</h4>
                        <p className="text-sm text-gray-600">Customize choreography parameters</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-8 p-4 bg-white/60 rounded-xl border border-gray-200">
                      <Sparkles className="w-4 h-4 inline mr-2 text-gray-600" />
                      Đặt khoảng thời gian để tạo ra các bước nhảy tập trung. Bỏ trống để phân tích toàn bộ file âm thanh.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-800">Start Time (mm:ss or seconds)</label>
                        <div className="flex gap-3">
                          <Input
                            type="text"
                            placeholder="0:00"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="flex-1 h-12 bg-white/80 border-gray-200 focus:border-gray-400 focus:ring-gray-400/20 rounded-xl shadow-sm text-center font-medium"
                          />
                          <Button
                            onClick={handleSetStartTime}
                            size="default"
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 h-12 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap font-medium"
                          >
                            Set Current
                          </Button>
                        </div>
                        {startTime && (
                          <p className="text-xs text-gray-600 mt-2 text-center">
                            ⏰ Start at: {startTime.includes(':') ? startTime : formatTime(parseFloat(startTime))}
                          </p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-800">End Time (mm:ss or seconds)</label>
                        <div className="flex gap-3">
                          <Input
                            type="text"
                            placeholder="0:30"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="flex-1 h-12 bg-white/80 border-gray-200 focus:border-gray-400 focus:ring-gray-400/20 rounded-xl shadow-sm text-center font-medium"
                          />
                          <Button
                            onClick={handleSetEndTime}
                            size="default"
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 h-12 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap font-medium"
                          >
                            Set Current
                          </Button>
                        </div>
                        {endTime && (
                          <p className="text-xs text-gray-600 mt-2 text-center">
                            ⏰ End at: {endTime.includes(':') ? endTime : formatTime(parseFloat(endTime))}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-100/50 rounded-xl border border-gray-200">
                      <div className="text-sm text-gray-700 flex items-center gap-3">
                        <div className="p-1 bg-gray-600 rounded-full">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        AI will analyze rhythm, tempo, and mood to create synchronized dance movements
                      </div>
                      
                      {/* Show selected range */}
                      {startTime && endTime && (
                        <div className="mt-3 p-3 bg-white/70 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-800 mb-2">
                            📍 Selected Range:
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-4 h-4" />
                              {startTime.includes(':') ? startTime : formatTime(parseFloat(startTime))} - {endTime.includes(':') ? endTime : formatTime(parseFloat(endTime))}
                            </span>
                            <span className="text-gray-500">
                              ({(parseTimeToSeconds(endTime) - parseTimeToSeconds(startTime)).toFixed(1)}s duration)
                            </span>
                          </div>
                          
                          {/* Progress bar visualization */}
                          {duration > 0 && (
                            <div className="mt-3">
                              <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
                                {/* Full duration bar */}
                                <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                                
                                {/* Selected range */}
                                <div 
                                  className="absolute top-0 h-full bg-gray-500 rounded-full transition-all duration-300"
                                  style={{
                                    left: `${(parseTimeToSeconds(startTime) / duration) * 100}%`,
                                    width: `${((parseTimeToSeconds(endTime) - parseTimeToSeconds(startTime)) / duration) * 100}%`
                                  }}
                                ></div>
                                
                                {/* Current time indicator */}
                                <div 
                                  className="absolute top-0 w-1 h-full bg-gray-600 transition-all duration-100"
                                  style={{
                                    left: `${(currentTime / duration) * 100}%`
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0:00</span>
                                <span className="text-red-500">Current: {formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Video Player */}
              {isVideo && (
                <div className="space-y-6">
                  <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl">
                    <video
                      ref={videoRef}
                      controls
                      src={fileUrl}
                      className="w-full max-h-96 object-contain"
                      preload="metadata"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                    >
                      Your browser does not support video playback.
                    </video>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-4 py-2 font-semibold border border-gray-300 shadow-sm">
                      <Video className="w-4 h-4 mr-2" />
                      Video File
                    </Badge>
                  </div>

                  {/* AI Dance Configuration for Video */}
                  <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-gray-600 rounded-xl shadow-lg">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">AI Dance Configuration</h4>
                        <p className="text-sm text-gray-600">Customize choreography parameters</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-8 p-4 bg-white/60 rounded-xl border border-gray-200">
                      <Sparkles className="w-4 h-4 inline mr-2 text-gray-600" />
                      Set time range for focused dance generation. Leave empty to analyze the entire video file.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Start Time */}
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-800">Start Time (mm:ss or seconds)</label>
                        <div className="flex gap-3">
                          <Input
                            type="text"
                            placeholder="0:00"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="flex-1 h-12 bg-white/80 border-gray-200 focus:border-gray-400 focus:ring-gray-400/20 rounded-xl shadow-sm text-center font-medium"
                          />
                          <Button
                            onClick={handleSetStartTime}
                            size="default"
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 h-12 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap font-medium"
                          >
                            Set Current
                          </Button>
                        </div>
                        {startTime && (
                          <p className="text-xs text-gray-600 mt-2 text-center">
                            ⏰ Start at: {startTime.includes(':') ? startTime : formatTime(parseFloat(startTime))}
                          </p>
                        )}
                      </div>

                      {/* End Time */}
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-800">End Time (mm:ss or seconds)</label>
                        <div className="flex gap-3">
                          <Input
                            type="text"
                            placeholder="0:30"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="flex-1 h-12 bg-white/80 border-gray-200 focus:border-gray-400 focus:ring-gray-400/20 rounded-xl shadow-sm text-center font-medium"
                          />
                          <Button
                            onClick={handleSetEndTime}
                            size="default"
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 h-12 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap font-medium"
                          >
                            Set Current
                          </Button>
                        </div>
                        {endTime && (
                          <p className="text-xs text-gray-600 mt-2 text-center">
                            ⏰ End at: {endTime.includes(':') ? endTime : formatTime(parseFloat(endTime))}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-100/50 rounded-xl border border-gray-200">
                      <div className="text-sm text-gray-700 flex items-center gap-3">
                        <div className="p-1 bg-gray-600 rounded-full">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        AI will analyze rhythm, tempo, and mood to create synchronized dance movements
                      </div>
                      
                      {/* Show selected range */}
                      {startTime && endTime && (
                        <div className="mt-3 p-3 bg-white/70 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-800 mb-2">
                            📍 Selected Range:
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-4 h-4" />
                              {startTime.includes(':') ? startTime : formatTime(parseFloat(startTime))} - {endTime.includes(':') ? endTime : formatTime(parseFloat(endTime))}
                            </span>
                            <span className="text-gray-500">
                              Duration: {formatTime(parseTimeToSeconds(endTime) - parseTimeToSeconds(startTime))}
                            </span>
                          </div>
                          
                          {/* Progress visualization */}
                          {duration > 0 && (
                            <div className="mt-3">
                              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                                
                                {/* Selected range */}
                                <div 
                                  className="absolute top-0 h-full bg-gray-500 rounded-full transition-all duration-300"
                                  style={{
                                    left: `${(parseTimeToSeconds(startTime) / duration) * 100}%`,
                                    width: `${((parseTimeToSeconds(endTime) - parseTimeToSeconds(startTime)) / duration) * 100}%`
                                  }}
                                ></div>
                                
                                {/* Current time indicator */}
                                <div 
                                  className="absolute top-0 w-1 h-full bg-gray-600 transition-all duration-100"
                                  style={{
                                    left: `${(currentTime / duration) * 100}%`
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0:00</span>
                                <span className="text-red-500">Current: {formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200/50">
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    onClick={togglePlayPause}
                    size="lg"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 mr-2" />
                    ) : (
                      <Play className="w-5 h-5 mr-2" />
                    )}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  
                  {(isAudio || isVideo) && (
                    <Button
                      onClick={handleGenerateDancePlan}
                      disabled={isGeneratingPlan}
                      size="lg"
                      className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      {isGeneratingPlan ? "Đang tạo..." : "Tạo Kế Hoạch Nhảy"}
                    </Button>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    <Volume2 className="w-4 h-4 mr-2" />
                    <span>Ready to play</span>
                  </div>
                </div>

                <Button
                  onClick={removePreview}
                  variant="outline"
                  size="lg"
                  className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <X className="w-5 h-5 mr-2" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Tips */}
        {!fileUrl && (
          <Card className="mt-8 border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">💡 Pro Tips</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Drag and drop files directly onto the upload area for quick access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Supported formats: MP3, WAV, M4A, FLAC, and other popular audio formats</span>
                  </li>
                </ul>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Files are processed securely in your browser for complete privacy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use time ranges for focused choreography on specific song sections</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}