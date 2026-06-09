# AgroGestão — Status de Integração Frontend ↔ Backend

Última atualização: 2026-06-06

---

## Visão geral

O AgroGestão migrou de um modelo **offline / localStorage** para uma arquitetura **SaaS com backend Spring Boot + PostgreSQL**. Esta página documenta o estado atual de cada módulo e o que ainda usa localStorage como fallback.

---

## Módulos integrados à API REST

| Módulo | Endpoint backend | Status |
|--------|-----------------|--------|
| Login / Cadastro | `POST /api/auth/login` `POST /api/auth/register` | ✅ Integrado |
| Restaurar sessão | `GET /api/users/me` + `GET /api/areas` + `GET /api/lancamentos` | ✅ Integrado |
| Logout | `Token.clear()` + `Store.clear()` | ✅ Integrado |
| Áreas | `GET/POST/DELETE /api/areas` | ✅ Integrado |
| Lançamentos | `GET/POST/DELETE /api/lancamentos` | ✅ Integrado |
| Dashboard | Lê de `Store.areas` / `Store.lancamentos` | ✅ Integrado |
| Relatório | Lê de `Store.areas` / `Store.lancamentos` | ✅ Integrado |
| Preços de Mercado | `GET /api/precos-mercado` | ✅ Integrado |
| Admin — usuários | `GET/DELETE /api/users` | ✅ Integrado |

---

## Módulos ainda usando localStorage

| Módulo | Chave localStorage | Motivo |
|--------|-------------------|--------|
| Estoque | `ag_estoque` | Campo mapeados diferente do backend (`tipo` organico/quimico/adubo vs semente/fertilizante/defensivo/outro) — migração pendente |
| Pragas | `ag_pragas` | Formulário de criação ainda não implementado no HTML; campo `nivelSeveridade` difere da UI |
| Irrigação | `ag_irrigacao` | Mesma razão — formulário não existe no HTML ainda |
| Variedades/Produtos/Mão de Obra | `ag_variedades` `ag_produtos` `ag_maodeobra` | Backend tem endpoints mas formulários precisam ser adaptados |
| Estimativas de colheita | `ag_ests` | Sem endpoint backend para estimativas; armazenado localmente com referência por `areaId` (UUID) |

---

## Arquitetura de dados no frontend

### Store (cache em memória, via `js/core/store.js`)
Carregado uma vez após login. Acessado por qualquer módulo sem chamadas duplicadas.

```
Store.areas           → Area[]   (GET /api/areas)
Store.lancamentos     → Lancamento[]  (GET /api/lancamentos)
Store.areaById(id)    → Area | null
Store.criarArea(payload)       → POST /api/areas  + push no cache
Store.atualizarArea(id, p)     → PUT  /api/areas/:id + update no cache
Store.deletarArea(id)          → DELETE /api/areas/:id + filter do cache
Store.criarLancamento(payload) → POST /api/lancamentos + unshift no cache
Store.deletarLancamento(id)    → DELETE /api/lancamentos/:id + filter do cache
Store.clear()                  → Limpa tudo ao fazer logout
```

### Token (via `js/core/api.js`)
```
Token.save({ accessToken, refreshToken, plano })
Token.clear()
Token.hasAccess()   → boolean
```
Auto-refresh em respostas 401: o `api.js` tenta `POST /api/auth/refresh` antes de deslogar.

---

## Fluxo de autenticação

```
1. POST /api/auth/login  →  accessToken + refreshToken
2. Token.save()          →  localStorage (ag_access_token, ag_refresh_token)
3. Promise.all([
     GET /api/users/me,
     GET /api/areas + GET /api/lancamentos  (Store.load)
   ])
4. State.user = userProfile
5. router.go('app')      →  carrega Dashboard
```

Em caso de 401 em qualquer requisição:
```
api.js  →  POST /api/auth/refresh
     ✓ token válido  →  reenvia requisição original
     ✗ refresh falhou → dispara evento 'ag:sessionExpired' → router.go('landing')
```

---

## Mapeamento de campos: frontend ↔ backend

### Áreas

| Frontend (JS) | Backend (JSON) | Tipo |
|---------------|---------------|------|
| `a.id` | `id` (UUID) | string |
| `a.nome` | `nome` | string |
| `a.ha` | `ha` | number (BigDecimal) |
| `a.variedade` | `variedade` | string |
| `a.plantio` | `plantio` | string YYYY-MM-DD |
| `a.status` | `status` | `ativa\|inativa\|colhida` |
| `a.obs` | `obs` | string |
| `a.colheitaIni` | `colheitaIni` | integer 1–12 |
| `a.colheitaFim` | `colheitaFim` | integer 1–12 |
| `a.criadoEm` | `criadoEm` | ISO 8601 Instant |

### Lançamentos

| Frontend (JS) | Backend (JSON) | Tipo |
|---------------|---------------|------|
| `l.id` | `id` (UUID) | string |
| `l.areaId` | `areaId` (UUID) | string |
| `l.areaNome` | `areaNome` | string (join do backend) |
| `l.tipo` | `tipo` | `receita\|despesa\|investimento` |
| `l.categoria` | `categoria` | string |
| `l.descricao` | `descricao` | string |
| `l.fornecedor` | `fornecedor` | string |
| `l.valor` | `valor` | number (BigDecimal) |
| `l.data` | `data` | string YYYY-MM-DD |
| `l.criadoEm` | `criadoEm` | ISO 8601 Instant |

---

## Migração V9 do banco de dados

A migração `V9__align_fields.sql` alinha o schema do banco ao modelo do frontend:

| Coluna anterior | Coluna atual | Tabela |
|-----------------|-------------|--------|
| `tamanho_ha` | `ha` | areas |
| `cultura` | `variedade` | areas |
| `data_plantio` | `plantio` | areas |
| `observacoes` | `obs` | areas |
| — | `colheita_ini` | areas (novo) |
| — | `colheita_fim` | areas (novo) |
| — | `fornecedor` | lancamentos (novo) |
| constraint tipo | `receita\|despesa\|investimento` | lancamentos |

---

## Integrações externas planejadas

### HF Brasil — Preços Médios de Manga
- Admin coleta dados em [hfbrasil.org.br](https://www.hfbrasil.org.br) semanalmente
- Insere via `POST /api/precos-mercado` (admin only)
- Usuários do plano Anual Premium visualizam em Mercado
- **Roadmap:** Import automático de planilha `.xlsx`

### CEPEA/ESALQ — Automação futura
- Sem API pública — requer scraping ou parceria
- Endpoint previsto: `POST /api/admin/precos/sync?fonte=cepea`

### NF-e — Import de lançamentos
- Produtor faz upload do XML da NF-e de compra de insumos
- Backend extrai produto, valor, fornecedor, data
- Pré-preenche formulário de lançamento de despesa
- Endpoint previsto: `POST /api/lancamentos/importar-nfe`

### Exportação para bancos / crédito rural
- PDF consolidado com KPIs + histórico de lançamentos
- Endpoint previsto: `GET /api/relatorios/credito-rural?formato=pdf`
