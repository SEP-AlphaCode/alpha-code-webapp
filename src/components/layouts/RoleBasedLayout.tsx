'use client';

import { UserRole, LayoutProps } from '@/types/user';
import ParentLayout from './ParentLayout';
import TeacherLayout from './TeacherLayout';
import AdminLayout from './AdminLayout';
import ManagerLayout from './ManagerLayout';

export default function RoleBasedLayout({ children, user }: LayoutProps) {
  if (!user) {
    // Default layout for non-authenticated users
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    );
  }

  switch (user.role) {
    case UserRole.PARENT:
      return <ParentLayout user={user}>{children}</ParentLayout>;
    
    case UserRole.TEACHER:
      return <TeacherLayout user={user}>{children}</TeacherLayout>;
    
    case UserRole.ADMIN:
      return <AdminLayout user={user}>{children}</AdminLayout>;
    
    case UserRole.MANAGER:
      return <ManagerLayout user={user}>{children}</ManagerLayout>;
    
    default:
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {children}
        </div>
      );
  }
}

// Export individual layouts for direct use
export { ParentLayout, TeacherLayout, AdminLayout, ManagerLayout };
