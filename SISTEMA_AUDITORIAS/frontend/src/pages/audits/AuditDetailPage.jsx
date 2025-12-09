import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auditService } from '../../services/auditService';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { LoadingPage } from '../../components/common/Loading';
import { StatusBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ScoreGauge from '../../components/charts/ScoreGauge';
import SectionChart from '../../components/charts/SectionChart';
import { ArrowLeft, Play, CheckCircle, FileText, AlertTriangle } from 'lucide-react';
import { getScoreColor } from '../../utils/constants';

const AuditDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudit();
  }, [id]);

  const loadAudit = async () => {
    try {
      const auditData = await auditService.getAudit(id);
      setAudit(auditData);
      
      if (auditData.status === 'completed') {
        const resultsData = await auditService.getResults(id);
        setResults(resultsData);
      }
    } catch (err) {
      console.error('Error loading audit:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    try {
      await auditService.startAudit(id);
      navigate(`/audits/${id}/execute`);
    } catch (err) {
      console.error('Error starting audit:', err);
    }
  };

  if (loading) return <LoadingPage />;
  if (!audit) return <div>Auditoría no encontrada</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/audits')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{audit.name}</h1>
              <StatusBadge status={audit.status} />
            </div>
            <p className="text-gray-500">{audit.code} • {audit.level_name}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          {audit.status === 'draft' && (
            <Button onClick={handleStart} icon={Play}>
              Iniciar Auditoría
            </Button>
          )}
          {audit.status === 'in_progress' && (
            <Button onClick={() => navigate(`/audits/${id}/execute`)} icon={Play}>
              Continuar
            </Button>
          )}
          {audit.status === 'completed' && (
            <Button variant="outline" icon={FileText}>
              Exportar PDF
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Progreso</span>
            <span className="font-medium">{audit.answered_questions} / {audit.total_questions} preguntas</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-600 rounded-full transition-all"
              style={{ width: `${audit.progress_percentage}%` }}
            />
          </div>
        </CardBody>
      </Card>

      {/* Results for completed audits */}
      {audit.status === 'completed' && results && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Gauge */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Puntuación General</h2>
              </CardHeader>
              <CardBody className="flex justify-center py-8">
                <ScoreGauge score={results.overall_score} size="lg" />
              </CardBody>
            </Card>

            {/* Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <h2 className="text-lg font-semibold">Resumen</h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Respuestas Sí</p>
                    <p className="text-2xl font-bold text-green-600">{results.answers_summary?.yes || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Respuestas No</p>
                    <p className="text-2xl font-bold text-red-600">{results.answers_summary?.no || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Promedio Escala</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {results.answers_summary?.scale_avg?.toFixed(1) || 0}/5
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Recomendaciones</p>
                    <p className="text-2xl font-bold text-orange-600">{results.recommendations?.length || 0}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Section Chart */}
          {results.sections_scores && results.sections_scores.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Puntuación por Sección</h2>
              </CardHeader>
              <CardBody>
                <SectionChart data={results.sections_scores} height={350} />
              </CardBody>
            </Card>
          )}

          {/* Recommendations */}
          {results.recommendations && results.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="text-orange-500" size={20} />
                  Recomendaciones ({results.recommendations.length})
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {results.recommendations.map((rec) => (
                    <div key={rec.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{rec.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{rec.description}</p>
                          <p className="text-sm text-primary-600 mt-2">{rec.action_required}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          rec.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AuditDetailPage;
