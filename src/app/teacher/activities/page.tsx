"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Play, 
  MoreVertical,
  Edit,
  Eye,
  BookOpen,
  Zap,
  Trophy,
  Star,
  Target,
  Activity,
  Loader2
} from "lucide-react"
import { useActivities, useCreateActivity } from "@/features/activities/hooks/use-activities"
import { useRobotControls } from "@/features/users/hooks/use-websocket"
import { useRobotStore } from "@/hooks/use-robot-store"
import { Activity as ActivityType, ActivityData } from "@/types/activities"
import { ActionActivites } from "@/types/action"

export default function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("1") // Mặc định lọc activities đã xuất bản
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // Reset to first page when search changes
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // API Hooks - use debounced search term
  const { data: activitiesData, isLoading, error } = useActivities(currentPage, 12, debouncedSearchTerm)
  const createActivityMutation = useCreateActivity()

  // Robot Controls Hook
  const { startActivity, isLoading: isRobotLoading } = useRobotControls()
  
  // Robot Store Hook
  const { 
    selectedRobotSerial, 
    selectedRobot, 
    updateRobotStatus, 
    initializeMockData 
  } = useRobotStore()

  // Initialize mock robot data
  useEffect(() => {
    initializeMockData()
  }, [initializeMockData])

  const activities = activitiesData?.data || []
  const pagination = activitiesData ? {
    total_count: activitiesData.total_count,
    page: activitiesData.page,
    per_page: activitiesData.per_page,
    total_pages: activitiesData.total_pages,
    has_next: activitiesData.has_next,
    has_previous: activitiesData.has_previous
  } : null

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "dance_with_music":
        return <Play className="w-4 h-4" />
      case "lesson":
        return <BookOpen className="w-4 h-4" />
      case "game":
        return <Trophy className="w-4 h-4" />
      case "exercise":
        return <Target className="w-4 h-4" />
      case "project":
        return <Zap className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "dance_with_music":
        return "bg-pink-100 text-pink-800"
      case "lesson":
        return "bg-blue-100 text-blue-800"
      case "game":
        return "bg-purple-100 text-purple-800"
      case "exercise":
        return "bg-green-100 text-green-800"
      case "project":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800"
      case 0:
        return "bg-yellow-100 text-yellow-800"
      case 2:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "Đã xuất bản"
      case 0:
        return "Bản nháp"
      case 2:
        return "Đã lưu trữ"
      default:
        return "Không xác định"
    }
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === "all" || activity.type === filterType
    const matchesStatus = filterStatus === "all" || activity.status.toString() === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const handleStartActivity = (activity: ActivityType) => {
    // Sử dụng selected robot serial từ Redux
    const robotSerial = selectedRobotSerial || "EAA007UBT10000341";
    
    console.log('Selected Robot:', selectedRobot);
    console.log('Using Robot Serial:', robotSerial);
    console.log('Activity data before processing:', activity);
    
    // Update robot status to busy when starting activity
    if (robotSerial && selectedRobot) {
      updateRobotStatus(robotSerial, 'busy');
    }
    
    // Parse data từ activity (nếu là JSON string)
    let activityData;
    try {
      activityData = typeof activity.data === 'string' ? JSON.parse(activity.data) : activity.data;
    } catch (error) {
      console.error('Error parsing activity data:', error);
      activityData = activity.data;
    }
    
    console.log('Processed activity data:', activityData);
    console.log('Activity type:', activity.type);
    
    // Gửi command với selected robot
    startActivity(robotSerial, activity.type, activityData);
    
    // Set robot back to online after a delay (mock behavior)
    setTimeout(() => {
      if (robotSerial) {
        updateRobotStatus(robotSerial, 'online');
      }
    }, 3000);
  }

  const CreateActivityForm = () => {
    const [formData, setFormData] = useState({
      name: "",
      type: "",
      data: "", // JSON string hoặc object
      status: 1, // Published status
      statusText: "ACTIVE",
      accountId: "default-account-id", // Tạm thời dùng default
      robotModelId: "6e4e14b3-b073-4491-ab2a-2bf315b3259f" // Default robot model
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      
      // Convert string data to ActivityData object
      let activityData: ActivityData;
      try {
        // Try to parse as JSON first
        activityData = JSON.parse(formData.data || '{}');
      } catch {
        // If not valid JSON, create a simple object
        activityData = { content: formData.data };
      }
      
      const submitData = {
        ...formData,
        data: activityData
      };
      
      createActivityMutation.mutate(submitData, {
        onSuccess: () => {
          setIsCreateModalOpen(false)
          setFormData({
            name: "",
            type: "",
            data: "",
            status: 1,
            statusText: "ACTIVE",
            accountId: "default-account-id",
            robotModelId: "6e4e14b3-b073-4491-ab2a-2bf315b3259f"
          })
        }
      })
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Tên hoạt động</label>
          <Input 
            placeholder="Nhập tên hoạt động..." 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Loại hoạt động</label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dance_with_music">Nhảy với nhạc</SelectItem>
                <SelectItem value="lesson">Bài học</SelectItem>
                <SelectItem value="game">Trò chơi</SelectItem>
                <SelectItem value="exercise">Bài tập</SelectItem>
                <SelectItem value="project">Dự án</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Dữ liệu hoạt động</label>
          <Textarea 
            placeholder="Nhập dữ liệu JSON hoặc text cho hoạt động..." 
            rows={3}
            value={formData.data}
            onChange={(e) => setFormData({...formData, data: e.target.value})}
            required
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button 
            type="submit" 
            className="flex-1"
            disabled={createActivityMutation.isPending}
          >
            {createActivityMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Tạo hoạt động
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
            Hủy
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden p-5">
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
      
      {/* Decorative Grid Squares */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Left Squares */}
        <div className="absolute top-20 left-20 w-16 h-16 border-2 border-blue-200 rounded-lg rotate-12 opacity-50 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-12 h-12 border-2 border-purple-200 rounded-md rotate-45 opacity-45 animate-bounce"></div>
        <div className="absolute top-60 left-10 w-8 h-8 border-2 border-green-200 rounded-sm -rotate-12 opacity-55 animate-spin" style={{animationDuration: '8s'}}></div>
        
        {/* Top Right Squares */}
        <div className="absolute top-32 right-24 w-20 h-20 border-2 border-orange-200 rounded-xl -rotate-6 opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-16 right-48 w-14 h-14 border-2 border-pink-200 rounded-lg rotate-30 opacity-50 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-72 right-16 w-10 h-10 border-2 border-indigo-200 rounded-md -rotate-45 opacity-45 animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}></div>
        
        {/* Bottom Left Squares */}
        <div className="absolute bottom-40 left-32 w-18 h-18 border-2 border-cyan-200 rounded-lg rotate-15 opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-16 w-12 h-12 border-2 border-yellow-200 rounded-md -rotate-30 opacity-55 animate-bounce" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-60 left-60 w-8 h-8 border-2 border-red-200 rounded-sm rotate-60 opacity-45 animate-spin" style={{animationDuration: '10s'}}></div>
        
        {/* Bottom Right Squares */}
        <div className="absolute bottom-32 right-40 w-16 h-16 border-2 border-teal-200 rounded-lg -rotate-20 opacity-50 animate-pulse" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute bottom-16 right-20 w-14 h-14 border-2 border-violet-200 rounded-md rotate-45 opacity-45 animate-bounce" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-48 right-64 w-10 h-10 border-2 border-emerald-200 rounded-sm -rotate-15 opacity-55 animate-spin" style={{animationDuration: '7s', animationDirection: 'reverse'}}></div>
        
        {/* Center Area Squares - Subtle with gentle animations */}
        <div className="absolute top-1/2 left-1/4 w-6 h-6 border border-gray-200 rounded-sm rotate-45 opacity-35 animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 border border-gray-200 rounded-md -rotate-30 opacity-35 animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-1/3 left-1/2 w-4 h-4 border border-gray-200 rounded-sm rotate-12 opacity-40 animate-pulse" style={{animationDelay: '1.2s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Alpha Mini Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white backdrop-blur-sm border border-gray-200 text-gray-700 rounded-2xl text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Alpha Mini Activities
            <Star className="w-5 h-5 text-gray-600" />
          </div>
          
          {/* Main Title */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Learning 
              <span className="block text-gray-700 py-2">
                Activities Hub
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tạo và quản lý các hoạt động học tập tương tác với robot Alpha Mini
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Bài học tương tác</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Trò chơi giáo dục</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Theo dõi tiến độ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Tìm kiếm hoạt động..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm !== debouncedSearchTerm && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
            )}
          </div>
          
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="dance_with_music">Nhảy với nhạc</SelectItem>
                <SelectItem value="lesson">Bài học</SelectItem>
                <SelectItem value="game">Trò chơi</SelectItem>
                <SelectItem value="exercise">Bài tập</SelectItem>
                <SelectItem value="project">Dự án</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="1">Đã xuất bản</SelectItem>
                <SelectItem value="0">Bản nháp</SelectItem>
                <SelectItem value="2">Đã lưu trữ</SelectItem>
                <SelectItem value="dance_with_music">Nhảy với nhạc</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tạo hoạt động mới</DialogTitle>
                </DialogHeader>
                <CreateActivityForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Activities Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-300 rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error && 
             !(error && typeof error === 'object' && 
               (('name' in error && error.name === 'CanceledError') || 
                ('code' in error && error.code === 'ERR_CANCELED'))) ? (
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <Activity className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lỗi khi tải dữ liệu</h3>
              <p className="text-gray-600">
                {error && typeof error === 'object' && 'message' in error 
                  ? (error as { message: string }).message 
                  : 'Đã xảy ra lỗi khi tải dữ liệu'}
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-4"
              >
                Thử lại
              </Button>
            </div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-16">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy hoạt động</h3>
            <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc tạo hoạt động mới</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo hoạt động đầu tiên
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(activity.type)}
                      <Badge variant="secondary" className={getTypeColor(activity.type)}>
                        {activity.type === "lesson" ? "Bài học" :
                         activity.type === "game" ? "Trò chơi" :
                         activity.type === "exercise" ? "Bài tập" : "Dự án"}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{activity.name}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Hiển thị thông tin cho dance_with_music */}
                  {activity.type === "dance_with_music" && activity.data && activity.data.activity ? (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium">Hoạt động nhảy múa với AI</span>
                        </div>
                        {activity.data.activity.actions && (
                          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="text-xs text-gray-500">Số hành động:</span>
                              <p className="font-semibold text-lg text-blue-600">{activity.data.activity.actions.length}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Thời lượng:</span>
                              <p className="font-semibold text-lg text-green-600">
                                {activity.data.music_info?.duration || 
                                 Math.max(...activity.data.activity.actions.map((a: ActionActivites) => a.start_time + a.duration)).toFixed(1)}s
                              </p>
                            </div>
                          </div>
                        )}
                        {activity.data.music_info?.name && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-purple-600 bg-purple-50 p-2 rounded">
                            <span>🎵</span>
                            <span className="font-medium">{activity.data.music_info.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm line-clamp-3">Hoạt động Alpha Mini - {activity.type}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {activity.type === "dance_with_music" ? "Nhảy với nhạc" : activity.type}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(activity.status)}>
                      {getStatusText(activity.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {activity.type === "dance_with_music" && activity.data?.music_info?.duration 
                          ? `${activity.data.music_info.duration}s`
                          : "30 phút"
                        }
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        {activity.type === "dance_with_music" && activity.data?.activity?.actions?.length 
                          ? `${activity.data.activity.actions.length} hành động`
                          : "Hoạt động"
                        }
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDate(activity.createdDate)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleStartActivity(activity)}
                      disabled={isRobotLoading}
                    >
                      {isRobotLoading ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-1" />
                      )}
                      Bắt đầu
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-400 border-t pt-3">
                    Cập nhật: {formatDate(activity.lastUpdate)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center border-0 shadow-md">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {activities.filter(a => a.type === "lesson").length}
              </h3>
              <p className="text-gray-600">Bài học</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-md">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {activities.filter(a => a.type === "game").length}
              </h3>
              <p className="text-gray-600">Trò chơi</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-md">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {activities.length}
              </h3>
              <p className="text-gray-600">Hoạt động</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-md">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {pagination?.total_count || 0}
              </h3>
              <p className="text-gray-600">Tổng số</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
