# AlinhaAgro — Referência da API REST

**Base URL prod:** `https://api.alinhaagro.com.br`  
**Base URL dev:** `http://localhost:8080`  
**Swagger UI:** `http://localhost:8080/swagger-ui.html`

Todas as rotas (exceto `/api/auth/**` e `GET /api/precos-mercado`) exigem:
```
Authorization: Bearer <accessToken>
```

---

## Limites por plano

| Recurso | Mensal | Trimestral | Anual/Admin |
|---|---|---|---|
| Áreas | 3 | 8 | Ilimitado |
| Itens de estoque | 20 | 60 | Ilimitado |

Ultrapassar o limite retorna `402 Payment Required`.

---

## 1. Autenticação `/api/auth`

### POST /api/auth/register — Cadastro
```json
// Request
{ "nome": "Natanael", "email": "nat@email.com", "senha": "Agro@2025!", "plano": "anual" }

// Response 201
{ "accessToken": "eyJ...", "refreshToken": "eyJ...", "tipo": "Bearer", "plano": "anual", "expiraEm": 900 }
```
Erros: `400` validação | `409` e-mail já cadastrado

### POST /api/auth/login
```json
// Request
{ "email": "nat@email.com", "senha": "Agro@2025!" }

// Response 200 — mesmo formato do register
```
Erros: `401` credenciais incorretas | `403` conta desativada

### POST /api/auth/refresh
```json
// Request
{ "refreshToken": "eyJ..." }

// Response 200 — mesmo formato do register
```
Erro: `401` token inválido ou expirado

---

## 2. Usuário `/api/users`

### GET /api/users/me — Dados do usuário autenticado
```json
// Response 200
{
  "id": "uuid",
  "nome": "Natanael",
  "email": "nat@email.com",
  "plano": "anual",
  "ativo": true,
  "criadoEm": "2026-06-06T23:51:49Z"
}
```

---

## 3. Áreas `/api/areas`

### GET /api/areas — Listar todas as áreas
```json
// Response 200
[
  {
    "id": "uuid",
    "nome": "Talhão 01",
    "tamanhoHa": 5.5,
    "cultura": "Manga Tommy",
    "dataPlantio": "2024-03-15",
    "status": "ativa",
    "observacoes": null,
    "criadoEm": "2026-06-06T12:00:00Z"
  }
]
```

### GET /api/areas/{id}
Response 200 — objeto único | `404` não encontrado

### POST /api/areas — Criar área
```json
// Request
{
  "nome": "Talhão 02",
  "tamanhoHa": 3.2,
  "cultura": "Uva Italia",
  "dataPlantio": "2025-01-20",
  "status": "ativa",
  "observacoes": "Solo arenoso"
}
// Response 201 — AreaResponse
```
Erros: `400` validação | `402` limite do plano

### PUT /api/areas/{id} — Atualizar
Body: mesmo esquema do POST | Response 200

### DELETE /api/areas/{id}
Response `204 No Content` | `404` não encontrado

**status válidos:** `ativa` | `inativa` | `colhida`

---

## 4. Lançamentos `/api/lancamentos`

### GET /api/lancamentos
Query params opcionais: `tipo=receita|despesa`, `areaId=uuid`
```json
// Response 200 — array de LancamentoResponse
[
  {
    "id": "uuid",
    "areaId": "uuid-ou-null",
    "tipo": "despesa",
    "categoria": "Defensivos",
    "descricao": "Fungicida Captan",
    "valor": 850.00,
    "data": "2025-06-01",
    "criadoEm": "2026-06-01T10:00:00Z"
  }
]
```

### GET /api/lancamentos/resumo — Resumo financeiro do período
Query params: `inicio=2025-01-01&fim=2025-06-30` (padrão: mês atual)
```json
// Response 200
{
  "totalReceitas": 25000.00,
  "totalDespesas": 8500.00,
  "saldo": 16500.00,
  "periodo": { "inicio": "2025-01-01", "fim": "2025-06-30" }
}
```

### GET /api/lancamentos/{id}
### POST /api/lancamentos
```json
// Request
{
  "areaId": "uuid (opcional)",
  "tipo": "despesa",
  "categoria": "Defensivos",
  "descricao": "Fungicida Captan",
  "valor": 850.00,
  "data": "2025-06-01"
}
// Response 201
```
**tipo válido:** `receita` | `despesa`

### PUT /api/lancamentos/{id}
### DELETE /api/lancamentos/{id} → `204`

---

## 5. Estoque `/api/estoque`

### GET /api/estoque
Query param opcional: `tipo=semente|fertilizante|defensivo|outro`

