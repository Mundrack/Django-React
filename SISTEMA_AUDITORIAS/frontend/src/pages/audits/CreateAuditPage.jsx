import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Check } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { auditService } from '../../services/auditService';
import { companyService } from '../../services/companyService';

const CreateAuditPage = function() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [description, setDescription] = useState('');

  useEffect(function() {
    fetchData();
  }, []);

  var fetchData = async function() {
    try {
      var templatesRes = await auditService.getTemplates();
      var tData = templatesRes.data || templatesRes || [];
      if (Array.isArray(tData)) {
        setTemplates(tData);
      } else {
        setTemplates([]);
      }

      var companiesRes = await companyService.getCompanies();
      var cData = companiesRes.data || companiesRes || [];
      if (Array.isArray(cData)) {
        setCompanies(cData);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setTemplates([]);
      setCompanies([]);
    }
    setLoading(false);
  };

  var handleSubmit = async function(e) {
    e.preventDefault();
    if (!name || !templateId) {
      alert('Completa nombre y plantilla');
      return;
    }
    setSubmitting(true);
    try {
      var data = {
        name: name,
        template_id: templateId,
        description: description
      };
      if (companyId) {
        data.target_id = companyId;
        data.target_type = 'company';
      }
      var res = await auditService.createAudit(data);
      var newAudit = res.data || res;
      navigate('/audits/' + newAudit.id);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear');
    }
    setSubmitting(false);
  };

  if (loading) {
    return React.createElement(Loading, null);
  }

  var templateArray = [];
  if (templates && Array.isArray(templates)) {
    templateArray = templates;
  }

  var companyArray = [];
  if (companies && Array.isArray(companies)) {
    companyArray = companies;
  }

  return React.createElement('div', { className: 'space-y-6' },
    React.createElement('div', { className: 'flex items-center gap-4' },
      React.createElement('button', {
        onClick: function() { navigate('/audits'); },
        className: 'p-2 hover:bg-gray-700 rounded-lg'
      }, React.createElement(ArrowLeft, { className: 'w-5 h-5 text-gray-400' })),
      React.createElement('div', null,
        React.createElement('h1', { className: 'text-2xl font-bold text-white' }, 'Nueva Auditoria'),
        React.createElement('p', { className: 'text-gray-400' }, 'Crea una nueva auditoria')
      )
    ),
    React.createElement('form', { onSubmit: handleSubmit },
      React.createElement(Card, null,
        React.createElement(CardHeader, null,
          React.createElement('h2', { className: 'text-lg font-semibold text-white' }, 'Informacion')
        ),
        React.createElement(CardBody, null,
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' }, 'Nombre *'),
              React.createElement('input', {
                type: 'text',
                value: name,
                onChange: function(e) { setName(e.target.value); },
                className: 'w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white',
                placeholder: 'Nombre de la auditoria',
                required: true
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' }, 'Descripcion'),
              React.createElement('textarea', {
                value: description,
                onChange: function(e) { setDescription(e.target.value); },
                className: 'w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white',
                rows: 3,
                placeholder: 'Descripcion opcional'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' }, 'Plantilla *'),
              React.createElement('select', {
                value: templateId,
                onChange: function(e) { setTemplateId(e.target.value); },
                className: 'w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white',
                required: true
              },
                React.createElement('option', { value: '' }, 'Seleccionar plantilla'),
                templateArray.map(function(t) {
                  return React.createElement('option', { key: t.id, value: t.id }, t.name);
                })
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' }, 'Empresa (Opcional)'),
              React.createElement('select', {
                value: companyId,
                onChange: function(e) { setCompanyId(e.target.value); },
                className: 'w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white'
              },
                React.createElement('option', { value: '' }, 'Seleccionar empresa'),
                companyArray.map(function(c) {
                  return React.createElement('option', { key: c.id, value: c.id }, c.name);
                })
              )
            )
          )
        )
      ),
      React.createElement('div', { className: 'flex justify-end gap-4 mt-6' },
        React.createElement('button', {
          type: 'button',
          onClick: function() { navigate('/audits'); },
          className: 'px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600'
        }, 'Cancelar'),
        React.createElement('button', {
          type: 'submit',
          disabled: submitting,
          className: 'px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
        }, submitting ? 'Creando...' : 'Crear Auditoria')
      )
    )
  );
};

export default CreateAuditPage;
