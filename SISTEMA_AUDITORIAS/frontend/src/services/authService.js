import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login/', { email, password });
    const { access, refresh, user, organization } = response.data;
    
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('user', JSON.stringify(user));
    if (organization) {
      localStorage.setItem('organization', JSON.stringify(organization));
    }
    
    return { user, organization };
  },
  
  async register(data) {
    const response = await api.post('/auth/register/', data);
    const { tokens, user, organization } = response.data;
    
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    localStorage.setItem('user', JSON.stringify(user));
    if (organization) {
      localStorage.setItem('organization', JSON.stringify(organization));
    }
    
    return { user, organization };
  },
  
  async logout() {
    try {
      const refresh = localStorage.getItem('refreshToken');
      await api.post('/auth/logout/', { refresh });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('organization');
    }
  },
  
  async getMe() {
    const response = await api.get('/auth/me/');
    return response.data;
  },
  
  async updateProfile(data) {
    const response = await api.put('/auth/me/', data);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },
  
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  getStoredOrganization() {
    const org = localStorage.getItem('organization');
    return org ? JSON.parse(org) : null;
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },
};

export default authService;
