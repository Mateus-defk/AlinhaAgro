/**
 * Módulo: Lançamentos
 * CRUD via API REST — dados do Store, sem localStorage.
 */

import { State }  from '../core/state.js';
import { Store }  from '../core/store.js';
import { router } from '../core/router.js';
import { ApiError } from '../core/api.js';
import { toastOk, toastErr } from '../utils/toast.js';
import { moeda, dataFmt } from '../utils/formatters.js';
import { Validators } from '../utils/validators.js';

router.register('lanc', renderLanc);

const CATS = {
  despesa:     ['Irrigação','Adubação','Defensivo','Mão de Obra','Poda','Colheita','Transporte','Manutenção','Outros'],
  receita:     ['Venda de Fruta','Outra Receita'],
  investimento:['Equipamento','Infraestrutura','Mudas/Sementes','Outros'],
};

export async function salvarLanc() {
  const data    = _val('l-data');
  const areaId  = _val('l-area');
  const tipo    = _val('l-tipo');
  const cat     = _val('l-cat');
  const valor   = parseFloat(_val('l-val') || 0);
  const desc    = _val('l-desc');
  const forn    = _val('l-forn');

  const v = Validators.all(
    Validators.required(data,   'Data'),
    Validators.required(areaId, 'Área'),
    Validators.required(cat,    'Categoria'),
    Validators.positivo(valor,  'Valor'),
  );
  if (!v.ok) { toastErr(v.msg); return; }

  try {
    await Store.criarLancamento({
      areaId:    areaId || null,
      tipo,
      categoria: cat,
      descricao: desc || null,
      fornecedor: forn || null,
      valor,
      data,
    });
    toastOk('Lançamento registrado!');
    _limparForm();
    renderLanc();
  } catch (err) {
    toastErr(err instanceof ApiError ? err.message : 'Erro ao registrar lançamento.');
  }
}

export function renderLanc() {
  const lancs = Store.lancamentos;
  const fArea = _val('f-a-lanc');
  const fTipo = _val('f-t-lanc');
  const fMes  = _val('f-mes-lanc');

  _popularAreas('l-area');
  _popularAreas('f-a-lanc');
  atualizarCats();

  const filtrados = lancs.filter(l => {
    if (fArea && l.areaNome !== fArea) return false;
    if (fTipo && l.tipo     !== fTipo) return false;
    if (fMes  && !(l.data ?? '').startsWith(fMes)) return false;
    return true;
  }).sort((a, b) => (b.data ?? '').localeCompare(a.data ?? ''));

  const container = document.getElementById('historico-lanc');
  if (!container) return;

  if (!filtrados.length) {
    container.innerHTML = '<div class="empty"><span class="ei">📋</span><p>Nenhum lançamento encontrado.</p></div>';
    return;
  }

  const rec  = filtrados.filter(l => l.tipo === 'receita').reduce((s, l) => s + Number(l.valor), 0);
  const desp = filtrados.filter(l => l.tipo !== 'receita').reduce((s, l) => s + Number(l.valor), 0);

  const resumo = document.getElementById('resumo-lanc');
  if (resumo) {
    resumo.innerHTML = `
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:10px;font-size:.82rem">
        <span class="vp">Receitas: ${moeda(rec)}</span>
        <span class="vn">Despesas: ${moeda(desp)}</span>
        <span style="color:var(--texto3)">${filtrados.length} registro(s)</span>
      </div>`;
  }

  container.innerHTML = `<div class="tw"><table>
    <thead><tr><th>Data</th><th>Área</th><th>Tipo</th><th>Categoria</th><th>Descrição</th><th>Fornecedor</th><th>Valor</th><th></th></tr></thead>
    <tbody>
      ${filtrados.map(l => `<tr>
        <td>${dataFmt(l.data)}</td>
        <td>${l.areaNome ?? '—'}</td>
        <td><span class="tag ${l.tipo === 'receita' ? 't-rec' : l.tipo === 'investimento' ? 't-inv' : 't-def'}">${l.tipo}</span></td>
        <td>${l.categoria ?? '—'}</td>
        <td>${l.descricao ?? '—'}</td>
        <td>${l.fornecedor ?? '—'}</td>
        <td class="${l.tipo === 'receita' ? 'vp' : 'vn'}">${moeda(Number(l.valor))}</td>
        <td><button class="btn-d" onclick="window._deletarLanc('${l.id}')">✕</button></td>
      </tr>`).join('')}
    </tbody>
  </table></div>`;
}

export async function deletarLanc(id) {
  try {
    await Store.deletarLancamento(id);
    renderLanc();
    toastOk('Lançamento removido.');
  } catch (err) {
    toastErr(err instanceof ApiError ? err.message : 'Erro ao remover lançamento.');
  }
}

export function atualizarCats() {
  const tipo = _val('l-tipo');
  const sel  = document.getElementById('l-cat');
  if (!sel) return;
  sel.innerHTML = (CATS[tipo] ?? []).map(c => `<option value="${c}">${c}</option>`).join('');
}

function _popularAreas(elId) {
  const sel = document.getElementById(elId);
  if (!sel) return;
  const areas = Store.areas;
  const curr  = sel.value;

  if (elId === 'l-area') {
    sel.innerHTML = `<option value="">— Sem área —</option>${areas.map(a =>
      `<option value="${a.id}" ${a.id === curr ? 'selected' : ''}>${a.nome}</option>`).join('')}`;
  } else {
    sel.innerHTML = `<option value="">Todas as áreas</option>${areas.map(a =>
      `<option value="${a.nome}" ${a.nome === curr ? 'selected' : ''}>${a.nome}</option>`).join('')}`;
  }
}

function _val(id) { return document.getElementById(id)?.value?.trim() ?? ''; }

function _limparForm() {
  ['l-data','l-area','l-val','l-desc','l-forn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

window._deletarLanc = deletarLanc;
