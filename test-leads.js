const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testLeadsEndpoints() {
  console.log('🔍 Testando endpoints de leads...\n');

  try {
    // 1. Primeiro fazer login para obter token
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test-1754405978814@example.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login realizado, token obtido');
    
    // 2. Testar endpoint /leads/stats
    console.log('\n2️⃣ Testando /leads/stats...');
    try {
      const statsResponse = await axios.get(`${API_BASE_URL}/leads/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ /leads/stats funciona');
      console.log('📝 Resposta:', JSON.stringify(statsResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Erro em /leads/stats:', error.response?.data || error.message);
      console.log('📊 Status:', error.response?.status);
    }
    
    // 3. Testar endpoint /leads/history
    console.log('\n3️⃣ Testando /leads/history...');
    try {
      const historyResponse = await axios.get(`${API_BASE_URL}/leads/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ /leads/history funciona');
      console.log('📝 Resposta:', JSON.stringify(historyResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Erro em /leads/history:', error.response?.data || error.message);
      console.log('📊 Status:', error.response?.status);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o teste
testLeadsEndpoints(); 