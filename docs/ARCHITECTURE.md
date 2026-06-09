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
│  Spring Boot 4.x + Java 21                                  │
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
| Framework | Spring Boot 4.x |
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