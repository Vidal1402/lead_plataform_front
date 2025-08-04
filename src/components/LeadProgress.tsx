import React, { useEffect, useState } from 'react';
import { Download, Clock, Users, CheckCircle, AlertCircle, X } from 'lucide-react';
import { LeadGenerationProgress } from '../types/leads';

interface LeadProgressProps {
  progress: LeadGenerationProgress;
  onDownloadLast30: () => void;
  onDownloadAll: () => void;
  onStop: () => void;
}

const LeadProgressComponent: React.FC<LeadProgressProps> = ({
  progress,
  onDownloadLast30,
  onDownloadAll,
  onStop
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showLeads, setShowLeads] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (progress.status === 'generating') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [progress.status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatEstimatedTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    return `${mins}m ${seconds % 60}s`;
  };

  const progressPercentage = (progress.generated / progress.total) * 100;

  return (
    <div className="card p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            progress.status === 'generating' 
              ? 'bg-blue-500 animate-pulse' 
              : progress.status === 'completed'
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}>
            {progress.status === 'generating' && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {progress.status === 'completed' && <CheckCircle className="w-5 h-5 text-white" />}
            {progress.status === 'error' && <AlertCircle className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white font-poppins">
              {progress.status === 'generating' && 'Gerando Leads...'}
              {progress.status === 'completed' && 'Geração Concluída!'}
              {progress.status === 'error' && 'Erro na Geração'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {progress.generated.toLocaleString()} de {progress.total.toLocaleString()} leads
            </p>
          </div>
        </div>
        
        {progress.status === 'generating' && (
          <button
            onClick={onStop}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Parar</span>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progresso
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Users className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Gerados</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {progress.generated.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Clock className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tempo Decorrido</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatTime(timeElapsed)}
            </p>
          </div>
        </div>
        
        {progress.status === 'generating' && (
          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Clock className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tempo Restante</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatEstimatedTime(progress.estimatedTimeRemaining)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {progress.leads.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={onDownloadLast30}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Últimos 30</span>
          </button>
          
          {progress.status === 'completed' && (
            <button
              onClick={onDownloadAll}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Todos ({progress.total.toLocaleString()})</span>
            </button>
          )}
        </div>
      )}

      {/* Leads List */}
      {progress.leads.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Leads Gerados
            </h3>
            <button
              onClick={() => setShowLeads(!showLeads)}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {showLeads ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          
          {showLeads && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {progress.leads.slice(-10).map((lead, index) => (
                <div
                  key={lead.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {lead.name}
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          📧 {lead.email}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          📱 {lead.phone}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          📍 {lead.city}, {lead.country}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {lead.source}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadProgressComponent; 