import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function AuditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [audit, setAudit] = useState(null);
  const [template, setTemplate] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAuditData();
  }, [id]);

  const fetchAuditData = async () => {
    try {
      const auditRes = await axios.get(`/audits/${id}/`);
      const templateRes = await axios.get(`/templates/${auditRes.data.template}/`);
      
      setAudit(auditRes.data);
      setTemplate(templateRes.data);

      // Inicializar respuestas vacías
      const initialResponses = {};
      templateRes.data.sections.forEach(section => {
        section.questions.forEach(question => {
          initialResponses[question.id] = {
            question: question.id,
            answer_type: question.answer_type,
            answer_value: '',
            answer_text: '',
            answer_score: null
          };
        });
      });
      setResponses(initialResponses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching audit data:', error);
      setError('Error al cargar la auditoría');
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId, field, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value
      }
    }));
  };

  const calculateScore = () => {
    let totalWeight = 0;
    let totalScore = 0;

    template.sections.forEach(section => {
      section.questions.forEach(question => {
        const response = responses[question.id];
        totalWeight += question.weight;

        if (response.answer_type === 'yes_no_partial') {
          if (response.answer_value === 'yes') {
            totalScore += question.weight;
          } else if (response.answer_value === 'partial') {
            totalScore += question.weight * 0.5;
          }
        } else if (response.answer_type === 'scale_1_5') {
          const score = parseInt(response.answer_value) || 0;
          totalScore += (score / 5) * question.weight;
        }
      });
    });

    return totalWeight > 0 ? ((totalScore / totalWeight) * 100).toFixed(2) : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const score = calculateScore();

      // Enviar respuestas
      const responsePromises = Object.values(responses).map(response =>
        axios.post('/responses/', {
          audit: parseInt(id),
          ...response
        })
      );

      await Promise.all(responsePromises);

      // Actualizar auditoría con puntaje y estado completado
      await axios.patch(`/audits/${id}/`, {
        score: parseFloat(score),
        status: 'completed'
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/audits/${id}/results`);
      }, 2000);
    } catch (error) {
      console.error('Error submitting audit:', error);
      setError('Error al enviar las respuestas. Por favor intente nuevamente.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Cargando auditoría...</div>
      </div>
    );
  }

  if (!audit || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: Auditoría no encontrada</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{audit.title}</h1>
              <p className="mt-1 text-sm text-gray-600">
                {template.name} - {audit.iso_standard}
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            ✓ Auditoría enviada exitosamente. Redirigiendo a resultados...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {template.sections.map((section, sectionIndex) => (
            <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {sectionIndex + 1}. {section.name}
                </h2>
              </div>

              <div className="space-y-6">
                {section.questions.map((question, questionIndex) => (
                  <div key={question.id} className="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      {sectionIndex + 1}.{questionIndex + 1}. {question.question_text}
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    {question.answer_type === 'yes_no_partial' && (
                      <div className="flex space-x-4">
                        {['yes', 'no', 'partial'].map(option => (
                          <label key={option} className="flex items-center">
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option}
                              checked={responses[question.id]?.answer_value === option}
                              onChange={(e) => handleResponseChange(question.id, 'answer_value', e.target.value)}
                              required
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {option === 'yes' ? 'Sí' : option === 'no' ? 'No' : 'Parcial'}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {question.answer_type === 'scale_1_5' && (
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map(num => (
                          <label key={num} className="flex flex-col items-center">
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={num}
                              checked={responses[question.id]?.answer_value === String(num)}
                              onChange={(e) => handleResponseChange(question.id, 'answer_value', e.target.value)}
                              required
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="mt-1 text-sm text-gray-700">{num}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {question.answer_type === 'text' && (
                      <textarea
                        value={responses[question.id]?.answer_text || ''}
                        onChange={(e) => handleResponseChange(question.id, 'answer_text', e.target.value)}
                        required
                        rows={4}
                        placeholder="Escribe tu respuesta aquí..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}

                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        Peso: {question.weight}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Botones */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-300"
              >
                {submitting ? 'Enviando...' : 'Enviar Auditoría'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
