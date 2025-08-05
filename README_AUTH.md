# Sistema de Autenticação - Lead Platform Frontend

## 🚨 Diagnóstico Rápido

Se você está recebendo erro 404, siga estes passos:

### 1. Teste Rápido do Backend
```bash
# Instale o axios se não tiver
npm install axios

# Execute o teste
node test-backend.js
```

### 2. Verifique se o Backend está Rodando
```bash
# No diretório do backend
npm start
# ou
node server.js
```

### 3. Use o DebugPanel
- Acesse a página de login
- Clique em "Diagnóstico Completo" no DebugPanel
- Verifique quais endpoints estão funcionando

## Mudanças Implementadas

### ✅ Correções Realizadas

1. **Remoção do Sistema Mock**
   - Removida toda a lógica de fallback que permitia login com usuários inexistentes
   - O sistema agora **exige** que o backend esteja rodando na porta 5000

2. **Melhor Tratamento de Erros**
   - Mensagens de erro mais específicas e informativas
   - Tratamento adequado de erros de rede
   - Validação de tokens JWT

3. **Endpoints Corretos**
   - `POST /api/auth/register` - Cadastro de usuários
   - `POST /api/auth/login` - Login de usuários
   - `GET /api/auth/me` - Verificação de token (opcional)

4. **Flexibilidade na Resposta**
   - Suporte a diferentes formatos de resposta do backend
   - Compatível com `{ token, user }` ou `{ token, ...userData }`

## Configuração

### Backend
Certifique-se de que o backend está rodando na porta 5000 com os seguintes endpoints:

```bash
# Cadastro
POST http://localhost:5000/api/auth/register
{
  "name": "João Silva",
  "email": "joao@email.com", 
  "password": "123456"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "joao@email.com",
  "password": "123456"
}
```

### Frontend
O frontend está configurado para se conectar automaticamente ao backend na porta 5000.

## Como Testar

1. **Inicie o Backend**
   ```bash
   # No diretório do backend
   npm start
   # ou
   node server.js
   ```

2. **Inicie o Frontend**
   ```bash
   # No diretório do frontend
   npm start
   ```

3. **Teste a Conexão**
   - Acesse a página de login
   - Clique no botão "Testar Conexão Backend"
   - Verifique se aparece "✅ Backend conectado com sucesso!"

4. **Teste o Cadastro**
   - Vá para `/register`
   - Crie uma nova conta
   - Verifique se é redirecionado para o dashboard

5. **Teste o Login**
   - Vá para `/login`
   - Faça login com as credenciais criadas
   - Verifique se é redirecionado para o dashboard

## Estrutura de Resposta Esperada

O backend deve retornar uma das seguintes estruturas:

### Opção 1: Token e User separados
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

### Opção 2: Token e dados do usuário no mesmo nível
```json
{
  "token": "jwt-token-aqui",
  "_id": "user-id",
  "name": "João Silva",
  "email": "joao@email.com",
  "credits": 100
}
```

## Tratamento de Erros

### Erros de Rede
- "Erro de conexão. Verifique se o backend está rodando na porta 5000."

### Erros de Autenticação
- "Email ou senha incorretos"
- "Usuário não encontrado"
- "Senha inválida"

### Erros de Cadastro
- "Email já cadastrado"
- "Dados inválidos"
- "Senha muito fraca"

## Logs de Debug

O sistema agora inclui logs detalhados no console:

- `🔄 Inicializando autenticação...`
- `🔍 Token encontrado: Sim/Não`
- `🔐 Verificando token com backend...`
- `✅ Token válido, usuário autenticado`
- `❌ Token inválido ou expirado`
- `🔐 Tentando login...`
- `✅ Login realizado com sucesso`
- `❌ Erro no login`

## Segurança

- Tokens JWT são armazenados no localStorage
- Tokens expirados são automaticamente removidos
- Requisições não autenticadas são redirecionadas para login
- Timeout de 10 segundos para requisições

## Troubleshooting

### Backend não conecta
1. Verifique se o backend está rodando na porta 5000
2. Teste a conexão com o botão na página de login
3. Verifique os logs do console do navegador

### Login não funciona
1. Verifique se o usuário existe no backend
2. Confirme se as credenciais estão corretas
3. Verifique se o backend está retornando o token JWT

### Cadastro não funciona
1. Verifique se o email não está duplicado
2. Confirme se a senha tem pelo menos 6 caracteres
3. Verifique se todos os campos obrigatórios estão preenchidos

### Erro 404
1. Execute `node test-backend.js` para diagnosticar
2. Verifique se os endpoints estão implementados no backend
3. Confirme se o prefixo `/api` está sendo usado
4. Consulte o arquivo `BACKEND_SETUP.md` para implementação

## Arquivos de Apoio

- `BACKEND_SETUP.md` - Guia completo para implementar o backend
- `test-backend.js` - Script para testar rapidamente o backend
- `src/components/DebugPanel.tsx` - Componente de diagnóstico no frontend 