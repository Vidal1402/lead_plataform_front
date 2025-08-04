import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Search, MapPin, Users, Target, Download } from 'lucide-react';
import { LeadFilters } from '../types/leads';

interface LeadFiltersProps {
  onGenerate: (filters: LeadFilters) => void;
  loading?: boolean;
}

const niches = [
  'Tecnologia',
  'Saúde',
  'Educação',
  'Finanças',
  'E-commerce',
  'Marketing Digital',
  'Consultoria',
  'Imobiliário',
  'Automotivo',
  'Alimentação',
  'Moda',
  'Turismo',
  'Serviços',
  'Indústria',
  'Outros'
];

const countries = [
  'Brasil',
  'Estados Unidos',
  'Argentina',
  'Chile',
  'Colômbia',
  'México',
  'Peru',
  'Uruguai',
  'Canadá',
  'Portugal',
  'Espanha',
  'Reino Unido',
  'Alemanha',
  'França',
  'Itália'
];

const LeadFiltersComponent: React.FC<LeadFiltersProps> = ({ onGenerate, loading = false }) => {
  const [selectedFields, setSelectedFields] = useState<string[]>(['email', 'phone']);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<LeadFilters>({
    defaultValues: {
      niche: '',
      city: '',
      country: 'Brasil',
      quantity: 100,
      ageRange: { min: 25, max: 55 },
      fields: ['email', 'phone']
    }
  });

  const quantity = watch('quantity');

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
    setValue('fields', selectedFields);
  };

  const onSubmit = (data: LeadFilters) => {
    onGenerate({
      ...data,
      fields: selectedFields
    });
  };

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white font-poppins">
            Configurar Filtros
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Defina os critérios para gerar leads qualificados
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nicho */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nicho de Atuação
          </label>
          <Controller
            name="niche"
            control={control}
            rules={{ required: 'Nicho é obrigatório' }}
            render={({ field }) => (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  {...field}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Selecione um nicho</option>
                  {niches.map(niche => (
                    <option key={niche} value={niche}>{niche}</option>
                  ))}
                </select>
              </div>
            )}
          />
          {errors.niche && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.niche.message}
            </p>
          )}
        </div>

        {/* Localização */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cidade
            </label>
            <Controller
              name="city"
              control={control}
              rules={{ required: 'Cidade é obrigatória' }}
              render={({ field }) => (
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...field}
                    type="text"
                    placeholder="Ex: São Paulo"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              )}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.city.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              País
            </label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>

        {/* Quantidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quantidade de Leads: {quantity.toLocaleString()}
          </label>
          <Controller
            name="quantity"
            control={control}
            rules={{ 
              required: 'Quantidade é obrigatória',
              min: { value: 10, message: 'Mínimo 10 leads' },
              max: { value: 10000, message: 'Máximo 10.000 leads' }
            }}
            render={({ field }) => (
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...field}
                  type="range"
                  min="10"
                  max="10000"
                  step="10"
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10</span>
                  <span>1.000</span>
                  <span>5.000</span>
                  <span>10.000</span>
                </div>
              </div>
            )}
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.quantity.message}
            </p>
          )}
        </div>

        {/* Campos Desejados */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Campos Desejados
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: 'email', label: 'Email', icon: '📧' },
              { key: 'phone', label: 'Telefone', icon: '📱' },
              { key: 'website', label: 'Website', icon: '🌐' },
              { key: 'company', label: 'Empresa', icon: '🏢' }
            ].map(field => (
              <button
                key={field.key}
                type="button"
                onClick={() => handleFieldToggle(field.key)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedFields.includes(field.key)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">{field.icon}</div>
                  <div className="text-sm font-medium">{field.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Botão Gerar */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Gerando Leads...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Gerar {quantity.toLocaleString()} Leads</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadFiltersComponent; 