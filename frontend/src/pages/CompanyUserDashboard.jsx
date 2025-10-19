import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FileText, LogOut } from 'lucide-react';

const CompanyUserDashboard = () => {
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
            <h1 className="text-2xl font-bold text-gray-900">Panel de Usuario</h1>
            <p className="text-sm text-gray-600">Bienvenido, {user?.full_name}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Auditorías Asignadas</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <FileText className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Mis Auditorías</h2>
          <p className="text-gray-600">No tienes auditorías asignadas en este momento.</p>
        </div>
      </main>
    </div>
  );
};

export default CompanyUserDashboard;