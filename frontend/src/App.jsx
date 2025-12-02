import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import AuditTemplates from './pages/AuditTemplates';
import CreateAudit from './pages/CreateAudit';
import AuditForm from './pages/AuditForm';
import AuditResults from './pages/AuditResults';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/users" element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          } />

          <Route path="/templates" element={
            <PrivateRoute>
              <AuditTemplates />
            </PrivateRoute>
          } />

          <Route path="/audits/create" element={
            <PrivateRoute>
              <CreateAudit />
            </PrivateRoute>
          } />

          <Route path="/audits/:id/form" element={
            <PrivateRoute>
              <AuditForm />
            </PrivateRoute>
          } />

          <Route path="/audits/:id/results" element={
            <PrivateRoute>
              <AuditResults />
            </PrivateRoute>
          } />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
