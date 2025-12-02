import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

    useEffect(() => {
    // Mantener token sincronizado con localStorage
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, [token]);


  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login/', { email, password });
      const userData = response.data.user;
      const userToken = response.data.token;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error al iniciar sesión' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null); 
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      loading,
      isAuthenticated: !!user
    }}>
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