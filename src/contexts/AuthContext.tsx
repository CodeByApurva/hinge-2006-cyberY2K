import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User } from '../utils/types';
import { currentUser } from '../mockData/users';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hinge2006-auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('hinge2006-auth', JSON.stringify(user));
    } else {
      localStorage.removeItem('hinge2006-auth');
    }
  }, [user]);

  const login = useCallback((username: string, password: string): boolean => {
    // Mock authentication — accept the demo user or any username with password "hinge2006"
    if ((username === currentUser.username && password === currentUser.password) ||
        (username && password === 'hinge2006')) {
      const loggedInUser = { ...currentUser, status: 'Online' as const, lastActive: new Date().toISOString() };
      setUser(loggedInUser);
      return true;
    }
    // Also accept any non-empty credentials for demo purposes
    if (username && password) {
      const loggedInUser = { ...currentUser, username, displayName: username.split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' '), status: 'Online' as const, lastActive: new Date().toISOString() };
      setUser(loggedInUser);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('hinge2006-auth');
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
