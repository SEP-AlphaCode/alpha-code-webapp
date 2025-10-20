"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, Layers, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data
const mockCategories = [
  { id: "1", name: "Lập trình cơ bản" },
  { id: "2", name: "Robot nâng cao" },
  { id: "3", name: "AI & Machine Learning" }
]

const mockCourses = [
  {
    id: "c1",
    name: "Python cho người mới bắt đầu",
    description: "Khóa học Python từ cơ bản đến nâng cao",
    categoryId: "1",
    categoryName: "Lập trình cơ bản",
    level: 3,
    totalLessons: 24,
    totalDuration: 14400,
    status: 1,
    price: 299000,
    sectionsCount: 4,
    imageUrl: "/placeholder-course.jpg",
    createdDate: "2024-02-01"
  },
  {
    id: "c2",
    name: "JavaScript Fundamentals",
    description: "Nền tảng JavaScript và lập trình web",
    categoryId: "1",
    categoryName: "Lập trình cơ bản",
    level: 3,
    totalLessons: 32,
    totalDuration: 18000,
    status: 1,
    price: 399000,
    sectionsCount: 5,
    imageUrl: "/placeholder-course.jpg",
    createdDate: "2024-02-15"
  },
  {
    id: "c3",
    name: "Điều khiển Robot Alpha",
    description: "Học cách lập trình và điều khiển robot",
    categoryId: "2",
    categoryName: "Robot nâng cao",
    level: 4,
    totalLessons: 18,
    totalDuration: 12600,
    status: 1,
    price: 499000,
    sectionsCount: 3,
    imageUrl: "/placeholder-course.jpg",
    createdDate: "2024-03-01"
  }
]

const levelMap: { [key: number]: { text: string; color: string } } = {
  3: { text: "Cơ bản", color: "bg-blue-500/10 text-blue-500" },
  4: { text: "Trung bình", color: "bg-green-500/10 text-green-500" },
  5: { text: "Nâng cao", color: "bg-yellow-500/10 text-yellow-500" }
}

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [courses] = useState(mockCourses)
  const [categories] = useState(mockCategories)

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.categoryId === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Khóa học</h1>
          <p className="text-muted-foreground">
            Quản lý tất cả các khóa học trong hệ thống
          </p>
        </div>
        <Link href="/staff/courses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo khóa học mới
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách khóa học</CardTitle>
          <CardDescription>
            Tổng cộng {courses.length} khóa học
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm khóa học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Ảnh</TableHead>
                  <TableHead>Tên khóa học</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Cấp độ</TableHead>
                  <TableHead>Bài học</TableHead>
                  <TableHead>Chương</TableHead>
                  <TableHead>Thời lượng</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy khóa học nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
                          {course.imageUrl ? (
                            <Image
                              src={course.imageUrl}
                              alt={course.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-xs">
                        <div>
                          <p className="font-medium">{course.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {course.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.categoryName}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={levelMap[course.level]?.color}>
                          {levelMap[course.level]?.text}
                        </Badge>
                      </TableCell>
                      <TableCell>{course.totalLessons}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{course.sectionsCount}</Badge>
                      </TableCell>
                      <TableCell>{formatDuration(course.totalDuration)}</TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(course.price)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={course.status === 1 ? "default" : "secondary"}>
                          {course.status === 1 ? "Hoạt động" : "Ẩn"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Mở menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/staff/courses/${course.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/staff/courses/${course.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/staff/courses/${course.id}/sections`}>
                                <Layers className="mr-2 h-4 w-4" />
                                Quản lý chương
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
