import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  Download, 
  Filter, 
  Users, 
  Phone, 
  Mail, 
  Globe, 
  FileText,
  Loader2,
  Eye
} from 'lucide-react';
import { NICHOS, ESTADOS } from '../types';

interface LeadForm {
  nicho: string;
  cidade: string;
  estado: string;
  pais: string;
  idadeMin: number;
  idadeMax: number;
  includePhone: boolean;
  includeEmail: boolean;
  includeWebsite: boolean;
  limit: number;
}

interface Lead {
  nome: string;
  email: string;
  telefone?: string;
  site?: string;
  idade: number;
  cidade: string;
  estado: string;
  nicho: string;
}

const GerarLeads: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLeads, setGeneratedLeads] = useState<Lead[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LeadForm>({
    defaultValues: {
      nicho: '',
      cidade: '',
      estado: '',
      pais: 'Brasil',
      idadeMin: 18,
      idadeMax: 65,
      includePhone: true,
      includeEmail: true,
      includeWebsite: false,
      limit: 100,
    },
  });

  const watchedFields = watch();

  const handleGenerateLeads = async (data: LeadForm) => {
    setIsGenerating(true);
    try {
      // Simular chamada da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dados simulados
      const mockLeads: Lead[] = Array.from({ length: data.limit }, (_, i) => ({
        nome: `João Silva ${i + 1}`,
        email: `joao.silva${i + 1}@email.com`,
        telefone: data.includePhone ? `(11) 99999-${String(i + 1).padStart(4, '0')}` : undefined,
        site: data.includeWebsite ? `www.empresa${i + 1}.com.br` : undefined,
        idade: Math.floor(Math.random() * (data.idadeMax - data.idadeMin + 1)) + data.idadeMin,
        cidade: data.cidade || 'São Paulo',
        estado: data.estado || 'SP',
        nicho: data.nicho,
      }));

      setGeneratedLeads(mockLeads);
      setShowPreview(true);
      toast.success(`${data.limit} leads gerados com sucesso!`);
    } catch (error) {
      toast.error('Erro ao gerar leads');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadCSV = () => {
    if (generatedLeads.length === 0) return;

    const headers = ['Nome', 'Email', 'Telefone', 'Site', 'Idade', 'Cidade', 'Estado', 'Nicho'];
    const csvContent = [
      headers.join(','),
      ...generatedLeads.map(lead => [
        lead.nome,
        lead.email,
        lead.telefone || '',
        lead.site || '',
        lead.idade,
        lead.cidade,
        lead.estado,
        lead.nicho
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Gerar Leads
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Configure os filtros e gere leads qualificados para seu negócio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Filter className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Filtros
              </h2>
            </div>

            <form onSubmit={handleSubmit(handleGenerateLeads)} className="space-y-6">
              {/* Nicho */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nicho *
                </label>
                <select
                  {...register('nicho', { required: 'Nicho é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Selecione um nicho</option>
                  {NICHOS.map((nicho) => (
                    <option key={nicho} value={nicho}>
                      {nicho.charAt(0).toUpperCase() + nicho.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.nicho && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.nicho.message}
                  </p>
                )}
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  {...register('cidade')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ex: São Paulo"
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado
                </label>
                <select
                  {...register('estado')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Todos os estados</option>
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* País */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  País
                </label>
                <select
                  {...register('pais')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Brasil">Brasil</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Chile">Chile</option>
                  <option value="Colômbia">Colômbia</option>
                  <option value="México">México</option>
                </select>
              </div>

              {/* Faixa Etária */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Faixa Etária: {watchedFields.idadeMin} - {watchedFields.idadeMax} anos
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="18"
                    max="80"
                    {...register('idadeMin', { valueAsNumber: true })}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="18"
                    max="80"
                    {...register('idadeMax', { valueAsNumber: true })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Campos Desejados */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Campos Desejados
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      {...register('includeEmail')}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Email</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      {...register('includePhone')}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Telefone</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      {...register('includeWebsite')}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Website</span>
                  </label>
                </div>
              </div>

              {/* Quantidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantidade de Leads
                </label>
                <select
                  {...register('limit', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value={50}>50 leads</option>
                  <option value={100}>100 leads</option>
                  <option value={250}>250 leads</option>
                  <option value={500}>500 leads</option>
                  <option value={1000}>1.000 leads</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 px-6 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl font-semibold transition-all duration-300 hover:from-primary-600 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <Users className="h-5 w-5" />
                    <span>Gerar Leads</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          {showPreview && generatedLeads.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Eye className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Preview dos Leads
                  </h2>
                </div>
                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Nome
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Email
                      </th>
                      {watchedFields.includePhone && (
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Telefone
                        </th>
                      )}
                      {watchedFields.includeWebsite && (
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Website
                        </th>
                      )}
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Idade
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Localização
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedLeads.slice(0, 5).map((lead, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {lead.nome}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {lead.email}
                        </td>
                        {watchedFields.includePhone && (
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {lead.telefone}
                          </td>
                        )}
                        {watchedFields.includeWebsite && (
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {lead.site}
                          </td>
                        )}
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {lead.idade} anos
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {lead.cidade}, {lead.estado}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Mostrando 5 de {generatedLeads.length} leads gerados
                </p>
              </div>
            </div>
          )}

          {!showPreview && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum lead gerado ainda
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Configure os filtros e clique em "Gerar Leads" para começar
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GerarLeads; 