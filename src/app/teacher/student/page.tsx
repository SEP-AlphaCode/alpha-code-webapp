"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastActivity: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  avatar?: string;
  grade: string;
  programmingLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface ClassGroup {
  id: string;
  name: string;
  studentCount: number;
  teacher: string;
  description: string;
}

export default function StudentManagementPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'classes' | 'invite'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddStudent, setShowAddStudent] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@email.com',
        class: 'Lớp 6A',
        status: 'active',
        joinDate: '2024-09-01',
        lastActivity: '2024-12-10',
        progress: 85,
        completedLessons: 17,
        totalLessons: 20,
        grade: '6',
        programmingLevel: 'Intermediate'
      },
      {
        id: '2',
        name: 'Trần Thị Bình',
        email: 'binh.tran@email.com',
        class: 'Lớp 6A',
        status: 'active',
        joinDate: '2024-09-01',
        lastActivity: '2024-12-09',
        progress: 92,
        completedLessons: 18,
        totalLessons: 20,
        grade: '6',
        programmingLevel: 'Advanced'
      },
      {
        id: '3',
        name: 'Lê Văn Cường',
        email: 'cuong.le@email.com',
        class: 'Lớp 6B',
        status: 'pending',
        joinDate: '2024-12-01',
        lastActivity: '2024-12-05',
        progress: 30,
        completedLessons: 6,
        totalLessons: 20,
        grade: '6',
        programmingLevel: 'Beginner'
      },
      {
        id: '4',
        name: 'Phạm Thị Duyên',
        email: 'duyen.pham@email.com',
        class: 'Lớp 7A',
        status: 'active',
        joinDate: '2024-08-15',
        lastActivity: '2024-12-10',
        progress: 78,
        completedLessons: 23,
        totalLessons: 30,
        grade: '7',
        programmingLevel: 'Intermediate'
      },
      {
        id: '5',
        name: 'Hoàng Văn Em',
        email: 'em.hoang@email.com',
        class: 'Lớp 7A',
        status: 'inactive',
        joinDate: '2024-09-01',
        lastActivity: '2024-11-20',
        progress: 45,
        completedLessons: 9,
        totalLessons: 30,
        grade: '7',
        programmingLevel: 'Beginner'
      }
    ];

    const mockClasses: ClassGroup[] = [
      {
        id: '1',
        name: 'Lớp 6A',
        studentCount: 25,
        teacher: 'Cô Nguyễn Thị Lan',
        description: 'Lớp học lập trình cơ bản cho học sinh lớp 6'
      },
      {
        id: '2',
        name: 'Lớp 6B',
        studentCount: 22,
        teacher: 'Thầy Trần Văn Nam',
        description: 'Lớp học lập trình nâng cao cho học sinh lớp 6'
      },
      {
        id: '3',
        name: 'Lớp 7A',
        studentCount: 28,
        teacher: 'Cô Lê Thị Hoa',
        description: 'Lớp học lập trình trung cấp cho học sinh lớp 7'
      }
    ];

    setStudents(mockStudents);
    setClasses(mockClasses);
    setIsLoading(false);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getStatusBadge = (status: Student['status']) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      pending: 'Chờ xác nhận'
    };

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getLevelBadge = (level: Student['programmingLevel']) => {
    const variants = {
      Beginner: 'bg-blue-100 text-blue-800',
      Intermediate: 'bg-purple-100 text-purple-800',
      Advanced: 'bg-orange-100 text-orange-800'
    };

    const labels = {
      Beginner: 'Cơ bản',
      Intermediate: 'Trung bình',
      Advanced: 'Nâng cao'
    };

    return (
      <Badge className={variants[level]}>
        {labels[level]}
      </Badge>
    );
  };

  const renderStudentsTab = () => (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý học sinh</h2>
          <p className="text-gray-600">Quản lý thông tin và tiến độ học tập của học sinh</p>
        </div>
        <Button 
          onClick={() => setShowAddStudent(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm học sinh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm học sinh theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả lớp</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.name}>{cls.name}</option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng học sinh</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {students.filter(s => s.status === 'pending').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiến độ trung bình</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)}%
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription>{student.email}</CardDescription>
                  </div>
                </div>
                <CardAction>
                  {getStatusBadge(student.status)}
                </CardAction>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Lớp:</span>
                    <p className="font-medium">{student.class}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Cấp độ:</span>
                    <div className="mt-1">{getLevelBadge(student.programmingLevel)}</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Tiến độ học tập</span>
                    <span className="font-medium">{student.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {student.completedLessons}/{student.totalLessons} bài học hoàn thành
                  </p>
                </div>

                <div className="text-xs text-gray-500">
                  <p>Tham gia: {new Date(student.joinDate).toLocaleDateString('vi-VN')}</p>
                  <p>Hoạt động cuối: {new Date(student.lastActivity).toLocaleDateString('vi-VN')}</p>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Xem chi tiết
                  </Button>
                  <Button size="sm" variant="ghost">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-gray-400">👥</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy học sinh</h3>
          <p className="text-gray-500">Thử thay đổi bộ lọc hoặc thêm học sinh mới</p>
        </div>
      )}
    </div>
  );

  const renderClassesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý lớp học</h2>
          <p className="text-gray-600">Tạo và quản lý các lớp học</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo lớp mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classGroup) => (
          <Card key={classGroup.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{classGroup.name}</CardTitle>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">🏫</span>
                </div>
              </div>
              <CardDescription>{classGroup.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Số học sinh:</span>
                    <p className="font-medium text-lg">{classGroup.studentCount}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Giáo viên:</span>
                    <p className="font-medium">{classGroup.teacher}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Xem lớp
                  </Button>
                  <Button size="sm" variant="ghost">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderInviteTab = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Mời học sinh tham gia</h2>
        <p className="text-gray-600 mt-2">Gửi lời mời cho học sinh tham gia lớp học</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mời qua email</CardTitle>
          <CardDescription>Nhập địa chỉ email của học sinh</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email học sinh
              </label>
              <Input
                type="email"
                placeholder="student@email.com"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn lớp
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Chọn lớp học</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tin nhắn (tùy chọn)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Thêm tin nhắn cho học sinh..."
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Gửi lời mời
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liên kết mời</CardTitle>
          <CardDescription>Chia sẻ liên kết để học sinh tự tham gia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-600 mb-2">Liên kết mời lớp:</p>
              <div className="flex items-center space-x-2">
                <Input
                  value="https://alphacode.edu.vn/invite/abc123"
                  readOnly
                  className="flex-1"
                />
                <Button size="sm" variant="outline">
                  Sao chép
                </Button>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                Tạo mã QR
              </Button>
              <Button variant="outline" className="flex-1">
                Chia sẻ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'students', label: 'Học sinh', icon: '👥' },
            { key: 'classes', label: 'Lớp học', icon: '🏫' },
            { key: 'invite', label: 'Mời tham gia', icon: '📧' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'students' && renderStudentsTab()}
      {activeTab === 'classes' && renderClassesTab()}
      {activeTab === 'invite' && renderInviteTab()}
    </div>
  );
}