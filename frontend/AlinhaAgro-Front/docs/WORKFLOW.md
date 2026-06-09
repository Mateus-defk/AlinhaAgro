# AgroGestão — Workflows

Fluxos de trabalho para desenvolvimento, operação e suporte.

---

## 1. Fluxo do Produtor (Usuário Final)

### Onboarding — primeira vez no sistema

```
1. Abre o arquivo Agrogestao.html no navegador
2. Clica "Criar conta gratuita" ou escolhe um plano
3. Preenche nome, e-mail, senha e confirma o plano
4. É redirecionado para o Dashboard (vazio)
5. Clica "Campo" → "Áreas" → "+ Nova Área"
6. Cadastra o primeiro talhão com dados agronômicos e investimentos previstos
7. Vai para "Lançamentos" e registra o primeiro custo
8. Acessa "Campo" → "Colheita" para configurar estimativa de produção
9. Dashboard já mostra os KPIs com os primeiros dados
```

### Rotina semanal do produtor

```
Segunda-feira:
  → Lançamentos → registrar despesas da semana anterior
  → Campo → Irrigação → registrar eventos de irrigação
  → Campo → Pragas → registrar inspeções realizadas

Durante a semana:
  → Qualquer evento de campo → lançar no momento (via celular)
  → Ação de controle de praga → registrar + descontar estoque

Fim do mês:
  → Relatório → verificar saldo, ranking de despesas
  → Orçamento → comparar previsto vs realizado
  → Campo → Colheita → atualizar produção real após colheita
```

### Fluxo de venda

```
1. Lançamentos → Tipo: Receita (Venda)
2. Informa: Área, Data, Quantidade (kg), Preço/kg
3. Sistema calcula Valor Total automaticamente
4. Salva → Dashboard atualiza KPIs
5. Campo → Colheita → o kg vendido aparece no Resumo da Safra
6. Barra de comercialização mostra % da produção já vendida
```

### Fluxo de controle de praga

```
1. Campo → Pragas → Nova Ocorrência
2. Seleciona: Área, Praga, Nível de Infestação
3. Opção A: "Registrar Ocorrência" → só monitora, sem custo
4. Opção B: "Registrar + Ação de Controle"
   → Abre modal: seleciona defensivo do estoque
   → Informa dose e custo
   → Sistema desconta o defensivo do estoque automaticamente
   → Pergunta: "Deseja gerar lançamento de despesa?" → Sim/Não
5. Ocorrência aparece no histórico e nos gráficos do Dashboard e Relatório
```

### Fluxo de irrigação com lançamento

```
1. Campo → Irrigação → Novo Registro
2. Informa: Área, Tipo, Horas, Volume, Custo/hora
3. Sistema calcula Custo Total = Horas × R$/hora
4. Botão "Registrar + Gerar Lançamento"
   → Confirma → cria despesa categoria Irrigação na área
5. KPIs de irrigação atualizados no painel
```

---

## 2. Fluxo do Administrador

### Atualização semanal de preços HF Brasil

```
1. Acessa hfbrasil.org.br → Banco de Dados de Preços Médios
2. Filtra: Manga, semana atual
3. Coleta por variedade:
   - Palmer/Tommy - atacado São Paulo → campo "Preço SP"
   - Palmer/Tommy - produtor Vale do SF → campo "Preço NE"
   - Mínimo e Máximo da semana
4. Faz login como admin@agro.com
5. Clica "Admin" no menu → aba "Preços Médios"
6. Preenche: Mês, Ano, SP, NE, Mín, Máx, Variedade, Observação
7. Clica "✓ Salvar Preço"
8. Repete para cada variedade (Palmer e Tommy no mínimo)
9. Usuários do plano Anual já visualizam os novos preços em "Mercado"
```

### Suporte a novo usuário

```
1. Usuário faz cadastro pelo próprio sistema
2. Admin verifica pagamento externo (WhatsApp, PIX, etc.)
3. Se plano diferente do cadastrado, ajusta via console:
   const users = JSON.parse(localStorage.getItem('ag_users'));
   const u = users.find(u => u.email === 'email@usuario.com');
   u.plano = 'anual'; // ou 'trimestral'
   localStorage.setItem('ag_users', JSON.stringify(users));
4. Informa ao usuário que o acesso foi liberado
5. Envia o arquivo Agrogestao.html atualizado se necessário
```

### Gestão de usuários no painel admin

```
Admin → aba Usuários:
  - Ver estatísticas: total por plano, áreas cadastradas, lançamentos
  - Remover usuário cancelado: botão "✕ Remover"
  - Verificar usuários inativos (sem lançamentos recentes)
```

---

## 3. Fluxo de Desenvolvimento

### Fazer uma correção ou melhoria

```
1. Abrir Agrogestao.html no VS Code
2. Ctrl+F → buscar pelo nome da função ou ID do elemento
3. Fazer a alteração
4. Verificar sintaxe JS:
   python3 -c "
   import re
   with open('Agrogestao.html','r') as f: c=f.read()
   script=re.findall(r'<script[^>]*>(.*?)</script>',c,re.DOTALL)[0]
   open('/tmp/check.js','w').write(script)
   " && node --check /tmp/check.js
5. Verificar duplicatas:
   python3 -c "
   import re
   content=open('Agrogestao.html').read()
   seen={}
   for i,line in enumerate(content.split('\n'),1):
     m=re.match(r'^(const|let|function)\s+(\w+)',line)
     if m:
       name=m.group(2)
       if name in seen: print(f'DUP: {name} linha {i}')
       else: seen[name]=i
   "
6. Testar no navegador (abrir o HTML localmente)
7. Fazer backup antes de distribuir
```

