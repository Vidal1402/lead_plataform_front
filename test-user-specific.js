const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testUserSpecificData() {
  console.log('🔍 Testando se os dados são específicos do usuário...\n');

  try {
    // 1. Criar dois usuários diferentes
    console.log('1️⃣ Criando dois usuários de teste...');
    
    const user1Email = `user1-${Date.now()}@example.com`;
    const user2Email = `user2-${Date.now()}@example.com`;
    const password = '123456';
    
    // Criar usuário 1
    const user1Response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: 'Usuário 1',
      email: user1Email,
      password: password
    });
    const user1Token = user1Response.data.token;
    console.log('✅ Usuário 1 criado:', user1Email);
    
    // Criar usuário 2
    const user2Response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: 'Usuário 2',
      email: user2Email,
      password: password
    });
    const user2Token = user2Response.data.token;
    console.log('✅ Usuário 2 criado:', user2Email);
    
    // 2. Verificar dados do usuário 1
    console.log('\n2️⃣ Verificando dados do usuário 1...');
    const user1Stats = await axios.get(`${API_BASE_URL}/leads/stats`, {
      headers: {
        'Authorization': `Bearer ${user1Token}`
      }
    });
    console.log('📊 Usuário 1 - Total de leads:', user1Stats.data.data.geral.totalLeads);
    
    // 3. Verificar dados do usuário 2
    console.log('\n3️⃣ Verificando dados do usuário 2...');
    const user2Stats = await axios.get(`${API_BASE_URL}/leads/stats`, {
      headers: {
        'Authorization': `Bearer ${user2Token}`
      }
    });
    console.log('📊 Usuário 2 - Total de leads:', user2Stats.data.data.geral.totalLeads);
    
    // 4. Comparar os dados
    console.log('\n4️⃣ Comparando dados...');
    if (user1Stats.data.data.geral.totalLeads === user2Stats.data.data.geral.totalLeads) {
      console.log('❌ PROBLEMA: Ambos os usuários têm os mesmos dados!');
      console.log('💡 Isso indica que o backend não está filtrando por usuário');
      console.log('🔧 O backend deve retornar apenas os leads do usuário logado');
    } else {
      console.log('✅ Dados são específicos do usuário');
    }
    
    // 5. Verificar se os dados são 0 para usuários novos
    if (user1Stats.data.data.geral.totalLeads === 0 && user2Stats.data.data.geral.totalLeads === 0) {
      console.log('✅ Usuários novos começam com 0 leads (correto)');
    } else if (user1Stats.data.data.geral.totalLeads === 1000 && user2Stats.data.data.geral.totalLeads === 1000) {
      console.log('❌ PROBLEMA: Ambos os usuários têm 1000 leads (dados globais)');
      console.log('🔧 O backend deve filtrar por userId');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

// Executar o teste
testUserSpecificData(); 