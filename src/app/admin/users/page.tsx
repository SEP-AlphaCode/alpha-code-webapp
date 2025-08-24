"use client";
import React, { useState, useMemo } from 'react';
import { 
  Search, 
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
import { useAccount } from '@/hooks/use-account';
import { Account } from '@/types/account';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const accountHooks = useAccount();
  const { data: accounts, isLoading, error } = accountHooks.useGetAllAccounts();
  const deleteAccountMutation = accountHooks.useDeleteAccount();
  const updateAccountMutation = accountHooks.useUpdateAccount();

  // Convert Account type to User interface for compatibility
  const users = useMemo(() => {
    if (!accounts || !Array.isArray(accounts)) return [];
    return accounts.map((account: Account) => ({
      id: account.id,
      name: account.fullName || 'Unknown',
      fullName: account.fullName || 'Unknown',
      email: account.email || '',
      role: (account.roleName?.toLowerCase() as 'teacher' | 'admin' | 'student') || 'student',
      roleName: account.roleName || 'student',
      status: account.status === 1 ? 'active' : 'inactive' as 'active' | 'inactive',
      statusNumber: account.status || 0,
      statusText: account.status === 1 ? 'active' : 'inactive',
      lastLogin: account.lastEdited || '',
      phone: account.phone || '',
      createdAt: account.createdDate || '',
      createdDate: account.createdDate || '',
      username: account.username || '',
      gender: account.gender || 0,
      genderText: account.gender === 1 ? 'male' : account.gender === 2 ? 'female' : 'other',
      image: account.image || '',
      bannedReason: account.bannedReason || '',
      roleId: account.roleId || ''
    }));
  }, [accounts]);

  // Get unique roles dynamically from data
  const availableRoles = useMemo(() => {
    const roles = [...new Set(users.map(user => user.role))];
    return roles;
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.username?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  // Get role colors dynamically
  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-600',
      teacher: 'bg-purple-100 text-purple-600', 
      student: 'bg-blue-100 text-blue-600',
      default: 'bg-gray-100 text-gray-600'
    };
    return colors[role as keyof typeof colors] || colors.default;
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteAccountMutation.mutate(userId);
    }
  };

  const handleToggleStatus = (userId: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    updateAccountMutation.mutate({
      id: userId,
      accountData: { status: newStatus }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-red-500">Có lỗi xảy ra: {(error as Error)?.message}</p>
        </div>
      </div>
    );
  }

  // Statistics
  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter(user => user.statusNumber === 1).length;
  const teachers = filteredUsers.filter(user => user.roleName === 'teacher').length;
  const admins = filteredUsers.filter(user => user.roleName === 'admin').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-3xl font-bold text-purple-600">{teachers}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-3xl font-bold text-red-600">{admins}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {availableRoles.map(role => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-900">User</th>
                  <th className="text-left p-4 font-medium text-gray-900">Role</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Gender</th>
                  <th className="text-left p-4 font-medium text-gray-900">Created</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getRoleColor(user.roleName)}>
                        {user.roleName.charAt(0).toUpperCase() + user.roleName.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(user.statusNumber)}>
                        {user.statusText.charAt(0).toUpperCase() + user.statusText.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-900">
                        {user.genderText === 'male' ? 'Nam' : user.genderText === 'female' ? 'Nữ' : 'Khác'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-900">
                        {new Date(user.createdDate).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(user.id, user.statusNumber)}
                          className="flex items-center space-x-1"
                        >
                          {user.statusNumber === 1 ? (
                            <>
                              <UserX className="h-4 w-4" />
                              <span>Deactivate</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4" />
                              <span>Activate</span>
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && !isLoading && (
            <div className="text-center py-8">
              {users.length === 0 ? (
                <p className="text-gray-500">No users found in the system.</p>
              ) : (
                <p className="text-gray-500">No users found matching your criteria.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
