import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Building2, CheckCircle, Clock, FileEdit } from 'lucide-react';
import { Card, CardBody } from '../common/Card';
import { StatusBadge } from '../common/Badge';

const AuditCard = ({ audit }) => {
  const navigate = useNavigate();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <FileEdit className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleClick = () => {
    if (audit.status === 'in_progress') {
      navigate('/audits/' + audit.id + '/execute');
    } else {
      navigate('/audits/' + audit.id);
    }
  };

  const score = Number(audit.score) || 0;
  const progress = Number(audit.progress) || 0;

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <CardBody>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon(audit.status)}
            <StatusBadge status={audit.status} />
          </div>
          {audit.status === 'completed' && (
            <div className="text-right">
              <span className="text-2xl font-bold text-primary-600">
                {score.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-lg mb-1 text-white">{audit.name}</h3>
        
        <p className="text-sm text-gray-400 mb-3">
          {audit.template_name || 'ISO 27701'}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Building2 className="w-4 h-4" />
            <span>{audit.target_name || 'Sin asignar'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(audit.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {audit.status !== 'completed' && (
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progreso</span>
              <span className="text-white">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: progress + '%' }}
              />
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default AuditCard;