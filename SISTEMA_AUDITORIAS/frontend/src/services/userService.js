import api from './api';

export const userService = {
  // Users
  async getUsers() {
    const response = await api.get('/users/');
    return response.data;
  },
  
  // Invitations
  async getInvitations() {
    const response = await api.get('/invitations/');
    return response.data;
  },
  
  async createInvitation(data) {
    const response = await api.post('/invitations/', data);
    return response.data;
  },
  
  async cancelInvitation(id) {
    const response = await api.post(`/invitations/${id}/cancel/`);
    return response.data;
  },
  
  async resendInvitation(id) {
    const response = await api.post(`/invitations/${id}/resend/`);
    return response.data;
  },
  
  // Public invitation endpoints
  async getInvitationByToken(token) {
    const response = await api.get(`/invitation/${token}/`);
    return response.data;
  },
  
  async acceptInvitation(token, data) {
    const response = await api.post(`/invitation/${token}/accept/`, data);
    return response.data;
  },
  
  async rejectInvitation(token) {
    const response = await api.post(`/invitation/${token}/reject/`);
    return response.data;
  },
};

export default userService;
