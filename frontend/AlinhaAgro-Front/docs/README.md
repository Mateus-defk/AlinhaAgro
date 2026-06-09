# AgroGestão

Sistema de gestão financeira e operacional para produtores rurais do agronegócio brasileiro, com foco em fruticultura irrigada do Vale do São Francisco.

## Visão Geral

O AgroGestão permite ao produtor controlar áreas de produção, lançamentos financeiros, estimativas de colheita, estoque, pragas, irrigação e muito mais — com uma interface pensada para uso no celular, mesmo em áreas rurais com conectividade limitada.

## Planos

| Plano      | Preço         | Áreas | Estoque | Premium |
|-----------|---------------|-------|---------|---------|
| Mensal     | R$ 159,90/mês  | 3     | —       | Não     |
| Trimestral | R$ 369,90/trim.| 8     | 30 itens| Não     |
| Anual      | R$ 1.500,00/ano| ∞     | ∞       | Sim     |

## Stack

### Frontend (este repositório)
- HTML5 semântico + CSS3 modular + JavaScript ES6 Modules
- Sem frameworks — vanilla JS puro
- Design system próprio (Luxury Agrarian · Dark Premium)
- Fontes: Fraunces (serif), Plus Jakarta Sans, DM Mono
- Ícones: Tabler Icons (CDN)
- Persistência atual: localStorage (offline-first)

### Backend (em desenvolvimento)
- Java 21 + Spring Boot 3.x
- PostgreSQL 16
- JWT para autenticação
- API REST — contrato documentado em [API.md](./API.md)

### Infraestrutura
- Hospedagem: Hostgator (cPanel)
- Domínio: Registra.br → agrogestao.com.br
- CI/CD: GitHub Actions (FTP deploy para Hostgator)

## Estrutura do Projeto

```
agrogestao/
├── .github/
│   └── workflows/
│       ├── ci.yml          # Lint + validação em cada PR
│       └── deploy.yml      # Deploy automático em push para main
├── frontend/
│   ├── css/
│   │   ├── base/           # Variáveis, reset, tipografia, animações
│   │   ├── components/     # Botões, cards, formulários, modais, nav, tabelas, toasts
│   │   ├── sections/       # Landing, auth, app
│   │   └── main.css        # Entry point CSS (@import de tudo)
│   ├── js/
│   │   ├── core/           # config, state, storage, auth, router
│   │   ├── modules/        # dashboard, áreas, lançamentos, colheita, relatório,
│   │   │                   # estoque, variedades, campo, mercado, admin
│   │   ├── utils/          # formatters, validators, toast, charts
│   │   └── main.js         # Entry point JS
│   ├── assets/
│   │   └── images/
│   ├── index.html
│   └── package.json
├── .env.example            # Template de variáveis de ambiente
├── .gitignore
└── README.md
```

## Módulos

| Módulo        | Arquivo                      | Descrição                                    |
|--------------|------------------------------|----------------------------------------------|
| Dashboard    | `js/modules/dashboard.js`    | KPIs, gráficos mensais, calendário de colheita |
| Áreas        | `js/modules/areas.js`        | CRUD de talhões/áreas de produção             |
| Lançamentos  | `js/modules/lancamentos.js`  | Receitas, despesas e investimentos            |
| Colheita     | `js/modules/colheita.js`     | Estimativa de produção e lucro por área       |
| Relatório    | `js/modules/relatorio.js`    | Consolidado com gráficos de pizza e barras    |
| Estoque      | `js/modules/estoque.js`      | Controle de insumos e alertas de mínimo       |
| Cadastros    | `js/modules/variedades.js`   | Variedades, produtos e mão de obra            |
| Campo        | `js/modules/campo.js`        | Pragas/MIP e irrigação                       |
| Mercado      | `js/modules/mercado.js`      | Preços HF Brasil — manga (Premium)            |
| Admin        | `js/modules/admin.js`        | Painel administrativo — usuários e preços     |

## Rodando localmente

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/agrogestao.git
cd agrogestao/frontend

# 2. Instale dependências de desenvolvimento (opcional — apenas para lint)
npm install

# 3. Sirva os arquivos estáticos
npm run dev
# ou simplesmente abra frontend/index.html no navegador
```

O app funciona 100% sem servidor — basta abrir o `index.html` no navegador.

## Deploy (Hostgator via GitHub Actions)

1. Configure os Secrets no GitHub:
   - `FTP_HOST` → endereço FTP da Hostgator
   - `FTP_USER` → usuário FTP
   - `FTP_PASSWORD` → senha FTP
   - `FTP_REMOTE_PATH` → `/public_html` (ou subdiretório)
   - `API_URL` → URL da API quando o backend estiver no ar

2. Faça push para `main` — o workflow `deploy.yml` envia os arquivos automaticamente.

## Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha os valores:

```bash
cp .env.example .env
```

O frontend lê as variáveis via `window.__ENV__` injetado pelo servidor em produção (veja `deploy.yml`).

## Roadmap de Migração para API REST

A aplicação atualmente usa **localStorage** para todos os dados. Quando o backend Spring Boot estiver pronto, a migração ocorre em `js/core/storage.js`:

- `Storage.get()` → `fetch(API_URL + '/endpoint')`
- `Storage.set()` → `fetch(API_URL + '/endpoint', { method: 'POST', body: ... })`
- `auth.js` → Trocar senha plaintext por JWT via `/auth/login` e `/auth/register`

O contrato da API REST está documentado em [API.md](./API.md).

## Documentação Adicional

- [API.md](./API.md) — Endpoints da API REST (Spring Boot)
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Arquitetura técnica detalhada
- [VISION.md](./VISION.md) — Visão de produto e roadmap
- [SECURITY.md](./SECURITY.md) — Considerações de segurança
- [CHANGELOG.md](./CHANGELOG.md) — Histórico de versões

---

Desenvolvido para produtores rurais brasileiros · Vale do São Francisco · 2025
