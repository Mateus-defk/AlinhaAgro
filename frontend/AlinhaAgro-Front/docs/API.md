# AgroGestão — Referência da API REST

Backend: Spring Boot 4.0.6 + Java 21 · Porta padrão: **8080**  
Base URL: `http://localhost:8080/api`  
Swagger UI: `http://localhost:8080/swagger-ui/index.html`  
Auth: **Bearer JWT** — incluir header `Authorization: Bearer <token>` em todas as rotas protegidas.

---

## Autenticação (`/api/auth`)

### POST `/api/auth/register`
Cria conta e retorna tokens.

**Body:**
```json
{ "nome": "Natanael", "email": "user@email.com", "senha": "minimo6", "plano": "mensal" }
```
**Planos aceitos:** `mensal | trimestral | anual | admin`

**Resposta 201:**
```json
{ "accessToken": "...", "refreshToken": "...", "plano": "mensal" }
```

---

### POST `/api/auth/login`
Autentica e retorna tokens.

**Body:**
```json
{ "email": "user@email.com", "senha": "minimo6" }
```

**Resposta 200:** mesma estrutura do register.  
**Erros:** `401` credenciais inválidas, `403` conta inativa.

---

### POST `/api/auth/refresh`
Renova o accessToken usando o refreshToken.

**Body:**
```json
{ "refreshToken": "..." }
```

---

## Usuário (`/api/users`) — Requer token

### GET `/api/users/me`
Retorna o perfil do usuário autenticado.

```json
{ "id": "uuid", "nome": "Natanael", "email": "...", "plano": "mensal", "ativo": true, "criadoEm": "2026-06-01T..." }
```

---

### GET `/api/users` — Admin only
Lista todos os usuários (exceto admins). Retorna `403` se `plano != admin`.

---

### DELETE `/api/users/{id}` — Admin only
Remove um usuário. Retorna `400` se tentar remover a própria conta.

---

## Áreas (`/api/areas`) — Requer token

### GET `/api/areas`
Lista todas as áreas do usuário autenticado.

**Resposta:**
```json
[
  {
    "id": "uuid",
    "nome": "Talhão A1",
    "ha": 3.5,
    "variedade": "Tommy Atkins",
    "plantio": "2022-07-01",
    "status": "ativa",
    "obs": "Solo arenoso",
    "colheitaIni": 9,
    "colheitaFim": 11,
    "criadoEm": "2026-06-01T..."
  }
]
```

**Status aceitos:** `ativa | inativa | colhida`

---

### POST `/api/areas`
Cria uma nova área.

**Body:**
```json
{
  "nome": "Talhão A1",
  "ha": 3.5,
  "variedade": "Tommy Atkins",
  "plantio": "2022-07-01",
  "status": "ativa",
  "obs": "Texto livre",
  "colheitaIni": 9,
  "colheitaFim": 11
}
```

**Regras:** `nome` obrigatório, `ha` > 0, `colheitaIni/Fim` entre 1–12.

---

### GET `/api/areas/{id}`
Busca uma área por ID.

---

### PUT `/api/areas/{id}`
Atualiza todos os campos de uma área.

---

### DELETE `/api/areas/{id}`
Remove uma área (retorna `409` se tiver lançamentos vinculados).

---

## Lançamentos (`/api/lancamentos`) — Requer token

### GET `/api/lancamentos`
Lista lançamentos com filtros opcionais.

**Query params:**
- `tipo` — `receita | despesa | investimento`
- `areaId` — UUID da área

**Resposta:**
```json
[
  {
    "id": "uuid",
    "areaId": "uuid",
    "areaNome": "Talhão A1",
    "tipo": "despesa",
    "categoria": "Irrigação",
    "descricao": "Manutenção bomba",
    "fornecedor": "Hidrotec Ltda",
    "valor": 350.00,
    "data": "2026-06-01",
    "criadoEm": "2026-06-01T..."
  }
]
```

---

### POST `/api/lancamentos`
Cria um lançamento.

**Body:**
```json
{
  "areaId": "uuid-opcional",
  "tipo": "despesa",
  "categoria": "Irrigação",
  "descricao": "Manutenção bomba",
  "fornecedor": "Hidrotec Ltda",
  "valor": 350.00,
  "data": "2026-06-01"
}
```

