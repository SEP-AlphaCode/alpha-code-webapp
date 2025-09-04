"use client";
import React, { useState, useMemo } from 'react';
import { useAccount } from '@/hooks/use-account';
import { Account } from '@/types/account';
import {
  PageHeader,
  StatisticsCards,
  UserTable,
  LoadingState,
  ErrorState,
  CreateUserModal
} from '@/components/users';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createError, setCreateError] = useState<string>('');
  const [createSuccess, setCreateSuccess] = useState<string>('');

  const accountHooks = useAccount();
  const { data: accountsResponse, isLoading, error } = accountHooks.useGetAllAccounts();
  const deleteAccountMutation = accountHooks.useDeleteAccount();
  const updateAccountMutation = accountHooks.useUpdateAccount();
  const createAccountMutation = accountHooks.useCreateAccount();

  // Extract accounts from PagedResult
  const accounts = accountsResponse?.data || [];

  // Convert Account type to User interface for compatibility
  const users = useMemo(() => {
    if (!accounts || !Array.isArray(accounts)) {
      return [];
    }
    
    const processedUsers = accounts.map((account: Account) => ({
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
    
    return processedUsers;
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

  const handleAddUser = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateUser = (userData: {
    username: string;
    email: string;
    fullName: string;
    password: string;
    phone: string;
    roleId: string;
    gender: number;
    status: number;
    avatarFile?: File;
  }) => {
    // Prepare complete account data for API
    const accountData = {
      ...userData,
      statusText: userData.status === 1 ? 'active' : 'inactive',
      image: '', // Default empty image
      bannedReason: null, // Default no ban reason
      roleName: '', // This will be populated by backend based on roleId
      avatarFile: userData.avatarFile
    };

    createAccountMutation.mutate(accountData, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        setCreateError(''); // Clear any errors
        setCreateSuccess('User created successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setCreateSuccess(''), 3000);
      },
      onError: (error) => {
        console.error('❌ Error creating user:', error);
        
        // Extract meaningful error message
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Unknown error occurred while creating user';
        
        setCreateError(errorMessage);
        setCreateSuccess(''); // Clear any success messages
        
        // Don't close modal so user can fix the issue and try again
      }
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error as Error} />;
  }

  // Statistics
  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter(user => user.statusNumber === 1).length;
  const teachers = filteredUsers.filter(user => user.roleName === 'teacher').length;
  const admins = filteredUsers.filter(user => user.roleName === 'admin').length;

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {createSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex">
            <div className="text-green-700 text-sm">
              <strong>Success:</strong> {createSuccess}
            </div>
          </div>
        </div>
      )}

      <PageHeader onAddUser={handleAddUser} />
      
      <StatisticsCards
        totalUsers={totalUsers}
        activeUsers={activeUsers}
        teachers={teachers}
        admins={admins}
      />

      <UserTable
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterRole={filterRole}
        onRoleChange={setFilterRole}
        availableRoles={availableRoles}
        filteredUsers={filteredUsers}
        totalUsers={users.length}
        isLoading={isLoading}
        onToggleStatus={handleToggleStatus}
        onDeleteUser={handleDeleteUser}
        getRoleColor={getRoleColor}
        getStatusColor={getStatusColor}
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateError(''); // Clear error when closing
        }}
        onSubmit={handleCreateUser}
        isLoading={createAccountMutation.isPending}
        error={createError}
      />
    </div>
  );
}
