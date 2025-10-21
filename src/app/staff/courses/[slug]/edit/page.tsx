"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Upload } from "lucide-react"
import Link from "next/link"
import { useStaffCourse, useUpdateCourse, useCourse } from "@/features/courses/hooks"
import { toast } from "sonner"

const levelOptions = [
  { value: "1", label: "Cơ bản" },
  { value: "2", label: "Trung bình" },
  { value: "3", label: "Nâng cao" },
]

const statusOptions = [
  { value: "1", label: "Hoạt động" },
  { value: "0", label: "Ẩn" },
]

export default function EditCoursePage() {
  const params = useParams()
  const courseSlug = params.slug as string

  const { data: course, isLoading: courseLoading } = useStaffCourse(courseSlug)
  const updateCourse = useUpdateCourse(courseSlug)
  const { useGetCategories } = useCourse()
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories(0, 100)
  
  const categories = categoriesData?.data || []

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    level: "3",
    price: "",
    image: "",
    status: "1",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load course data into form
  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name || "",
        description: course.description || "",
        categoryId: course.categoryId || "",
        level: course.level?.toString() || "3",
        price: course.price?.toString() || "",
        image: course.imageUrl || "",
        status: course.status?.toString() || "1",
      })
    }
  }, [course])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên khóa học")
      return
    }
    
    if (!formData.description.trim()) {
      toast.error("Vui lòng nhập mô tả khóa học")
      return
    }
    
    if (!formData.categoryId) {
      toast.error("Vui lòng chọn danh mục")
      return
    }
    
    if (!formData.price || parseInt(formData.price) < 0) {
      toast.error("Vui lòng nhập giá hợp lệ")
      return
    }

    setIsSubmitting(true)

    try {
      await updateCourse.mutateAsync({
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        level: parseInt(formData.level),
        price: parseInt(formData.price),
        image: formData.image || undefined,
        status: parseInt(formData.status),
      })
      
      toast.success("Cập nhật khóa học thành công!")
      // Router will be handled by the mutation's onSuccess
    } catch (error) {
      toast.error("Lỗi khi cập nhật khóa học")
      console.error("Error updating course:", error)
      setIsSubmitting(false)
    }
  }

  if (courseLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Không tìm thấy khóa học</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/staff/courses">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa khóa học</h1>
          <p className="text-muted-foreground">
            Cập nhật thông tin khóa học: {course.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khóa học</CardTitle>
            <CardDescription>
              Chỉnh sửa thông tin về khóa học
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên khóa học <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên khóa học..."
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Mô tả <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả khóa học..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={5}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Danh mục <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleInputChange("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Level */}
              <div className="space-y-2">
                <Label htmlFor="level">
                  Cấp độ <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleInputChange("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cấp độ" />
                  </SelectTrigger>
                  <SelectContent>
                    {levelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Giá (VNĐ) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">URL Ảnh</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Nhập URL ảnh hoặc tải lên từ máy tính
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || updateCourse.isPending}
                className="min-w-[120px]"
              >
                {(isSubmitting || updateCourse.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Lưu thay đổi
              </Button>
              <Link href="/staff/courses">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting || updateCourse.isPending}
                >
                  Hủy
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
