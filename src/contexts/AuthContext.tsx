// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'collector' | 'admin';
  points?: number;
  memberSince?: string;
  collectorInfo?: {
    phone?: string;
    address?: string;
    vehicleType?: string;
    vehicleNumberPlate?: string;
    experience?: string;
    isApproved?: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string, rememberMe: boolean) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use PropsWithChildren instead of defining custom props
export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app start
    const checkAuth = () => {
      try {
        // Check both localStorage and sessionStorage
        const loginMethod = localStorage.getItem('loginMethod') || sessionStorage.getItem('loginMethod');
        const storage = loginMethod === 'local' ? localStorage : sessionStorage;
        
        const token = storage.getItem('token');
        const userData = storage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log('Auto-login successful:', parsedUser);
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginMethod');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('loginMethod');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User, token: string, rememberMe: boolean) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem('token', token);
    storage.setItem('user', JSON.stringify(userData));
    storage.setItem('loginMethod', rememberMe ? 'local' : 'session');
    
    setUser(userData);
    console.log('User logged in:', userData);
  };

  const logout = () => {
    // Clear all storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginMethod');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('loginMethod');
    
    setUser(null);
    console.log('User logged out');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};