const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testUserEndpoints() {
  console.log('🔍 Testando endpoints específicos do usuário...\n');

  try {
    // 1. Fazer login
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'user1-1754406869982@example.com',
      password: '123456'
    });
    const token = loginResponse.data.token;
    console.log('✅ Login realizado');
    
    // 2. Testar diferentes endpoints que podem ter dados do usuário
    const endpoints = [
      '/leads/my-stats',
      '/leads/user-stats',
      '/leads/personal-stats',
      '/users/stats',
      '/users/leads',
      '/dashboard/stats',
      '/dashboard/data'
    ];
    
    console.log('\n2️⃣ Testando endpoints específicos do usuário...');
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(`✅ ${endpoint} - Funciona`);
        console.log(`📊 Resposta:`, JSON.stringify(response.data, null, 2));
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`❌ ${endpoint} - Não encontrado (404)`);
        } else if (error.response?.status === 401) {
          console.log(`❌ ${endpoint} - Não autorizado (401)`);
        } else {
          console.log(`⚠️ ${endpoint} - Erro ${error.response?.status}: ${error.response?.data?.error || error.message}`);
        }
      }
    }
    
    // 3. Verificar se o endpoint /leads/stats tem parâmetros de usuário
    console.log('\n3️⃣ Testando parâmetros no endpoint /leads/stats...');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/leads/stats?user=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ /leads/stats?user=true funciona');
      console.log('📊 Resposta:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('❌ /leads/stats?user=true não funciona');
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/leads/stats?personal=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ /leads/stats?personal=true funciona');
      console.log('📊 Resposta:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('❌ /leads/stats?personal=true não funciona');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

// Executar o teste
testUserEndpoints(); 