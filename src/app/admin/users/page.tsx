"use client";

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  UserCheck,
  UserX,
  Mail,
  Phone,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAccounts, useDeleteAccount, useUpdateAccount, convertAccountForDisplay } from '@/hooks/useAccounts';
import CreateUserModal from '@/components/CreateUserModal';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage] = useState(1);
  const pageSize = 10;

  // Sử dụng TanStack Query để fetch data
  const { 
    data: accountsResponse, 
    isLoading, 
    isError, 
    error 
  } = useAccounts({
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
    role: filterRole !== 'all' ? filterRole : undefined
  });

  // Mutations
  const deleteAccountMutation = useDeleteAccount();
  const updateAccountMutation = useUpdateAccount();

  // Memoized filtered data với conversion
  const filteredUsers = useMemo(() => {
    if (!accountsResponse?.data) return [];
    return accountsResponse.data.map(convertAccountForDisplay);
  }, [accountsResponse?.data]);

  const totalUsers = accountsResponse?.total || 0;
  const activeUsers = filteredUsers.filter(user => user.status === 1).length;
  const teachers = filteredUsers.filter(user => user.roleName === 'teacher').length;
  const admins = filteredUsers.filter(user => user.roleName === 'admin').length;

  // Helper functions
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-green-100 text-green-800'; // active
      case 0: return 'bg-gray-100 text-gray-800';   // inactive
      case 2: return 'bg-yellow-100 text-yellow-800'; // pending
      case 3: return 'bg-red-100 text-red-800';      // banned
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await deleteAccountMutation.mutateAsync(userId);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1; // toggle between active (1) and inactive (0)
    try {
      await updateAccountMutation.mutateAsync({
        id: userId,
        data: { status: newStatus }
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Button className='bg-black text-white' onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : totalUsers}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : activeUsers}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : teachers}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : admins}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Gender</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Created Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="text-gray-500 mt-2">Đang tải dữ liệu...</p>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
                      <p className="text-red-500">Có lỗi xảy ra: {error?.message}</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
                      <p className="text-gray-500">Không tìm thấy người dùng nào</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getRoleColor(user.roleName)}>
                          {user.roleName.charAt(0).toUpperCase() + user.roleName.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(user.status)}>
                          {user.statusText.charAt(0).toUpperCase() + user.statusText.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">
                          {user.genderText === 'male' ? 'Nam' : user.genderText === 'female' ? 'Nữ' : 'Khác'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">
                          {new Date(user.createdDate).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            disabled={updateAccountMutation.isPending}
                          >
                            {user.status === 1 ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deleteAccountMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <CreateUserModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
    </div>
  );
}
