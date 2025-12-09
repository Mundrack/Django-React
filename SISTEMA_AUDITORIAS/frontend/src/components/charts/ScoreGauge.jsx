import React from 'react';
import { getScoreColor, getScoreBgColor } from '../../utils/constants';

const ScoreGauge = ({ score, size = 'md', showLabel = true }) => {
  const sizes = {
    sm: { container: 'w-24 h-24', text: 'text-xl', label: 'text-xs' },
    md: { container: 'w-36 h-36', text: 'text-3xl', label: 'text-sm' },
    lg: { container: 'w-48 h-48', text: 'text-4xl', label: 'text-base' },
  };

  const { container, text, label } = sizes[size];
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative ${container}`}>
      <svg className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        {/* Progress circle */}
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke={score >= 85 ? '#10b981' : score >= 70 ? '#3b82f6' : score >= 50 ? '#f59e0b' : '#ef4444'}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold ${text} ${getScoreColor(score)}`}>
          {score?.toFixed(0)}%
        </span>
        {showLabel && (
          <span className={`text-gray-500 ${label}`}>Puntuación</span>
        )}
      </div>
    </div>
  );
};

export default ScoreGauge;
