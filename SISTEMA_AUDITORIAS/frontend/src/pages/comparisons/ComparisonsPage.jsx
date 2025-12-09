import React, { useState, useEffect } from 'react';
import { GitCompare, Check, Trophy, Award } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { auditService } from '../../services/auditService';

const ComparisonsPage = () => {
  const [audits, setAudits] = useState([]);
  const [selectedAudits, setSelectedAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchCompletedAudits();
  }, []);

  const fetchCompletedAudits = async () => {
    try {
      const response = await auditService.getAudits({ status: 'completed' });
      const data = response.data || response || [];
      setAudits(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching audits:', error);
      setAudits([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuditSelection = (auditId) => {
    setSelectedAudits(function(prev) {
      if (prev.includes(auditId)) {
        return prev.filter(function(id) { return id !== auditId; });
      }
      if (prev.length >= 5) {
        return prev;
      }
      return prev.concat([auditId]);
    });
    setShowResults(false);
  };

  const handleCompare = () => {
    if (selectedAudits.length >= 2) {
      setShowResults(true);
    }
  };

  const getSelectedAuditsData = () => {
    return audits.filter(function(a) {
      return selectedAudits.includes(a.id);
    }).sort(function(a, b) {
      return (Number(b.score) || 0) - (Number(a.score) || 0);
    });
  };

  if (loading) return <Loading />;

  const auditList = Array.isArray(audits) ? audits : [];
  const comparisonData = getSelectedAuditsData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Comparaciones</h1>
        <p className="text-gray-400">Compara resultados entre diferentes auditorias</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Seleccionar Auditorias</h2>
          <p className="text-sm text-gray-400">Selecciona entre 2 y 5 auditorias completadas para comparar</p>
        </CardHeader>
        <CardBody>
          {auditList.length === 0 ? (
            <div className="text-center py-8">
              <GitCompare className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No hay auditorias completadas para comparar</p>
              <p className="text-sm text-gray-500 mt-1">Completa al menos 2 auditorias para usar esta funcion</p>
            </div>
          ) : (
            <div>
              <div className="grid gap-3 mb-4">
                {auditList.map(function(audit) {
                  var score = Number(audit.score) || 0;
                  var isSelected = selectedAudits.includes(audit.id);
                  return (
                    <div
                      key={audit.id}
                      onClick={function() { toggleAuditSelection(audit.id); }}
                      className={'p-4 rounded-lg border-2 cursor-pointer transition-all ' + 
                        (isSelected
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 hover:border-gray-600')
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={'w-6 h-6 rounded-full border-2 flex items-center justify-center ' +
                            (isSelected
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-500')
                          }>
                            {isSelected && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">{audit.name}</p>
                            <p className="text-sm text-gray-400">
                              {audit.target_name || 'Sin asignar'} - {new Date(audit.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-blue-500">
                            {score.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">
                  {selectedAudits.length} de 5 seleccionadas
                </p>
                <button 
                  onClick={handleCompare}
                  disabled={selectedAudits.length < 2}
                  className={'px-4 py-2 rounded-lg flex items-center gap-2 ' +
                    (selectedAudits.length >= 2 
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed')
                  }
                >
                  <GitCompare className="w-4 h-4" />
                  Comparar
                </button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {showResults && comparisonData.length >= 2 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-white">Resultados de la Comparacion</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {comparisonData.map(function(audit, index) {
                var score = Number(audit.score) || 0;
                var isFirst = index === 0;
                var isLast = index === comparisonData.length - 1;
                
                return (
                  <div
                    key={audit.id}
                    className={'p-4 rounded-lg border-2 ' +
                      (isFirst ? 'border-yellow-500 bg-yellow-500/10' : 
                       isLast ? 'border-red-500/50 bg-red-500/5' : 
                       'border-gray-700')
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={'w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ' +
                          (isFirst ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white')
                        }>
                          {isFirst ? <Trophy className="w-5 h-5" /> : (index + 1)}
                        </div>
                        <div>
                          <p className="font-medium text-white flex items-center gap-2">
                            {audit.name}
                            {isFirst && <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded">MEJOR</span>}
                          </p>
                          <p className="text-sm text-gray-400">{audit.target_name || 'Sin asignar'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={'text-3xl font-bold ' +
                          (isFirst ? 'text-yellow-500' : isLast ? 'text-red-400' : 'text-blue-500')
                        }>
                          {score.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className={'h-3 rounded-full ' +
                            (isFirst ? 'bg-yellow-500' : isLast ? 'bg-red-400' : 'bg-blue-500')
                          }
                          style={{ width: score + '%' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-white mb-3">Resumen</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-500">
                      {Math.max.apply(null, comparisonData.map(function(a) { return Number(a.score) || 0; })).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-400">Mejor Puntaje</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-500">
                      {(comparisonData.reduce(function(sum, a) { return sum + (Number(a.score) || 0); }, 0) / comparisonData.length).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-400">Promedio</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-400">
                      {Math.min.apply(null, comparisonData.map(function(a) { return Number(a.score) || 0; })).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-400">Menor Puntaje</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ComparisonsPage;
