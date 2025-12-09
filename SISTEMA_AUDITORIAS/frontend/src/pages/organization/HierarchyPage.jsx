import React, { useState, useEffect } from 'react';
import { hierarchyService } from '../../services/hierarchyService';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { LoadingPage } from '../../components/common/Loading';
import { Building2, GitBranch, Users, ChevronDown, ChevronRight } from 'lucide-react';

const TreeNode = ({ item, level = 0, type }) => {
  const [expanded, setExpanded] = useState(level < 2);
  const icons = { company: Building2, branch: GitBranch, department: Users, team: Users, subteam: Users };
  const colors = { company: 'bg-blue-100 text-blue-600', branch: 'bg-green-100 text-green-600', department: 'bg-purple-100 text-purple-600', team: 'bg-orange-100 text-orange-600', subteam: 'bg-pink-100 text-pink-600' };
  const Icon = icons[type] || Building2;
  const children = item.branches || item.departments || item.teams || item.subteams || [];
  const hasChildren = children.length > 0;
  const childType = type === 'company' ? 'branch' : type === 'branch' ? 'department' : type === 'department' ? 'team' : 'subteam';

  return (
    <div>
      <div className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer" style={{ marginLeft: `${level * 24}px` }} onClick={() => hasChildren && setExpanded(!expanded)}>
        {hasChildren ? (expanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />) : <span className="w-4" />}
        <div className={`p-1.5 rounded ${colors[type]}`}><Icon size={16} /></div>
        <span className="font-medium text-gray-900">{item.name}</span>
        <span className="text-xs text-gray-400">({item.code})</span>
        {hasChildren && <span className="ml-auto text-xs text-gray-400">{children.length}</span>}
      </div>
      {expanded && hasChildren && children.map((child) => <TreeNode key={child.id} item={child} level={level + 1} type={childType} />)}
    </div>
  );
};

const HierarchyPage = () => {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [treeData, statsData] = await Promise.all([hierarchyService.getTree(), hierarchyService.getStats()]);
      setTree(treeData); setStats(statsData);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Jerarquía Organizacional</h1><p className="text-gray-500">Vista completa de la estructura</p></div>
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[{ label: 'Empresas', value: stats.companies_count, color: 'bg-blue-500' }, { label: 'Sucursales', value: stats.branches_count, color: 'bg-green-500' }, { label: 'Departamentos', value: stats.departments_count, color: 'bg-purple-500' }, { label: 'Equipos', value: stats.teams_count, color: 'bg-orange-500' }, { label: 'Sub-equipos', value: stats.subteams_count, color: 'bg-pink-500' }].map((stat) => (
            <Card key={stat.label}><CardBody className="text-center py-4"><div className={`w-3 h-3 rounded-full ${stat.color} mx-auto mb-2`} /><p className="text-2xl font-bold">{stat.value || 0}</p><p className="text-sm text-gray-500">{stat.label}</p></CardBody></Card>
          ))}
        </div>
      )}
      <Card><CardHeader><h2 className="text-lg font-semibold">Árbol de Organización</h2></CardHeader><CardBody>{tree?.companies?.length > 0 ? tree.companies.map((c) => <TreeNode key={c.id} item={c} type="company" />) : <p className="text-center text-gray-500 py-8">No hay empresas creadas</p>}</CardBody></Card>
    </div>
  );
};

export default HierarchyPage;
