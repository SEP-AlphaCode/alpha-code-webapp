import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchAndFilter from './search-and-filter';
import UserTableRow from './user-table-row';

interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  username: string;
  roleName: string;
  statusNumber: number;
  statusText: string;
  genderText: string;
  createdDate: string;
}

interface UserTableProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterRole: string;
  onRoleChange: (value: string) => void;
  availableRoles: string[];
  filteredUsers: UserInfo[];
  totalUsers: number;
  isLoading: boolean;
  onToggleStatus: (userId: string, currentStatus: number) => void;
  onDeleteUser: (userId: string) => void;
  getRoleColor: (role: string) => string;
  getStatusColor: (status: number) => string;
}

export default function UserTable({
  searchTerm,
  onSearchChange,
  filterRole,
  onRoleChange,
  availableRoles,
  filteredUsers,
  totalUsers,
  isLoading,
  onToggleStatus,
  onDeleteUser,
  getRoleColor,
  getStatusColor
}: UserTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User List</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          filterRole={filterRole}
          onRoleChange={onRoleChange}
          availableRoles={availableRoles}
        />

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
                <UserTableRow
                  key={user.id}
                  user={user}
                  onToggleStatus={onToggleStatus}
                  onDeleteUser={onDeleteUser}
                  getRoleColor={getRoleColor}
                  getStatusColor={getStatusColor}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && !isLoading && (
          <div className="text-center py-8">
            {totalUsers === 0 ? (
              <p className="text-gray-500">No users found in the system.</p>
            ) : (
              <p className="text-gray-500">No users found matching your criteria.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
