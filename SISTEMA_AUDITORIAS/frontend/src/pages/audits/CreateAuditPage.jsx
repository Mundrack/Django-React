import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auditService } from '../../services/auditService';
import { hierarchyService } from '../../services/hierarchyService';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { LoadingPage } from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Input, { Select, Textarea } from '../../components/common/Input';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const CreateAuditPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [hierarchy, setHierarchy] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template_id: '',
    level_type: 'company',
    level_id: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesRes, hierarchyRes] = await Promise.all([
        auditService.getTemplates(),
        hierarchyService.getTree(),
      ]);
      setTemplates(templatesRes.results || templatesRes);
      setHierarchy(hierarchyRes);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getLevelOptions = () => {
    if (!hierarchy) return [];
    
    const options = [];
    const { level_type } = formData;
    
    if (level_type === 'company') {
      hierarchy.companies?.forEach(c => options.push({ value: c.id, label: c.name }));
    } else if (level_type === 'branch') {
      hierarchy.companies?.forEach(c => 
        c.branches?.forEach(b => options.push({ value: b.id, label: `${c.name} > ${b.name}` }))
      );
    } else if (level_type === 'department') {
      hierarchy.companies?.forEach(c => 
        c.branches?.forEach(b => 
          b.departments?.forEach(d => options.push({ value: d.id, label: `${b.name} > ${d.name}` }))
        )
      );
    }
    
    return options;
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const audit = await auditService.createAudit(formData);
      navigate(`/audits/${audit.id}`);
    } catch (err) {
      console.error('Error creating audit:', err);
      alert('Error al crear la auditoría');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/audits')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Auditoría</h1>
          <p className="text-gray-500">Paso {step} de 3</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-primary-600' : 'bg-gray-200'}`} />
        ))}
      </div>

      <Card>
        <CardBody className="space-y-6">
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold">Seleccionar Plantilla</h2>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setFormData({ ...formData, template_id: template.id })}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.template_id === template.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-500">{template.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {template.total_sections} secciones • {template.total_questions} preguntas
                        </p>
                      </div>
                      {formData.template_id === template.id && (
                        <Check className="text-primary-600" size={24} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-lg font-semibold">Nivel de la Auditoría</h2>
              <Select
                label="Tipo de nivel"
                name="level_type"
                value={formData.level_type}
                onChange={handleChange}
                options={[
                  { value: 'company', label: 'Empresa' },
                  { value: 'branch', label: 'Sucursal' },
                  { value: 'department', label: 'Departamento' },
                ]}
              />
              <Select
                label="Seleccionar"
                name="level_id"
                value={formData.level_id}
                onChange={handleChange}
                options={[{ value: '', label: 'Seleccionar...' }, ...getLevelOptions()]}
              />
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-lg font-semibold">Detalles de la Auditoría</h2>
              <Input
                label="Nombre de la auditoría"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Auditoría Q4 2025"
                required
              />
              <Textarea
                label="Descripción (opcional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Fecha inicio"
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                />
                <Input
                  label="Fecha fin"
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button variant="secondary" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={20} /> Anterior
              </Button>
            ) : <div />}
            
            {step < 3 ? (
              <Button 
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !formData.template_id || step === 2 && !formData.level_id}
              >
                Siguiente <ArrowRight size={20} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} loading={saving} disabled={!formData.name}>
                Crear Auditoría
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateAuditPage;
