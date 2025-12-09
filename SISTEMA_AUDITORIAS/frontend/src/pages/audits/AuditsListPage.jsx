import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Card, CardBody } from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import AuditCard from '../../components/audits/AuditCard';
import { auditService } from '../../services/auditService';

const AuditsListPage = () => {
  const navigate = useNavigate();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const response = await auditService.getAudits();
      const data = response.data || response || [];
      setAudits(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching audits:', error);
      setAudits([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAudits = (audits || []).filter(audit => {
    const matchesFilter = filter === 'all' || audit.status === filter;
    const matchesSearch = (audit.name || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Auditorias</h1>
          <p className="text-gray-400">Gestiona tus auditorias ISO 27701</p>
        </div>
        <button
          onClick={() => navigate('/audits/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Nueva Auditoria
        </button>
      </div>

      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar auditorias..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'draft', 'in_progress', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={'px-4 py-2 rounded-lg font-medium ' +
                    (filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600')
                  }
                >
                  {status === 'all' ? 'Todas' : 
                   status === 'draft' ? 'Borrador' :
                   status === 'in_progress' ? 'En Progreso' : 'Completadas'}
                </button>
              ))}
            </div>
          </div>

          {filteredAudits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No hay auditorias</p>
              <button
                onClick={() => navigate('/audits/new')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Crear primera auditoria
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAudits.map((audit) => (
                <AuditCard key={audit.id} audit={audit} />
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AuditsListPage;
