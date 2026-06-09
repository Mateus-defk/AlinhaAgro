# AgroGestão — Arquitetura Técnica

## Visão geral

O AgroGestão é uma **Single Page Application (SPA) de arquivo único** (`Agrogestao.html`). Toda a lógica, estilos e estrutura estão contidos em um único arquivo HTML de ~7.100 linhas, sem dependências externas de runtime — apenas fontes e ícones via CDN.

```
Agrogestao.html
├── <style>        — CSS completo (~1.200 linhas)
├── <body>         — HTML estrutural (~700 linhas)
│   ├── Landing page (planos, auth)
│   ├── App (seções: dash, campo, lanc, orçamento, relatório...)
│   ├── Admin panel
│   └── Modais
└── <script>       — JavaScript (~5.200 linhas, 161 funções)
```

---

## Persistência de dados

Todo o estado da aplicação vive no **localStorage** do navegador.

### Chaves de armazenamento

| Chave | Tipo | Escopo | Descrição |
|---|---|---|---|
| `ag_users` | Array | Global | Todos os usuários cadastrados |
| `ag_session` | Object | Global | Sessão ativa (userId) |
| `ag_precos_medios` | Array | Global | Preços HF Brasil (admin) |
| `ag_estoque_{userId}` | Array | Por usuário | Itens em estoque |
| `ag_programados_{userId}` | Array | Por usuário | Lançamentos programados |
| `ag_maodeobra_{userId}` | Array | Por usuário | Cadastro de colaboradores |
| `ag_variedades_{userId}` | Array | Por usuário | Variedades cadastradas |
| `ag_produtos_{userId}` | Array | Por usuário | Produtos cadastrados |
| `ag_pragas_{userId}` | Array | Por usuário | Ocorrências de pragas |
| `ag_irrigacao_{userId}` | Array | Por usuário | Registros de irrigação |

### Dados do usuário (embutidos no objeto `ag_users`)

Dentro de cada usuário no array `ag_users`:

```js
{
  id: string,
  nome: string,
  email: string,
  senha: string,       // plaintext — sem backend, sem hash
  plano: 'mensal' | 'trimestral' | 'anual' | 'admin',
  areas: Area[],       // talhões cadastrados
  lancs: Lancamento[], // histórico financeiro
  ests: Estimativa[],  // estimativas por área
  criado: ISO8601
}
```

---

## Estado global

```js
let CU = null;  // Current User — objeto do usuário logado
```

A função auxiliar `_k(sk)` gera chaves de localStorage isoladas por usuário:
```js
function _k(sk) { return CU ? sk + '_' + CU.id : sk; }
```

---

## Navegação

O sistema usa uma navegação baseada em IDs de seção, sem roteamento de URL.

```
ir(id)
  ├── Oculta todas as .sec
  ├── Exibe sec-{id}
  ├── Atualiza classe .ativo nos links de nav
  └── Chama a função de render correspondente
```

### Mapa de rotas

| ID | Seção | Função de render |
|---|---|---|
| `dash` | Dashboard | `renderDash()` |
| `campo` | Campo (sub-abas) | `mudarCampoTab('areas')` |
| `lanc` | Lançamentos | `renderLanc()` |
| `orcamento` | Orçamento vs Realizado | `renderOrcamento()` |
| `relatorio` | Relatório Consolidado | `renderRel()` |
| `estoque` | Estoque | `renderEstoque()` |
| `variedades` | Cadastros | `renderVariedades()` |
| `mercado` | Mercado HF Brasil | `renderMercado()` |

---

## Camadas da aplicação

```
┌─────────────────────────────────────┐
│           Interface (HTML/CSS)       │
│  Landing · App · Admin · Modais      │
├─────────────────────────────────────┤
│         Render Functions (JS)        │
│  renderDash · renderLanc · renderRel │
│  renderEstoque · renderPragas ...    │
├─────────────────────────────────────┤
│          Business Logic (JS)         │
│  salvar* · deletar* · editar*        │
│  calcular* · preencher*              │
├─────────────────────────────────────┤
│           Storage Layer (JS)         │
│  get/set Users · Estoque · Pragas    │
│  Irrigacoes · MaoDeObra · Produtos   │
├─────────────────────────────────────┤
│            localStorage              │
└─────────────────────────────────────┘
```

---

## Módulos funcionais

### Autenticação
- `fazerLogin()` / `fazerCadastro()` / `sair()`
- `entrarApp(user)` — inicializa estado e renderiza dashboard
- `initAdmin()` — garante conta admin na primeira execução

### Campo
- Sub-abas: Áreas, Colheita, Pragas, Irrigação
- `mudarCampoTab(tab)` — controla visibilidade dos painéis
- Wrappers `-C` para cada sub-aba (ex: `salvarPragaC()`, `renderIrrigacaoC()`)

### Financeiro
- `salvarLanc()` — valida, salva, atualiza estoque se produto vinculado
- `calcularCamposVenda()` — lógica 3-way: valor × quantidade × preço/kg
- `calcularValorMO()` — mão de obra: quantidade × valor/unidade

### Relatório
- `renderRel()` — gera HTML completo com KPIs, gráficos SVG, tabelas
- `gerarPizzaSVG()` / `gerarBarrasSVG()` — gráficos vetoriais inline
- Inclui seções: Pragas (MIP) e Irrigação com gráficos dinâmicos

### Planos e limites
```js
const PLANOS = {
  mensal:     { maxAreas: 3,    maxHa: 5,    premium: false, maxEstoque: 0    },
  trimestral: { maxAreas: 8,    maxHa: 10,   premium: false, maxEstoque: 30   },
  anual:      { maxAreas: 9999, maxHa: 9999, premium: true,  maxEstoque: 9999 },
  admin:      { maxAreas: 9999, maxHa: 9999, premium: true,  maxEstoque: 9999 },
}
```

---

## Dependências externas (CDN)

| Recurso | URL | Uso |
|---|---|---|
| Tabler Icons | `cdn.jsdelivr.net/npm/@tabler/icons-webfont` | Ícones da navegação |
| Google Fonts | `fonts.googleapis.com` | Fraunces, Plus Jakarta Sans, DM Mono |

Sem frameworks JS, sem bundler, sem build step.

---

## Limitações conhecidas

| Limitação | Impacto | Mitigação futura |
|---|---|---|
| localStorage (~5MB) | Limite de dados por usuário | Exportação JSON + backend |
| Sem sincronização | Dados presos no dispositivo | API REST + sync |
| Senha em plaintext | Segurança básica | Hash bcrypt no backend |
| Single-file | Manutenção complexa | Migrar para Vue/React + build |
| Sem backup automático | Risco de perda de dados | Export periódico + cloud save |

---

## Limites por plano (atualizado v2.1)

```js
const PLANOS = {
  mensal:     { maxAreas:3,    maxLancs:50,   maxEstoque:0,    maxCadastros:0    },
  trimestral: { maxAreas:8,    maxLancs:200,  maxEstoque:30,   maxCadastros:15   },
  anual:      { maxAreas:9999, maxLancs:9999, maxEstoque:9999, maxCadastros:9999 },
}
```

## Terminologia oficial

| Conceito | Termo correto no sistema |
|---|---|
| Subdivisão da propriedade | Área / Talhão / Área de produção |
| Limite do plano Mensal | 3 áreas de produção / 50 lançamentos por mês |
| Limite do plano Trimestral | 8 áreas de produção / 200 lançamentos por mês |
