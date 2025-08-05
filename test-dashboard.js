const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testDashboardFlow() {
  console.log('🔍 Testando fluxo completo: Login -> Dashboard...\n');

  try {
    // 1. Fazer login
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test-1754405978814@example.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login realizado');
    
    // 2. Verificar token com /auth/me
    console.log('\n2️⃣ Verificando token...');
    const meResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Token válido, usuário:', meResponse.data.name);
    
    // 3. Carregar dados do dashboard
    console.log('\n3️⃣ Carregando dados do dashboard...');
    
    // Stats
    const statsResponse = await axios.get(`${API_BASE_URL}/leads/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Stats carregados');
    console.log('📊 Total de leads:', statsResponse.data.data.geral.totalLeads);
    
    // History (pode falhar, mas não deve quebrar o fluxo)
    try {
      const historyResponse = await axios.get(`${API_BASE_URL}/leads/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ History carregado');
    } catch (historyError) {
      console.log('⚠️ History falhou (esperado):', historyError.response?.data?.error);
    }
    
    console.log('\n🎯 Fluxo completo funcionando!');
    console.log('✅ Login -> Token válido -> Dashboard carregado');
    
  } catch (error) {
    console.error('❌ Erro no fluxo:', error.response?.data || error.message);
  }
}

// Executar o teste
testDashboardFlow(); 