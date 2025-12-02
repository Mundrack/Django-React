import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../api/axios';

export default function CreateAudit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');

  const [formData, setFormData] = useState({
    title: '',
    template: templateId || '',
    company: '',
    iso_standard: '',
    status: 'pending'
  });

  const [templates, setTemplates] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (templateId) {
      const template = templates.find(t => t.id === parseInt(templateId));
      if (template) {
        setFormData(prev => ({
          ...prev,
          template: templateId,
          iso_standard: template.iso_standard
        }));
      }
    }
  }, [templateId, templates]);

  const fetchData = async () => {
    try {
      const [templatesRes, companiesRes] = await Promise.all([
        axios.get('/templates/'),
        axios.get('/companies/')
      ]);
      setTemplates(templatesRes.data);
      setCompanies(companiesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar los datos');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'template') {
      const template = templates.find(t => t.id === parseInt(value));
      if (template) {
        setFormData(prev => ({ ...prev, iso_standard: template.iso_standard }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/audits/', formData);
      navigate(`/audits/${response.data.id}/form`);
    } catch (error) {
      console.error('Error creating audit:', error);
      setError('Error al crear la auditoría. Por favor intente nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nueva Auditoría</h1>
              <p className="mt-1 text-sm text-gray-600">
                Crea una nueva auditoría seleccionando una plantilla y empresa
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Auditoría *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ej: Auditoría ISO 9001 - Q1 2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Plantilla */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plantilla *
              </label>
              <select
                name="template"
                value={formData.template}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona una plantilla</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.iso_standard})
                  </option>
                ))}
              </select>
            </div>

            {/* Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa *
              </label>
              <select
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona una empresa</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name} - {company.ruc}
                  </option>
                ))}
              </select>
            </div>

            {/* Estándar ISO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estándar ISO *
              </label>
              <input
                type="text"
                name="iso_standard"
                value={formData.iso_standard}
                onChange={handleChange}
                required
                placeholder="Ej: ISO 9001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado Inicial
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pendiente</option>
                <option value="in_progress">En Progreso</option>
              </select>
            </div>

            {/* Botones */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-300"
              >
                {loading ? 'Creando...' : 'Crear y Comenzar Auditoría'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
