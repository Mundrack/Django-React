export const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  reviewed: 'bg-purple-100 text-purple-800',
};

export const STATUS_LABELS = {
  draft: 'Borrador',
  in_progress: 'En Progreso',
  completed: 'Completada',
  reviewed: 'Revisada',
};

export const PRIORITY_COLORS = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

export const PRIORITY_LABELS = {
  critical: 'Crítico',
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo',
};

export const ROLE_LABELS = {
  owner: 'Dueño',
  manager: 'Gerente',
  employee: 'Empleado',
};

export const LEVEL_LABELS = {
  company: 'Empresa',
  branch: 'Sucursal',
  department: 'Departamento',
  team: 'Equipo',
  subteam: 'Sub-equipo',
};

export const getScoreColor = (score) => {
  if (score >= 85) return 'text-green-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

export const getScoreBgColor = (score) => {
  if (score >= 85) return 'bg-green-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};
