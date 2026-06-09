# AgroGestão — Segurança

## Modelo de segurança atual

O AgroGestão v2.0 é um sistema **client-side only**, sem servidor. Isso implica um modelo de segurança simplificado, adequado para uso pessoal e de pequeno grupo, mas com limitações claras que devem ser comunicadas aos usuários.

---

## Autenticação

### Como funciona

```
Usuário → email + senha → fazerLogin()
  → Busca em ag_users (localStorage)
  → Compara senha em texto puro
  → Se válido: setSession(user) + entrarApp(user)
```

### Limitações

| Aspecto | Situação atual | Risco | Recomendação futura |
|---|---|---|---|
| **Armazenamento de senha** | Texto puro no localStorage | Alto em ambiente compartilhado | bcrypt hash no backend |
| **Sessão** | localStorage sem expiração | Médio | JWT com TTL + refresh token |
| **Força da senha** | Sem validação | Baixo (uso pessoal) | Mínimo 8 chars + complexidade |
| **Brute force** | Sem limitação de tentativas | Baixo (local) | Rate limiting no backend |
| **HTTPS** | Não aplicável (arquivo local) | N/A | Obrigatório em produção web |

### Conta admin

- A conta admin é criada automaticamente pela função `initAdmin()` na primeira execução
- Credenciais padrão: `admin@agro.com` / `admin@2025`
- **⚠️ Alterar a senha padrão antes de distribuir para usuários**

---

## Dados do usuário

### O que é armazenado

Todos os dados ficam no `localStorage` do navegador do usuário:
- Dados pessoais: nome, e-mail, senha
- Dados financeiros: lançamentos, receitas, despesas
- Dados agronômicos: áreas, estimativas, pragas, irrigação
- Cadastros: variedades, produtos, mão de obra, estoque

### Isolamento entre usuários

Cada usuário tem seus dados isolados por `userId` na chave de storage:
```js
ag_estoque_{userId}
ag_pragas_{userId}
ag_maodeobra_{userId}
// etc.
```

Os dados de todos os usuários do sistema ficam no array `ag_users`. Qualquer pessoa com acesso ao navegador pode ver os dados de todos os usuários via console:
```js
localStorage.getItem('ag_users')
```

**⚠️ Implicação:** O sistema não é adequado para ambientes onde múltiplos usuários compartilham o mesmo navegador/dispositivo sem isolamento de perfil.

### Dados globais (sem autenticação)

Os preços HF Brasil (`ag_precos_medios`) são acessíveis a qualquer usuário logado — isso é intencional, pois são dados de mercado públicos curados pelo admin.

---

## Superfície de ataque

### Cenário 1: Acesso físico ao dispositivo

**Risco:** Alto. Qualquer pessoa com acesso ao dispositivo desbloqueado pode:
- Abrir o DevTools e ler o localStorage
- Ver senhas de todos os usuários
- Modificar dados financeiros

**Mitigação:** Orientar usuários a usar bloqueio de tela no dispositivo.

### Cenário 2: Arquivo HTML compartilhado

**Risco:** Baixo. O arquivo HTML não contém dados de usuários — apenas o código. Os dados ficam no localStorage do dispositivo do usuário.

**Cuidado:** Se o usuário exportar um backup JSON com dados e compartilhar, os dados estarão expostos.

### Cenário 3: Acesso via servidor web compartilhado

**Risco:** Médio-alto. Se o arquivo for servido por um servidor HTTP sem HTTPS:
- Tráfego pode ser interceptado (man-in-the-middle)
- Outros usuários no mesmo servidor podem ter acesso ao filesystem

**Recomendação:** Se servir via web, usar HTTPS obrigatoriamente.

### Cenário 4: Injeção de código

**Risco:** Baixo. Não há execução de código externo, sem `eval()`, sem inputs que geram `innerHTML` com dados não sanitizados em posições críticas.

**Atenção:** Campos de texto livre (obs, descrição) são inseridos via template literals no `innerHTML`. Usuários maliciosos poderiam inserir HTML. Em uso pessoal, risco mínimo.

---

## Recomendações para produção

Caso o sistema seja migrado para arquitetura web com backend:

### Obrigatório

- [ ] HTTPS em todos os endpoints
- [ ] Hash de senhas com bcrypt (custo mínimo 12)
- [ ] JWT com expiração (access: 15min, refresh: 7 dias)
- [ ] Validação e sanitização de inputs no backend
- [ ] Rate limiting em endpoints de autenticação (5 tentativas / minuto)
- [ ] CORS configurado para origens específicas
- [ ] Headers de segurança: CSP, HSTS, X-Frame-Options

### Recomendado

- [ ] Autenticação 2FA por e-mail (OTP)
- [ ] Auditoria de acesso (log de login, IP, user-agent)
- [ ] Criptografia de dados sensíveis em repouso (senhas, dados financeiros)
- [ ] Backup automatizado com retenção de 30 dias
- [ ] Política de senha: mínimo 8 caracteres, letras + números

### Privacidade (LGPD)

O AgroGestão coleta e armazena dados pessoais (nome, e-mail) e dados sensíveis (informações financeiras da propriedade rural). Em produção web:

- Deve ter Política de Privacidade clara
- Deve oferecer exportação e exclusão de dados (Art. 18 LGPD)
- Não deve compartilhar dados com terceiros sem consentimento
- Deve informar sobre uso de cookies/localStorage

---

## Resposta a incidentes

### Vazamento de dados de usuário

1. Identificar o escopo (quais usuários, quais dados)
2. Notificar os usuários afetados em até 72h (LGPD Art. 48)
3. Invalidar sessões ativas
4. Forçar reset de senha
5. Documentar o incidente

### Conta admin comprometida

1. Substituir o arquivo `Agrogestao.html` com nova senha admin hardcoded em `initAdmin()`
2. Distribuir o arquivo atualizado para todos os usuários
3. Orientar usuários a trocarem suas senhas
