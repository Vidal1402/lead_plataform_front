import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  CreditCard, 
  History, 
  Download, 
  Calendar, 
  Filter,
  Users,
  TrendingUp,
  Plus
} from 'lucide-react';

interface GenerationHistory {
  id: string;
  date: string;
  filters: {
    nicho: string;
    cidade?: string;
    estado?: string;
    pais: string;
    idadeMin: number;
    idadeMax: number;
    includePhone: boolean;
    includeEmail: boolean;
    includeWebsite: boolean;
  };
  totalLeads: number;
  creditsUsed: number;
}

const Creditos: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<GenerationHistory[]>([]);

  useEffect(() => {
    // Simular dados do histórico
    const mockHistory: GenerationHistory[] = [
      {
        id: '1',
        date: '2024-01-15T10:30:00Z',
        filters: {
          nicho: 'estetica',
          cidade: 'São Paulo',
          estado: 'SP',
          pais: 'Brasil',
          idadeMin: 25,
          idadeMax: 45,
          includePhone: true,
          includeEmail: true,
          includeWebsite: false,
        },
        totalLeads: 150,
        creditsUsed: 150,
      },
      {
        id: '2',
        date: '2024-01-10T14:20:00Z',
        filters: {
          nicho: 'advocacia',
          cidade: 'Rio de Janeiro',
          estado: 'RJ',
          pais: 'Brasil',
          idadeMin: 30,
          idadeMax: 60,
          includePhone: true,
          includeEmail: true,
          includeWebsite: true,
        },
        totalLeads: 200,
        creditsUsed: 200,
      },
      {
        id: '3',
        date: '2024-01-05T09:15:00Z',
        filters: {
          nicho: 'medicina',
          cidade: 'Belo Horizonte',
          estado: 'MG',
          pais: 'Brasil',
          idadeMin: 28,
          idadeMax: 55,
          includePhone: true,
          includeEmail: true,
          includeWebsite: false,
        },
        totalLeads: 100,
        creditsUsed: 100,
      },
    ];

    setHistory(mockHistory);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNichoDisplayName = (nicho: string) => {
    return nicho.charAt(0).toUpperCase() + nicho.slice(1);
  };

  const getTotalCreditsUsed = () => {
    return history.reduce((total, item) => total + item.creditsUsed, 0);
  };

  const getTotalLeadsGenerated = () => {
    return history.reduce((total, item) => total + item.totalLeads, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Meus Créditos
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Gerencie seu saldo e acompanhe o histórico de gerações
        </p>
      </div>

      {/* Saldo Atual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Saldo Atual
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Créditos disponíveis
              </p>
            </div>
          </div>
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {user?.credits || 0}
          </div>
          <button
            onClick={() => navigate('/comprar')}
            className="mt-4 w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Comprar Mais</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Leads Gerados
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total histórico
              </p>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {getTotalLeadsGenerated()}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Créditos Usados
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total histórico
              </p>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {getTotalCreditsUsed()}
          </div>
        </div>
      </div>

      {/* Histórico */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <History className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Histórico de Gerações
            </h2>
          </div>
        </div>

        {history.length > 0 ? (
          <div className="space-y-6">
            {history.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <Download className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Geração de Leads - {getNichoDisplayName(item.filters.nicho)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(item.date)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {item.totalLeads}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      leads gerados
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nicho
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {getNichoDisplayName(item.filters.nicho)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Localização
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {item.filters.cidade && `${item.filters.cidade}, `}
                      {item.filters.estado || item.filters.pais}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Faixa Etária
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {item.filters.idadeMin} - {item.filters.idadeMax} anos
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Créditos Usados
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {item.creditsUsed}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Campos incluídos:
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {item.filters.includeEmail && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                        Email
                      </span>
                    )}
                    {item.filters.includePhone && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                        Telefone
                      </span>
                    )}
                    {item.filters.includeWebsite && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                        Website
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma geração encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Comece a gerar leads para ver seu histórico aqui
            </p>
            <button
              onClick={() => navigate('/gerar-leads')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Users className="h-4 w-4" />
              <span>Gerar Leads</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Creditos; 