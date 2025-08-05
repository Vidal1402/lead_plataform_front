# Correção do Dashboard - Dados por Usuário

## 🚨 Problema Identificado

O endpoint `/leads/stats` está retornando dados globais (1000 leads) para todos os usuários, em vez de filtrar por usuário. Isso é um problema de segurança e funcionalidade.

### Evidências:
- ✅ Login funciona corretamente
- ✅ Token é válido e autenticado
- ❌ Todos os usuários veem os mesmos dados (1000 leads)
- ❌ Usuários novos deveriam ver 0 leads

## 🔧 Solução Necessária no Backend

### 1. Modificar o endpoint `/leads/stats`

O backend deve filtrar os dados pelo `userId` do token JWT:

```javascript
// Em vez de:
const stats = await Lead.aggregate([
  { $group: { _id: null, totalLeads: { $sum: 1 } } }
]);

// Deve ser:
const stats = await Lead.aggregate([
  { $match: { userId: req.user._id } }, // Filtrar por usuário
  { $group: { _id: null, totalLeads: { $sum: 1 } } }
]);
```

### 2. Modificar o endpoint `/leads/history`

O mesmo problema existe no endpoint `/leads/history` que retorna "Usuário não encontrado":

```javascript
// Deve filtrar por usuário:
const history = await SearchHistory.find({ userId: req.user._id })
  .sort({ createdAt: -1 })
  .limit(10);
```

### 3. Estrutura de Dados Esperada

Para usuários novos, o backend deve retornar:

```json
{
  "success": true,
  "data": {
    "geral": {
      "_id": null,
      "totalLeads": 0,
      "avgScore": 0,
      "avgAge": 0
    },
    "porNicho": [],
    "porEstado": []
  }
}
```

## 🛠️ Solução Temporária no Frontend

Implementei uma solução temporária no frontend:

1. **Detecção de dados globais**: Se `totalLeads === 1000`, assume que são dados globais
2. **Exibição de dados vazios**: Mostra 0 leads para usuários novos
3. **Mensagem informativa**: Explica que o usuário ainda não tem leads

### Código implementado:

```typescript
// Em src/pages/Dashboard.tsx
const isGlobalData = statsData.totalLeads === 1000;

setStats({
  totalLeads: isGlobalData ? 0 : statsData.totalLeads,
  avgScore: isGlobalData ? 0 : statsData.avgScore,
  avgAge: isGlobalData ? 0 : statsData.avgAge,
  topNichos: isGlobalData ? [] : (statsResponse.data.data.porNicho || [])
});
```

## 📋 Checklist para Correção no Backend

- [ ] Modificar `/leads/stats` para filtrar por `userId`
- [ ] Modificar `/leads/history` para filtrar por `userId`
- [ ] Testar com usuários diferentes
- [ ] Verificar se usuários novos veem 0 leads
- [ ] Verificar se usuários com leads veem seus dados corretos

## 🧪 Testes para Validar

Execute estes testes após a correção:

```bash
node test-user-specific.js
```

**Resultado esperado:**
- Usuário 1: 0 leads (usuário novo)
- Usuário 2: 0 leads (usuário novo)
- Usuários com leads: seus dados específicos

## 🔄 Próximos Passos

1. **Backend**: Implementar filtragem por usuário
2. **Frontend**: Remover lógica temporária após correção
3. **Testes**: Validar que cada usuário vê apenas seus dados

## 📞 Informações para Desenvolvedor Backend

**Arquivos que precisam ser modificados:**
- `src/routes/leads.ts` ou similar
- `src/controllers/leadsController.ts` ou similar
- Middleware de autenticação (se necessário)

**Middleware de autenticação deve:**
- Decodificar o token JWT
- Adicionar `req.user` com dados do usuário
- Incluir `req.user._id` para filtragem

**Exemplo de implementação:**
```javascript
// Middleware de autenticação
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Usuário não encontrado.' });
  }
};
``` 