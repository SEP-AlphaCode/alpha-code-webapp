import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterColor: string;
  setFilterColor: (color: string) => void;
  availableStatuses: number[];
  availableColors: string[];
}

export default function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterColor,
  setFilterColor,
  availableStatuses,
  availableColors
}: SearchAndFilterProps) {
  const getStatusText = (status: number) => {
    return status === 1 ? 'Active' : 'Inactive';
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by name, expression, action, dance, or color..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          {availableStatuses.map(status => (
            <option key={status} value={status.toString()}>
              {getStatusText(status)}
            </option>
          ))}
        </select>
        <select
          value={filterColor}
          onChange={(e) => setFilterColor(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Colors</option>
          {availableColors.map(color => (
            <option key={color} value={color}>
              {color ? color.charAt(0).toUpperCase() + color.slice(1) : 'Unknown'}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
