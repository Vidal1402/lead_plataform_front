# Diagnóstico de Problemas de Login

## 🚨 Problema: Login não entra no dashboard

### Passo 1: Verificar o Backend

Execute o teste específico de login:
```bash
node test-login.js
```

**O que verificar:**
- ✅ Backend está rodando na porta 5000
- ✅ Endpoint `/auth/login` existe e responde
- ✅ Resposta contém `token` e dados do usuário
- ✅ Token é válido e tem tamanho adequado

### Passo 2: Verificar o Frontend

1. **Abra o console do navegador** (F12)
2. **Acesse a página de login**
3. **Observe o AuthDebug** (canto superior esquerdo)
4. **Tente fazer login**
5. **Verifique os logs no console**

### Passo 3: Análise dos Logs

Procure por estas mensagens no console:

#### ✅ Logs de Sucesso:
```
🚀 Iniciando processo de login...
📧 Email: seu@email.com
🔐 Chamando função login do AuthContext...
🔐 Tentando login...
✅ Login realizado com sucesso
✅ Login bem-sucedido no AuthContext
🔄 Redirecionando para dashboard...
🏁 Processo de login finalizado
```

#### ❌ Logs de Erro Comuns:

**1. Erro de Rede:**
```
❌ Erro de conexão. Verifique se o backend está rodando na porta 5000.
```
**Solução:** Inicie o backend

**2. Erro 404:**
```
❌ Endpoint /auth/login não encontrado (404)
```
**Solução:** Implemente o endpoint no backend

**3. Erro de Credenciais:**
```
❌ Email ou senha incorretos
```
**Solução:** Verifique as credenciais

**4. Erro de Estrutura:**
```
❌ Token não recebido do servidor
```
**Solução:** Backend não está retornando token

### Passo 4: Verificar o AuthDebug

O componente AuthDebug mostra:

- **Loading:** Deve ser `❌ Não` após carregar
- **Token:** Deve ser `✅ Presente` após login
- **User:** Deve ser `✅ Logado` após login

### Passo 5: Verificar o ProtectedRoute

Se o AuthDebug mostra que está logado mas não entra no dashboard:

1. **Verifique se a rota `/dashboard` está protegida**
2. **Verifique se o componente `ProtectedRoute` está funcionando**
3. **Verifique se não há redirecionamentos automáticos**

### Passo 6: Testes Específicos

#### Teste 1: Backend Funcionando?
```bash
node test-backend.js
```

#### Teste 2: Login Funcionando?
```bash
node test-login.js
```

#### Teste 3: Frontend Conectando?
- Use o DebugPanel na página de login
- Clique em "Diagnóstico Completo"

### Passo 7: Soluções Comuns

#### Problema: Backend não responde
```bash
# No diretório do backend
npm start
# ou
node server.js
```

#### Problema: Endpoints não existem
Consulte `BACKEND_SETUP.md` para implementar os endpoints

#### Problema: Estrutura de resposta incorreta
O backend deve retornar:
```json
{
  "token": "jwt-token-aqui",
  "user": {
    "_id": "user-id",
    "name": "João Silva",
    "email": "joao@email.com",
    "credits": 100
  }
}
```

#### Problema: CORS
Adicione no backend:
```javascript
app.use(cors());
```

#### Problema: Token não é salvo
Verifique se o localStorage está funcionando:
```javascript
// No console do navegador
localStorage.setItem('test', 'value');
console.log(localStorage.getItem('test'));
```

### Passo 8: Debug Avançado

#### Verificar Estado do AuthContext:
```javascript
// No console do navegador
// Abra o React DevTools
// Vá para Components > AuthProvider
// Verifique o estado: user, token, loading
```

#### Verificar Rotas:
```javascript
// No console do navegador
// Verifique se a rota /dashboard existe
console.log(window.location.pathname);
```

#### Verificar Redirecionamentos:
```javascript
// No console do navegador
// Verifique se há redirecionamentos automáticos
// Procure por Navigate components
```

### Passo 9: Logs Detalhados

Ative logs detalhados no AuthContext:
```javascript
// Em src/contexts/AuthContext.tsx
// Todos os console.log já estão ativos
// Verifique o console do navegador
```

### Passo 10: Checklist Final

- [ ] Backend rodando na porta 5000
- [ ] Endpoint `/auth/login` implementado
- [ ] Resposta contém `token` e `user`
- [ ] Frontend consegue fazer requisição
- [ ] Token é salvo no localStorage
- [ ] User é definido no AuthContext
- [ ] Loading é false
- [ ] Rota `/dashboard` existe e está protegida
- [ ] Não há redirecionamentos automáticos

### 🆘 Se Nada Funcionar

1. **Limpe o localStorage:**
   ```javascript
   localStorage.clear();
   ```

2. **Recarregue a página**

3. **Verifique se não há erros de JavaScript**

4. **Teste em uma aba anônima**

5. **Verifique se não há conflitos de versão**

### 📞 Informações para Debug

Quando reportar o problema, inclua:

1. **Logs do console do navegador**
2. **Resultado do `node test-login.js`**
3. **Estado do AuthDebug**
4. **URL atual**
5. **Mensagens de erro específicas** 