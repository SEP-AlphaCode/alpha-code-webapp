"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, Music, Video, X, Play, Pause, Volume2, FileAudio, FileVideo } from "lucide-react"

export default function MusicPage() {
  const [fileUrl, setFileUrl] = useState<string>("")
  const [fileType, setFileType] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [fileSize, setFileSize] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
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

  const isAudio = fileType.startsWith("audio/")
  const isVideo = fileType.startsWith("video/")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Music & Video Studio
          </h1>
          <p className="text-gray-600 text-lg">Upload and preview your media files</p>
        </div>

        {/* Upload Area */}
        <Card className="mb-8 overflow-hidden border-2 border-dashed border-gray-300 hover:border-purple-400 transition-all duration-300">
          <CardContent className="p-0">
            <div
              className={`relative p-12 text-center transition-all duration-300 ${
                isDragOver 
                  ? "bg-purple-50 border-purple-400" 
                  : "hover:bg-gray-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Drag & Drop your media files here
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Support for MP3, WAV, MP4, AVI and more
                  </p>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
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
        </Card>

        {/* Media Preview */}
        {fileUrl && (
          <Card className="overflow-hidden shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isAudio ? (
                    <FileAudio className="w-6 h-6" />
                  ) : (
                    <FileVideo className="w-6 h-6" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{fileName}</CardTitle>
                    <p className="text-purple-100 text-sm">
                      {formatFileSize(fileSize)} • {fileType}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={removePreview}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Audio Player */}
              {isAudio && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center p-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Music className="w-12 h-12 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Audio File
                      </Badge>
                    </div>
                  </div>
                  
                  <audio
                    ref={audioRef}
                    controls
                    src={fileUrl}
                    className="w-full h-12 rounded-lg"
                    preload="metadata"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    Your browser does not support audio playback.
                  </audio>
                </div>
              )}

              {/* Video Player */}
              {isVideo && (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-black">
                    <video
                      ref={videoRef}
                      controls
                      src={fileUrl}
                      className="w-full max-h-96 object-contain"
                      preload="metadata"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    >
                      Your browser does not support video playback.
                    </video>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Video className="w-3 h-3 mr-1" />
                      Video File
                    </Badge>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={togglePlayPause}
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Volume2 className="w-4 h-4 mr-1" />
                    <span>Ready to play</span>
                  </div>
                </div>

                <Button
                  onClick={removePreview}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        {!fileUrl && (
          <Card className="mt-8 border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-3">💡 Tips:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Drag and drop files directly onto the upload area</li>
                <li>• Supported formats: MP3, WAV, MP4, AVI, MOV, and more</li>
                <li>• Files are processed locally in your browser for privacy</li>
                <li>• Use the built-in controls to play, pause, and adjust volume</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}