### Adicionar novo módulo

```
Padrão a seguir:
1. Criar chave de storage: const SK_NOVO = 'ag_novo'
2. Criar get/set: getNovo() / setNovo()
3. Usar _k() para isolar por usuário: localStorage.getItem(_k(SK_NOVO))
4. Adicionar ao router ir(): novo: () => { renderNovo(); }
5. Criar seção HTML: <div class="sec" id="sec-novo">
6. Adicionar link na nav: <li><a onclick="ir('novo')">Novo</a></li>
7. Implementar renderNovo(), salvarNovo(), deletarNovo()
8. Adicionar guard CU: if(!CU) return; no início de cada função
9. Atualizar CHANGELOG.md
```

### Checklist antes de distribuir nova versão

```
□ node --check passou sem erros
□ Zero duplicatas de const/let/function
□ Conta demo/teste removida (grep demo@agro Agrogestao.html → vazio)
□ Senha admin alterada se necessário
□ Preços HF atualizados
□ Testado no Chrome e Firefox
□ Testado no celular (375px)
□ CHANGELOG.md atualizado com a versão
□ Backup da versão anterior salvo
```

---

## 4. Fluxo de Dados

### Como os dados fluem entre módulos

```
Cadastro de Área
  ↓ alimenta
Lançamentos (select de área)
Colheita & Lucro (estimativas por área)
Orçamento vs Realizado (previsto vs real)
Relatório Consolidado (gráficos e tabelas)
Dashboard (KPIs e calendário)
Campo → Pragas (ocorrências por talhão)
Campo → Irrigação (consumo por talhão)

Estoque
  ↓ alimenta
Lançamentos (desconto automático ao registrar uso)
Campo → Pragas → Ação de Controle (desconta defensivo)
Campo → Irrigação (vincula material usado)

Mão de Obra (Cadastros)
  ↓ alimenta
Lançamentos (preenche valor automaticamente por unidade)

Preços HF Brasil (Admin)
  ↓ alimenta
Mercado (cards de preços mensais)
Campo → Colheita (sugestão de preço de venda)
```

### Ciclo de vida de um lançamento

```
salvarLanc()
  1. Valida: data, área, valor
  2. Verifica limite do plano (maxLancs/mês)
  3. Se produto do estoque selecionado:
     → baixarEstoque(id, qty) → atualiza saldo
  4. Se mão de obra com valor cadastrado:
     → val = quantidade × valor/unidade (calculado automaticamente)
  5. CU.lancs.push(novoLanc)
  6. saveUserData() → persiste no ag_users
  7. renderLanc() → atualiza histórico
  8. renderDash() → atualiza KPIs
```

---

## 5. Fluxo de Limites por Plano

### Verificações implementadas

| Recurso | Mensal | Trimestral | Anual |
|---|---|---|---|
| Áreas/talhões | 3 | 8 | ∞ |
| Lançamentos/mês | 50 | 200 | ∞ |
| Itens no estoque | 0 (bloqueado) | 30 | ∞ |
| Cadastros por tipo | 0 (bloqueado) | 15 | ∞ |
| Mercado HF Brasil | 🔒 | 🔒 | ✅ |
| Programados | 🔒 (futuro) | 🔒 (futuro) | 🔒 (futuro) |

### Onde cada limite é verificado no código

```js
// Áreas
salvarArea() → if(CU.areas.length >= p.maxAreas) → bloqueia

// Lançamentos
salvarLanc() → lancsMes >= p.maxLancs → bloqueia + toast

// Estoque
salvarEstoque() → lista.length >= p.maxEstoque → bloqueia

// Cadastros (variedades, produtos, mão de obra)
checkLimiteCadastro(tipo, quantidade) → bloqueia com mensagem

// Mercado
tentarMercado() → if(!p.premium) → mostra modal de upgrade

// Indicador visual
renderLanc() → barra de progresso do mês com alerta em 80%
```

---

## 6. Fluxo de Backup e Recuperação

### Backup manual pelo usuário (via console)

```js
// Exportar todos os dados
const backup = {};
Object.keys(localStorage)
  .filter(k => k.startsWith('ag_'))
  .forEach(k => { backup[k] = localStorage.getItem(k); });
const blob = new Blob([JSON.stringify(backup, null, 2)], {type:'application/json'});
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = `agrogestao-backup-${new Date().toISOString().split('T')[0]}.json`;
a.click();
```

### Restaurar backup

```js
// Colar o conteúdo do arquivo JSON
const backup = { /* conteúdo do JSON */ };
Object.entries(backup).forEach(([k, v]) => localStorage.setItem(k, v));
location.reload();
```

### Migrar dados para novo dispositivo

```
1. No dispositivo antigo: executar o script de exportação acima
2. Salvar o arquivo JSON em local acessível (nuvem, e-mail, WhatsApp)
3. No novo dispositivo: abrir Agrogestao.html no navegador
4. Abrir console (F12)
5. Executar o script de restauração com o conteúdo do backup
6. Recarregar a página
7. Fazer login normalmente
```
