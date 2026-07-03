/**
 * Módulo: Lançamentos
 * CRUD completo via API REST — resumo financeiro via /lancamentos/resumo.
 */

import { Store }    from '../core/store.js';
import { router }   from '../core/router.js';
import { ApiError } from '../core/api.js';
import { toastOk, toastErr } from '../utils/toast.js';
import { moeda, dataFmt }    from '../utils/formatters.js';
import { Validators }        from '../utils/validators.js';
import { confirmar }         from '../utils/confirmDialog.js';

router.register('lanc', renderLanc);

const CATS = {
  despesa:      ['Irrigação','Adubação','Defensivo','Mão de Obra','Poda','Colheita','Transporte','Manutenção','Outros'],
  receita:      ['Venda de Fruta','Outra Receita'],
  investimento: ['Equipamento','Infraestrutura','Mudas/Sementes','Outros'],
};

/* id do lançamento em edição (null = modo criar) */
let _editandoId = null;

/* ── Salvar (criar ou atualizar) */
export async function salvarLanc() {
  const data  = _val('l-data');
  const tipo  = _val('l-tipo');
  const cat   = _val('l-cat');
  const valor = parseFloat(_val('l-val') || 0);

  const v = Validators.all(
    Validators.required(data,  'Data'),
    Validators.required(cat,   'Categoria'),
    Validators.positivo(valor, 'Valor'),
  );
  if (!v.ok) { toastErr(v.msg); return; }

  const payload = {
    areaId:    _val('l-area') || null,
    tipo,
    categoria: cat,
    descricao: _val('l-desc') || null,
    fornecedor: _val('l-forn') || null,
    valor,
    data,
  };

  try {
    if (_editandoId) {
      await Store.atualizarLancamento(_editandoId, payload);
      toastOk('Lançamento atualizado!');
    } else {
      await Store.criarLancamento(payload);
      toastOk('Lançamento registrado!');
    }
    _limparForm();
    await renderLanc();
  } catch (err) {
    toastErr(_msgErro(err));
  }
}

/* ── Render principal */
export async function renderLanc() {
  const fArea = _val('f-a-lanc');
  const fTipo = _val('f-t-lanc');
  const fMes  = _val('f-mes-lanc');

  _popularAreas('l-area');
  _popularAreas('f-a-lanc');
  atualizarCats();

  /* Filtro local sobre o cache do Store */
  const filtrados = Store.lancamentos.filter(l => {
    if (fArea && l.areaNome !== fArea)         return false;
    if (fTipo && l.tipo     !== fTipo)         return false;
    if (fMes  && !(l.data ?? '').startsWith(fMes)) return false;
    return true;
  }).sort((a, b) => (b.data ?? '').localeCompare(a.data ?? ''));

  /* Resumo financeiro via API (totais oficiais do servidor) */
  await _renderResumo(fMes);

  _renderTabela(filtrados);
}

