/**
 * Módulo: Relatório Consolidado
 * Gera visão financeira completa com KPIs, gráficos e tabelas.
 */

import { State }  from '../core/state.js';
import { Store }  from '../core/store.js';
import { router } from '../core/router.js';
import { moeda, pct } from '../utils/formatters.js';
import { gerarPizzaSVG, gerarBarrasSVG } from '../utils/charts.js';

router.register('relatorio', renderRel);

export function renderRel() {
  if (!State.user) return;

  const filtroArea = document.getElementById('rel-a')?.value  ?? '';
  const filtroMes  = parseInt(document.getElementById('rel-mes')?.value ?? '') || null;

  let lancs = Store.lancamentos;
  if (filtroArea) lancs = lancs.filter(l => l.areaNome === filtroArea);
  if (filtroMes)  lancs = lancs.filter(l => new Date((l.data ?? '') + 'T00:00:00').getMonth() + 1 === filtroMes);

  const receita  = lancs.filter(l => l.tipo === 'receita').reduce((s, l) => s + Number(l.valor), 0);
  const despesa  = lancs.filter(l => l.tipo === 'despesa').reduce((s, l) => s + Number(l.valor), 0);
  const investim = lancs.filter(l => l.tipo === 'investimento').reduce((s, l) => s + Number(l.valor), 0);
  const saldo    = receita - despesa - investim;
  const margem   = receita > 0 ? (saldo / receita) * 100 : 0;

  const porCat = {};
  lancs.filter(l => l.tipo !== 'receita').forEach(l => {
    porCat[l.categoria] = (porCat[l.categoria] ?? 0) + Number(l.valor);
  });

  const CORES  = ['#3d7a44','#e8930f','#2563eb','#7c3aed','#c0392b','#059669','#d97706','#6366f1'];
  const fatias = Object.entries(porCat).map(([label, valor], i) => ({ label, valor, cor: CORES[i % CORES.length] }));

  const container = document.getElementById('conteudo-rel');
  if (!container) return;

  const saldoCls = saldo >= 0 ? 'saldo-pos' : 'saldo-neg';

  container.innerHTML = `
    <div class="saldo-destaque ${saldoCls}" style="margin-bottom:24px">
      <span class="saldo-icone">${saldo >= 0 ? '📈' : '📉'}</span>
      <div class="saldo-corpo">
        <div class="saldo-label">Resultado do Período</div>
        <div class="saldo-valor">${moeda(saldo)}</div>
        <div class="saldo-formula">
          <span>Receita ${moeda(receita)}</span> − <span>Despesas ${moeda(despesa)}</span> − <span>Inv. ${moeda(investim)}</span>
        </div>
      </div>
      <div class="saldo-pct">${pct(margem)}<small><br>margem</small></div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-bottom:24px">
      <div class="chart-wrap">
        <h3>🥧 Composição de Despesas</h3>
        ${fatias.length ? gerarPizzaSVG(fatias) : '<p style="color:var(--texto3);font-size:.82rem">Sem despesas no período.</p>'}
      </div>
      <div class="chart-wrap">
        <h3>📊 Receitas vs Despesas (mês)</h3>
        ${_barrasMensais(Store.lancamentos, filtroArea)}
      </div>
    </div>`;

  const selArea = document.getElementById('rel-a');
  if (selArea && selArea.options.length <= 1) {
    Store.areas.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.nome;
      opt.textContent = a.nome;
      selArea.appendChild(opt);
    });
  }
}

function _barrasMensais(lancs, filtroArea) {
  const dados = Array.from({ length: 12 }, () => ({ desp: 0, rec: 0 }));
  const base  = filtroArea ? lancs.filter(l => l.areaNome === filtroArea) : lancs;
  base.forEach(l => {
    const m = new Date((l.data ?? '') + 'T00:00:00').getMonth();
    if (isNaN(m)) return;
    if (l.tipo === 'receita') dados[m].rec  += Number(l.valor);
    else                       dados[m].desp += Number(l.valor);
  });
  return gerarBarrasSVG(dados);
}
