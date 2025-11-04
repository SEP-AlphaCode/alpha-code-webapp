"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  GraduationCap, 
  Clock, 
  TrendingUp, 
  Key, 
  Calendar,
  Download,
  PlayCircle,
  CheckCircle2,
  ArrowRight,
  Package
} from 'lucide-react';
import Link from 'next/link';

// Mock data - Thay thế bằng API thực sau
const MOCK_DATA = {
  // Khóa học đã mua (enrolled courses)
  enrolledCourses: [
    {
      id: '1',
      name: 'Lập trình cơ bản với Alpha Mini',
      imageUrl: '/course-1.jpg',
      progressPercent: 75,
      completedLesson: 15,
      totalLesson: 20,
      lastAccessed: '2025-11-03T10:30:00',
      slug: 'lap-trinh-co-ban'
    },
    {
      id: '2',
      name: 'Điều khiển Robot nâng cao',
      imageUrl: '/course-2.jpg',
      progressPercent: 40,
      completedLesson: 8,
      totalLesson: 20,
      lastAccessed: '2025-11-02T14:20:00',
      slug: 'dieu-khien-nang-cao'
    }
  ],
  // Khóa học chưa mua (available courses)
  availableCourses: [
    {
      id: '3',
      name: 'Lập trình AI cho Robot',
      imageUrl: '/course-3.jpg',
      totalLesson: 25,
      slug: 'lap-trinh-ai',
      price: 500000,
      description: 'Học cách lập trình AI cơ bản cho robot Alpha Mini'
    },
    {
      id: '4',
      name: 'Xử lý hình ảnh với Robot',
      imageUrl: '/course-4.jpg',
      totalLesson: 18,
      slug: 'xu-ly-hinh-anh',
      price: 450000,
      description: 'Khám phá khả năng nhận diện và xử lý hình ảnh'
    }
  ],
  subscription: {
    planName: 'Gói Premium',
    endDate: '2026-01-15T00:00:00',
    status: 'active'
  },
  stats: {
    totalCourses: 3,
    completedCourses: 0,
    inProgressCourses: 2,
    totalLessonsCompleted: 23,
    learningHoursThisWeek: 12
  },
  recentActivities: [
    {
      courseName: 'Lập trình cơ bản với Alpha Mini',
      lessonName: 'Bài 15: Điều khiển LED',
      completedAt: '2025-11-03T10:30:00'
    },
    {
      courseName: 'Điều khiển Robot nâng cao',
      lessonName: 'Bài 8: Cảm biến khoảng cách',
      completedAt: '2025-11-02T14:20:00'
    }
  ],
  license: {
    hasPurchased: true, // true = đã mua, false = chưa mua
    purchaseDate: '2025-01-15T00:00:00'
    // Không có expiryDate vì license là trọn đời
  }
};

export default function ParentDashboard() {
  const { enrolledCourses, availableCourses, subscription, stats, recentActivities, license } = MOCK_DATA;

  // Tính số ngày còn lại của subscription
  const daysRemaining = subscription.endDate 
    ? Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trang chủ</h1>
          <p className="text-gray-500 mt-1">Chào mừng bạn trở lại! Hãy tiếp tục hành trình học tập của bạn.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/parent/courses">
            <BookOpen className="w-4 h-4 mr-2" />
            Xem tất cả khóa học
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tổng khóa học
            </CardTitle>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.inProgressCourses} đang học
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Bài học hoàn thành
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLessonsCompleted}</div>
            <p className="text-xs text-gray-500 mt-1">
              Tất cả các khóa học
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Thời gian học
            </CardTitle>
            <Clock className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.learningHoursThisWeek}h</div>
            <p className="text-xs text-gray-500 mt-1">
              Tuần này
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Trạng thái License
            </CardTitle>
            <Key className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {license.hasPurchased ? (
                <span className="text-green-600">Đã mua</span>
              ) : (
                <span className="text-gray-400">Chưa mua</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {license.hasPurchased
                ? 'Sử dụng trọn đời'
                : 'Mua license để kích hoạt'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Courses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tiếp tục học</CardTitle>
                  <CardDescription>Các khóa học bạn đang theo học</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/parent/courses">
                    Xem tất cả
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2">{course.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {course.completedLesson}/{course.totalLesson} bài học
                          </span>
                          <span className="font-medium text-blue-600">
                            {course.progressPercent}%
                          </span>
                        </div>
                        <Progress value={course.progressPercent} className="h-2" />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        {course.lastAccessed && (
                          <span className="text-xs text-gray-500">
                            Học lần cuối: {new Date(course.lastAccessed).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                        <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Link href={`/parent/courses/${course.slug}`}>
                            <PlayCircle className="w-4 h-4 mr-1" />
                            Tiếp tục
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {enrolledCourses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Bạn chưa có khóa học nào</p>
                  <Button size="sm" className="mt-3" asChild>
                    <Link href="/parent/courses">Khám phá khóa học</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Courses (Chưa mua) */}
          {availableCourses.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Khóa học có sẵn</CardTitle>
                    <CardDescription>Khám phá thêm các khóa học mới</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/parent/courses">
                      Xem tất cả
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableCourses.slice(0, 3).map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900">{course.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{course.totalLesson} bài học</p>
                        {course.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-bold text-blue-600">
                            {course.price?.toLocaleString('vi-VN')}đ
                          </span>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/parent/courses/${course.slug}`}>
                              Xem chi tiết
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>Lịch sử học tập của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.lessonName}</p>
                      <p className="text-xs text-gray-500">{activity.courseName}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.completedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscription Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gói đăng ký</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{subscription.planName}</p>
                  <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                    {subscription.status === 'active' ? 'Đang hoạt động' : 'Hết hạn'}
                  </Badge>
                </div>
              </div>
              
              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Hết hạn
                  </span>
                  <span className="font-medium">
                    {new Date(subscription.endDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Còn {daysRemaining} ngày
                </p>
              </div>

              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/subscription-plan">
                  Gia hạn hoặc nâng cấp
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Truy cập nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/apks">
                  <Download className="w-4 h-4 mr-2" />
                  Tải APK mới nhất
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/license-key">
                  <Key className="w-4 h-4 mr-2" />
                  Mua License Key
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/addons">
                  <Package className="w-4 h-4 mr-2" />
                  Xem Addons
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/resources">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Tài nguyên học tập
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Learning Progress Summary */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Thống kê học tập
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Khóa học hoàn thành</span>
                <span className="font-bold text-gray-900">{stats.completedCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Đang học</span>
                <span className="font-bold text-gray-900">{stats.inProgressCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Tổng bài học</span>
                <span className="font-bold text-gray-900">{stats.totalLessonsCompleted}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
