import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building, FileText, LogOut } from 'lucide-react';

const CompanyAdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel Admin Empresarial</h1>
            <p className="text-sm text-gray-600">Bienvenido, {user?.full_name}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Empresas Hijas</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Building className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Auditorías</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <FileText className="w-12 h-12 text-green-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Acciones Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="btn btn-primary text-left p-4">
              <Building className="w-6 h-6 mb-2" />
              <p className="font-semibold">Gestionar Empresas Hijas</p>
              <p className="text-sm opacity-80">Crear y administrar filiales</p>
            </button>

            <button className="btn btn-primary text-left p-4">
              <FileText className="w-6 h-6 mb-2" />
              <p className="font-semibold">Mis Auditorías</p>
              <p className="text-sm opacity-80">Ver y crear auditorías</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyAdminDashboard;