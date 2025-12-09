import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AuditsListPage from './pages/audits/AuditsListPage';
import CreateAuditPage from './pages/audits/CreateAuditPage';
import AuditDetailPage from './pages/audits/AuditDetailPage';
import ExecuteAuditPage from './pages/audits/ExecuteAuditPage';
import TemplatesPage from './pages/audits/TemplatesPage';
import CompaniesPage from './pages/organization/CompaniesPage';
import HierarchyPage from './pages/organization/HierarchyPage';
import UsersPage from './pages/users/UsersPage';
import ComparisonsPage from './pages/comparisons/ComparisonsPage';
import SettingsPage from './pages/settings/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="audits" element={<AuditsListPage />} />
            <Route path="audits/new" element={<CreateAuditPage />} />
            <Route path="audits/:id" element={<AuditDetailPage />} />
            <Route path="audits/:id/execute" element={<ExecuteAuditPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="hierarchy" element={<HierarchyPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="comparisons" element={<ComparisonsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
