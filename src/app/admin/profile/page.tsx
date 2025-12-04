"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Lock,
  Edit,
  Save,
  X,
  Camera,
  Activity,
  Settings
} from 'lucide-react';
import { getUserInfoFromToken } from '@/utils/tokenUtils';
import { useAccount } from '@/features/users/hooks/use-account';
import LoadingState from '@/components/loading-state';
import ErrorState from '@/components/error-state';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AdminProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editedData, setEditedData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { useGetAccountById, useUpdateAccount } = useAccount();
  const updateMutation = useUpdateAccount();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        const userInfo = getUserInfoFromToken(accessToken);
        setUserId(userInfo?.id || null);
      }
    }
  }, []);

  const { data: account, isLoading, error, refetch } = useGetAccountById(userId || '');

  useEffect(() => {
    if (account) {
      setEditedData({
        fullName: account.fullName || '',
        email: account.email || '',
        phone: account.phone || '',
      });
    }
  }, [account]);

  const handleSave = async () => {
    if (!userId) return;

    try {
      await updateMutation.mutateAsync({
        id: userId,
        accountData: editedData,
      });
      toast.success('Cập nhật hồ sơ thành công');
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error('Cập nhật hồ sơ thất bại');
      console.error('Update error:', error);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    // TODO: Implement password change API
    toast.info('Tính năng đổi mật khẩu sắp ra mắt');
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingState />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="container mx-auto py-8">
        <ErrorState error={error || "Không thể tải hồ sơ"} />
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Quản Trị Viên</h1>
        <p className="text-gray-500 mt-2">Quản lý cài đặt tài khoản và tùy chọn của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={account.image} alt={account.fullName} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(account.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full"
                    disabled
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{account.fullName}</CardTitle>
                  <Badge variant="default" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Quản Trị Viên
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{account.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{account.phone || 'Chưa có số điện thoại'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{account.username}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">
                    Tham gia {account.createdDate ? format(new Date(account.createdDate), 'MM/yyyy') : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Trạng Thái Tài Khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Trạng thái</span>
                <Badge variant={account.status === 1 ? "default" : "destructive"}>
                  {account.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Vai trò</span>
                <Badge variant="outline">{account.roleName}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Giới tính</span>
                <span className="text-sm font-medium">
                  {account.gender === 0 ? 'Nam' : account.gender === 1 ? 'Nữ' : 'Khác'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Thông Tin Chung</TabsTrigger>
              <TabsTrigger value="security">Bảo Mật</TabsTrigger>
            </TabsList>

            {/* General Information Tab */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Thông Tin Cá Nhân</CardTitle>
                      <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleSave} disabled={updateMutation.isPending}>
                          <Save className="h-4 w-4 mr-2" />
                          Lưu
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditing(false);
                            setEditedData({
                              fullName: account.fullName || '',
                              email: account.email || '',
                              phone: account.phone || '',
                            });
                          }}
                          variant="outline"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Hủy
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input
                      id="fullName"
                      value={editedData.fullName}
                      onChange={(e) => setEditedData({ ...editedData, fullName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Địa chỉ email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedData.email}
                      onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={editedData.phone}
                      onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Activity Log */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Hoạt Động Tài Khoản
                  </CardTitle>
                  <CardDescription>Các hoạt động và cập nhật gần đây</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Tài khoản được tạo</p>
                        <p className="text-xs text-gray-500">
                          {account.createdDate ? format(new Date(account.createdDate), 'dd/MM/yyyy HH:mm') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    {account.lastEdited && (
                      <div className="flex items-start gap-4">
                        <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Cập nhật lần cuối</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(account.lastEdited), 'dd/MM/yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Đổi Mật Khẩu
                  </CardTitle>
                  <CardDescription>Cập nhật mật khẩu để bảo vệ tài khoản của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isChangingPassword ? (
                    <Button onClick={() => setIsChangingPassword(true)} variant="outline">
                      <Lock className="h-4 w-4 mr-2" />
                      Đổi mật khẩu
                    </Button>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Nhập mật khẩu mới"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Xác nhận mật khẩu mới"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handlePasswordChange}>
                          <Save className="h-4 w-4 mr-2" />
                          Cập nhật mật khẩu
                        </Button>
                        <Button
                          onClick={() => {
                            setIsChangingPassword(false);
                            setPasswordData({
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: '',
                            });
                          }}
                          variant="outline"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Hủy
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Cài Đặt Bảo Mật
                  </CardTitle>
                  <CardDescription>Các tính năng bảo mật bổ sung</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Xác thực hai yếu tố</p>
                      <p className="text-sm text-gray-500">Thêm lớp bảo mật bổ sung</p>
                    </div>
                    <Badge variant="outline">Sắp ra mắt</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Phiên hoạt động</p>
                      <p className="text-sm text-gray-500">Quản lý các phiên đăng nhập của bạn</p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Xem phiên
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Lịch sử đăng nhập</p>
                      <p className="text-sm text-gray-500">Xem lại hoạt động đăng nhập gần đây</p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Xem lịch sử
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
