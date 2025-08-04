import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { wsService } from '../services/websocket';
import { LeadFilters, LeadGenerationProgress, SearchHistory, Lead } from '../types/leads';
import LeadFiltersComponent from '../components/LeadFilters';
import LeadProgressComponent from '../components/LeadProgress';
import SearchHistoryComponent from '../components/SearchHistory';
import toast from 'react-hot-toast';

const LeadGenerationPage: React.FC = () => {
  const { token } = useAuth();
  const [currentView, setCurrentView] = useState<'filters' | 'progress' | 'history'>('filters');
  const [progress, setProgress] = useState<LeadGenerationProgress>({
    total: 0,
    generated: 0,
    currentBatch: 0,
    estimatedTimeRemaining: 0,
    status: 'idle',
    leads: []
  });
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      wsService.connect(token);
    }
    
    // Carregar histórico simulado
    loadHistory();
    
    return () => {
      wsService.disconnect();
    };
  }, [token]);

  const loadHistory = () => {
    // Simular carregamento do histórico
    const mockHistory: SearchHistory[] = [
      {
        id: '1',
        filters: {
          niche: 'Tecnologia',
          city: 'São Paulo',
          country: 'Brasil',
          quantity: 500,
          fields: ['email', 'phone']
        },
        totalLeads: 487,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
        status: 'completed',
        downloadUrl: '/downloads/search-1.csv'
      },
      {
        id: '2',
        filters: {
          niche: 'Marketing Digital',
          city: 'Rio de Janeiro',
          country: 'Brasil',
          quantity: 200,
          fields: ['email', 'phone', 'website']
        },
        totalLeads: 198,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
        status: 'completed',
        downloadUrl: '/downloads/search-2.csv'
      }
    ];
    setHistory(mockHistory);
  };

  const handleGenerateLeads = async (filters: LeadFilters) => {
    setLoading(true);
    
    try {
      // Simular início da geração
      setProgress({
        total: filters.quantity,
        generated: 0,
        currentBatch: 0,
        estimatedTimeRemaining: Math.ceil(filters.quantity / 30) * 2, // 2 segundos por lote
        status: 'generating',
        leads: []
      });
      
      setCurrentView('progress');
      
      // Simular geração em tempo real
      simulateLeadGeneration(filters);
      
    } catch (error) {
      console.error('Erro ao iniciar geração:', error);
      toast.error('Erro ao iniciar geração de leads');
      setLoading(false);
    }
  };

  const simulateLeadGeneration = (filters: LeadFilters) => {
    const batchSize = 30;
    const totalBatches = Math.ceil(filters.quantity / batchSize);
    let currentBatch = 0;
    
    const interval = setInterval(() => {
      currentBatch++;
      
      // Gerar leads para este lote
      const newLeads: Lead[] = Array.from({ length: Math.min(batchSize, filters.quantity - (currentBatch - 1) * batchSize) }, (_, i) => ({
        id: `${Date.now()}-${currentBatch}-${i}`,
        name: `Lead ${(currentBatch - 1) * batchSize + i + 1}`,
        email: `lead${(currentBatch - 1) * batchSize + i + 1}@example.com`,
        phone: `+55 11 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        city: filters.city,
        country: filters.country,
        source: 'Generated',
        createdAt: new Date().toISOString()
      }));
      
      const generated = Math.min(currentBatch * batchSize, filters.quantity);
      const estimatedTimeRemaining = Math.max(0, (totalBatches - currentBatch) * 2);
      
      setProgress(prev => ({
        ...prev,
        generated,
        currentBatch,
        estimatedTimeRemaining,
        leads: [...prev.leads, ...newLeads]
      }));
      
      if (currentBatch >= totalBatches) {
        clearInterval(interval);
        setProgress(prev => ({
          ...prev,
          status: 'completed'
        }));
        setLoading(false);
        
        // Adicionar ao histórico
        const newSearch: SearchHistory = {
          id: Date.now().toString(),
          filters,
          totalLeads: generated,
          createdAt: new Date().toISOString(),
          status: 'completed',
          downloadUrl: `/downloads/search-${Date.now()}.csv`
        };
        
        setHistory(prev => [newSearch, ...prev]);
        toast.success(`Geração concluída! ${generated.toLocaleString()} leads gerados.`);
      }
    }, 2000); // 2 segundos por lote
  };

  const handleDownloadLast30 = () => {
    const last30Leads = progress.leads.slice(-30);
    downloadCSV(last30Leads, 'ultimos-30-leads');
    toast.success('Download dos últimos 30 leads iniciado');
  };

  const handleDownloadAll = () => {
    downloadCSV(progress.leads, `todos-${progress.total}-leads`);
    toast.success(`Download de ${progress.total.toLocaleString()} leads iniciado`);
  };

  const handleStopGeneration = () => {
    wsService.stopLeadGeneration();
    setProgress(prev => ({
      ...prev,
      status: 'idle'
    }));
    setLoading(false);
    toast('Geração interrompida', {
      icon: '⏹️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const handleRedownload = (searchId: string) => {
    const search = history.find(h => h.id === searchId);
    if (search) {
      toast.success(`Download da busca #${searchId.slice(-6)} iniciado`);
    }
  };

  const handleDeleteSearch = (searchId: string) => {
    setHistory(prev => prev.filter(h => h.id !== searchId));
    toast.success('Busca excluída com sucesso');
  };

  const downloadCSV = (leads: Lead[], filename: string) => {
    const headers = ['Nome', 'Email', 'Telefone', 'Cidade', 'País', 'Fonte'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        lead.name,
        lead.email,
        lead.phone,
        lead.city,
        lead.country,
        lead.source
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-poppins mb-2">
            Geração de Leads
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gere leads qualificados com filtros avançados e acompanhe o progresso em tempo real
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 mb-8 shadow-sm">
          <button
            onClick={() => setCurrentView('filters')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              currentView === 'filters'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Filtros
          </button>
          <button
            onClick={() => setCurrentView('progress')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              currentView === 'progress'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Progresso
          </button>
          <button
            onClick={() => setCurrentView('history')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              currentView === 'history'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Histórico
          </button>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {currentView === 'filters' && (
            <LeadFiltersComponent
              onGenerate={handleGenerateLeads}
              loading={loading}
            />
          )}
          
          {currentView === 'progress' && (
            <LeadProgressComponent
              progress={progress}
              onDownloadLast30={handleDownloadLast30}
              onDownloadAll={handleDownloadAll}
              onStop={handleStopGeneration}
            />
          )}
          
          {currentView === 'history' && (
            <SearchHistoryComponent
              history={history}
              onRedownload={handleRedownload}
              onDelete={handleDeleteSearch}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadGenerationPage; 