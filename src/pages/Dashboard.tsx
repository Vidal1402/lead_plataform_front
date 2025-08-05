import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { leadsApi } from '../services/api';
import { 
  Users, 
  Download, 
  CreditCard, 
  TrendingUp, 
  BarChart3,
  Calendar,
  MapPin,
  Filter
} from 'lucide-react';
import { LeadStats, SearchHistory } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('🔄 Carregando dados do dashboard...');
        
        // Por enquanto, carregar apenas stats (history está com problema no backend)
        const statsResponse = await leadsApi.getLeadStats();
        
        // Tentar carregar history, mas não falhar se der erro
        let historyResponse = null;
        try {
          historyResponse = await leadsApi.getSearchHistory();
        } catch (historyError) {
          console.log('⚠️ Erro ao carregar histórico (ignorando):', historyError);
        }

        console.log('✅ Dados carregados com sucesso');
        
        // Corrigir estrutura de dados do stats
        if (statsResponse.data.success && statsResponse.data.data) {
          const statsData = statsResponse.data.data.geral;
          
          setStats({
            totalLeads: statsData.totalLeads,
            avgScore: statsData.avgScore,
            avgAge: statsData.avgAge,
            topNichos: statsResponse.data.data.porNicho || []
          });
        }
        
        // Corrigir estrutura de dados do history
        if (historyResponse && historyResponse.data.success && historyResponse.data.data) {
          setHistory(historyResponse.data.data.history || []);
        } else {
          setHistory([]);
        }
      } catch (error: any) {
        console.error('Erro ao carregar dados do dashboard:', error);
        
        // Se for erro 401, redirecionar para login
        if (error.response?.status === 401) {
          console.log('Token expirado, redirecionando para login...');
          window.location.href = '/login';
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bem-vindo de volta, {user?.name}!
          </p>
        </div>
        <Link
          to="/lead-generation"
          className="btn-primary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Gerar Leads</span>
        </Link>
      </div>

      {/* Aviso para usuários sem leads */}
      {stats?.totalLeads === 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Bem-vindo ao seu Dashboard!
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>
                  Você ainda não tem leads gerados. Comece gerando seus primeiros leads para ver estatísticas personalizadas aqui.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <CreditCard className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Créditos Disponíveis
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.credits || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Leads
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalLeads || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Score Médio
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.avgScore || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Idade Média
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.avgAge || 0} anos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Nichos */}
      {stats?.topNichos && stats.topNichos.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Nichos Mais Populares
          </h3>
          <div className="space-y-3">
            {stats.topNichos.slice(0, 5).map((nicho, index) => (
              <div key={nicho._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {index + 1}.
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {nicho._id}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {nicho.count} leads
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Buscas Recentes
          </h3>
          <Link
            to="/history"
            className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Ver todas
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Nenhuma busca realizada ainda
            </p>
            <Link
              to="/generate"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
            >
              Fazer primeira busca
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.slice(0, 5).map((search, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(search.date)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {search.totalLeads} leads
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span className="capitalize">{search.filters.nicho}</span>
                  </div>
                  {search.filters.cidade && (
                    <span>{search.filters.cidade}</span>
                  )}
                  {search.filters.idadeMin && search.filters.idadeMax && (
                    <span>{search.filters.idadeMin}-{search.filters.idadeMax} anos</span>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Créditos usados: {search.creditsUsed}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <Link
              to="/gerar-leads"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span className="text-gray-900 dark:text-white">Gerar novos leads</span>
            </Link>
            <Link
              to="/comprar"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <CreditCard className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span className="text-gray-900 dark:text-white">Comprar créditos</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span className="text-gray-900 dark:text-white">Editar perfil</span>
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Estatísticas
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total de buscas</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {history.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Leads gerados</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {history.reduce((acc, search) => acc + search.totalLeads, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Créditos usados</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {history.reduce((acc, search) => acc + search.creditsUsed, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 