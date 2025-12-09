import React from 'react';
import { Loader2, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

// Loading Spinner
export const Loading = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-primary-600`} />
    </div>
  );
};

// Loading Page
export const LoadingPage = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <Loading size="lg" />
  </div>
);

// Card Component
export const Card = ({ children, className = '', onClick }) => (
  <div 
    className={`bg-white rounded-xl shadow-sm border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

// Badge Component
export const Badge = ({ children, variant = 'gray', className = '' }) => {
  const variants = {
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`
        ${variants[variant]} ${sizes[size]}
        font-medium rounded-lg transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

// Input Component
export const Input = ({ label, error, className = '', ...props }) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <input
      className={`
        w-full px-4 py-2 border rounded-lg outline-none transition-all
        ${error 
          ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
          : 'border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-500'
        }
      `}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// Select Component
export const Select = ({ label, error, options = [], className = '', ...props }) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <select
      className={`
        w-full px-4 py-2 border rounded-lg outline-none transition-all bg-white
        ${error 
          ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
          : 'border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-500'
        }
      `}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// Textarea Component
export const Textarea = ({ label, error, className = '', ...props }) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <textarea
      className={`
        w-full px-4 py-2 border rounded-lg outline-none transition-all resize-none
        ${error 
          ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
          : 'border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-500'
        }
      `}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// Alert Component
export const Alert = ({ type = 'info', title, children, className = '' }) => {
  const types = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: Info },
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: CheckCircle },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: AlertCircle },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: XCircle },
  };
  
  const { bg, border, text, icon: Icon } = types[type];
  
  return (
    <div className={`${bg} ${border} ${text} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <Icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          {title && <p className="font-medium">{title}</p>}
          {children && <p className="text-sm mt-1">{children}</p>}
        </div>
      </div>
    </div>
  );
};

// Modal Component
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizes[size]} p-6`}>
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

// Empty State Component
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-12">
    {Icon && <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />}
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {description && <p className="text-gray-500 mb-4">{description}</p>}
    {action}
  </div>
);

// Progress Bar Component
export const ProgressBar = ({ value, max = 100, color = 'primary', showLabel = true, size = 'md' }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const colors = {
    primary: 'bg-primary-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  return (
    <div>
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]} overflow-hidden`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-gray-600 mt-1">{percentage.toFixed(0)}%</p>
      )}
    </div>
  );
};

// Score Circle Component
export const ScoreCircle = ({ score, size = 'md', showLabel = true }) => {
  const sizes = {
    sm: { width: 60, stroke: 4, text: 'text-lg' },
    md: { width: 100, stroke: 6, text: 'text-2xl' },
    lg: { width: 140, stroke: 8, text: 'text-4xl' },
  };
  
  const { width, stroke, text } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const getColor = () => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };
  
  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={width} className="transform -rotate-90">
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className={`${text} font-bold -mt-${width / 2 + 10}`} style={{ marginTop: -width / 2 - 10, color: getColor() }}>
        {score.toFixed(0)}
      </span>
      {showLabel && (
        <span className="text-sm text-gray-500 mt-1">puntos</span>
      )}
    </div>
  );
};
