# AlinhaAgro — Segurança

## Autenticação e autorização

### Tokens JWT
- **Access token**: expira em 15 minutos — enviado em `Authorization: Bearer <token>`
- **Refresh token**: expira em 7 dias — renovado via `POST /api/auth/refresh`
- Assinatura com HMAC-SHA256, secret mínimo de 256 bits (32+ caracteres)
- Tokens são **stateless**: o backend não mantém sessão — cada requisição é validada independentemente

### Senhas
- Hash com **BCrypt custo 12** — nunca armazenadas em plaintext
- Validação: mínimo 8 caracteres, ao menos 1 maiúscula, 1 número, 1 caractere especial (`@$!%*?&`)

### Isolamento de dados (multi-tenant)
- **Todo** `WHERE` filtra por `userId` extraído do JWT — nunca aceito do body da requisição
- O `@AuthenticationPrincipal` injeta o usuário autenticado no Controller
- Um usuário nunca acessa ou altera dados de outro, mesmo conhecendo o UUID

---

## Transporte

- HTTPS obrigatório em produção (Railway e Vercel provisionam TLS automaticamente)
- HSTS configurado no servidor
- CORS configurado explicitamente:
  - Dev: `allowedOriginPatterns: "*"`
  - Prod: apenas `https://alinhaagro.com.br` e `https://www.alinhaagro.com.br`

---

## Proteções no frontend

- Tokens armazenados em `localStorage` — suficiente para MVP, migrar para `httpOnly cookie` em v2
- Refresh automático transparente: ao receber `401`, tenta renovar o token antes de redirecionar para login
- Dados sensíveis (senha_hash) nunca retornados pela API — apenas campos necessários

---

## Variáveis de ambiente sensíveis

| Variável | Onde fica | Como gerar |
|---|---|---|
| `JWT_SECRET` | Railway env vars | 64 chars aleatórios (ver RUNBOOK.md) |
| `DATABASE_PASS` | Railway env vars | Gerado pelo Railway automaticamente |
| `SENTRY_DSN` | Railway env vars | Painel Sentry → Project Settings |

**Nunca commitar** `.env`, secrets, ou senhas no repositório. O `.gitignore` já bloqueia `.env`.

---

## Rate limiting

- Planejado para `POST /api/auth/login` e `POST /api/auth/register` com **Bucket4j**
- Limite previsto: 10 tentativas por minuto por IP
- Retorna `429 Too Many Requests` ao exceder

---

## LGPD

- `send-default-pii: false` no Sentry — CPF, e-mail e dados pessoais não enviados ao Sentry
- Dados do usuário deletáveis via `DELETE /api/users/me` (a implementar)
- Banco no Brasil (Railway pode hospedar em us-east — avaliar Fly.io BR quando disponível)

---

## Checklist de segurança por PR

- [ ] Nenhum secret ou senha hardcoded
- [ ] Novo endpoint protegido com `@PreAuthorize` ou regra em `SecurityConfig`
- [ ] Dados retornados filtrados por `userId` do token
- [ ] Entrada validada com Bean Validation (`@NotBlank`, `@Min`, etc.)
- [ ] SQL sem concatenação de string (usar parâmetros JPA/JPQL)
- [ ] CHANGELOG atualizado se mudança de comportamento de segurança