import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { hierarchyService } from '../../services/hierarchyService';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { LoadingPage } from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import { Users, UserPlus, Mail, Clock, Check, X } from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [hierarchy, setHierarchy] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ to_email: '', role: 'employee', level_type: 'company', level_id: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [usersRes, invitationsRes, hierarchyRes] = await Promise.all([
        userService.getUsers(), userService.getInvitations(), hierarchyService.getTree()
      ]);
      setUsers(usersRes.results || usersRes);
      setInvitations((invitationsRes.results || invitationsRes).filter(i => i.status === 'pending'));
      setHierarchy(hierarchyRes);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const getLevelOptions = () => {
    if (!hierarchy) return [];
    const options = [];
    if (formData.level_type === 'company') hierarchy.companies?.forEach(c => options.push({ value: c.id, label: c.name }));
    else if (formData.level_type === 'branch') hierarchy.companies?.forEach(c => c.branches?.forEach(b => options.push({ value: b.id, label: `${c.name} > ${b.name}` })));
    return options;
  };

  const handleInvite = async () => {
    setSaving(true);
    try {
      const data = { to_email: formData.to_email, role: formData.role };
      data[formData.level_type] = formData.level_id;
      await userService.createInvitation(data);
      setShowModal(false);
      setFormData({ to_email: '', role: 'employee', level_type: 'company', level_id: '' });
      loadData();
    } catch (err) { alert('Error al enviar invitación'); } finally { setSaving(false); }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">Usuarios</h1><p className="text-gray-500">Gestiona el equipo de tu organización</p></div>
        <Button icon={UserPlus} onClick={() => setShowModal(true)}>Invitar Usuario</Button>
      </div>

      {invitations.length > 0 && (
        <Card>
          <CardHeader><h2 className="text-lg font-semibold flex items-center gap-2"><Clock size={20} /> Invitaciones Pendientes ({invitations.length})</h2></CardHeader>
          <CardBody>
            <div className="divide-y">
              {invitations.map((inv) => (
                <div key={inv.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-400" size={20} />
                    <div><p className="font-medium">{inv.to_email}</p><p className="text-sm text-gray-500">{inv.level_name} • {inv.role}</p></div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pendiente</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader><h2 className="text-lg font-semibold flex items-center gap-2"><Users size={20} /> Miembros del Equipo ({users.length})</h2></CardHeader>
        <CardBody>
          {users.length === 0 ? <p className="text-center text-gray-500 py-8">No hay usuarios asignados</p> : (
            <div className="divide-y">
              {users.map((assignment) => (
                <div key={assignment.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"><span className="text-primary-600 font-medium">{assignment.user_name?.charAt(0)}</span></div>
                    <div><p className="font-medium">{assignment.user_name}</p><p className="text-sm text-gray-500">{assignment.user_email}</p></div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium capitalize">{assignment.role === 'manager' ? 'Gerente' : 'Empleado'}</p>
                    <p className="text-xs text-gray-500">{assignment.level_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Invitar Usuario">
        <div className="space-y-4">
          <Input label="Email" type="email" value={formData.to_email} onChange={(e) => setFormData({...formData, to_email: e.target.value})} placeholder="correo@ejemplo.com" required />
          <Select label="Rol" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} options={[{ value: 'employee', label: 'Empleado' }, { value: 'manager', label: 'Gerente' }]} />
          <Select label="Tipo de nivel" value={formData.level_type} onChange={(e) => setFormData({...formData, level_type: e.target.value, level_id: ''})} options={[{ value: 'company', label: 'Empresa' }, { value: 'branch', label: 'Sucursal' }]} />
          <Select label="Asignar a" value={formData.level_id} onChange={(e) => setFormData({...formData, level_id: e.target.value})} options={[{ value: '', label: 'Seleccionar...' }, ...getLevelOptions()]} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleInvite} loading={saving} disabled={!formData.to_email || !formData.level_id}>Enviar Invitación</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
