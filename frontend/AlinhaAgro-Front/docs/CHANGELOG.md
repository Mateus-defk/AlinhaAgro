# AgroGestão — Changelog

Todas as mudanças relevantes do produto são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [3.0.0] — 2026-06-06

### Migração para backend SaaS — Spring Boot + PostgreSQL

#### Backend (C:\Users\natanael.adm\ArgoGestao\api\)

- **V9__align_fields.sql**: migração que renomeia colunas para alinhar ao modelo do frontend
  - areas: `tamanho_ha→ha`, `cultura→variedade`, `data_plantio→plantio`, `observacoes→obs`
  - areas: adicionado `colheita_ini INTEGER` e `colheita_fim INTEGER`
  - lancamentos: adicionado `fornecedor VARCHAR(150)`
  - lancamentos: constraint `tipo` atualizado para aceitar `receita|despesa|investimento`
- **Area.java**: campos renomeados (`ha`, `variedade`, `plantio`, `obs`, `colheitaIni`, `colheitaFim`)
- **AreaRequest / AreaResponse**: atualizados com novos campos
- **AreaService**: builder atualizado
- **Lancamento.java**: campo `fornecedor` adicionado
- **LancamentoRequest**: aceita `fornecedor` e `investimento` como tipo
- **LancamentoResponse**: inclui `areaNome` (join) e `fornecedor`
- **LancamentoService**: `fornecedor` persistido e retornado
- **UserController**: adicionados endpoints admin `GET /api/users` e `DELETE /api/users/{id}`

#### Frontend (C:\ArgoGestao\frontend\)

- **js/core/api.js** (novo): gerenciamento de tokens JWT, auto-refresh em 401, `ApiError`
- **js/core/store.js** (novo): cache em memória de `areas` e `lancamentos`, métodos CRUD via API
- **js/core/auth.js**: reescrito para usar JWT — `fazerLogin`, `fazerCadastro`, `restaurarSessao`, `sair`
- **js/core/config.js**: corrigida `API_URL` de `/api/v1` para `/api`
- **js/main.js**: handlers async, escuta `ag:sessionExpired`, remove dependência de `initAdmin`
- **css/sections/auth.css + app.css**: corrigido bug de CSS specificity com `#id.classe`
- **js/modules/areas.js**: migrado de `Storage.getUsers()` para `Store.criarArea/deletarArea`
- **js/modules/lancamentos.js**: migrado — `areaId` (UUID) para criar, `areaNome` para exibir; campos `valor/categoria/descricao/fornecedor`
- **js/modules/dashboard.js**: migrado de `State.user.lancs/areas` para `Store.lancamentos/areas`
- **js/modules/relatorio.js**: migrado — filtros usam `areaNome`, campos `valor/categoria`
- **js/modules/colheita.js**: migrado — `_popularAreas` usa `Store.areas`, estimativas filtram `l.areaId`
- **js/modules/mercado.js**: migrado para `GET /api/precos-mercado`
- **js/modules/admin.js**: migrado para `GET/DELETE /api/users`

#### Módulos com localStorage (pendente de migração)
- estoque.js, campo.js (pragas/irrigação), variedades.js — endpoints backend existem mas mapeamento de campos difere

---

## [2.0.0] — 2026-05-25

### Reestruturação de navegação
- Nova Linha 1: Dashboard · Campo · Lançamentos · Orçamento · Relatório
- Nova Linha 2: Estoque · Cadastros · Mercado
- Removidas abas separadas de Áreas, Colheita, Pragas e Irrigação

### Adicionado — Aba Campo unificada
- Sub-abas: 🌳 Áreas · 🌾 Colheita · 🐛 Pragas · 💧 Irrigação
- Todas as operações de campo em um único lugar

### Adicionado — Módulo Pragas (MIP)
- Registro de ocorrências por área e tipo de praga/doença
- Níveis de infestação: Baixo / Médio / Alto / Crítico
- Modal de Ação de Controle vinculado ao estoque de defensivos
- Desconto automático do estoque ao registrar ação
- Pergunta ao salvar se deseja gerar lançamento de despesa
- Alertas de focos críticos no Dashboard

### Adicionado — Módulo Irrigação
- Registro de volume (m³), duração (h) e custo por evento
- Cálculo automático do custo total (horas × R$/hora)
- Botão "Registrar + Gerar Lançamento" com confirmação
- KPIs acumulados no painel da sub-aba

### Adicionado — Aba Orçamento vs Realizado
- 4 KPIs: Investimento Previsto, Despesas Reais, Receita Estimada, Receita Realizada
- Tabela comparativa por área com % de execução e diferença
- Tabela por categoria de despesa
- Filtros por área e mês

### Adicionado — Dashboard com painéis de Campo
- Card 🐛 Pragas: gráfico de pizza por tipo + lista de focos críticos
- Card 💧 Irrigação: KPIs dos últimos 30 dias + barras de volume por área
- Estado vazio com link para registrar a primeira ocorrência

### Adicionado — Relatório Consolidado com Campo
- Seção Acompanhamento de Pragas: pizza por tipo + barras por nível + tabela histórica
- Seção Acompanhamento de Irrigação: KPIs + barras por área + gráfico de colunas por mês + tabela histórica

---

## [1.8.0] — 2026-05-20

### Adicionado
- Edição de lançamentos: botão ✏️ carrega dados no formulário para reenvio
- Edição de variedades, produtos e mão de obra via botão ✏️
- Edição de itens de estoque via botão ✏️
- Edição de estimativas da colheita via botão ✏️ Editar no Resumo da Safra
- Edição de áreas via modal (já existia, melhorada)

