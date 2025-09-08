import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  onAddNewCard?: () => void;
}

export default function PageHeader({ onAddNewCard }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Osmo Card Management</h1>
        <p className="text-gray-600">Manage your Osmo Cards and their activities</p>
      </div>
      <Button 
        className="flex items-center space-x-2"
        onClick={onAddNewCard}
      >
        <Plus className="h-4 w-4" />
        <span>Add New Card</span>
      </Button>
    </div>
  );
}
