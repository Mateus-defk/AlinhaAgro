# Changelog

Todas as mudanças notáveis são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [Não lançado]

### Planejado
- Rate limiting com Bucket4j nos endpoints de auth
- Testes de integração com Testcontainers
- Dashboard endpoint (resumo geral por safra)

---

## [0.2.0] — 2026-06-06

### Adicionado
- `GET /api/users/me` — dados do usuário autenticado sem senha_hash
- `AuthResponse` com campo `expiraEm: 900` (segundos)
- **Módulo Áreas** — CRUD completo com validação de limite de plano
- **Módulo Lançamentos** — CRUD + `GET /resumo` com totalReceitas, totalDespesas, saldo
- **Módulo Estoque** — CRUD + `PATCH /baixar` com validação de quantidade disponível
- **Módulo Pragas** — CRUD + sub-recurso `acoes` (listar, criar, deletar)
- **Módulo Irrigação** — CRUD completo
- **Módulo Mão de Obra** — CRUD completo
- **Módulo Preços de Mercado** — listagem pública + criação/deleção autenticada
- `PlanLimitService` — limites por plano (áreas: 3/8/∞, estoque: 20/60/∞)
- 8 entidades JPA: `Area`, `Lancamento`, `Estoque`, `Praga`, `AcaoPraga`, `Irrigacao`, `MaoDeObra`, `PrecoMercado`
- 8 repositories Spring Data JPA
- `422 Unprocessable Entity` para baixa de estoque com quantidade insuficiente
- `API.md` atualizado com todos os 30+ endpoints documentados

---

## [0.1.0] — 2026-06-06

### Adicionado
- Estrutura do projeto Spring Boot 4.x + Java 21 + Maven
- Configuração do banco: PostgreSQL 16 via Docker Compose
- Migrations Flyway V1–V8:
  - `V1` — tabela `users`
  - `V2` — tabela `areas`
  - `V3` — tabela `lancamentos`
  - `V4` — tabela `estoque`
  - `V5` — tabelas `pragas` e `acoes_praga`
  - `V6` — tabela `irrigacao`
  - `V7` — tabela `mao_de_obra`
  - `V8` — tabela `precos_mercado`
- Segurança completa:
  - Spring Security stateless com JWT (access 15 min / refresh 7 dias)
  - BCrypt com custo 12
  - `JwtService` — gerar/validar tokens com jjwt 0.12.x
  - `JwtAuthFilter` — filtro de autenticação por requisição
  - `UserDetailsServiceImpl` — carrega usuário do banco
  - `SecurityConfig` — CORS + rotas públicas/protegidas
- Endpoints de autenticação: `POST /api/auth/register`, `/login`, `/refresh`
- `GlobalExceptionHandler` com ProblemDetail (RFC 9457)
- Swagger UI via SpringDoc OpenAPI em `/swagger-ui.html`
- Integração com Sentry (monitoramento de erros)
- Testes unitários:
  - `JwtServiceTest` — 6 casos
  - `AuthServiceTest` — 6 casos
  - `ApiApplicationTests` — smoke test com H2
- Documentação: `docs/` com API.md, ARCHITECTURE.md, VISION.md, INTEGRATION.md, RUNBOOK.md, WORKFLOW.md, CHANGELOG.md