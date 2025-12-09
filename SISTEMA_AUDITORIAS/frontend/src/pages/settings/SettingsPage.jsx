import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { User, Building2, Lock, Save, Check } from 'lucide-react';

const SettingsPage = () => {
  const { user, organization, isOwner, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({ full_name: user?.full_name || '' });
  const [passwords, setPasswords] = useState({ old_password: '', new_password: '', confirm_password: '' });

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      await authService.updateProfile(profile);
      await refreshUser();
      setMessage('Perfil actualizado');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { alert('Error al actualizar'); } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (passwords.new_password !== passwords.confirm_password) return alert('Las contraseñas no coinciden');
    setSaving(true);
    try {
      await authService.changePassword(passwords);
      setPasswords({ old_password: '', new_password: '', confirm_password: '' });
      setMessage('Contraseña actualizada');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { alert('Error al cambiar contraseña'); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Configuración</h1><p className="text-gray-500">Administra tu cuenta y preferencias</p></div>

      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <Check className="text-green-500" size={20} /><span className="text-green-700">{message}</span>
        </div>
      )}

      <Card>
        <CardHeader><h2 className="text-lg font-semibold flex items-center gap-2"><User size={20} /> Perfil</h2></CardHeader>
        <CardBody className="space-y-4">
          <Input label="Nombre completo" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
          <Input label="Email" value={user?.email || ''} disabled />
          <Input label="Tipo de usuario" value={user?.user_type === 'owner' ? 'Dueño' : 'Empleado'} disabled />
          <Button onClick={handleUpdateProfile} loading={saving} icon={Save}>Guardar Cambios</Button>
        </CardBody>
      </Card>

      {isOwner && organization && (
        <Card>
          <CardHeader><h2 className="text-lg font-semibold flex items-center gap-2"><Building2 size={20} /> Organización</h2></CardHeader>
          <CardBody className="space-y-4">
            <Input label="Nombre de la organización" value={organization.name} disabled />
            <p className="text-sm text-gray-500">Para cambiar el nombre de la organización, contacta al soporte.</p>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader><h2 className="text-lg font-semibold flex items-center gap-2"><Lock size={20} /> Cambiar Contraseña</h2></CardHeader>
        <CardBody className="space-y-4">
          <Input label="Contraseña actual" type="password" value={passwords.old_password} onChange={(e) => setPasswords({ ...passwords, old_password: e.target.value })} />
          <Input label="Nueva contraseña" type="password" value={passwords.new_password} onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })} />
          <Input label="Confirmar contraseña" type="password" value={passwords.confirm_password} onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })} />
          <Button onClick={handleChangePassword} loading={saving} disabled={!passwords.old_password || !passwords.new_password}>Cambiar Contraseña</Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsPage;
