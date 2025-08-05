const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testBackend() {
  console.log('🔍 Testando backend na porta 5000...\n');

  try {
    // Teste 1: Verificar se o servidor está rodando
    console.log('1️⃣ Testando conectividade básica...');
    try {
      const response = await axios.get('http://localhost:5000/');
      console.log('✅ Servidor está rodando');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Servidor não está rodando na porta 5000');
        console.log('💡 Execute: npm start no diretório do backend');
        return;
      } else if (error.response?.status === 404) {
        console.log('✅ Servidor está rodando (endpoint raiz não encontrado)');
      } else {
        console.log(`⚠️ Servidor respondeu com status: ${error.response?.status}`);
      }
    }

    // Teste 2: Verificar endpoint de cadastro
    console.log('\n2️⃣ Testando endpoint de cadastro...');
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: 'Teste',
        email: 'teste@teste.com',
        password: '123456'
      });
      console.log('✅ Endpoint /auth/register está funcionando');
      console.log('📝 Resposta:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Endpoint /auth/register existe (erro 400 esperado para dados de teste)');
      } else if (error.response?.status === 404) {
        console.log('❌ Endpoint /auth/register não encontrado (404)');
        console.log('💡 Verifique se a rota está definida no backend');
      } else {
        console.log(`⚠️ Endpoint /auth/register retornou status ${error.response?.status}`);
        console.log('📝 Erro:', error.response?.data);
      }
    }

    // Teste 3: Verificar endpoint de login
    console.log('\n3️⃣ Testando endpoint de login...');
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'teste@teste.com',
        password: '123456'
      });
      console.log('✅ Endpoint /auth/login está funcionando');
      console.log('📝 Resposta:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 401) {
        console.log('✅ Endpoint /auth/login existe (erro esperado para credenciais inválidas)');
      } else if (error.response?.status === 404) {
        console.log('❌ Endpoint /auth/login não encontrado (404)');
        console.log('💡 Verifique se a rota está definida no backend');
      } else {
        console.log(`⚠️ Endpoint /auth/login retornou status ${error.response?.status}`);
        console.log('📝 Erro:', error.response?.data);
      }
    }

    // Teste 4: Verificar endpoint /auth/me
    console.log('\n4️⃣ Testando endpoint /auth/me...');
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      console.log('✅ Endpoint /auth/me está funcionando');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Endpoint /auth/me existe (autenticação necessária)');
      } else if (error.response?.status === 404) {
        console.log('❌ Endpoint /auth/me não encontrado (404)');
        console.log('💡 Este endpoint é opcional, mas recomendado');
      } else {
        console.log(`⚠️ Endpoint /auth/me retornou status ${error.response?.status}`);
      }
    }

    console.log('\n🎯 Teste concluído!');
    console.log('\n📋 Resumo:');
    console.log('- Se você viu ❌ nos endpoints, implemente-os no backend');
    console.log('- Se você viu ✅, o backend está funcionando corretamente');
    console.log('- Use o DebugPanel no frontend para testes mais detalhados');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

// Executar o teste
testBackend(); 