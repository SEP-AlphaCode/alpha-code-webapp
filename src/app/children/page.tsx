"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChildrenDashboard() {
    const activities = [
        { name: 'Emma', action: 'Hoàn thành bài học "Di chuyển tiến"', time: '2 phút trước', avatar: 'E' },
        { name: 'Liam', action: 'Bắt đầu chuỗi servo', time: '5 phút trước', avatar: 'L' },
        { name: 'Sofia', action: 'Lệnh đèn LED', time: '8 phút trước', avatar: 'S' },
        { name: 'Noah', action: 'Đọc cảm biến', time: '12 phút trước', avatar: 'N' }
    ];

    const robots = [
        { id: 'Alpha-01', status: 'Online', battery: 85, classroom: 'Classroom A' },
        { id: 'Alpha-02', status: 'Online', battery: 73, classroom: 'Classroom B' },
        { id: 'Alpha-03', status: 'Online', battery: 69, classroom: 'Classroom C' },
        { id: 'Alpha-04', status: 'Offline', battery: 37, classroom: 'Charging Station' }
    ];

    return (
        <div className="space-y-8 p-6">
            {/* Hero */}
            <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-400 text-white p-6 shadow-xl flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Chào bạn nhỏ 👋</h2>
                    <p className="text-sm opacity-90">Học vui, chơi khỏe — chọn một hoạt động để bắt đầu!</p>
                </div>
                <div className="hidden md:block text-5xl">🤖</div>
            </div>

            {/* Activity Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { title: 'Ghép hình', icon: '🧩', color: 'bg-amber-200' },
                    { title: 'Nhạc & Âm thanh', icon: '🎵', color: 'bg-emerald-200' },
                    { title: 'Luyện chữ', icon: '✏️', color: 'bg-sky-200' },
                    { title: 'Câu chuyện', icon: '📖', color: 'bg-pink-200' },
                    { title: 'Thí nghiệm', icon: '🔬', color: 'bg-lime-200' },
                    { title: 'Trò chơi', icon: '🎮', color: 'bg-violet-200' }
                ].map((tile) => (
                    <div key={tile.title} className={`${tile.color} rounded-2xl p-6 shadow-md hover:scale-105 transition-transform cursor-pointer flex items-center gap-4`}>
                        <div className="text-4xl">{tile.icon}</div>
                        <div>
                            <div className="font-bold text-lg">{tile.title}</div>
                            <div className="text-xs opacity-80">Chạm để bắt đầu</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cards: recent activity & robot status (kept from previous design) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Hoạt động gần đây</CardTitle>
                        <p className="text-sm text-muted-foreground">Hoạt động mới nhất của bạn</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {activities.map((activity, index) => (
                                <div key={index} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50">
                                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                                        <span className="text-xs font-medium">{activity.avatar}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground">{activity.name}</p>
                                        <p className="text-xs text-muted-foreground">{activity.action}</p>
                                    </div>
                                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Tình trạng robot</CardTitle>
                        <p className="text-sm text-muted-foreground">Trạng thái các robot Alpha Mini</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            {robots.map((robot, index) => (
                                <div key={index} className="p-3 border border-border rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">{robot.id}</span>
                                        <span className={`text-xs px-2 py-1 rounded ${robot.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {robot.status}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Battery</span>
                                            <span>{robot.battery}%</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-1.5">
                                            <div className={`h-1.5 rounded-full ${robot.battery > 60 ? 'bg-green-600' : robot.battery > 30 ? 'bg-yellow-600' : 'bg-red-600'}`} style={{ width: `${robot.battery}%` }}></div>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{robot.classroom}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
