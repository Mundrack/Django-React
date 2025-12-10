import api from './api';

export const companyService = {
  getCompanies: function() {
    return api.get('/companies/');
  },
  
  getCompany: function(id) {
    return api.get('/companies/' + id + '/');
  },
  
  createCompany: function(data) {
    return api.post('/companies/', data);
  },
  
  updateCompany: function(id, data) {
    return api.put('/companies/' + id + '/', data);
  },
  
  deleteCompany: function(id) {
    return api.delete('/companies/' + id + '/');
  },
  
  getPerimeters: function(companyId) {
    return api.get('/companies/' + companyId + '/perimeters/');
  },
  
  createPerimeter: function(companyId, data) {
    return api.post('/companies/' + companyId + '/perimeters/', data);
  }
};

export default companyService;
