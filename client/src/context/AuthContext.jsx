
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('techblog_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('techblog_access_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreUser = async () => {
      const savedToken = localStorage.getItem('techblog_access_token');
      if (!savedToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const data = await authService.getMe();
        if (isMounted && data?.user) {
          setUser(data.user);
          localStorage.setItem('techblog_user', JSON.stringify(data.user));
        }
      } catch (err) {
        console.warn('Session restoration failed:', err.message);
        if (isMounted) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('techblog_access_token');
          localStorage.removeItem('techblog_user');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    restoreUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      if (data?.accessToken && data?.user) {
        setToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('techblog_access_token', data.accessToken);
        localStorage.setItem('techblog_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      throw new Error('Invalid response from authentication server');
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Login failed. Please check your credentials.',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.register({ name, email, password });
      if (data?.accessToken && data?.user) {
        setToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('techblog_access_token', data.accessToken);
        localStorage.setItem('techblog_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      throw new Error('Invalid response from registration server');
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Registration failed. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout error:', err.message);
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
