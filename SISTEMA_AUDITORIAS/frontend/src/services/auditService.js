import api from './api';

export const auditService = {
  getTemplates: function() {
    return api.get('/templates/');
  },
  
  getTemplate: function(id) {
    return api.get('/templates/' + id + '/');
  },
  
  getAudits: function(filters) {
    return api.get('/audits/', { params: filters });
  },
  
  getAudit: function(id) {
    return api.get('/audits/' + id + '/');
  },
  
  createAudit: function(data) {
    return api.post('/audits/', data);
  },
  
  startAudit: function(id) {
    return api.post('/audits/' + id + '/start/');
  },
  
  completeAudit: function(id) {
    return api.post('/audits/' + id + '/complete/');
  },
  
  getQuestions: function(auditId) {
    return api.get('/audits/' + auditId + '/questions/');
  },
  
  submitAnswer: function(auditId, questionId, data) {
    return api.post('/audits/' + auditId + '/answer/', {
      question_id: questionId,
      answer: data.answer,
      comment: data.comment
    });
  },
  
  getResults: function(auditId) {
    return api.get('/audits/' + auditId + '/results/');
  },
  
  getAnswers: function(auditId) {
    return api.get('/audits/' + auditId + '/answers/');
  },
  
  compareAudits: function(auditIds) {
    return api.post('/audits/compare/', { audit_ids: auditIds });
  },
  
  getStatistics: function() {
    return api.get('/statistics/');
  },
  
  getDashboard: function() {
    return api.get('/dashboard/');
  },
  
  getRecommendations: function(auditId) {
    return api.get('/recommendations/', { params: { audit: auditId } });
  }
};

export default auditService;
