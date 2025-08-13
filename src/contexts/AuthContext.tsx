'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data from localStorage or API
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem('alphacode-user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('alphacode-user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('alphacode-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Demo users for testing
export const demoUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    role: UserRole.PARENT,
    avatar: undefined
  },
  {
    id: '2',
    name: 'Ms. Emily Chen',
    email: 'emily.chen@school.edu',
    role: UserRole.TEACHER,
    avatar: undefined
  },
  {
    id: '3',
    name: 'Dr. Michael Rodriguez',
    email: 'michael.rodriguez@alphacode.com',
    role: UserRole.ADMIN,
    avatar: undefined
  },
  {
    id: '4',
    name: 'Jennifer Kim',
    email: 'jennifer.kim@alphacode.com',
    role: UserRole.MANAGER,
    avatar: undefined
  }
];
