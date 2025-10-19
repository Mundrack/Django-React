import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building2, FileText, Users, LogOut } from 'lucide-react';

const SuperAdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel Super Admin</h1>
            <p className="text-sm text-gray-600">Bienvenido, {user?.full_name}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stat Cards */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Empresas</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Building2 className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Plantillas</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <FileText className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Users className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Acciones Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="btn btn-primary text-left p-4">
              <Building2 className="w-6 h-6 mb-2" />
              <p className="font-semibold">Gestionar Empresas</p>
              <p className="text-sm opacity-80">Crear y administrar empresas padre</p>
            </button>

            <button className="btn btn-primary text-left p-4">
              <FileText className="w-6 h-6 mb-2" />
              <p className="font-semibold">Plantillas de Auditoría</p>
              <p className="text-sm opacity-80">Crear y editar plantillas</p>
            </button>
          </div>
        </div>

        {/* Success Message */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">✅ Sistema funcionando correctamente</p>
          <p className="text-green-700 text-sm mt-1">
            Has iniciado sesión exitosamente como Super Administrador
          </p>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;