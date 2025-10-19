import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import CompanyAdminDashboard from './pages/CompanyAdminDashboard';
import CompanyUserDashboard from './pages/CompanyUserDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas - Super Admin */}
          <Route
            path="/super-admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas - Company Admin */}
          <Route
            path="/company-admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['company_admin']}>
                <CompanyAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas - Company User */}
          <Route
            path="/company-user/dashboard"
            element={
              <ProtectedRoute allowedRoles={['company_user']}>
                <CompanyUserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirigir a login por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;