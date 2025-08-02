import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Check, Star, Zap } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  leads: number;
  credits: number;
  price: number;
  popular?: boolean;
  features: string[];
}

const Comprar: React.FC = () => {
  const navigate = useNavigate();

  const packages: Package[] = [
    {
      id: '100',
      name: 'Starter',
      leads: 100,
      credits: 100,
      price: 29.90,
      features: [
        '100 leads qualificados',
        'Filtros básicos',
        'Exportação CSV',
        'Suporte por email'
      ]
    },
    {
      id: '1000',
      name: 'Professional',
      leads: 1000,
      credits: 1000,
      price: 199.90,
      popular: true,
      features: [
        '1.000 leads qualificados',
        'Filtros avançados',
        'Exportação CSV/Excel',
        'Suporte prioritário',
        'Relatórios detalhados'
      ]
    },
    {
      id: '5000',
      name: 'Enterprise',
      leads: 5000,
      credits: 5000,
      price: 799.90,
      features: [
        '5.000 leads qualificados',
        'Filtros premium',
        'Exportação múltiplos formatos',
        'Suporte dedicado',
        'Relatórios avançados',
        'API access'
      ]
    }
  ];

  const handlePurchase = (packId: string) => {
    navigate(`/checkout?pack=${packId}`);
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
          Escolha seu Plano
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Selecione o pacote ideal para suas necessidades e comece a gerar leads qualificados
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              pkg.popular
                ? 'border-primary-500 dark:border-primary-400'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Mais Popular</span>
                </div>
              </div>
            )}

            <div className="p-8">
              {/* Package Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline justify-center space-x-1 mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {pkg.leads.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-600 dark:text-gray-400">
                    leads
                  </span>
                </div>
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    R$ {pkg.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">/pacote</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePurchase(pkg.id)}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Zap className="h-5 w-5" />
                <span>Comprar Agora</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-16 text-center">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Por que escolher o LeadForge?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Leads Qualificados
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Dados verificados e atualizados regularmente
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Geração Rápida
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Resultados em segundos com filtros avançados
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Pagamento Seguro
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Transações protegidas e dados criptografados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comprar; 