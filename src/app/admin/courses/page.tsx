"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  FolderOpen, 
  FileText,
  Loader2,
  ChevronRight,
  Search
} from "lucide-react"
import { toast } from "sonner"
import lessonApi from '@/services/lesson-api'

// Interfaces
interface Category {
  id: string
  name: string
  description: string
  orderNumber: number
  createdDate: string
  lastUpdated: string
}

interface Course {
  id: string
  title: string
  description: string
  categoryId: string
  categoryName?: string
  price: number
  duration: number
  level: string
  status: string
  orderNumber: number
  imageUrl?: string
  createdDate: string
  lastUpdated: string
}

interface Section {
  id: string
  title: string
  courseId: string
  courseName?: string
  orderNumber: number
  createdDate: string
  lastUpdated: string
}

interface Lesson {
  id: string
  title: string
  content: string
  sectionId: string
  sectionName?: string
  videoUrl?: string
  duration: number
  requireRobot: boolean
  type: number
  orderNumber: number
  solution: object
  createdDate: string
  lastUpdated: string
}

// Create/Update DTOs
interface CreateCategory {
  name: string
  description: string
  orderNumber: number
}

interface CreateCourse {
  title: string
  description: string
  categoryId: string
  price: number
  duration: number
  level: string
  status: string
  orderNumber: number
  imageUrl?: string
}

interface CreateSection {
  title: string
  courseId: string
  orderNumber: number
}

interface CreateLesson {
  title: string
  content: string
  sectionId: string
  duration: number
  requireRobot: boolean
  type: number
  orderNumber: number
  solution: object
}

