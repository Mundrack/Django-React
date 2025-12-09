import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hierarchyService } from '../../services/hierarchyService';
import { Card, CardBody } from '../../components/common/Card';
import { LoadingPage } from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Textarea } from '../../components/common/Input';
import { Building2, Plus, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';

const CompaniesPage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', description: '', address: '', phone: '', email: '' });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const result = await hierarchyService.getCompanies();
      setCompanies(result.results || result);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await hierarchyService.createCompany(formData);
      setShowModal(false);
      setFormData({ name: '', code: '', description: '', address: '', phone: '', email: '' });
      loadCompanies();
    } catch (err) {
      alert('Error al crear empresa');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empresas</h1>
          <p className="text-gray-500">Gestiona las empresas de tu organización</p>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>Nueva Empresa</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
          <Card key={company.id} onClick={() => navigate(`/companies/${company.id}`)} className="hover:shadow-lg cursor-pointer">
            <CardBody>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <Building2 className="text-primary-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{company.name}</h3>
                  <p className="text-sm text-gray-500">{company.code}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">{company.branches_count || 0} sucursales</span>
                    <ChevronRight className="text-gray-400" size={20} />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nueva Empresa">
        <div className="space-y-4">
          <Input label="Nombre" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <Input label="Código" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="EMP-001" required />
          <Textarea label="Descripción" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <Input label="Dirección" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <div className="flex gap-4">
            <Input label="Teléfono" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="flex-1" />
            <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="flex-1" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleCreate} loading={saving} disabled={!formData.name || !formData.code}>Crear</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompaniesPage;