**Tipos aceitos:** `receita | despesa | investimento`

---

### GET `/api/lancamentos/{id}`
Busca um lançamento por ID.

---

### PUT `/api/lancamentos/{id}`
Atualiza um lançamento.

---

### DELETE `/api/lancamentos/{id}`
Remove um lançamento.

---

### GET `/api/lancamentos/resumo`
Retorna totais de receita, despesa e saldo para um período.

**Query params:** `inicio` (YYYY-MM-DD), `fim` (YYYY-MM-DD). Default: mês atual.

**Resposta:**
```json
{
  "receitas": 12000.00,
  "despesas": 4500.00,
  "saldo": 7500.00,
  "periodo": { "inicio": "2026-06-01", "fim": "2026-06-06" }
}
```

---

## Estoque (`/api/estoque`) — Requer token

### GET `/api/estoque`
Lista itens de estoque. Query param: `tipo`.

### POST `/api/estoque`
```json
{
  "areaId": "uuid-opcional",
  "produto": "Defensivo X",
  "tipo": "defensivo",
  "quantidade": 50.0,
  "unidade": "L",
  "custoUnitario": 45.00,
  "validade": "2027-01-01"
}
```
**Tipos aceitos:** `semente | fertilizante | defensivo | outro`

### PATCH `/api/estoque/{id}/baixar`
Registra saída de estoque. Body: `{ "quantidade": 5.0 }`

### PUT `/api/estoque/{id}` · DELETE `/api/estoque/{id}`

---

## Pragas (`/api/pragas`) — Requer token

### GET `/api/pragas`
Lista ocorrências. Query param: `areaId`.

### POST `/api/pragas`
```json
{
  "areaId": "uuid",
  "nome": "Mosca-da-Fruta",
  "tipo": "praga",
  "nivelSeveridade": "alto",
  "dataIdentificacao": "2026-06-01",
  "observacoes": "Detectado no talhão A1"
}
```
**Tipos aceitos:** `praga | doenca | erva-daninha`  
**Níveis:** `baixo | medio | alto | critico`

### POST `/api/pragas/{id}/acoes`
Registra ação de controle. Body: `{ "data": "2026-06-02", "descricao": "Aplicação de...", "produto": "...", "custo": 120.00 }`

### DELETE `/api/pragas/{id}` · DELETE `/api/pragas/{pragaId}/acoes/{acaoId}`

---

## Irrigação (`/api/irrigacao`) — Requer token

### GET `/api/irrigacao`
Lista registros. Query param: `areaId`.

### POST `/api/irrigacao`
```json
{
  "areaId": "uuid",
  "data": "2026-06-01",
  "duracaoMin": 120,
  "laminaMm": 8.5,
  "custo": 45.00,
  "observacoes": "Sistema de gotejamento"
}
```

### PUT `/api/irrigacao/{id}` · DELETE `/api/irrigacao/{id}`

---

## Preços de Mercado (`/api/precos-mercado`)

### GET `/api/precos-mercado`
Público. Lista preços cadastrados pelo admin.

```json
[
  { "id": "uuid", "regiao": "Vale do SF", "variedade": "Palmer", "preco": 1.48, "semana": "2026-W23" }
]
```

### POST `/api/precos-mercado` — Admin only
Cadastra novo preço. Body espelha a estrutura acima.

### DELETE `/api/precos-mercado/{id}` — Admin only

---

## Códigos de erro padrão

| Status | Significado |
|--------|-------------|
| 400 | Validação falhou (body inválido) |
| 401 | Token ausente ou expirado |
| 403 | Sem permissão (plano insuficiente ou recurso de outro usuário) |
| 404 | Recurso não encontrado |
| 409 | Conflito (e-mail já cadastrado, recurso em uso) |
| 422 | Entidade não processável |
| 500 | Erro interno do servidor |

---

## Tokens JWT

- **Access token:** validade curta (ver `application.properties`). Enviado em cada requisição.
- **Refresh token:** validade longa. Usar `POST /api/auth/refresh` para renovar.
- O frontend renova automaticamente em respostas `401` via `api.js`.

**Armazenamento no frontend (localStorage):**
```
ag_access_token   — Bearer token para requisições
ag_refresh_token  — Usado para renovar o access token
ag_plano          — Plano do usuário (cache local)
```