export default function CourseManagementPage() {
  // States
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  
  // Selected items for hierarchical display
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedSection, setSelectedSection] = useState<string>("")

  // Search states
  const [searchTerm, setSearchTerm] = useState("")

  // Dialog states
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [courseDialog, setCourseDialog] = useState(false)
  const [sectionDialog, setSectionDialog] = useState(false)
  const [lessonDialog, setLessonDialog] = useState(false)

  // Form states
  const [categoryForm, setCategoryForm] = useState<CreateCategory>({
    name: "",
    description: "",
    orderNumber: 1
  })
  
  const [courseForm, setCourseForm] = useState<CreateCourse>({
    title: "",
    description: "",
    categoryId: "",
    price: 0,
    duration: 0,
    level: "beginner",
    status: "draft",
    orderNumber: 1,
    imageUrl: ""
  })

  const [sectionForm, setSectionForm] = useState<CreateSection>({
    title: "",
    courseId: "",
    orderNumber: 1
  })

  const [lessonForm, setLessonForm] = useState<CreateLesson>({
    title: "",
    content: "",
    sectionId: "",
    duration: 100,
    requireRobot: false,
    type: 1,
    orderNumber: 1,
    solution: { action: "wave" }
  })

  // Edit states
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingCourse, setEditingCourse] = useState<string | null>(null)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editingLesson, setEditingLesson] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      fetchCoursesByCategory(selectedCategory)
    } else {
      setCourses([])
      setSelectedCourse("")
    }
  }, [selectedCategory])

  useEffect(() => {
    if (selectedCourse) {
      fetchSectionsByCourse(selectedCourse)
    } else {
      setSections([])
      setSelectedSection("")
    }
  }, [selectedCourse])

  useEffect(() => {
    if (selectedSection) {
      fetchLessonsBySection(selectedSection)
    } else {
      setLessons([])
    }
  }, [selectedSection])

  // API Functions
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await lessonApi.get('/api/v1/categories')
      setCategories(response.data.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Không thể tải danh sách categories')
    } finally {
      setLoading(false)
    }
  }

  const fetchCoursesByCategory = async (categoryId: string) => {
    try {
      setLoading(true)
      const response = await lessonApi.get(`/api/v1/courses/get-by-category/${categoryId}`)
      setCourses(response.data.data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Không thể tải danh sách courses')
    } finally {
      setLoading(false)
    }
  }

  const fetchSectionsByCourse = async (courseId: string) => {
    try {
      setLoading(true)
      const response = await lessonApi.get(`/api/v1/sections/get-by-course/${courseId}`)
      setSections(response.data.data || [])
    } catch (error) {
      console.error('Error fetching sections:', error)
      toast.error('Không thể tải danh sách sections')
    } finally {
      setLoading(false)
    }
  }

  const fetchLessonsBySection = async (sectionId: string) => {
    try {
      setLoading(true)
      const response = await lessonApi.get(`/api/v1/lessons/get-by-section/${sectionId}`)
      setLessons(response.data.data || [])
    } catch (error) {
      console.error('Error fetching lessons:', error)
      toast.error('Không thể tải danh sách lessons')
    } finally {
      setLoading(false)
    }
  }

  // Create Functions
  const createCategory = async () => {
    try {
      setLoading(true)
      await lessonApi.post('/api/v1/categories', categoryForm)
      toast.success('Tạo category thành công')
      setCategoryDialog(false)
      resetCategoryForm()
      fetchCategories()
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Không thể tạo category')
    } finally {
      setLoading(false)
    }
  }

  const createCourse = async () => {
    try {
      setLoading(true)
      await lessonApi.post('/api/v1/courses', courseForm)
      toast.success('Tạo course thành công')
      setCourseDialog(false)
      resetCourseForm()
      if (selectedCategory) fetchCoursesByCategory(selectedCategory)
    } catch (error) {
      console.error('Error creating course:', error)
      toast.error('Không thể tạo course')
    } finally {
      setLoading(false)
    }
  }

  const createSection = async () => {
    try {
      setLoading(true)
      await lessonApi.post('/api/v1/sections', sectionForm)
      toast.success('Tạo section thành công')
      setSectionDialog(false)
      resetSectionForm()
      if (selectedCourse) fetchSectionsByCourse(selectedCourse)
    } catch (error) {
      console.error('Error creating section:', error)
      toast.error('Không thể tạo section')
    } finally {
      setLoading(false)
    }
  }

  const createLesson = async () => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append(
        "createLesson",
        new Blob([JSON.stringify(lessonForm)], { type: "application/json" })
      )
      
      await lessonApi.post('/api/v1/lessons', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      
      toast.success('Tạo lesson thành công')
      setLessonDialog(false)
      resetLessonForm()
      if (selectedSection) fetchLessonsBySection(selectedSection)
    } catch (error) {
      console.error('Error creating lesson:', error)
      toast.error('Không thể tạo lesson')
    } finally {
      setLoading(false)
    }
  }

  // Delete Functions
  const deleteCategory = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa category này?')) return
    
    try {
      setLoading(true)
      await lessonApi.delete(`/api/v1/categories/${id}`)
      toast.success('Xóa category thành công')
      fetchCategories()
      if (selectedCategory === id) {
        setSelectedCategory("")
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Không thể xóa category')
    } finally {
      setLoading(false)
    }
  }

  const deleteCourse = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa course này?')) return
    
    try {
      setLoading(true)
      await lessonApi.delete(`/api/v1/courses/${id}`)
      toast.success('Xóa course thành công')
      if (selectedCategory) fetchCoursesByCategory(selectedCategory)
      if (selectedCourse === id) {
        setSelectedCourse("")
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      toast.error('Không thể xóa course')
    } finally {
      setLoading(false)
    }
  }

  const deleteSection = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa section này?')) return
    
    try {
      setLoading(true)
      await lessonApi.delete(`/api/v1/sections/${id}`)
      toast.success('Xóa section thành công')
      if (selectedCourse) fetchSectionsByCourse(selectedCourse)
      if (selectedSection === id) {
        setSelectedSection("")
      }
    } catch (error) {
      console.error('Error deleting section:', error)
      toast.error('Không thể xóa section')
    } finally {
      setLoading(false)
    }
  }

  const deleteLesson = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa lesson này?')) return
    
    try {
      setLoading(true)
      await lessonApi.delete(`/api/v1/lessons/${id}`)
      toast.success('Xóa lesson thành công')
      if (selectedSection) fetchLessonsBySection(selectedSection)
    } catch (error) {
      console.error('Error deleting lesson:', error)
      toast.error('Không thể xóa lesson')
    } finally {
      setLoading(false)
    }
  }

  // Reset form functions
  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      description: "",
      orderNumber: categories.length + 1
    })
    setEditingCategory(null)
  }

  const resetCourseForm = () => {
    setCourseForm({
      title: "",
      description: "",
      categoryId: selectedCategory,
      price: 0,
      duration: 0,
      level: "beginner",
      status: "draft",
      orderNumber: courses.length + 1,
      imageUrl: ""
    })
    setEditingCourse(null)
  }

  const resetSectionForm = () => {
    setSectionForm({
      title: "",
      courseId: selectedCourse,
      orderNumber: sections.length + 1
    })
    setEditingSection(null)
  }

  const resetLessonForm = () => {
    setLessonForm({
      title: "",
      content: "",
      sectionId: selectedSection,
      duration: 100,
      requireRobot: false,
      type: 1,
      orderNumber: lessons.length + 1,
      solution: { action: "wave" }
    })
    setEditingLesson(null)
  }

  // Edit functions
  const editCategory = (category: Category) => {
    setCategoryForm({
      name: category.name,
      description: category.description,
      orderNumber: category.orderNumber
    })
    setEditingCategory(category.id)
    setCategoryDialog(true)
  }

  const editCourse = (course: Course) => {
    setCourseForm({
      title: course.title,
      description: course.description,
      categoryId: course.categoryId,
      price: course.price,
      duration: course.duration,
      level: course.level,
      status: course.status,
      orderNumber: course.orderNumber,
      imageUrl: course.imageUrl || ""
    })
    setEditingCourse(course.id)
    setCourseDialog(true)
  }

  const editSection = (section: Section) => {
    setSectionForm({
      title: section.title,
      courseId: section.courseId,
      orderNumber: section.orderNumber
    })
    setEditingSection(section.id)
    setSectionDialog(true)
  }

  const editLesson = (lesson: Lesson) => {
    setLessonForm({
      title: lesson.title,
      content: lesson.content,
      sectionId: lesson.sectionId,
      duration: lesson.duration,
      requireRobot: lesson.requireRobot,
      type: lesson.type,
      orderNumber: lesson.orderNumber,
      solution: lesson.solution
    })
    setEditingLesson(lesson.id)
    setLessonDialog(true)
  }

  // Filter data based on search
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSections = sections.filter(section => 
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredLessons = lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý khóa học</h1>
          <p className="text-muted-foreground">
            Quản lý Categories, Courses, Sections và Lessons
          </p>
        </div>
        
        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>Categories</span>
        {selectedCategory && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span>{categories.find(c => c.id === selectedCategory)?.name}</span>
          </>
        )}
        {selectedCourse && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span>{courses.find(c => c.id === selectedCourse)?.title}</span>
          </>
        )}
        {selectedSection && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span>{sections.find(s => s.id === selectedSection)?.title}</span>
          </>
        )}
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Categories</h2>
            <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetCategoryForm(); setCategoryDialog(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Sửa Category' : 'Tạo Category mới'}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Tên *</Label>
                    <Input
                      id="name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm(prev => ({...prev, name: e.target.value}))}
                      placeholder="VD: Lập trình cơ bản"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm(prev => ({...prev, description: e.target.value}))}
                      placeholder="Mô tả về category"
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="orderNumber">Thứ tự</Label>
                    <Input
                      id="orderNumber"
                      type="number"
                      min="1"
                      value={categoryForm.orderNumber}
                      onChange={(e) => setCategoryForm(prev => ({...prev, orderNumber: parseInt(e.target.value) || 1}))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCategoryDialog(false)}>
                    Hủy
                  </Button>
                  <Button onClick={createCategory} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {editingCategory ? 'Cập nhật' : 'Tạo'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <Card key={category.id} className={`cursor-pointer transition-colors ${selectedCategory === category.id ? 'border-primary' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {category.description}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          editCategory(category)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteCategory(category.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Xem Courses ({courses.filter(c => c.categoryId === category.id).length})
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Courses {selectedCategory && `- ${categories.find(c => c.id === selectedCategory)?.name}`}
            </h2>
            <Dialog open={courseDialog} onOpenChange={setCourseDialog}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => { resetCourseForm(); setCourseDialog(true); }}
                  disabled={!selectedCategory}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingCourse ? 'Sửa Course' : 'Tạo Course mới'}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Tiêu đề *</Label>
                    <Input
                      id="title"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm(prev => ({...prev, title: e.target.value}))}
                      placeholder="VD: Khóa học React cơ bản"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={courseForm.description}
                      onChange={(e) => setCourseForm(prev => ({...prev, description: e.target.value}))}
                      placeholder="Mô tả về course"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Giá (VND)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        value={courseForm.price}
                        onChange={(e) => setCourseForm(prev => ({...prev, price: parseInt(e.target.value) || 0}))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="duration">Thời lượng (giờ)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="0"
                        value={courseForm.duration}
                        onChange={(e) => setCourseForm(prev => ({...prev, duration: parseInt(e.target.value) || 0}))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="level">Cấp độ</Label>
                      <Select 
                        value={courseForm.level} 
                        onValueChange={(value) => setCourseForm(prev => ({...prev, level: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Cơ bản</SelectItem>
                          <SelectItem value="intermediate">Trung cấp</SelectItem>
                          <SelectItem value="advanced">Nâng cao</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Trạng thái</Label>
                      <Select 
                        value={courseForm.status} 
                        onValueChange={(value) => setCourseForm(prev => ({...prev, status: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Nháp</SelectItem>
                          <SelectItem value="published">Đã xuất bản</SelectItem>
                          <SelectItem value="archived">Lưu trữ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="imageUrl">URL hình ảnh</Label>
                    <Input
                      id="imageUrl"
                      value={courseForm.imageUrl}
                      onChange={(e) => setCourseForm(prev => ({...prev, imageUrl: e.target.value}))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="orderNumber">Thứ tự</Label>
                    <Input
                      id="orderNumber"
                      type="number"
                      min="1"
                      value={courseForm.orderNumber}
                      onChange={(e) => setCourseForm(prev => ({...prev, orderNumber: parseInt(e.target.value) || 1}))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCourseDialog(false)}>
                    Hủy
                  </Button>
                  <Button onClick={createCourse} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {editingCourse ? 'Cập nhật' : 'Tạo'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {!selectedCategory ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Vui lòng chọn một Category để xem Courses</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <Card key={course.id} className={`cursor-pointer transition-colors ${selectedCourse === course.id ? 'border-primary' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {course.description}
                        </CardDescription>
                        <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
                          <span>Giá: {course.price.toLocaleString()} VND</span>
                          <span>•</span>
                          <span>{course.duration}h</span>
                          <span>•</span>
                          <span className="capitalize">{course.level}</span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            editCourse(course)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteCourse(course.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedCourse(course.id)}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Xem Sections ({sections.filter(s => s.courseId === course.id).length})
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Sections {selectedCourse && `- ${courses.find(c => c.id === selectedCourse)?.title}`}
            </h2>
            <Dialog open={sectionDialog} onOpenChange={setSectionDialog}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => { resetSectionForm(); setSectionDialog(true); }}
                  disabled={!selectedCourse}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Section
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingSection ? 'Sửa Section' : 'Tạo Section mới'}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Tiêu đề *</Label>
                    <Input
                      id="title"
                      value={sectionForm.title}
                      onChange={(e) => setSectionForm(prev => ({...prev, title: e.target.value}))}
                      placeholder="VD: Giới thiệu về React"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="orderNumber">Thứ tự</Label>
                    <Input
                      id="orderNumber"
                      type="number"
                      min="1"
                      value={sectionForm.orderNumber}
                      onChange={(e) => setSectionForm(prev => ({...prev, orderNumber: parseInt(e.target.value) || 1}))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSectionDialog(false)}>
                    Hủy
                  </Button>
                  <Button onClick={createSection} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {editingSection ? 'Cập nhật' : 'Tạo'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {!selectedCourse ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Vui lòng chọn một Course để xem Sections</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredSections.map((section) => (
                <Card key={section.id} className={`cursor-pointer transition-colors ${selectedSection === section.id ? 'border-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{section.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Thứ tự: {section.orderNumber} • Lessons: {lessons.filter(l => l.sectionId === section.id).length}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSection(section.id)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Xem Lessons
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editSection(section)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSection(section.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Lessons Tab */}
        <TabsContent value="lessons" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Lessons {selectedSection && `- ${sections.find(s => s.id === selectedSection)?.title}`}
            </h2>
            <Dialog open={lessonDialog} onOpenChange={setLessonDialog}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => { resetLessonForm(); setLessonDialog(true); }}
                  disabled={!selectedSection}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Lesson
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingLesson ? 'Sửa Lesson' : 'Tạo Lesson mới'}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Tiêu đề *</Label>
                    <Input
                      id="title"
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm(prev => ({...prev, title: e.target.value}))}
                      placeholder="VD: Tạo component đầu tiên"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Nội dung *</Label>
                    <Textarea
                      id="content"
                      value={lessonForm.content}
                      onChange={(e) => setLessonForm(prev => ({...prev, content: e.target.value}))}
                      placeholder="Nội dung bài học..."
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="duration">Thời lượng (giây)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={lessonForm.duration}
                        onChange={(e) => setLessonForm(prev => ({...prev, duration: parseInt(e.target.value) || 100}))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Loại</Label>
                      <Select 
                        value={lessonForm.type.toString()} 
                        onValueChange={(value) => setLessonForm(prev => ({...prev, type: parseInt(value)}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Loại 1</SelectItem>
                          <SelectItem value="2">Loại 2</SelectItem>
                          <SelectItem value="3">Loại 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="orderNumber">Thứ tự</Label>
                    <Input
                      id="orderNumber"
                      type="number"
                      min="1"
                      value={lessonForm.orderNumber}
                      onChange={(e) => setLessonForm(prev => ({...prev, orderNumber: parseInt(e.target.value) || 1}))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="requireRobot"
                      checked={lessonForm.requireRobot}
                      onChange={(e) => setLessonForm(prev => ({...prev, requireRobot: e.target.checked}))}
                      className="rounded"
                    />
                    <Label htmlFor="requireRobot">Yêu cầu robot</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setLessonDialog(false)}>
                    Hủy
                  </Button>
                  <Button onClick={createLesson} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {editingLesson ? 'Cập nhật' : 'Tạo'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {!selectedSection ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Vui lòng chọn một Section để xem Lessons</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredLessons.map((lesson) => (
                <Card key={lesson.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{lesson.content}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>Thứ tự: {lesson.orderNumber}</span>
                          <span>Thời lượng: {lesson.duration}s</span>
                          <span>Loại: {lesson.type}</span>
                          {lesson.requireRobot && <span className="text-orange-600">Yêu cầu robot</span>}
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editLesson(lesson)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLesson(lesson.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}