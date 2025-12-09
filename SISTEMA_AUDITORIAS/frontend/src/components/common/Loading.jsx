import React from 'react';

export const Loading = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`${sizes[size]} border-primary-600 border-t-transparent rounded-full animate-spin ${className}`} />
  );
};

export const LoadingPage = ({ message = 'Cargando...' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loading size="lg" />
    <p className="mt-4 text-gray-600">{message}</p>
  </div>
);

export const LoadingOverlay = ({ message = 'Procesando...' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-xl p-8 flex flex-col items-center">
      <Loading size="lg" />
      <p className="mt-4 text-gray-700 font-medium">{message}</p>
    </div>
  </div>
);

export default Loading;