### GET /api/estoque/{id}
### POST /api/estoque
```json
// Request
{
  "areaId": "uuid (opcional)",
  "produto": "Captan 500g",
  "tipo": "defensivo",
  "quantidade": 10.0,
  "unidade": "kg",
  "custoUnitario": 85.00,
  "validade": "2026-01-01"
}
// Response 201
```
Erro: `402` limite do plano

### PUT /api/estoque/{id}

### PATCH /api/estoque/{id}/baixar — Dar baixa no estoque
```json
// Request
{ "quantidade": 2.5 }
// Response 200 — EstoqueResponse atualizado
```
Erro: `422 Unprocessable Entity` se quantidade insuficiente

### DELETE /api/estoque/{id} → `204`

**tipo válido:** `semente` | `fertilizante` | `defensivo` | `outro`

---

## 6. Pragas `/api/pragas`

### GET /api/pragas
Query param opcional: `areaId=uuid`

### GET /api/pragas/{id}
### POST /api/pragas
```json
// Request
{
  "areaId": "uuid (opcional)",
  "nome": "Mosca-da-fruta",
  "tipo": "praga",
  "nivelSeveridade": "medio",
  "dataIdentificacao": "2025-05-20",
  "observacoes": "Incidência no setor norte"
}
// Response 201
```

### PUT /api/pragas/{id}
### DELETE /api/pragas/{id} → `204`

**tipo válido:** `praga` | `doenca` | `erva-daninha`  
**nivelSeveridade válido:** `baixo` | `medio` | `alto` | `critico`

### GET /api/pragas/{id}/acoes — Listar ações de controle

### POST /api/pragas/{id}/acoes — Registrar ação
```json
// Request
{
  "descricao": "Aplicação de isca proteica",
  "produtoUsado": "Success 0,08 CB",
  "custo": 320.00,
  "dataAplicacao": "2025-05-22"
}
// Response 201 — AcaoPragaResponse
```

### DELETE /api/pragas/{pragaId}/acoes/{acaoId} → `204`

---

## 7. Irrigação `/api/irrigacao`

### GET /api/irrigacao
Query param opcional: `areaId=uuid`

### GET /api/irrigacao/{id}
### POST /api/irrigacao
```json
// Request
{
  "areaId": "uuid (opcional)",
  "data": "2025-06-05",
  "duracaoMin": 120,
  "laminaMm": 8.5,
  "custo": 45.00,
  "observacoes": "Turno manhã"
}
// Response 201
```

### PUT /api/irrigacao/{id}
### DELETE /api/irrigacao/{id} → `204`

---

## 8. Mão de Obra `/api/mao-de-obra`

### GET /api/mao-de-obra
Query param opcional: `areaId=uuid`

### GET /api/mao-de-obra/{id}
### POST /api/mao-de-obra
```json
// Request
{
  "areaId": "uuid (opcional)",
  "descricao": "Raleio de frutos",
  "tipo": "diarista",
  "quantidadePessoas": 4,
  "valorTotal": 480.00,
  "data": "2025-05-28"
}
// Response 201
```
**tipo válido:** `diarista` | `mensalista` | `empreitada`

### PUT /api/mao-de-obra/{id}
### DELETE /api/mao-de-obra/{id} → `204`

---

## 9. Preços de Mercado `/api/precos-mercado`

Rota pública (sem autenticação) para leitura.

### GET /api/precos-mercado
Query param opcional: `cultura=Manga+Tommy`
```json
// Response 200
[
  { "id": "uuid", "cultura": "Manga Tommy", "precoKg": 3.80, "fonte": "CEASAMINAS", "data": "2025-06-05", "criadoEm": "..." }
]
```

### POST /api/precos-mercado *(requer auth)*
```json
// Request
{ "cultura": "Manga Tommy", "precoKg": 3.80, "fonte": "CEASAMINAS", "data": "2025-06-05" }
// Response 201
```

### DELETE /api/precos-mercado/{id} *(requer auth)* → `204`

---

## Formato de Erros — ProblemDetail (RFC 9457)

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Dados inválidos",
  "instance": "/api/areas",
  "errors": ["nome: não deve estar em branco", "tamanhoHa: deve ser maior que 0"]
}
```

| Status | Situação |
|---|---|
| 400 | Dados inválidos (validação Bean Validation) |
| 401 | Não autenticado / token expirado |
| 402 | Limite do plano atingido |
| 403 | Conta desativada |
| 404 | Recurso não encontrado |
| 409 | E-mail já cadastrado |
| 422 | Lógica de negócio (ex: estoque insuficiente) |
| 500 | Erro interno |