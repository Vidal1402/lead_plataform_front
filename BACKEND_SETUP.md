# Configuração do Backend - Lead Platform

## Endpoints Necessários

O frontend espera que o backend tenha os seguintes endpoints implementados:

### 1. Cadastro de Usuário
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

**Resposta esperada:**
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

### 2. Login de Usuário
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "123456"
}
```

**Resposta esperada:**
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

### 3. Verificação de Token (Opcional)
```
GET /api/auth/me
Authorization: Bearer jwt-token-aqui
```

**Resposta esperada:**
```json
{
  "_id": "user-id",
  "name": "João Silva",
  "email": "joao@email.com",
  "credits": 100
}
```

## Exemplo de Implementação em Node.js/Express

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simulação de banco de dados
let users = [];

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, 'seu-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Cadastro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se email já existe
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = {
      _id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      credits: 100
    };

    users.push(user);

    // Gerar token
    const token = jwt.sign({ userId: user._id }, 'seu-secret-key', { expiresIn: '24h' });

    // Retornar resposta (sem a senha)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Encontrar usuário
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    // Gerar token
    const token = jwt.sign({ userId: user._id }, 'seu-secret-key', { expiresIn: '24h' });

    // Retornar resposta (sem a senha)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Verificar token (opcional)
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u._id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

## Dependências Necessárias

```bash
npm install express jsonwebtoken bcryptjs cors
```

## Testando os Endpoints

### 1. Teste de Cadastro
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### 2. Teste de Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### 3. Teste de Verificação de Token
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Solução de Problemas

### Erro 404
- Verifique se o servidor está rodando na porta 5000
- Confirme se as rotas estão definidas corretamente
- Verifique se o prefixo `/api` está sendo usado

### Erro de CORS
- Certifique-se de que o middleware `cors()` está configurado
- Verifique se as origens estão permitidas

### Erro de Token
- Confirme se o secret key está definido
- Verifique se o token está sendo gerado corretamente
- Teste se o middleware de autenticação está funcionando

## Estrutura de Pastas Recomendada

```
backend/
├── package.json
├── server.js
├── routes/
│   └── auth.js
├── middleware/
│   └── auth.js
├── models/
│   └── User.js
└── config/
    └── database.js
```

## Variáveis de Ambiente

Crie um arquivo `.env`:

```env
PORT=5000
JWT_SECRET=sua-chave-secreta-aqui
DATABASE_URL=sua-url-do-banco
```

## Próximos Passos

1. Implemente os endpoints básicos (register e login)
2. Teste com o DebugPanel do frontend
3. Implemente o endpoint `/auth/me` se necessário
4. Adicione validações e tratamento de erros
5. Conecte com um banco de dados real 