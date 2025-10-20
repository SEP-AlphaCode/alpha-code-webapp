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
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, FolderOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data - sẽ thay bằng API call thực tế
const mockCategories = [
  {
    id: "1",
    name: "Lập trình cơ bản",
    description: "Các khóa học về lập trình cơ bản cho người mới bắt đầu",
    slug: "lap-trinh-co-ban",
    imageUrl: "/placeholder-category.jpg",
    status: 1,
    coursesCount: 12,
    createdDate: "2024-01-15",
    lastUpdated: "2024-03-20"
  },
  {
    id: "2",
    name: "Robot nâng cao",
    description: "Khóa học điều khiển robot nâng cao",
    slug: "robot-nang-cao",
    imageUrl: "/placeholder-category.jpg",
    status: 1,
    coursesCount: 8,
    createdDate: "2024-02-10",
    lastUpdated: "2024-03-18"
  },
  {
    id: "3",
    name: "AI & Machine Learning",
    description: "Các khóa học về trí tuệ nhân tạo",
    slug: "ai-machine-learning",
    imageUrl: "/placeholder-category.jpg",
    status: 0,
    coursesCount: 5,
    createdDate: "2024-03-01",
    lastUpdated: "2024-03-15"
  }
]

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categories] = useState(mockCategories)

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Danh mục</h1>
          <p className="text-muted-foreground">
            Quản lý các danh mục khóa học
          </p>
        </div>
        <Link href="/staff/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo danh mục mới
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
          <CardDescription>
            Tổng cộng {categories.length} danh mục
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Hình ảnh</TableHead>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Số khóa học</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy danh mục nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                          {category.imageUrl ? (
                            <Image
                              src={category.imageUrl}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FolderOpen className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {category.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {category.coursesCount} khóa học
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={category.status === 1 ? "default" : "secondary"}>
                          {category.status === 1 ? "Hoạt động" : "Ẩn"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(category.createdDate).toLocaleDateString('vi-VN')}
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
                              <Link href={`/staff/categories/${category.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/staff/categories/${category.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/staff/categories/${category.id}/courses`}>
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Xem khóa học
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
