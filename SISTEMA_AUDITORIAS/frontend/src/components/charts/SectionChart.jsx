import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const getBarColor = (percentage) => {
  if (percentage >= 85) return '#10b981';
  if (percentage >= 70) return '#3b82f6';
  if (percentage >= 50) return '#f59e0b';
  return '#ef4444';
};

const SectionChart = ({ data, height = 300 }) => {
  const chartData = data.map(section => ({
    name: section.section_code || section.section_name?.substring(0, 15),
    fullName: section.section_name,
    score: section.percentage,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#6b7280', fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          domain={[0, 100]} 
          tick={{ fill: '#6b7280', fontSize: 12 }}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip 
          formatter={(value) => [`${value.toFixed(1)}%`, 'Puntuación']}
          labelFormatter={(label, payload) => payload[0]?.payload?.fullName || label}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SectionChart;
