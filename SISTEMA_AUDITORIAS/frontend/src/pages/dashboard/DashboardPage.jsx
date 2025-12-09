import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auditService } from '../../services/auditService';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { LoadingPage } from '../../components/common/Loading';
import AuditCard from '../../components/audits/AuditCard';
import TrendChart from '../../components/charts/TrendChart';
import { Building2, ClipboardCheck, Users, CheckCircle2, Clock, FileText, Plus, TrendingUp } from 'lucide-react';
import Button from '../../components/common/Button';

const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
  <Card>
    <CardBody className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
      </div>
    </CardBody>
  </Card>
);

const DashboardPage = () => {
  const { user, organization, isOwner } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const result = await auditService.getDashboard();
      setData(result);
    } catch (err) {
      setError('Error al cargar el dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;

  const stats = data?.audit_stats || {};
  const hierarchy = data?.hierarchy_stats || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenido, {user?.full_name}
          </h1>
          <p className="text-gray-500">
            {organization?.name || 'Sistema de Auditorías ISO 27701'}
          </p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/audits/new')}>
          Nueva Auditoría
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={ClipboardCheck} 
          label="Total Auditorías" 
          value={stats.total_audits || 0}
          color="bg-primary-600"
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Completadas" 
          value={stats.completed_audits || 0}
          color="bg-green-600"
        />
        <StatCard 
          icon={Clock} 
          label="En Progreso" 
          value={stats.in_progress_audits || 0}
          color="bg-yellow-600"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Promedio Score" 
          value={`${stats.average_score?.toFixed(1) || 0}%`}
          color="bg-blue-600"
        />
      </div>

      {/* Owner: Hierarchy Stats */}
      {isOwner && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={Building2} label="Empresas" value={hierarchy.companies_count || 0} color="bg-indigo-600" />
          <StatCard icon={Building2} label="Sucursales" value={hierarchy.branches_count || 0} color="bg-purple-600" />
          <StatCard icon={Users} label="Departamentos" value={hierarchy.departments_count || 0} color="bg-pink-600" />
          <StatCard icon={Users} label="Equipos" value={hierarchy.teams_count || 0} color="bg-rose-600" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        {stats.score_trend && stats.score_trend.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Tendencia de Puntuaciones</h2>
            </CardHeader>
            <CardBody>
              <TrendChart data={stats.score_trend} height={250} />
            </CardBody>
          </Card>
        )}

        {/* Companies Scores (Owner) */}
        {isOwner && data?.companies_scores && data.companies_scores.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Puntuación por Empresa</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {data.companies_scores.map((company) => (
                  <div key={company.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{company.name}</p>
                      <p className="text-sm text-gray-500">{company.audits_count} auditorías</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        company.average_score >= 70 ? 'text-green-600' : 
                        company.average_score >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {company.average_score.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Recent Audits */}
      {stats.recent_audits && stats.recent_audits.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Auditorías Recientes</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/audits')}>
              Ver todas
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recent_audits.slice(0, 3).map((audit) => (
              <AuditCard key={audit.id} audit={audit} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
