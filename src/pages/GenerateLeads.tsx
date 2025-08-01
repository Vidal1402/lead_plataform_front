import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { leadsApi } from '../services/api';
import { 
  Download, 
  Filter, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { LeadFilters, Lead, NICHOS, ESTADOS } from '../types';
import toast from 'react-hot-toast';

interface GenerateLeadsForm extends LeadFilters {
  includePhone: boolean;
  includeEmail: boolean;
  includeWebsite: boolean;
}

const GenerateLeads: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generatedLeads, setGeneratedLeads] = useState<Lead[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [csvUrl, setCsvUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<GenerateLeadsForm>({
    defaultValues: {
      nicho: '',
      includePhone: true,
      includeEmail: true,
      includeWebsite: false,
      limit: 100,
    },
  });

  const watchedNicho = watch('nicho');
  const watchedLimit = watch('limit');

  const onSubmit = async (data: GenerateLeadsForm) => {
    setLoading(true);
    try {
      const response = await leadsApi.generateLeads(data);
      
      setGeneratedLeads(response.data.leads);
      setCsvUrl(response.data.csvUrl);
      setShowResults(true);
      
      toast.success(`Leads gerados com sucesso! ${response.data.totalLeads} leads encontrados.`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Erro ao gerar leads';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = async () => {
    try {
      const response = await leadsApi.downloadCsv(csvUrl.split('/').pop() || '');
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_${watchedNicho}_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('CSV baixado com sucesso!');
    } catch (error) {
      toast.error('Erro ao baixar CSV');
    }
  };

  const handleNewSearch = () => {
    setShowResults(false);
    setGeneratedLeads([]);
    setCsvUrl('');
    reset();
  };

  const getNichoLabel = (nicho: string) => {
    const labels: Record<string, string> = {
      estetica: 'Estética',
      petshop: 'Pet Shop',
      advocacia: 'Advocacia',
      medicina: 'Medicina',
      educacao: 'Educação',
      tecnologia: 'Tecnologia',
      financas: 'Finanças',
      imoveis: 'Imóveis',
      automoveis: 'Automóveis',
      beleza: 'Beleza',
      fitness: 'Fitness',
      gastronomia: 'Gastronomia',
      moda: 'Moda',
      turismo: 'Turismo',
      outros: 'Outros',
    };
    return labels[nicho] || nicho;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gerar Leads
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure os filtros para encontrar leads qualificados
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {user?.credits} créditos disponíveis
            </span>
          </div>
        </div>
      </div>

      {!showResults ? (
        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nicho */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nicho de Mercado *
              </label>
              <select
                {...register('nicho', { required: 'Nicho é obrigatório' })}
                className="input-field"
              >
                <option value="">Selecione um nicho</option>
                {NICHOS.map((nicho) => (
                  <option key={nicho} value={nicho}>
                    {getNichoLabel(nicho)}
                  </option>
                ))}
              </select>
              {errors.nicho && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.nicho.message}
                </p>
              )}
            </div>

            {/* Localização */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cidade
                </label>
                <input
                  {...register('cidade')}
                  type="text"
                  className="input-field"
                  placeholder="Ex: São Paulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado
                </label>
                <select {...register('estado')} className="input-field">
                  <option value="">Todos os estados</option>
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  País
                </label>
                <input
                  {...register('pais')}
                  type="text"
                  className="input-field"
                  placeholder="Ex: Brasil"
                  defaultValue="Brasil"
                />
              </div>
            </div>

            {/* Idade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Idade Mínima
                </label>
                <input
                  {...register('idadeMin', {
                    min: { value: 18, message: 'Idade mínima é 18 anos' },
                    max: { value: 100, message: 'Idade máxima é 100 anos' },
                  })}
                  type="number"
                  className="input-field"
                  placeholder="18"
                  min="18"
                  max="100"
                />
                {errors.idadeMin && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.idadeMin.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Idade Máxima
                </label>
                <input
                  {...register('idadeMax', {
                    min: { value: 18, message: 'Idade mínima é 18 anos' },
                    max: { value: 100, message: 'Idade máxima é 100 anos' },
                  })}
                  type="number"
                  className="input-field"
                  placeholder="65"
                  min="18"
                  max="100"
                />
                {errors.idadeMax && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.idadeMax.message}
                  </p>
                )}
              </div>
            </div>

            {/* Limite */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantidade de Leads
              </label>
              <input
                {...register('limit', {
                  min: { value: 1, message: 'Mínimo 1 lead' },
                  max: { value: 1000, message: 'Máximo 1000 leads' },
                })}
                type="number"
                className="input-field"
                placeholder="100"
                min="1"
                max="1000"
              />
              {errors.limit && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.limit.message}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Máximo: {Math.min(user?.credits || 0, 1000)} leads
              </p>
            </div>

            {/* Campos Incluídos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Campos Incluídos no CSV
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    {...register('includeEmail')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Email
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('includePhone')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Telefone
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('includeWebsite')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Website
                  </span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !watchedNicho}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Filter className="h-5 w-5" />
                )}
                <span>{loading ? 'Gerando...' : 'Gerar Leads'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Leads Gerados
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {generatedLeads.length} leads encontrados
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleNewSearch}
                  className="btn-outline"
                >
                  Nova Busca
                </button>
                <button
                  onClick={handleDownloadCsv}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Baixar CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preview dos Leads
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Idade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {generatedLeads.map((lead, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {lead.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {lead.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {lead.idade} anos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {lead.cidade}, {lead.estado}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          lead.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          lead.score >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {lead.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateLeads; 