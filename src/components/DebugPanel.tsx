import React, { useState } from 'react';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const DebugPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testEndpoint = async (endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any) => {
    try {
      const response = await fetch(`http://localhost:5000/api${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      
      if (response.ok) {
        return { success: true, status: response.status };
      } else {
        return { success: false, status: response.status, message: response.statusText };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔍 Iniciando diagnóstico completo do backend...');
      
      // Teste 1: Verificar se o servidor está rodando
      addResult('📡 Testando conectividade básica...');
      const basicTest = await testEndpoint('/');
      if (basicTest.success) {
        addResult('✅ Servidor está rodando');
      } else if (basicTest.status === 404) {
        addResult('✅ Servidor está rodando (endpoint raiz não encontrado)');
      } else {
        addResult(`❌ Servidor não está respondendo: ${basicTest.error || basicTest.message}`);
        toast.error('Backend não está rodando na porta 5000');
        return;
      }

      // Teste 2: Verificar endpoint de cadastro
      addResult('📝 Testando endpoint de cadastro (/auth/register)...');
      const registerTest = await testEndpoint('/auth/register', 'POST', {
        name: 'Teste',
        email: 'teste@teste.com',
        password: '123456'
      });
      
      if (registerTest.success) {
        addResult('✅ Endpoint /auth/register está funcionando');
      } else if (registerTest.status === 400) {
        addResult('✅ Endpoint /auth/register existe (erro 400 esperado para dados de teste)');
      } else if (registerTest.status === 404) {
        addResult('❌ Endpoint /auth/register não encontrado (404)');
      } else {
        addResult(`⚠️ Endpoint /auth/register retornou status ${registerTest.status}`);
      }

      // Teste 3: Verificar endpoint de login
      addResult('🔐 Testando endpoint de login (/auth/login)...');
      const loginTest = await testEndpoint('/auth/login', 'POST', {
        email: 'teste@teste.com',
        password: '123456'
      });
      
      if (loginTest.success) {
        addResult('✅ Endpoint /auth/login está funcionando');
      } else if (loginTest.status === 400 || loginTest.status === 401) {
        addResult('✅ Endpoint /auth/login existe (erro esperado para credenciais inválidas)');
      } else if (loginTest.status === 404) {
        addResult('❌ Endpoint /auth/login não encontrado (404)');
      } else {
        addResult(`⚠️ Endpoint /auth/login retornou status ${loginTest.status}`);
      }

      // Teste 4: Verificar endpoint /auth/me
      addResult('👤 Testando endpoint /auth/me...');
      const meTest = await testEndpoint('/auth/me');
      
      if (meTest.success) {
        addResult('✅ Endpoint /auth/me está funcionando');
      } else if (meTest.status === 401) {
        addResult('✅ Endpoint /auth/me existe (autenticação necessária)');
      } else if (meTest.status === 404) {
        addResult('❌ Endpoint /auth/me não encontrado (404)');
      } else {
        addResult(`⚠️ Endpoint /auth/me retornou status ${meTest.status}`);
      }

      // Teste 5: Tentar cadastro real
      addResult('📝 Testando cadastro real...');
      try {
        const testEmail = `test-${Date.now()}@example.com`;
        const response = await authApi.register('Usuário Teste', testEmail, '123456');
        addResult('✅ Cadastro funcionando perfeitamente');
        
        // Se o cadastro funcionou, testar login
        addResult('🔐 Testando login com usuário criado...');
        try {
          await authApi.login(testEmail, '123456');
          addResult('✅ Login funcionando perfeitamente');
        } catch (error: any) {
          addResult(`❌ Erro no login: ${error.response?.data?.message || error.message}`);
        }
      } catch (error: any) {
        addResult(`❌ Erro no cadastro: ${error.response?.data?.message || error.message}`);
      }

      addResult('🎯 Diagnóstico concluído!');

    } catch (error: any) {
      addResult(`❌ Erro geral: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border max-w-md max-h-96 overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Debug Panel</h3>
        <button
          onClick={clearResults}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Limpar
        </button>
      </div>
      
      <button
        onClick={testBackendConnection}
        disabled={loading}
        className="w-full mb-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testando...' : 'Diagnóstico Completo'}
      </button>
      
      <div className="max-h-64 overflow-y-auto text-xs space-y-1">
        {testResults.map((result, index) => (
          <div key={index} className="text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 pb-1">
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugPanel; 