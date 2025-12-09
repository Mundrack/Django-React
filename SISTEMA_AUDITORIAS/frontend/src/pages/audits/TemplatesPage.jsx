import React, { useState, useEffect } from 'react';
import { FileText, ChevronDown, ChevronRight, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { auditService } from '../../services/auditService';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTemplate, setExpandedTemplate] = useState(null);
  const [templateDetails, setTemplateDetails] = useState({});

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await auditService.getTemplates();
      const data = response.data || response || [];
      setTemplates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTemplate = async (templateId) => {
    if (expandedTemplate === templateId) {
      setExpandedTemplate(null);
      return;
    }
    
    setExpandedTemplate(templateId);
    
    if (!templateDetails[templateId]) {
      try {
        const response = await auditService.getTemplate(templateId);
        const data = response.data || response;
        setTemplateDetails(function(prev) {
          var newDetails = {};
          for (var key in prev) {
            newDetails[key] = prev[key];
          }
          newDetails[templateId] = data;
          return newDetails;
        });
      } catch (error) {
        console.error('Error fetching template details:', error);
      }
    }
  };

  if (loading) return <Loading />;

  const templateList = Array.isArray(templates) ? templates : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Plantillas de Auditoria</h1>
        <p className="text-gray-400">Plantillas disponibles para tus auditorias</p>
      </div>

      {templateList.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No hay plantillas disponibles</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templateList.map(function(template) {
            var isExpanded = expandedTemplate === template.id;
            var details = templateDetails[template.id];
            var sections = (details && details.sections) ? details.sections : [];
            
            return (
              <Card key={template.id}>
                <div
                  onClick={function() { toggleTemplate(template.id); }}
                  className="p-4 cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-600 rounded-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{template.name}</h3>
                        <p className="text-sm text-gray-400">{template.code || template.standard}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-400">
                          {template.total_sections || 0} secciones
                        </p>
                        <p className="text-sm text-gray-400">
                          {template.total_questions || 0} preguntas
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <CardBody className="border-t border-gray-700">
                    <div className="mb-4">
                      <h4 className="font-semibold text-white mb-2">Descripcion</h4>
                      <p className="text-gray-400">{template.description || 'Sin descripcion'}</p>
                    </div>
                    
                    {sections.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-white mb-3">Secciones</h4>
                        <div className="space-y-2">
                          {sections.map(function(section) {
                            var questions = section.questions || [];
                            return (
                              <div key={section.id} className="p-3 bg-gray-800 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-white">
                                    {section.code} - {section.name}
                                  </span>
                                  <span className="text-sm text-gray-400">
                                    {questions.length} preguntas
                                  </span>
                                </div>
                                {questions.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {questions.slice(0, 3).map(function(q) {
                                      return (
                                        <div key={q.id} className="flex items-start gap-2 text-sm">
                                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                          <span className="text-gray-400">{q.text}</span>
                                        </div>
                                      );
                                    })}
                                    {questions.length > 3 && (
                                      <p className="text-sm text-gray-500 ml-6">
                                        ... y {questions.length - 3} preguntas mas
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardBody>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
