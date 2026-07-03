# AlinhaAgro

SaaS web para gestão rural — controle financeiro, estoque, pragas e irrigação para produtores de fruticultura irrigada do Vale do São Francisco.

## Estrutura do Monorepo

```
AlinhaAgro/
├── api/          ← Backend Spring Boot 3 + Java 21 + PostgreSQL
├── frontend/     ← Frontend HTML/CSS/JS vanilla (sem framework)
└── docs/         ← Documentação do projeto
```

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Java 21, Spring Boot 3, PostgreSQL 16, JWT |
| Frontend | HTML5, CSS3 modular, JavaScript ES6 Modules |
| Deploy backend | Railway |
| Deploy frontend | Vercel |

## Rodando localmente

**Backend:**
```bash
cd api
./mvnw spring-boot:run
```

**Frontend:**
```bash
# Abra frontend/index.html no navegador
# ou sirva com qualquer servidor estático
```

## Documentação

- [docs/VISION.md](docs/VISION.md) — Visão do produto e roadmap
- [docs/API.md](docs/API.md) — Contratos dos endpoints REST
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Arquitetura técnica
- [docs/WORKFLOW.md](docs/WORKFLOW.md) — Fluxo de desenvolvimento

## Planos

| Plano | Áreas | Preço |
|---|---|---|
| Mensal | até 3 | R$ 210,00/mês |
| Trimestral | até 8 | R$ 567,00/trimestre |
| Anual | ilimitado | R$ 2.016,00/ano |

---

Desenvolvido para produtores rurais brasileiros · Vale do São Francisco