
/**
 * AuthContext.tsx
 *
 * Provides authentication state and helpers (login, logout, user info) to the React app.
 * Stores user and token in localStorage for session persistence.
 *
 * Usage:
 *   - Wrap your app with <AuthProvider>
 *   - Use useAuth() hook to access auth state and actions
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { authApi } from '../api/auth';


// Shape of the authentication context
interface AuthContextType {
  user: User | null; // Current logged-in user (null if not logged in)
  token: string | null; // JWT token for API requests
  isLoading: boolean; // True while restoring session
  login: (email: string, password: string) => Promise<void>; // Login function
  logout: () => void; // Logout function
  isAdmin: boolean; // True if user is admin
  isMember: boolean; // True if user is member
}


// Create the context (null by default, must be used inside provider)
const AuthContext = createContext<AuthContextType | null>(null);


/**
 * AuthProvider component
 * Wrap your app with this to provide authentication context.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on page reload
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login and persist session
  const login = async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
  };

  // Logout and clear session
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    authApi.logout().catch(() => {}); // fire and forget
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      logout,
      isAdmin: user?.role === 'ADMIN',
      isMember: user?.role === 'MEMBER',
    }}>
      {children}
    </AuthContext.Provider>
  );
};


/**
 * useAuth hook
 * Access authentication state and actions anywhere in the app.
 * Throws if used outside AuthProvider.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};