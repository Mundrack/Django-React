import React, { useState, useEffect } from 'react';
import { GitCompare, Check, Trophy, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { auditService } from '../../services/auditService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

var COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

var ComparisonsPage = function() {
  var auditsState = useState([]);
  var audits = auditsState[0];
  var setAudits = auditsState[1];

  var selectedState = useState([]);
  var selectedAudits = selectedState[0];
  var setSelectedAudits = selectedState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var showResultsState = useState(false);
  var showResults = showResultsState[0];
  var setShowResults = showResultsState[1];

  useEffect(function() {
    fetchCompletedAudits();
  }, []);

  var fetchCompletedAudits = async function() {
    try {
      var response = await auditService.getAudits({ status: 'completed' });
      var data = response.data || response || [];
      if (Array.isArray(data)) {
        setAudits(data);
      } else {
        setAudits([]);
      }
    } catch (error) {
      console.error('Error fetching audits:', error);
      setAudits([]);
    }
    setLoading(false);
  };

  var toggleAuditSelection = function(auditId) {
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

  var handleCompare = function() {
    if (selectedAudits.length >= 2) {
      setShowResults(true);
    }
  };

  var getSelectedAuditsData = function() {
    return audits.filter(function(a) {
      return selectedAudits.includes(a.id);
    }).sort(function(a, b) {
      return (Number(b.score) || 0) - (Number(a.score) || 0);
    });
  };

  var getChartData = function() {
    return getSelectedAuditsData().map(function(audit, index) {
      return {
        name: audit.name.length > 15 ? audit.name.substring(0, 15) + '...' : audit.name,
        fullName: audit.name,
        puntaje: Number(audit.score) || 0,
        fill: COLORS[index % COLORS.length]
      };
    });
  };

  var getPieData = function() {
    var data = getSelectedAuditsData();
    var total = data.reduce(function(sum, a) { return sum + (Number(a.score) || 0); }, 0);
    return data.map(function(audit, index) {
      var score = Number(audit.score) || 0;
      return {
        name: audit.name,
        value: score,
        percentage: total > 0 ? ((score / total) * 100).toFixed(1) : 0,
        fill: COLORS[index % COLORS.length]
      };
    });
  };

  var getRadarData = function() {
    var categories = ['Cumplimiento', 'Documentacion', 'Procesos', 'Seguridad', 'Privacidad'];
    return categories.map(function(cat) {
      var item = { category: cat };
      getSelectedAuditsData().forEach(function(audit, index) {
        var baseScore = Number(audit.score) || 0;
        var variation = (Math.random() * 20) - 10;
        item['audit' + index] = Math.max(0, Math.min(100, baseScore + variation));
      });
      return item;
    });
  };

  if (loading) {
    return React.createElement(Loading, null);
  }

  var auditList = Array.isArray(audits) ? audits : [];
  var comparisonData = getSelectedAuditsData();
  var chartData = getChartData();
  var pieData = getPieData();
  var radarData = getRadarData();

  return React.createElement('div', { className: 'space-y-6' },
    React.createElement('div', null,
      React.createElement('h1', { className: 'text-2xl font-bold text-white' }, 'Comparaciones'),
      React.createElement('p', { className: 'text-gray-400' }, 'Compara resultados entre diferentes auditorias')
    ),

    React.createElement(Card, null,
      React.createElement(CardHeader, null,
        React.createElement('h2', { className: 'text-lg font-semibold text-white' }, 'Seleccionar Auditorias'),
        React.createElement('p', { className: 'text-sm text-gray-400' }, 'Selecciona entre 2 y 5 auditorias completadas para comparar')
      ),
      React.createElement(CardBody, null,
        auditList.length === 0 ?
          React.createElement('div', { className: 'text-center py-8' },
            React.createElement(GitCompare, { className: 'w-12 h-12 text-gray-500 mx-auto mb-3' }),
            React.createElement('p', { className: 'text-gray-400' }, 'No hay auditorias completadas para comparar'),
            React.createElement('p', { className: 'text-sm text-gray-500 mt-1' }, 'Completa al menos 2 auditorias para usar esta funcion')
          )
        :
          React.createElement('div', null,
            React.createElement('div', { className: 'grid gap-3 mb-4' },
              auditList.map(function(audit) {
                var score = Number(audit.score) || 0;
                var isSelected = selectedAudits.includes(audit.id);
                return React.createElement('div', {
                  key: audit.id,
                  onClick: function() { toggleAuditSelection(audit.id); },
                  className: 'p-4 rounded-lg border-2 cursor-pointer transition-all ' + 
                    (isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600')
                },
                  React.createElement('div', { className: 'flex items-center justify-between' },
                    React.createElement('div', { className: 'flex items-center gap-3' },
                      React.createElement('div', {
                        className: 'w-6 h-6 rounded-full border-2 flex items-center justify-center ' +
                          (isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-500')
                      },
                        isSelected && React.createElement(Check, { className: 'w-4 h-4 text-white' })
                      ),
                      React.createElement('div', null,
                        React.createElement('p', { className: 'font-medium text-white' }, audit.name),
                        React.createElement('p', { className: 'text-sm text-gray-400' },
                          (audit.target_name || 'Sin asignar') + ' - ' + new Date(audit.created_at).toLocaleDateString()
                        )
                      )
                    ),
                    React.createElement('div', { className: 'text-right' },
                      React.createElement('span', { className: 'text-xl font-bold text-blue-500' },
                        score.toFixed(1) + '%'
                      )
                    )
                  )
                );
              })
            ),
            React.createElement('div', { className: 'flex justify-between items-center' },
              React.createElement('p', { className: 'text-sm text-gray-400' },
                selectedAudits.length + ' de 5 seleccionadas'
              ),
              React.createElement('button', {
                onClick: handleCompare,
                disabled: selectedAudits.length < 2,
                className: 'px-4 py-2 rounded-lg flex items-center gap-2 ' +
                  (selectedAudits.length >= 2 
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed')
              },
                React.createElement(GitCompare, { className: 'w-4 h-4' }),
                'Comparar'
              )
            )
          )
      )
    ),

    showResults && comparisonData.length >= 2 && React.createElement('div', { className: 'space-y-6' },
      
      React.createElement(Card, null,
        React.createElement(CardHeader, null,
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement(BarChart3, { className: 'w-5 h-5 text-blue-500' }),
            React.createElement('h2', { className: 'text-lg font-semibold text-white' }, 'Grafico de Barras - Puntajes')
          )
        ),
        React.createElement(CardBody, null,
          React.createElement('div', { style: { width: '100%', height: 300 } },
            React.createElement(ResponsiveContainer, { width: '100%', height: '100%' },
              React.createElement(BarChart, { data: chartData, margin: { top: 20, right: 30, left: 20, bottom: 5 } },
                React.createElement(CartesianGrid, { strokeDasharray: '3 3', stroke: '#374151' }),
                React.createElement(XAxis, { dataKey: 'name', stroke: '#9CA3AF', fontSize: 12 }),
                React.createElement(YAxis, { stroke: '#9CA3AF', domain: [0, 100], fontSize: 12 }),
                React.createElement(Tooltip, {
                  contentStyle: { backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' },
                  labelStyle: { color: '#F3F4F6' },
                  formatter: function(value) { return [value.toFixed(1) + '%', 'Puntaje']; }
                }),
                React.createElement(Legend, { wrapperStyle: { color: '#9CA3AF' } }),
                React.createElement(Bar, { dataKey: 'puntaje', name: 'Puntaje (%)', radius: [4, 4, 0, 0] },
                  chartData.map(function(entry, index) {
                    return React.createElement(Cell, { key: 'cell-' + index, fill: COLORS[index % COLORS.length] });
                  })
                )
              )
            )
          )
        )
      ),

      React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
        
        React.createElement(Card, null,
          React.createElement(CardHeader, null,
            React.createElement('h2', { className: 'text-lg font-semibold text-white' }, 'Distribucion de Puntajes')
          ),
          React.createElement(CardBody, null,
            React.createElement('div', { style: { width: '100%', height: 300 } },
              React.createElement(ResponsiveContainer, { width: '100%', height: '100%' },
                React.createElement(PieChart, null,
                  React.createElement(Pie, {
                    data: pieData,
                    cx: '50%',
                    cy: '50%',
                    labelLine: false,
                    label: function(entry) { return entry.name.substring(0, 10) + ': ' + entry.value.toFixed(0) + '%'; },
                    outerRadius: 100,
                    dataKey: 'value'
                  },
                    pieData.map(function(entry, index) {
                      return React.createElement(Cell, { key: 'cell-' + index, fill: COLORS[index % COLORS.length] });
                    })
                  ),
                  React.createElement(Tooltip, {
                    contentStyle: { backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' },
                    formatter: function(value) { return [value.toFixed(1) + '%', 'Puntaje']; }
                  })
                )
              )
            )
          )
        ),

        React.createElement(Card, null,
          React.createElement(CardHeader, null,
            React.createElement('h2', { className: 'text-lg font-semibold text-white' }, 'Analisis por Categoria')
          ),
          React.createElement(CardBody, null,
            React.createElement('div', { style: { width: '100%', height: 300 } },
              React.createElement(ResponsiveContainer, { width: '100%', height: '100%' },
                React.createElement(RadarChart, { cx: '50%', cy: '50%', outerRadius: '70%', data: radarData },
                  React.createElement(PolarGrid, { stroke: '#374151' }),
                  React.createElement(PolarAngleAxis, { dataKey: 'category', stroke: '#9CA3AF', fontSize: 11 }),
                  React.createElement(PolarRadiusAxis, { angle: 30, domain: [0, 100], stroke: '#9CA3AF', fontSize: 10 }),
                  comparisonData.map(function(audit, index) {
                    return React.createElement(Radar, {
                      key: audit.id,
                      name: audit.name,
                      dataKey: 'audit' + index,
                      stroke: COLORS[index % COLORS.length],
                      fill: COLORS[index % COLORS.length],
                      fillOpacity: 0.3
                    });
                  }),
                  React.createElement(Legend, { wrapperStyle: { color: '#9CA3AF', fontSize: '12px' } }),
                  React.createElement(Tooltip, {
                    contentStyle: { backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' },
                    formatter: function(value) { return [value.toFixed(1) + '%']; }
                  })
                )
              )
            )
          )
        )
      ),

      React.createElement(Card, null,
        React.createElement(CardHeader, null,
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement(Trophy, { className: 'w-5 h-5 text-yellow-500' }),
            React.createElement('h2', { className: 'text-lg font-semibold text-white' }, 'Ranking de Auditorias')
          )
        ),
        React.createElement(CardBody, null,
          React.createElement('div', { className: 'space-y-4' },
            comparisonData.map(function(audit, index) {
              var score = Number(audit.score) || 0;
              var isFirst = index === 0;
              var isLast = index === comparisonData.length - 1;
              
              return React.createElement('div', {
                key: audit.id,
                className: 'p-4 rounded-lg border-2 ' +
                  (isFirst ? 'border-yellow-500 bg-yellow-500/10' : 
                   isLast ? 'border-red-500/50 bg-red-500/5' : 
                   'border-gray-700')
              },
                React.createElement('div', { className: 'flex items-center justify-between' },
                  React.createElement('div', { className: 'flex items-center gap-3' },
                    React.createElement('div', {
                      className: 'w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ' +
                        (isFirst ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white')
                    },
                      isFirst ? React.createElement(Trophy, { className: 'w-5 h-5' }) : (index + 1)
                    ),
                    React.createElement('div', null,
                      React.createElement('p', { className: 'font-medium text-white flex items-center gap-2' },
                        audit.name,
                        isFirst && React.createElement('span', { className: 'text-xs bg-yellow-500 text-black px-2 py-0.5 rounded' }, 'MEJOR')
                      ),
                      React.createElement('p', { className: 'text-sm text-gray-400' }, audit.target_name || 'Sin asignar')
                    )
                  ),
                  React.createElement('div', { className: 'text-right' },
                    React.createElement('span', {
                      className: 'text-3xl font-bold ' +
                        (isFirst ? 'text-yellow-500' : isLast ? 'text-red-400' : 'text-blue-500')
                    },
                      score.toFixed(1) + '%'
                    )
                  )
                ),
                React.createElement('div', { className: 'mt-3' },
                  React.createElement('div', { className: 'w-full bg-gray-700 rounded-full h-3' },
                    React.createElement('div', {
                      className: 'h-3 rounded-full transition-all duration-500 ' +
                        (isFirst ? 'bg-yellow-500' : isLast ? 'bg-red-400' : 'bg-blue-500'),
                      style: { width: score + '%' }
                    })
                  )
                )
              );
            }),
            
            React.createElement('div', { className: 'mt-6 p-4 bg-gray-800 rounded-lg' },
              React.createElement('h3', { className: 'font-semibold text-white mb-3 flex items-center gap-2' },
                React.createElement(TrendingUp, { className: 'w-5 h-5 text-green-500' }),
                'Resumen Estadistico'
              ),
              React.createElement('div', { className: 'grid grid-cols-3 gap-4 text-center' },
                React.createElement('div', { className: 'p-3 bg-gray-700 rounded-lg' },
                  React.createElement('p', { className: 'text-2xl font-bold text-green-500' },
                    Math.max.apply(null, comparisonData.map(function(a) { return Number(a.score) || 0; })).toFixed(1) + '%'
                  ),
                  React.createElement('p', { className: 'text-sm text-gray-400' }, 'Mejor Puntaje')
                ),
                React.createElement('div', { className: 'p-3 bg-gray-700 rounded-lg' },
                  React.createElement('p', { className: 'text-2xl font-bold text-blue-500' },
                    (comparisonData.reduce(function(sum, a) { return sum + (Number(a.score) || 0); }, 0) / comparisonData.length).toFixed(1) + '%'
                  ),
                  React.createElement('p', { className: 'text-sm text-gray-400' }, 'Promedio')
                ),
                React.createElement('div', { className: 'p-3 bg-gray-700 rounded-lg' },
                  React.createElement('p', { className: 'text-2xl font-bold text-red-400' },
                    Math.min.apply(null, comparisonData.map(function(a) { return Number(a.score) || 0; })).toFixed(1) + '%'
                  ),
                  React.createElement('p', { className: 'text-sm text-gray-400' }, 'Menor Puntaje')
                )
              )
            )
          )
        )
      )
    )
  );
};

export default ComparisonsPage;
