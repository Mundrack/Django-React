import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TrendChart = ({ data, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <YAxis 
          domain={[0, 100]} 
          tick={{ fill: '#6b7280', fontSize: 12 }}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip 
          formatter={(value) => [`${value.toFixed(1)}%`, 'Puntuación']}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke="#3b82f6" 
          strokeWidth={3}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 8 }}
          name="Puntuación"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;
