import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  onAddUser?: () => void;
}

export default function PageHeader({ onAddUser }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>
      <Button
        onClick={onAddUser}
        className="flex items-center space-x-2"
      >
        <Plus className="h-4 w-4" />
        <span>Add User</span>
      </Button>
    </div>
  );
}
