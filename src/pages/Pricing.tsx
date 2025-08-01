import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { paymentsApi } from '../services/api';
import { 
  Check, 
  Star, 
  CreditCard,
  Zap,
  Shield,
  Download,
  Users,
  BarChart3
} from 'lucide-react';
import { Package } from '../types';
import toast from 'react-hot-toast';

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await paymentsApi.getPackages();
        setPackages(response.data);
      } catch (error) {
        console.error('Erro ao carregar pacotes:', error);
        // Fallback para pacotes padrão
        setPackages([
          {
            id: '100',
            name: 'Pacote Básico',
            credits: 100,
            price: 99.00,
            priceId: 9900,
            popular: false
          },
          {
            id: '1000',
            name: 'Pacote Profissional',
            credits: 1000,
            price: 890.00,
            priceId: 89000,
            popular: true
          },
          {
            id: '5000',
            name: 'Pacote Empresarial',
            credits: 5000,
            price: 3990.00,
            priceId: 399000,
            popular: false
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const features = [
    'Acesso a mais de 50.000 leads qualificados',
    'Filtros avançados por nicho, localização e idade',
    'Download em formato CSV',
    'Dashboard com histórico de buscas',
    'Suporte técnico especializado',
    'Dados atualizados mensalmente',
    'API para integração',
    'Relatórios detalhados'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LF</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                LeadForge
              </span>
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Escolha seu{' '}
              <span className="text-gradient">Plano</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              Planos flexíveis para todos os tamanhos de empresa. 
              Pague apenas pelos leads que usar.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`card p-8 relative ${
                  pkg.popular ? 'ring-2 ring-primary-500 shadow-lg' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {pkg.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      R$ {pkg.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">/pacote</span>
                  </div>
                  <div className="mb-6">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {pkg.credits.toLocaleString()}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400"> créditos</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {pkg.credits.toLocaleString()} leads qualificados
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Download em CSV
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Filtros avançados
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Suporte técnico
                    </span>
                  </div>
                  {pkg.credits >= 1000 && (
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">
                        API de integração
                      </span>
                    </div>
                  )}
                  {pkg.credits >= 5000 && (
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Relatórios premium
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  {user ? (
                    <Link
                      to="/payments"
                      className="btn-primary w-full"
                    >
                      Comprar Agora
                    </Link>
                  ) : (
                    <Link
                      to="/register"
                      className="btn-primary w-full"
                    >
                      Começar Agora
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tudo incluído em todos os planos
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Recursos poderosos para impulsionar seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Leads Qualificados
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Acesso a milhares de leads segmentados e qualificados
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Download CSV
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Baixe seus leads em formato CSV para usar em campanhas
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Acompanhe suas buscas e resultados em tempo real
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Dados Seguros
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Todos os dados são protegidos e seguem LGPD
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de empresas que já estão crescendo com o LeadForge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/generate"
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Zap className="h-5 w-5" />
                <span>Gerar Leads</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Star className="h-5 w-5" />
                  <span>Começar Gratuitamente</span>
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Já tenho conta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Como funciona o sistema de créditos?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Cada lead gerado consome 1 crédito. Você pode comprar pacotes de créditos 
                e usar conforme necessário. Os créditos não expiram.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Os dados são atualizados?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sim, nossa base de dados é atualizada mensalmente com novos leads 
                qualificados de todo o Brasil.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sim, não há fidelidade. Você pode cancelar sua conta a qualquer momento 
                e os créditos não utilizados ficam disponíveis.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Há suporte técnico?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sim, oferecemos suporte técnico especializado por email e chat 
                para todos os planos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 