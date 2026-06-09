/**
 * Módulo: Campo — Pragas e Irrigação
 * Integrado com /api/pragas e /api/irrigacao.
 */

import { Store }  from '../core/store.js';
import { router } from '../core/router.js';
import { toastOk, toastErr } from '../utils/toast.js';
import { dataFmt, moeda } from '../utils/formatters.js';

router.register('pragas',    _initPragas);
router.register('irrigacao', _initIrrigacao);

/* ══════════════════════════════════════
   PRAGAS
══════════════════════════════════════ */

async function _initPragas() {
  _popularSelect('p-area');
  try {
    await Store.carregarPragas();
  } catch {
    toastErr('Erro ao carregar pragas.');
  }
  renderPragas();
}

export async function salvarPraga() {
  const areaId            = _val('p-area');
  const nome              = _val('p-nome');
  const tipo              = _val('p-tipo') || 'praga';
  const nivelSeveridade   = _val('p-severidade') || 'medio';
  const dataIdentificacao = _val('p-data');
  const observacoes       = _val('p-obs');

  if (!nome)              { toastErr('Informe o nome da praga / doença.'); return; }
  if (!dataIdentificacao) { toastErr('Informe a data de identificação.'); return; }

  try {
    await Store.criarPraga({
      areaId: areaId || null,
      nome,
      tipo,
      nivelSeveridade,
      dataIdentificacao,
      observacoes: observacoes || null,
    });
    toastOk('Ocorrência registrada!');
    _limpar(['p-nome', 'p-obs', 'p-data']);
    renderPragas();
  } catch (e) {
    toastErr(e.message ?? 'Erro ao salvar.');
  }
}

export function renderPragas() {
  const el    = document.getElementById('lista-pragas');
  const itens = Store.pragas;
  if (!el) return;

  el.innerHTML = !itens.length
    ? '<div class="empty"><span class="ei">🐛</span><p>Nenhuma ocorrência registrada.</p></div>'
    : `<div class="tw"><table>
        <thead><tr><th>Data</th><th>Área</th><th>Praga / Doença</th><th>Tipo</th><th>Severidade</th><th>Obs.</th><th></th></tr></thead>
        <tbody>
          ${[...itens].sort((a, b) => b.dataIdentificacao.localeCompare(a.dataIdentificacao)).map(p => `<tr>
            <td>${dataFmt(p.dataIdentificacao)}</td>
            <td>${Store.areaNome(p.areaId)}</td>
            <td>${p.nome}</td>
            <td>${_tipoBadge(p.tipo)}</td>
            <td>${_severidadeBadge(p.nivelSeveridade)}</td>
            <td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.observacoes ?? '—'}</td>
            <td><button class="btn-d" onclick="window._deletarPraga('${p.id}')">✕</button></td>
          </tr>`).join('')}
        </tbody>
      </table></div>`;
}

/* ══════════════════════════════════════
   IRRIGAÇÃO
══════════════════════════════════════ */

async function _initIrrigacao() {
  _popularSelect('irr-area');
  try {
    await Store.carregarIrrigacao();
  } catch {
    toastErr('Erro ao carregar irrigação.');
  }
  renderIrrigacao();
}

export async function salvarIrrigacao() {
  const areaId     = _val('irr-area');
  const data       = _val('irr-data');
  const duracaoMin = parseInt(_val('irr-duracao') || 0);
  const laminaMm   = parseFloat(_val('irr-lamina') || 0) || null;
  const custo      = parseFloat(_val('irr-custo')  || 0) || null;
  const observacoes = _val('irr-obs');

  if (!data)          { toastErr('Informe a data.'); return; }
  if (!(duracaoMin > 0)) { toastErr('Duração deve ser maior que zero.'); return; }

  try {
    await Store.criarIrrigacao({
      areaId: areaId || null,
      data,
      duracaoMin,
      laminaMm,
      custo,
      observacoes: observacoes || null,
    });
    toastOk('Irrigação registrada!');
    _limpar(['irr-data', 'irr-duracao', 'irr-lamina', 'irr-custo', 'irr-obs']);
    renderIrrigacao();
  } catch (e) {
    toastErr(e.message ?? 'Erro ao salvar.');
  }
}

export function renderIrrigacao() {
  const el    = document.getElementById('lista-irrigacao');
  const itens = Store.irrigacao;
  if (!el) return;

  el.innerHTML = !itens.length
    ? '<div class="empty"><span class="ei">💧</span><p>Nenhum registro de irrigação.</p></div>'
    : `<div class="tw"><table>
        <thead><tr><th>Data</th><th>Área</th><th>Duração (min)</th><th>Lâmina (mm)</th><th>Custo</th><th>Obs.</th><th></th></tr></thead>
        <tbody>
          ${[...itens].sort((a, b) => b.data.localeCompare(a.data)).map(i => `<tr>
            <td>${dataFmt(i.data)}</td>
            <td>${Store.areaNome(i.areaId)}</td>
            <td>${i.duracaoMin}</td>
            <td>${i.laminaMm ?? '—'}</td>
            <td>${i.custo ? moeda(i.custo) : '—'}</td>
            <td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${i.observacoes ?? '—'}</td>
            <td><button class="btn-d" onclick="window._deletarIrrigacao('${i.id}')">✕</button></td>
          </tr>`).join('')}
        </tbody>
      </table></div>`;
}

/* ── Helpers ─────────────────────────────────────────── */

function _popularSelect(id) {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel.innerHTML = '<option value="">— Todas as áreas —</option>' +
    Store.areas.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');
}

function _val(id) { return document.getElementById(id)?.value?.trim() ?? ''; }
function _limpar(ids) { ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; }); }

function _severidadeBadge(s) {
  const map = { baixo: '#dcfce7:#166534', medio: '#fef9c3:#854d0e', alto: '#fee2e2:#991b1b', critico: '#f3e8ff:#6d28d9' };
  const [bg, color] = (map[s] ?? map.medio).split(':');
  const label = { baixo: 'Baixa', medio: 'Média', alto: 'Alta', critico: 'Crítica' }[s] ?? s;
  return `<span style="background:${bg};color:${color};padding:2px 8px;border-radius:12px;font-size:.7rem;font-weight:700">${label}</span>`;
}

function _tipoBadge(t) {
  const map = { praga: '#fef3c7:#92400e', doenca: '#fee2e2:#991b1b', 'erva-daninha': '#dcfce7:#166534' };
  const [bg, color] = (map[t] ?? map.praga).split(':');
  const label = { praga: 'Praga', doenca: 'Doença', 'erva-daninha': 'Erva daninha' }[t] ?? t;
  return `<span style="background:${bg};color:${color};padding:2px 8px;border-radius:12px;font-size:.7rem;font-weight:700">${label}</span>`;
}

window._deletarPraga = async (id) => {
  try {
    await Store.deletarPraga(id);
    renderPragas();
    toastOk('Ocorrência removida.');
  } catch (e) { toastErr(e.message ?? 'Erro ao remover.'); }
};

window._deletarIrrigacao = async (id) => {
  try {
    await Store.deletarIrrigacao(id);
    renderIrrigacao();
    toastOk('Registro removido.');
  } catch (e) { toastErr(e.message ?? 'Erro ao remover.'); }
};