### Adicionado — Estoque com localização
- Campo "Localização" no cadastro de material
- Badge 📍 exibido em cada item na listagem
- Filtro por local (aparece automaticamente quando há mais de um local)
- Filtro por status (Normal / Baixo / Zerado)
- Busca por nome de produto em tempo real

### Modificado — Mão de Obra nos lançamentos
- Ao selecionar colaborador com valor cadastrado, campo de quantidade aparece automaticamente
- Label dinâmico conforme unidade: "Dias trabalhados", "Semanas", "Hectares"...
- Valor total calculado automaticamente (qtd × valor/unidade)
- Info inline mostra o cálculo em tempo real

---

## [1.7.0] — 2026-05-15

### Adicionado — Cadastros
- Módulo de Variedades com campos completos (ciclo, produtividade, mercado)
- Módulo de Produtos (orgânicos, adubos, defensivos) com tipos e categorias
- Módulo de Mão de Obra com valor por unidade e tipo de contrato
- Badges de limite por plano com barra de progresso

### Adicionado — Estoque
- Cadastro de materiais por tipo: Orgânicos, Adubos, Químicos
- Acordeão por tipo com totais e alertas de estoque baixo
- Estoque mínimo configurável com alertas visuais
- Baixa automática ao registrar lançamento com produto vinculado

---

## [1.6.0] — 2026-05-10

### Adicionado — Mercado HF Brasil
- Cards mensais com preços médios SP e NE
- Agrupamento por mês com média das semanas
- Análise de faturamento estimado vs preços de mercado
- Disponível apenas no plano Anual Premium

### Adicionado — Painel Admin
- Cadastro e remoção de usuários
- Estatísticas: total por plano, áreas e lançamentos
- Gestão de preços HF Brasil
- Acesso via conta admin@agro.com

---

## [1.5.0] — 2026-04-28

### Adicionado
- Relatório Consolidado com gráficos SVG animados
- Pizza de defensivos e adubação por categoria
- Gráfico de barras de evolução mensal (receitas vs despesas)
- Ranking de categorias de despesa
- Tabela de estimativas por área com margem e lucro estimado

### Adicionado
- Filtros na aba de lançamentos: por área, tipo e mês
- Cálculo 3-way nos lançamentos de receita: valor × quantidade × preço/kg

---

## [1.4.0] — 2026-04-15

### Adicionado
- Dashboard com KPIs financeiros
- Calendário de colheita por área
- Gráficos de barras: despesas por categoria e receitas vs despesas por área

---

## [1.3.0] — 2026-04-01

### Adicionado
- Colheita & Lucro: estimativa de produção, preço, descarte e custo de colheita
- Resumo da Safra no card de cada área (estimado / vendido / disponível)
- Sugestão automática de estimativa baseada em cadastro da área
- Barra de comercialização com % de vendas

---

## [1.2.0] — 2026-03-15

### Adicionado
- Módulo de Lançamentos financeiros (receitas e despesas)
- Categorias: Irrigação, Adubação, Mão de Obra, Poda, Defensivos, Colheita/Frete, Combustível, Manutenção, Outros
- Receitas: Venda, Subproduto, Parceria, Subsídio

---

## [1.1.0] — 2026-03-01

### Adicionado
- Cadastro de áreas (talhões) com dados agronômicos completos
- Investimentos previstos por categoria por área
- Autenticação com planos (Mensal, Trimestral, Anual, Admin)

---

## [1.0.0] — 2026-02-15

### Lançamento inicial
- Landing page com planos
- Cadastro e login de usuários
- Estrutura base de navegação
- Persistência em localStorage

---

## [2.1.0] — 2026-05-25

### Modificado — Limites por plano
- Mensal: limite de **50 lançamentos/mês** (era ilimitado)
- Trimestral: limite de **200 lançamentos/mês** (era ilimitado)
- Anual: lançamentos ilimitados (sem alteração)
- Barra de progresso mensal na aba Lançamentos com alerta visual em 80% e bloqueio ao atingir o limite

### Modificado — Terminologia de planos
- "Até 5 hectares" → **"Até 3 áreas de produção"** (Mensal)
- "Até 10 hectares" → **"Até 8 áreas de produção"** (Trimestral)
- Nomenclatura unificada: **talhões / áreas de produção**
- Landing page e tela de cadastro atualizadas

### Corrigido — Erro `Cannot read properties of null (reading 'areas')`
- Adicionado guard `if(!CU) return` em 16 funções que acessavam CU sem verificar login:
  `renderLanc`, `renderEsts`, `renderAreas`, `calcTotais`, `renderDashCharts`,
  `renderRel`, `preencherEst`, `editarEstimativaArea`, `gerarSugestaoEstimativa`,
  `confirmarProgramado`, `abrirModalAcaoPraga`, `preencherDadosIrr`,
  `deletarArea`, `deletarLanc`, `editarLanc`, `saveUserData`

### Corrigido — Arquivo HTML duplicado
- Removida cópia completa do HTML/CSS/JS que estava concatenada no final do arquivo
- Arquivo reduzido de 392KB para 285KB
- Eliminadas todas as declarações duplicadas de constantes e funções

### Adicionado — Relatório: Pragas e Irrigação antes de Estimativas
- Seção 🐛 Acompanhamento de Pragas: pizza por tipo + barras por nível + tabela
- Seção 💧 Acompanhamento de Irrigação: KPIs + barras por área + gráfico de colunas por mês + tabela
- Posicionadas antes de "Estimativas por Área" no relatório consolidado

### Adicionado — Documentação completa
- API.md, ARCHITECTURE.md, CHANGELOG.md, INTEGRATION.md
- RUNBOOK.md, SECURITY.md, VISION.md, WORKFLOW.md
