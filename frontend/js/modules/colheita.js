/**
 * Módulo: Estimativa de Colheita & Lucro
 * Integrado com /api/estimativas.
 */

import { Store }  from '../core/store.js';
import { router } from '../core/router.js';
import { toastOk, toastErr } from '../utils/toast.js';
import { moeda, num, pct } from '../utils/formatters.js';

router.register('colheita', _initColheita);

async function _initColheita() {
  _popularAreas();
  try {
    await Store.carregarEstimativas();
  } catch {
    toastErr('Erro ao carregar estimativas.');
  }
  _renderLista();
}

export function calcEst() {
  const kgEst   = parseFloat(_val('ce-kg-est')  || 0);
  const kgReal  = parseFloat(_val('ce-kg-real') || 0);
  const preco   = parseFloat(_val('ce-preco')   || 0);
  const descPct = parseFloat(_val('ce-desc')    || 0);
  const custoC  = parseFloat(_val('ce-custoC')  || 0);

  const areaId    = _val('ce-area');
  const kg        = kgReal || kgEst;
  const kgLiq     = kg * (1 - descPct / 100);
  const receita   = kgLiq * preco;
  const custos    = Store.lancamentos
    .filter(l => l.areaId === areaId && l.tipo !== 'receita')
    .reduce((s, l) => s + Number(l.valor), 0) + custoC;
  const lucro     = receita - custos;
  const margemPct = receita > 0 ? (lucro / receita) * 100 : 0;

  const box = document.getElementById('prev-est');
  const g   = document.getElementById('est-prev-g');
  if (!box || !g) return;

  if (!kg || !preco) { box.style.display = 'none'; return; }

  box.style.display = 'block';
  g.innerHTML = [
    _estItem('Prod. Líquida', `${num(kgLiq, 0)} kg`, false),
    _estItem('Receita Est.',  moeda(receita), false),
    _estItem('Custos',        moeda(custos),  false),
    _estItem('Lucro Est.',    moeda(lucro),   true),
    _estItem('Margem',        pct(margemPct), true),
  ].join('');
}

export async function salvarEst() {
  const areaId = _val('ce-area');
  if (!areaId) { toastErr('Selecione uma área.'); return; }

  const payload = {
    areaId,
    kgEst:   parseFloat(_val('ce-kg-est')  || 0),
    kgReal:  parseFloat(_val('ce-kg-real') || 0) || null,
    preco:   parseFloat(_val('ce-preco')   || 0),
    descPct: parseFloat(_val('ce-desc')    || 0) || 0,
    custoC:  parseFloat(_val('ce-custoC')  || 0) || 0,
  };

  try {
    const existente = Store.estimativas.find(e => e.areaId === areaId);
    if (existente) {
      await Store.atualizarEstimativa(existente.id, payload);
    } else {
      await Store.criarEstimativa(payload);
    }
    toastOk('Estimativa salva!');
    _renderLista();
  } catch (e) {
    toastErr(e.message ?? 'Erro ao salvar.');
  }
}

function _renderLista() {
  const ests = Store.estimativas;
  const el   = document.getElementById('lista-ests');
  if (!el) return;

  if (!ests.length) {
    el.innerHTML = '<div class="empty"><span class="ei">🌾</span><p>Nenhuma estimativa cadastrada.</p></div>';
    return;
  }

  el.innerHTML = ests.map(e => {
    const kgLiq   = (e.kgReal || e.kgEst) * (1 - (e.descPct || 0) / 100);
    const receita = kgLiq * (e.preco || 0);
    const custos  = Store.lancamentos
      .filter(l => l.areaId === e.areaId && l.tipo !== 'receita')
      .reduce((s, l) => s + Number(l.valor), 0) + (e.custoC || 0);
    const lucro = receita - custos;

    return `<div class="est-box" style="margin-bottom:14px">
      <h3>📍 ${e.areaNome ?? Store.areaNome(e.areaId)}</h3>
      <div class="est-g">
        ${_estItem('Prod. Est.', `${num(e.kgEst, 0)} kg`)}
        ${_estItem('Prod. Real', e.kgReal ? `${num(e.kgReal, 0)} kg` : '—')}
        ${_estItem('Preço/kg',   moeda(e.preco))}
        ${_estItem('Lucro Est.', moeda(lucro), true)}
      </div>
      <button class="btn-d" style="margin-top:10px" onclick="window._deletarEstimativa('${e.id}')">✕ Remover</button>
    </div>`;
  }).join('');
}

function _estItem(label, valor, dest = false) {
  return `<div class="est-i${dest ? ' dest' : ''}"><label>${label}</label><span>${valor}</span></div>`;
}

function _popularAreas() {
  const sel = document.getElementById('ce-area');
  if (!sel) return;
  const areas = Store.areas;
  sel.innerHTML = `<option value="">Selecione...</option>${areas.map(a => `<option value="${a.id}">${a.nome}</option>`).join('')}`;
}

function _val(id) { return document.getElementById(id)?.value?.trim() ?? ''; }

window._deletarEstimativa = async (id) => {
  try {
    await Store.deletarEstimativa(id);
    _renderLista();
    toastOk('Estimativa removida.');
  } catch (e) { toastErr(e.message ?? 'Erro ao remover.'); }
};