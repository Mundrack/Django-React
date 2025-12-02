import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AuditResults() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [audit, setAudit] = useState(null);
  const [template, setTemplate] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    try {
      const auditRes = await axios.get(`/audits/${id}/`);
      const templateRes = await axios.get(`/templates/${auditRes.data.template}/`);
      const responsesRes = await axios.get('/responses/', {
        params: { audit: id }
      });

      setAudit(auditRes.data);
      setTemplate(templateRes.data);
      setResponses(responsesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching results:', error);
      setLoading(false);
    }
  };

  const getSectionScores = () => {
    if (!template || !responses.length) return [];

    return template.sections.map(section => {
      const sectionQuestions = section.questions;
      let totalWeight = 0;
      let totalScore = 0;

      sectionQuestions.forEach(question => {
        const response = responses.find(r => r.question === question.id);
        totalWeight += question.weight;

        if (response) {
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
        }
      });

      const percentage = totalWeight > 0 ? ((totalScore / totalWeight) * 100).toFixed(1) : 0;

      return {
        name: section.name,
        score: parseFloat(percentage),
        totalQuestions: sectionQuestions.length
      };
    });
  };

  const getScoreDistribution = () => {
    const approved = audit?.score >= 70 ? audit.score : 0;
    const failed = audit?.score < 70 ? audit.score : 0;
    const remaining = 100 - (approved + failed);

    return [
      { name: 'Aprobado', value: approved, color: '#10B981' },
      { name: 'Reprobado', value: failed, color: '#EF4444' },
      { name: 'Restante', value: remaining, color: '#E5E7EB' }
    ];
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-blue-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Cargando resultados...</div>
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

  const sectionScores = getSectionScores();
  const scoreDistribution = getScoreDistribution();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resultados de Auditoría</h1>
              <p className="mt-1 text-sm text-gray-600">{audit.title}</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Card */}
        <div className={`${getScoreBgColor(audit.score)} rounded-xl shadow-sm border-2 ${
          audit.score >= 70 ? 'border-green-300' : 'border-red-300'
        } p-8 mb-8`}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Puntaje Final</h2>
            <div className={`text-7xl font-bold ${getScoreColor(audit.score)} mb-4`}>
              {audit.score}%
            </div>
            <p className="text-lg text-gray-700">
              {audit.score >= 90 ? '🎉 ¡Excelente!' :
               audit.score >= 70 ? '✓ Aprobado' :
               audit.score >= 50 ? '⚠️ Necesita Mejoras' :
               '✗ Reprobado'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Distribución del Puntaje</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.value > 0 ? `${entry.value.toFixed(1)}%` : ''}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Puntajes por Sección</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectionScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#3B82F6" name="Puntaje (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Detalle por Sección</h3>
          <div className="space-y-4">
            {sectionScores.map((section, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{section.name}</span>
                  <span className={`text-lg font-bold ${getScoreColor(section.score)}`}>
                    {section.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      section.score >= 70 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${section.score}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {section.totalQuestions} preguntas
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Volver al Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            📄 Imprimir Resultados
          </button>
        </div>
      </div>
    </div>
  );
}
