import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, organization, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-primary-600">
          {organization?.name || 'Sistema de Auditorías'}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <Bell size={20} />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{user?.full_name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.user_type === 'owner' ? 'Dueño' : 'Empleado'}</p>
          </div>
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-primary-600" />
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
