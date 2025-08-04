import React, { useState } from 'react';
import { History, Download, Users, Target, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { SearchHistory } from '../types/leads';

interface SearchHistoryProps {
  history: SearchHistory[];
  onRedownload: (searchId: string) => void;
  onDelete: (searchId: string) => void;
}

const SearchHistoryComponent: React.FC<SearchHistoryProps> = ({
  history,
  onRedownload,
  onDelete
}) => {
  const [selectedSearch, setSelectedSearch] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    return status === 'completed' ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  if (history.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <History className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Nenhuma busca encontrada
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Suas buscas de leads aparecerão aqui
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <History className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white font-poppins">
            Histórico de Buscas
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {history.length} busca{history.length !== 1 ? 's' : ''} realizada{history.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {history.map((search) => (
          <div
            key={search.id}
            className="card p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => setSelectedSearch(selectedSearch === search.id ? null : search.id)}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(search.status)}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Busca #{search.id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(search.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(search.status)}`}>
                  {search.status === 'completed' ? 'Concluída' : 'Falhou'}
                </span>
                
                <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{search.totalLeads.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Filters Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Target className="w-4 h-4" />
                <span>{search.filters.niche}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{search.filters.city}, {search.filters.country}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>{search.filters.quantity.toLocaleString()} leads</span>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedSearch === search.id && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Filtros Aplicados
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p><strong>Nicho:</strong> {search.filters.niche}</p>
                      <p><strong>Cidade:</strong> {search.filters.city}</p>
                      <p><strong>País:</strong> {search.filters.country}</p>
                      <p><strong>Quantidade:</strong> {search.filters.quantity.toLocaleString()}</p>
                      {search.filters.fields && (
                        <p><strong>Campos:</strong> {search.filters.fields.join(', ')}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Resultados
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p><strong>Total Gerado:</strong> {search.totalLeads.toLocaleString()}</p>
                      <p><strong>Status:</strong> {search.status === 'completed' ? 'Concluído' : 'Falhou'}</p>
                      <p><strong>Data:</strong> {formatDate(search.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {search.status === 'completed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRedownload(search.id);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Baixar CSV</span>
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(search.id);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistoryComponent; 