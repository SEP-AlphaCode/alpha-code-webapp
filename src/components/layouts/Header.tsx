import { User } from '@/types/user';
import { LogOut, User as UserIcon, Settings, Bell } from 'lucide-react';

interface HeaderProps {
  user?: User;
  title: string;
  showNotifications?: boolean;
}

export default function Header({ user, title, showNotifications = true }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">α</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              AlphaCode
            </h1>
          </div>
          <span className="text-gray-500 dark:text-gray-400">|</span>
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {title}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {showNotifications && (
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          )}
          
          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user.role}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
