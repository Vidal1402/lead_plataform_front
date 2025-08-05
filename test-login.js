const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testLogin() {
  console.log('🔍 Testando processo completo de login...\n');

  try {
    // 1. Primeiro, criar um usuário
    console.log('1️⃣ Criando usuário de teste...');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = '123456';
    
    let registerResponse;
    try {
      registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: 'Usuário Teste',
        email: testEmail,
        password: testPassword
      });
      console.log('✅ Usuário criado com sucesso');
      console.log('📝 Resposta do registro:', JSON.stringify(registerResponse.data, null, 2));
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('já cadastrado')) {
        console.log('⚠️ Usuário já existe, continuando com login...');
      } else {
        console.log('❌ Erro no registro:', error.response?.data || error.message);
        return;
      }
    }

    // 2. Tentar fazer login
    console.log('\n2️⃣ Testando login...');
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: testEmail,
        password: testPassword
      });
      
      console.log('✅ Login bem-sucedido!');
      console.log('📝 Resposta do login:', JSON.stringify(loginResponse.data, null, 2));
      
      // 3. Verificar estrutura da resposta
      console.log('\n3️⃣ Verificando estrutura da resposta...');
      const { data } = loginResponse;
      
      if (!data.token) {
        console.log('❌ ERRO: Token não encontrado na resposta');
        console.log('💡 O backend deve retornar um campo "token"');
        return;
      }
      
      if (!data.user && !data._id) {
        console.log('❌ ERRO: Dados do usuário não encontrados na resposta');
        console.log('💡 O backend deve retornar um campo "user" ou dados do usuário no mesmo nível');
        return;
      }
      
      console.log('✅ Estrutura da resposta está correta');
      
      // 4. Verificar se o token é válido
      console.log('\n4️⃣ Verificando token...');
      const token = data.token;
      console.log('🔑 Token recebido:', token.substring(0, 50) + '...');
      
      if (token.length < 10) {
        console.log('❌ ERRO: Token parece ser muito curto');
        return;
      }
      
      console.log('✅ Token parece válido');
      
      // 5. Testar endpoint /auth/me se existir
      console.log('\n5️⃣ Testando endpoint /auth/me...');
      try {
        const meResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Endpoint /auth/me funciona');
        console.log('📝 Dados do usuário:', JSON.stringify(meResponse.data, null, 2));
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('⚠️ Endpoint /auth/me não existe (opcional)');
        } else if (error.response?.status === 401) {
          console.log('❌ Token inválido ou endpoint /auth/me com problema');
        } else {
          console.log('⚠️ Erro no endpoint /auth/me:', error.response?.data || error.message);
        }
      }
      
      console.log('\n🎯 Teste concluído com sucesso!');
      console.log('✅ O backend está funcionando corretamente');
      console.log('✅ O frontend deve conseguir fazer login');
      
    } catch (error) {
      console.log('❌ Erro no login:', error.response?.data || error.message);
      console.log('📊 Status:', error.response?.status);
      console.log('📊 Headers:', error.response?.headers);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o teste
testLogin(); 