/**
 * Módulo: Dashboard
 * Renderiza KPIs, gráfico de barras mensal e calendário de colheita.
 */

import { State }  from '../core/state.js';
import { Store }  from '../core/store.js';
import { router } from '../core/router.js';
import { moeda, dataFmt, MESES } from '../utils/formatters.js';
import { gerarBarrasSVG } from '../utils/charts.js';

router.register('dash', renderDash);

export function renderDash() {
  if (!State.user) return;
  _renderKPIs();
  _renderCharts();
  _renderCalendario();
  _renderUltimosLancs();
}

function _renderKPIs() {
  const lancs   = Store.lancamentos;
  const areas   = Store.areas;
  const receita = lancs.filter(l => l.tipo === 'receita').reduce((s, l) => s + Number(l.valor), 0);
  const despesa = lancs.filter(l => l.tipo === 'despesa').reduce((s, l) => s + Number(l.valor), 0);
  const saldo   = receita - despesa;

  const el = document.getElementById('kpi-area');
  if (!el) return;

  el.innerHTML = `
    <p class="kpi-hint">Clique nos cards para expandir</p>
    <div class="kpi-grid">
      ${_kpi('💰', 'Receita Total', moeda(receita), '', 'kpi-verde')}
      ${_kpi('📉', 'Despesa Total', moeda(despesa), '', 'kpi-vermelho')}
      ${_kpi('📊', 'Saldo', moeda(saldo), saldo >= 0 ? 'Positivo' : 'Negativo', saldo >= 0 ? '' : 'kpi-vermelho')}
      ${_kpi('🌳', 'Áreas Ativas', areas.length, '', 'kpi-marrom')}
    </div>`;

  document.querySelectorAll('.kpi').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('kpi-aberto');
      card.classList.add('kpi-pulsou');
      setTimeout(() => card.classList.remove('kpi-pulsou'), 600);
    });
  });
}

function _kpi(icon, label, valor, sub, extra = '') {
  return `<div class="kpi ${extra}">
    <span class="ki">${icon}</span>
    <label>${label}</label>
    <div class="kv">${valor}</div>
    ${sub ? `<div class="ks">${sub}</div>` : ''}
  </div>`;
}

function _renderCharts() {
  const container = document.getElementById('dash-charts-row');
  if (!container) return;

  const porMes = Array.from({ length: 12 }, () => ({ desp: 0, rec: 0 }));
  Store.lancamentos.forEach(l => {
    const mes = new Date((l.data ?? '') + 'T00:00:00').getMonth();
    if (isNaN(mes)) return;
    if (l.tipo === 'receita') porMes[mes].rec  += Number(l.valor);
    else                       porMes[mes].desp += Number(l.valor);
  });

  container.innerHTML = `
    <div class="chart-wrap">
      <h3>📊 Receitas vs Despesas — ${new Date().getFullYear()}</h3>
      ${gerarBarrasSVG(porMes)}
      <div style="display:flex;gap:16px;margin-top:8px;font-size:.72rem">
        <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;background:#c0392b;border-radius:2px"></span>Despesas</span>
        <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;background:#16a34a;border-radius:2px"></span>Receitas</span>
      </div>
    </div>`;
}

function _renderCalendario() {
  const el = document.getElementById('cal-inner');
  if (!el) return;

  const areas = Store.areas;
  if (!areas.length) {
    el.innerHTML = '<p style="color:var(--texto3);font-size:.82rem;padding:8px 0">Nenhuma área cadastrada.</p>';
    return;
  }

  let html = `<div class="cal-row cal-header"><div class="cal-nome"></div>${MESES.map(m => `<div class="cal-cell">${m}</div>`).join('')}</div>`;

  areas.forEach(a => {
    html += `<div class="cal-row">
      <div class="cal-nome" title="${a.nome}">${a.nome}</div>
      ${MESES.map((_, i) => {
        const m   = i + 1;
        const ini = parseInt(a.colheitaIni);
        const fim = parseInt(a.colheitaFim);
        const eCol = a.colheitaIni && a.colheitaFim && m >= ini && m <= fim;
        return `<div class="cal-cell ${eCol ? 'c-col' : ''}"></div>`;
      }).join('')}
    </div>`;
  });

  el.innerHTML = html;
}

function _renderUltimosLancs() {
  const tbody = document.getElementById('tb-dash');
  if (!tbody) return;

  const lancs = [...Store.lancamentos]
    .sort((a, b) => (b.data ?? '').localeCompare(a.data ?? ''))
    .slice(0, 10);

  tbody.innerHTML = lancs.length
    ? lancs.map(l => `<tr>
        <td>${dataFmt(l.data)}</td>
        <td>${l.areaNome ?? '—'}</td>
        <td><span class="tag t-${l.tipo?.slice(0,3) ?? 'out'}">${l.tipo ?? '—'}</span></td>
        <td>${l.descricao ?? '—'}</td>
        <td class="${l.tipo === 'receita' ? 'vp' : 'vn'}">${moeda(Number(l.valor))}</td>
      </tr>`).join('')
    : '<tr><td colspan="5" style="text-align:center;color:var(--texto3);padding:24px">Nenhum lançamento ainda.</td></tr>';
}