/* ── Editar */
export function editarLanc(id) {
  const l = Store.lancamentos.find(x => x.id === id);
  if (!l) return;

  _editandoId = id;

  _set('l-data',  l.data ?? '');
  _set('l-area',  l.areaId ?? '');
  _set('l-tipo',  l.tipo);
  _set('l-val',   l.valor);
  _set('l-desc',  l.descricao ?? '');
  _set('l-forn',  l.fornecedor ?? '');

  atualizarCats();
  _set('l-cat', l.categoria);

  const fc = document.querySelector('#sec-lanc .fc h3');
  if (fc) fc.textContent = '✏️ Editar Lançamento';

  document.getElementById('l-data')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ── Deletar */
export async function deletarLanc(id) {
  const l = Store.lancamentos.find(x => x.id === id);
  const desc = l?.descricao || l?.categoria || 'este lançamento';
  if (!(await confirmar(`Excluir "${desc}"? Essa ação não pode ser desfeita.`))) return;

  try {
    await Store.deletarLancamento(id);
    await renderLanc();
    toastOk('Lançamento removido.');
  } catch (err) {
    toastErr(_msgErro(err));
  }
}

export function atualizarCats() {
  const tipo = _val('l-tipo');
  const sel  = document.getElementById('l-cat');
  if (!sel) return;
  sel.innerHTML = (CATS[tipo] ?? []).map(c => `<option value="${c}">${c}</option>`).join('');
}

/* ── Helpers internos */

async function _renderResumo(fMes) {
  const el = document.getElementById('resumo-lanc');
  if (!el) return;

  let inicio = null;
  let fim    = null;

  if (fMes) {
    const [ano, mes] = fMes.split('-').map(Number);
    const ultimo = new Date(ano, mes, 0).getDate();
    inicio = `${fMes}-01`;
    fim    = `${fMes}-${String(ultimo).padStart(2, '0')}`;
  }

  try {
    const r = await Store.resumoLancamentos(inicio, fim);
    el.innerHTML = `
      <div class="resumo-bar">
        <span class="vp">↑ Receitas: ${moeda(Number(r.totalReceitas ?? 0))}</span>
        <span class="vn">↓ Despesas: ${moeda(Number(r.totalDespesas ?? 0))}</span>
        <span class="${Number(r.saldo) >= 0 ? 'vp' : 'vn'}">= Saldo: ${moeda(Number(r.saldo ?? 0))}</span>
        ${fMes ? `<span style="color:var(--app-text-secondary);font-size:.75rem">${r.periodo?.inicio} → ${r.periodo?.fim}</span>` : ''}
      </div>`;
  } catch {
    el.innerHTML = '';
  }
}

function _renderTabela(filtrados) {
  const container = document.getElementById('historico-lanc');
  if (!container) return;

  if (!filtrados.length) {
    container.innerHTML = '<div class="empty"><span class="ei">📋</span><p>Nenhum lançamento encontrado.</p></div>';
    return;
  }

  container.innerHTML = `<div class="tw"><table>
    <thead><tr>
      <th>Data</th><th>Área</th><th>Tipo</th><th>Categoria</th>
      <th>Descrição</th><th>Fornecedor</th><th>Valor</th><th></th>
    </tr></thead>
    <tbody>
      ${filtrados.map(l => `<tr>
        <td>${dataFmt(l.data)}</td>
        <td>${l.areaNome ?? '—'}</td>
        <td><span class="tag ${_tagCls(l.tipo)}">${l.tipo}</span></td>
        <td>${l.categoria ?? '—'}</td>
        <td>${l.descricao ?? '—'}</td>
        <td>${l.fornecedor ?? '—'}</td>
        <td class="${l.tipo === 'receita' ? 'vp' : 'vn'}">${moeda(Number(l.valor))}</td>
        <td style="display:flex;gap:6px">
          <button class="btn-edit" onclick="window._editarLanc('${l.id}')">✏️</button>
          <button class="btn-d"    onclick="window._deletarLanc('${l.id}')">✕</button>
        </td>
      </tr>`).join('')}
    </tbody>
  </table></div>`;
}

function _tagCls(tipo) {
  return tipo === 'receita' ? 't-rec' : tipo === 'investimento' ? 't-inv' : 't-def';
}

function _popularAreas(elId) {
  const sel   = document.getElementById(elId);
  if (!sel) return;
  const areas = Store.areas;
  const curr  = sel.value;

  if (elId === 'l-area') {
    sel.innerHTML = `<option value="">— Sem área —</option>
      ${areas.map(a => `<option value="${a.id}" ${a.id === curr ? 'selected' : ''}>${a.nome}</option>`).join('')}`;
  } else {
    sel.innerHTML = `<option value="">Todas as áreas</option>
      ${areas.map(a => `<option value="${a.nome}" ${a.nome === curr ? 'selected' : ''}>${a.nome}</option>`).join('')}`;
  }
}

function _limparForm() {
  _editandoId = null;
  ['l-data','l-area','l-val','l-desc','l-forn'].forEach(id => _set(id, ''));
  const fc = document.querySelector('#sec-lanc .fc h3');
  if (fc) fc.textContent = '📝 Novo Lançamento';
}

function _msgErro(err) {
  if (err instanceof ApiError) {
    if (err.status === 404) return 'Lançamento não encontrado.';
    return err.message;
  }
  return 'Erro ao salvar lançamento.';
}

function _val(id) { return document.getElementById(id)?.value?.trim() ?? ''; }
function _set(id, v) { const el = document.getElementById(id); if (el) el.value = v ?? ''; }

window._editarLanc  = editarLanc;
window._deletarLanc = deletarLanc;