import api from './api';

export const hierarchyService = {
  // Tree
  async getTree() {
    const response = await api.get('/hierarchy/tree/');
    return response.data;
  },
  
  // Companies
  async getCompanies() {
    const response = await api.get('/companies/');
    return response.data;
  },
  
  async getCompany(id) {
    const response = await api.get(`/companies/${id}/`);
    return response.data;
  },
  
  async createCompany(data) {
    const response = await api.post('/companies/', data);
    return response.data;
  },
  
  async updateCompany(id, data) {
    const response = await api.put(`/companies/${id}/`, data);
    return response.data;
  },
  
  async getCompanyStats(id) {
    const response = await api.get(`/companies/${id}/stats/`);
    return response.data;
  },
  
  // Branches
  async getBranches(companyId = null) {
    const params = companyId ? `?company=${companyId}` : '';
    const response = await api.get(`/branches/${params}`);
    return response.data;
  },
  
  async getBranch(id) {
    const response = await api.get(`/branches/${id}/`);
    return response.data;
  },
  
  async createBranch(data) {
    const response = await api.post('/branches/', data);
    return response.data;
  },
  
  // Departments
  async getDepartments(branchId = null) {
    const params = branchId ? `?branch=${branchId}` : '';
    const response = await api.get(`/departments/${params}`);
    return response.data;
  },
  
  async getDepartment(id) {
    const response = await api.get(`/departments/${id}/`);
    return response.data;
  },
  
  async createDepartment(data) {
    const response = await api.post('/departments/', data);
    return response.data;
  },
  
  // Teams
  async getTeams(departmentId = null) {
    const params = departmentId ? `?department=${departmentId}` : '';
    const response = await api.get(`/teams/${params}`);
    return response.data;
  },
  
  async createTeam(data) {
    const response = await api.post('/teams/', data);
    return response.data;
  },
  
  // SubTeams
  async getSubTeams(teamId = null) {
    const params = teamId ? `?team=${teamId}` : '';
    const response = await api.get(`/subteams/${params}`);
    return response.data;
  },
  
  async createSubTeam(data) {
    const response = await api.post('/subteams/', data);
    return response.data;
  },
  
  // Stats
  async getStats() {
    const response = await api.get('/stats/');
    return response.data;
  },
};

export default hierarchyService;
