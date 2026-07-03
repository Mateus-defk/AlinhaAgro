# AlinhaAgro — Arquitetura do Sistema

## Visão geral

```
┌─────────────────────────────────────────────────────────────┐
│  CLIENTE                                                     │
│  HTML + CSS + JS vanilla                                     │
│  Hospedagem: Hostgator (FTP)                                │
│  domínio: alinhaagro.com.br                                 │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS + Bearer JWT
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND                                                     │
│  Spring Boot 3.x + Java 21                                  │
│  Hospedagem: Railway / Fly.io (Docker)                      │
│  api.alinhaagro.com.br                                      │
│                                                             │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │  Controller  │→ │    Service    │→ │   Repository    │  │
│  │  (REST API)  │  │ (Regras negócio)│  │  (Spring Data)  │  │
│  └──────────────┘  └───────────────┘  └────────┬────────┘  │
│                                                 │            │
│  ┌──────────────┐  ┌───────────────┐            │            │
│  │  JwtFilter   │  │ SecurityConfig│            ▼            │
│  │  (Auth)      │  │  (BCrypt 12)  │   ┌────────────────┐  │
│  └──────────────┘  └───────────────┘   │   PostgreSQL   │  │
│                                         │   (Flyway)     │  │
│  ┌──────────────┐  ┌───────────────┐   └────────────────┘  │
│  │  Sentry      │  │  Actuator     │                        │
│  │  (Erros)     │  │  /health      │                        │
│  └──────────────┘  └───────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Runtime | Java 21 (Virtual Threads) |
| Framework | Spring Boot 3.x |
| Segurança | Spring Security + JWT (jjwt 0.12.x) |
| Banco | PostgreSQL 16 |
| Migrations | Flyway |
| ORM | Spring Data JPA / Hibernate |
| Validação | Jakarta Bean Validation |
| Docs | SpringDoc OpenAPI (Swagger UI) |
| Monitoramento | Sentry |
| Build | Maven |
| Container | Docker + Docker Compose |
| CI | GitHub Actions |

## Estrutura de pacotes

```
com.alinhaagro.api/
├── config/          # SecurityConfig, OpenApiConfig, CorsConfig
├── controller/      # AuthController, AreaController, LancamentoController, ...
├── service/         # AuthService, AreaService, PlanLimitService, ...
├── repository/      # UserRepository, AreaRepository, ...
├── domain/          # User, Area, Lancamento, Estoque, Praga, ...
├── dto/
│   ├── auth/        # LoginRequest, RegisterRequest, AuthResponse
│   ├── area/        # AreaRequest, AreaResponse
│   └── ...
├── security/        # JwtService, JwtAuthFilter, UserDetailsServiceImpl
├── exception/       # GlobalExceptionHandler, ResourceNotFoundException, ...
└── ApiApplication.java
```

## Arquitetura do Frontend

```
frontend/
├── index.html               ← SPA entry point — todas as views renderizadas via JS
├── css/
│   ├── base/                ← variáveis, reset, tipografia, animações
│   ├── components/          ← botões, cards, formulários, modais, nav, tabelas, toasts
│   ├── sections/            ← landing, auth, app (cada seção tem seu CSS)
│   └── main.css             ← @import de tudo — único arquivo carregado no HTML
└── js/
    ├── core/                ← infraestrutura da aplicação
    │   ├── config.js        ← API_BASE_URL e constantes globais
    │   ├── api.js           ← apiFetch com interceptor de 401/refresh automático
    │   ├── auth.js          ← login, logout, tryRefresh, isAuthenticated
    │   ├── router.js        ← roteamento SPA por hash (#/dashboard, #/areas...)
    │   ├── state.js         ← estado global em memória (usuário, plano)
    │   └── store.js         ← cache em memória + CRUD via api.js (áreas, lançamentos, estoque, pragas, irrigação, mão de obra, variedades, produtos, estimativas)
    ├── modules/             ← um arquivo por tela/feature
    │   ├── dashboard.js     ← KPIs, gráficos mensais, calendário de colheita
    │   ├── areas.js         ← CRUD de talhões
    │   ├── lancamentos.js   ← receitas, despesas
    │   ├── colheita.js      ← estimativa de produção e lucro
    │   ├── estoque.js       ← insumos + alertas de mínimo
    │   ├── campo.js         ← pragas/MIP e irrigação
    │   ├── variedades.js    ← cadastros auxiliares
    │   ├── mercado.js       ← preços HF Brasil (Premium)
    │   ├── relatorio.js     ← consolidado com gráficos
    │   └── admin.js         ← painel administrativo (usuários, planos)
    └── utils/               ← funções puras sem efeito colateral
        ├── formatters.js    ← moeda, datas, números
        ├── validators.js    ← validação de formulários
        ├── toast.js         ← notificações de sucesso/erro
        ├── charts.js        ← wrappers dos gráficos
        └── confirmDialog.js ← modal de confirmação (substitui o confirm() nativo)
```

### Fluxo de renderização (SPA sem framework)

```
URL hash muda (#/areas)
        │
        ▼
router.js — mapeia hash → módulo
        │
        ▼
módulo.init() — chama api.js → backend
        │
        ▼
DOM manipulado diretamente — sem virtual DOM
```

### Persistência de dados

A migração de `localStorage` para a API REST já foi concluída. Todo módulo lê e
escreve dados através do `Store` (`js/core/store.js`), que mantém um cache em
memória e delega toda operação ao `api.js` (ex: `Store.criarArea()` →
`api.post('/areas', ...)`). O único uso de `localStorage` que resta é o de
tokens JWT (`Token` em `js/core/api.js`), que é stateless por natureza.

---

## Banco de dados — schema

```
users (1) ──< areas (1) ──< lancamentos
                        ──< estoque
                        ──< pragas ──< acoes_praga
                        ──< irrigacao
                        ──< mao_de_obra
precos_mercado (global, sem FK de usuário)
```

Migrations em `src/main/resources/db/migration/V1__create_users.sql` … `V8__create_precos_mercado.sql`.

## Segurança

- **Autenticação**: JWT com access token (15 min) + refresh token (7 dias)
- **Senhas**: BCrypt com custo 12
- **Isolamento de dados**: todo `WHERE` filtra por `user_id` extraído do token, nunca do body
- **CORS**: configurado para aceitar apenas a origem do frontend
- **Headers**: stateless (sem sessão, sem cookies)
- **Rate limiting**: a implementar com Bucket4j nos endpoints `/api/auth/**`

## Decisões de design

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Spring Boot | Node.js | Ecossistema Java maduro, validação e segurança robustas |
| PostgreSQL | MySQL | JSON nativo, melhor suporte a tipos, UUID nativo |
| Flyway | Liquibase | Mais simples para times pequenos |
| JWT stateless | Sessão em Redis | Menos infraestrutura, escala horizontal gratuita |
| Railway/Fly.io | Hostgator shared | Shared hosting não suporta Docker/JVM |
| Records para DTOs | Classes com getters | Imutabilidade, menos código com Java 16+ |
| ProblemDetail (RFC 9457) | Formato customizado | Padrão moderno nativo do Spring 6+ |