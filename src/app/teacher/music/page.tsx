"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, Music, Video, X, Play, Pause, Volume2, FileAudio, FileVideo, Sparkles, Clock, Copy, Bot, Zap } from "lucide-react"
import { getDancePlan } from "@/features/users/api/music-api"
import { DancePlanReposnse } from "@/types/music"
import { ActionActivites } from "@/types/action"
import { Color } from "@/types/color"

export default function MusicPage() {
  const [fileUrl, setFileUrl] = useState<string>("")
  const [fileType, setFileType] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [fileSize, setFileSize] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false)
  const [dancePlan, setDancePlan] = useState<DancePlanReposnse | null>(null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
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
    setFileUrl("")
    setFileType("")
    setFileName("")
    setFileSize(0)
    setIsPlaying(false)
    setCurrentFile(null)
    setDancePlan(null)
    setStartTime("")
    setEndTime("")
    setCurrentTime(0)
    setDuration(0)
    setIsModalOpen(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
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
    } else if (videoRef.current) {
      const time = videoRef.current.currentTime
      setStartTime(formatTime(time))
    }
  }

  const handleSetEndTime = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime
      setEndTime(formatTime(time))
    } else if (videoRef.current) {
      const time = videoRef.current.currentTime
      setEndTime(formatTime(time))
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
      alert("Please upload a file first")
      return
    }

    if (!isAudio && !isVideo) {
      alert("Please upload an audio or video file to generate a dance plan")
      return
    }

    // Parse start and end time if provided
    const startTimeNum = startTime ? parseTimeToSeconds(startTime) : undefined
    const endTimeNum = endTime ? parseTimeToSeconds(endTime) : undefined
    
    // Validate if both are provided
    if (startTime && endTime) {
      if (isNaN(startTimeNum!) || isNaN(endTimeNum!)) {
        alert("Please enter valid time format (mm:ss or seconds)")
        return
      }
      if (startTimeNum! >= endTimeNum!) {
        alert("Start time must be less than end time")
        return
      }
      if (startTimeNum! < 0) {
        alert("Start time must be greater than or equal to 0")
        return
      }
    }

    // Open modal and start generation
    setIsModalOpen(true)
    setIsGeneratingPlan(true)
    setDancePlan(null)

    try {
      console.log("Generating dance plan for:", currentFile.name)
      if (startTime && endTime) {
        console.log("Using time range:", startTimeNum, "to", endTimeNum)
      }
      
      const result = await getDancePlan(currentFile, startTimeNum, endTimeNum)
      setDancePlan(result)
      console.log("Dance plan generated:", result)
    } catch (error) {
      console.error("Failed to generate dance plan:", error)
      alert("Failed to generate dance plan. Please try again.")
      setIsModalOpen(false) // Close modal on error
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  const isAudio = fileType.startsWith("audio/")
  const isVideo = fileType.startsWith("video/")

  return (
    <div className="min-h-screen bg-white relative overflow-hidden p-10" suppressHydrationWarning>
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
              Music & Dance 
              <span className="block text-gray-700 py-2">
                Creative Studio
              </span>
            </h1>
            
            {/* Enhanced Description */}
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium">
                Transform your music into spectacular dance performances
              </p>
              <p className="text-lg text-gray-500 leading-relaxed">
                Upload your audio files and watch as our AI creates synchronized choreography for Alpha Mini robots
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
                <span className="text-sm font-medium text-gray-700">Real-time Analysis</span>
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
                      Drop Your Music Here
                    </h3>
                    <div className="space-y-3">
                      <p className="text-lg text-gray-600 leading-relaxed">
                        Drag & drop your audio files or click to browse your computer
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports MP3, WAV, M4A, and other popular audio formats up to 50MB
                      </p>
                    </div>
                    
                    {/* Enhanced Feature Tags */}
                    <div className="flex flex-wrap gap-3 justify-center">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                        <Music className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Audio Analysis</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                        <Bot className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">AI Choreography</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                        <Zap className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Instant Preview</span>
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
                      Choose Your Music
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
                            Ready for Analysis
                          </Badge>
                          <p className="text-base text-gray-700 font-medium">
                            Alpha Mini Choreography Engine
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
                      Set time range for focused dance generation. Leave empty to analyze the entire audio file.
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
                      {isGeneratingPlan ? (
                        <>
                          <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Dance Plan
                        </>
                      )}
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

        {/* Enhanced Dance Plan Generation Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader className="border-b border-gray-200 pb-6">
              <DialogTitle className="flex items-center space-x-3 text-2xl">
                <div className="p-2 bg-gray-600 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span>Dance Plan Generation</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-8 pt-6">
              {/* Enhanced File Info */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-600 rounded-xl">
                    <FileAudio className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{fileName}</h4>
                    <p className="text-sm text-gray-600">
                      {startTime && endTime ? (
                        <>Time Range: {startTime.includes(':') ? startTime : formatTime(parseFloat(startTime))} - {endTime.includes(':') ? endTime : formatTime(parseFloat(endTime))} ({(parseTimeToSeconds(endTime) - parseTimeToSeconds(startTime)).toFixed(1)}s duration)</>
                      ) : (
                        <>Processing entire audio file</>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Generation Status */}
              {isGeneratingPlan && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center space-x-4 bg-gray-50 px-8 py-6 rounded-2xl border border-gray-200">
                    <div className="w-10 h-10 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-700">Generating Dance Plan...</h3>
                      <p className="text-sm text-gray-600">This may take up to 5 minutes. Please wait.</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Processing audio and analyzing rhythm patterns</span>
                  </div>
                </div>
              )}

              {/* Enhanced Generation Success */}
              {!isGeneratingPlan && dancePlan && (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900">Dance Activities</h4>
                          <p className="text-sm text-gray-600">Generated choreography for this music</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      {dancePlan?.activity?.actions && Array.isArray(dancePlan.activity.actions) ? (
                        <div className="space-y-4">
                          {dancePlan.activity.actions.map((action: ActionActivites, index: number) => (
                            <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:bg-gray-100 transition-colors">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <span className="w-8 h-8 bg-gray-500 text-white rounded-lg flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                  </span>
                                  <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                    Activity {index + 1}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-1 rounded-full border">
                                  <Clock className="w-3 h-3" />
                                  {action.start_time}s - {action.start_time + action.duration}s
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="bg-white p-4 rounded-lg border border-gray-100">
                                  <h5 className="text-lg font-semibold text-gray-900 mb-1">
                                    Action ID: {action.action_id}
                                  </h5>
                                  {action.action_type && (
                                    <p className="text-sm text-gray-600 font-medium">
                                      Type: {action.action_type}
                                    </p>
                                  )}
                                </div>
                                
                                {action.color && Array.isArray(action.color) && action.color.length > 0 && (
                                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                                    <p className="text-sm font-medium text-gray-700 mb-3">Colors</p>
                                    <div className="flex flex-wrap gap-2">
                                      {action.color.map((color: Color, colorIndex: number) => {
                                        const hexColor = `#${[color.r, color.g, color.b].map(x => x.toString(16).padStart(2, '0')).join('')}`
                                        return (
                                        <div key={colorIndex} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                          <div 
                                            className="w-4 h-4 rounded-full border border-gray-300" 
                                            style={{ backgroundColor: hexColor }}
                                          ></div>
                                          <span className="text-sm text-gray-700">
                                            RGB({color.r}, {color.g}, {color.b})
                                          </span>
                                        </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Music className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-600 mb-4">No dance activities found</p>
                          <details className="mt-6 p-4 bg-gray-50 rounded-lg text-left border">
                            <summary className="text-sm font-medium text-gray-700 cursor-pointer">View raw data</summary>
                            <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
                              {JSON.stringify(dancePlan, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const activitiesText = dancePlan?.activity?.actions
                          ? dancePlan.activity.actions.map((action: ActionActivites, index: number) => 
                              `Activity ${index + 1}: Action ID: ${action.action_id}\n` +
                              `Type: ${action.action_type || 'N/A'}\n` +
                              `Time: ${action.start_time}s - ${action.start_time + action.duration}s (${action.duration}s)\n` +
                              `${action.color && action.color.length > 0 ? `Colors: ${action.color.map((c: Color) => `RGB(${c.r}, ${c.g}, ${c.b})`).join(', ')}\n` : ''}\n`
                            ).join('\n')
                          : JSON.stringify(dancePlan, null, 2)
                        
                        navigator.clipboard.writeText(activitiesText)
                        alert("Dance activities saved to clipboard!")
                      }}
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}