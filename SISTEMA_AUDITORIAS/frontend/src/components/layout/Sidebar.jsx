import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Building2, ClipboardCheck, GitCompare, 
  Users, Settings, FolderTree, FileText
} from 'lucide-react';

const Sidebar = () => {
  const { isOwner, user } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['owner', 'manager', 'employee'] },
    { to: '/companies', icon: Building2, label: 'Empresas', roles: ['owner'] },
    { to: '/hierarchy', icon: FolderTree, label: 'Jerarquía', roles: ['owner', 'manager'] },
    { to: '/audits', icon: ClipboardCheck, label: 'Auditorías', roles: ['owner', 'manager', 'employee'] },
    { to: '/comparisons', icon: GitCompare, label: 'Comparaciones', roles: ['owner', 'manager'] },
    { to: '/users', icon: Users, label: 'Usuarios', roles: ['owner', 'manager'] },
    { to: '/templates', icon: FileText, label: 'Plantillas', roles: ['owner'] },
    { to: '/settings', icon: Settings, label: 'Configuración', roles: ['owner', 'manager', 'employee'] },
  ];

  const userRole = isOwner ? 'owner' : (user?.assignment?.role || 'employee');

  const filteredItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <ClipboardCheck className="text-white" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Auditorías</h2>
            <p className="text-xs text-gray-500">ISO 27701</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
