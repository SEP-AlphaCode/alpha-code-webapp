'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Code, BookOpen, Trophy, Users, Bot, Target } from 'lucide-react'
import Image from 'next/image'

export default function ChildrenDashboard() {
  const achievements = [
    { icon: '🏆', title: 'Người Mới Bắt Đầu', desc: 'Hoàn thành bài học đầu tiên', unlocked: true },
    { icon: '⭐', title: 'Bậc Thầy Lập Trình', desc: 'Viết 10 chương trình', unlocked: true },
    { icon: '🎯', title: 'Thành Thạo Robot', desc: 'Hoàn thành 20 bài học', unlocked: true },
    { icon: '🌟', title: 'Siêu Sao Lập Trình', desc: 'Viết 50 chương trình', unlocked: false },
  ]

  const recentActivity = [
    { name: 'Emma', action: 'Hoàn thành bài học "Di chuyển"', time: '2 phút trước', avatar: 'E' },
    { name: 'Liam', action: 'Tạo chương trình mới', time: '5 phút trước', avatar: 'L' },
    { name: 'Sofia', action: 'Học về LED', time: '8 phút trước', avatar: 'S' },
    { name: 'Noah', action: 'Đọc dữ liệu cảm biến', time: '12 phút trước', avatar: 'N' },
  ]

  const robots = [
    { id: 'Robot #1', status: 'Online', battery: 85, name: 'Alpha-01' },
    { id: 'Robot #2', status: 'Online', battery: 73, name: 'Alpha-02' },
    { id: 'Robot #3', status: 'Online', battery: 69, name: 'Alpha-03' },
    { id: 'Robot #4', status: 'Offline', battery: 37, name: 'Alpha-04' },
  ]

  return (
    <div className="p-6 space-y-6" suppressHydrationWarning>
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_top_left,_#000000_0%,_transparent_50%)]"></div>
        <div className="grid lg:grid-cols-2 gap-6 items-center p-2">
          <div className="p-8 lg:p-10 text-gray-900 space-y-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              Dành cho thiếu nhi
            </span>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">
              Khám phá lập trình cùng Robot Alpha
            </h1>
            <p className="text-gray-700 text-lg">
              Học bằng cách kéo thả khối lệnh. Vui, dễ hiểu, và an toàn.
            </p>
            <Link href="/children/blockly-coding">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-7 py-6 font-bold shadow-md">
                <Code className="w-5 h-5 mr-2" /> Bắt đầu ngay
              </Button>
            </Link>
          </div>
          <div className="relative h-64 lg:h-full min-h-[260px]">
            <Image
              src="/img_noenjoy.webp"
              alt="Alpha Kids"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: <Bot className="w-7 h-7 text-blue-600" />, label: 'Tổng Robot', value: 8 },
          { icon: <Users className="w-7 h-7 text-blue-600" />, label: 'Bạn học đang hoạt động', value: 12 },
          { icon: <BookOpen className="w-7 h-7 text-blue-600" />, label: 'Bài học hoàn thành', value: 24 },
          { icon: <Trophy className="w-7 h-7 text-blue-600" />, label: 'Thành tích đạt được', value: 5 },
        ].map((item, index) => (
          <Card key={index} className="bg-white/90 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">{item.icon}</div>
              <span className="text-2xl text-blue-600">•</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">{item.value}</div>
              <p className="text-sm text-gray-600">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-blue-50 border-b border-blue-200 rounded-t-xl py-4 flex items-center">
            <CardTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900 leading-none">
              <Trophy className="w-8 h-8 text-blue-600" />
              Thành Tích Của Bạn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border transition-colors ${
                  achievement.unlocked ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.desc}</p>
                  </div>
                  {achievement.unlocked && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Robot Status */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-blue-50 border-b border-blue-200 rounded-t-xl py-4 flex items-center">
            <CardTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900 leading-none">
              <Bot className="w-8 h-8 text-blue-600" />
              Trạng Thái Robot
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {robots.map((robot, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-900 text-lg">{robot.name}</span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${
                      robot.status === 'Online'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {robot.status === 'Online' ? '🟢' : '⚪'} {robot.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pin</span>
                    <span className="text-gray-900 font-semibold">{robot.battery}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        robot.battery > 60
                          ? 'bg-green-500'
                          : robot.battery > 30
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${robot.battery}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="bg-blue-50 border-b border-blue-200 rounded-t-xl py-4 flex items-center">
          <CardTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900 leading-none">
            <Target className="w-8 h-8 text-blue-600" />
            Hoạt Động Gần Đây
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-blue-600">{activity.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{activity.name}</p>
                <p className="text-xs text-gray-600 truncate">{activity.action}</p>
              </div>
              <div className="text-xs text-gray-500 flex-shrink-0">{activity.time}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
