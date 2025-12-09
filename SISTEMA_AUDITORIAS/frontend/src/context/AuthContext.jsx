import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = authService.getStoredUser();
    const storedOrg = authService.getStoredOrganization();
    
    if (storedUser) {
      setUser(storedUser);
      setOrganization(storedOrg);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    setUser(result.user);
    setOrganization(result.organization);
    return result;
  };

  const register = async (data) => {
    const result = await authService.register(data);
    setUser(result.user);
    setOrganization(result.organization);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setOrganization(null);
  };

  const refreshUser = async () => {
    try {
      const data = await authService.getMe();
      setUser(data);
      if (data.organization) {
        setOrganization(data.organization);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value = {
    user,
    organization,
    loading,
    isAuthenticated: !!user,
    isOwner: user?.user_type === 'owner',
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
