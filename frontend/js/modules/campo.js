/**
 * Módulo: Campo — Pragas e Irrigação
 * Integrado com /api/pragas e /api/irrigacao.
 */

import { Store }  from '../core/store.js';
import { router } from '../core/router.js';
import { toastOk, toastErr } from '../utils/toast.js';
import { dataFmt, moeda } from '../utils/formatters.js';

/* cache de ações carregadas por pragaId */
const _acoes = {};

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

  if (!itens.length) {
    el.innerHTML = '<div class="empty"><span class="ei">🐛</span><p>Nenhuma ocorrência registrada.</p></div>';
    return;
  }

  const sorted = [...itens].sort((a, b) => b.dataIdentificacao.localeCompare(a.dataIdentificacao));

  el.innerHTML = sorted.map(p => `
    <div class="est-accordion" id="acc-praga-${p.id}">
      <div class="est-acc-hdr" onclick="window._toggleAcoes('${p.id}')">
        <div class="est-acc-left" style="gap:12px;flex-wrap:wrap">
          <span>${dataFmt(p.dataIdentificacao)}</span>
          <strong>${p.nome}</strong>
          ${_tipoBadge(p.tipo)}
          ${_severidadeBadge(p.nivelSeveridade)}
          <span style="font-size:.75rem;color:var(--app-text-secondary)">${Store.areaNome(p.areaId)}</span>
        </div>
        <div class="est-acc-right">
          <span class="est-acc-stat ok" id="acoes-count-${p.id}">
            ${_acoes[p.id] ? `${_acoes[p.id].length} ação(ões)` : '📋 Ações'}
          </span>
          <button class="btn-d" onclick="event.stopPropagation();window._deletarPraga('${p.id}')">✕</button>
          <span class="est-acc-chev" id="chev-${p.id}">▾</span>
        </div>
      </div>
      <div class="est-acc-body" id="body-praga-${p.id}">
        <div style="padding:16px">
          ${p.observacoes ? `<p style="font-size:.82rem;color:var(--app-text-secondary);margin-bottom:14px">📝 ${p.observacoes}</p>` : ''}
          <h4 style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--app-text-secondary);margin-bottom:12px">Ações de Controle</h4>
          <div id="lista-acoes-${p.id}"><p style="font-size:.82rem;color:var(--app-text-secondary)">Carregando...</p></div>
          <div class="fc" style="margin-top:14px;padding:16px">
            <h3>➕ Registrar Ação</h3>
            <div class="fg">
              <div class="g full"><label>Descrição</label><input type="text" id="acao-desc-${p.id}" placeholder="Ex: Aplicação de fungicida, remoção manual..."></div>
              <div class="g"><label>Produto usado</label><input type="text" id="acao-prod-${p.id}" placeholder="Nome do produto (opcional)"></div>
              <div class="g"><label>Custo (R$)</label><input type="number" id="acao-custo-${p.id}" min="0" step="0.01" placeholder="Opcional"></div>
              <div class="g"><label>Data de Aplicação</label><input type="date" id="acao-data-${p.id}"></div>
            </div>
            <button class="btn-p" style="margin-top:10px" onclick="window._salvarAcao('${p.id}')">✓ Registrar Ação</button>
          </div>
        </div>
      </div>
    </div>`).join('');
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
  const p = Store.pragas.find(x => x.id === id);
  if (!confirm(`Excluir a ocorrência "${p?.nome ?? ''}"? Essa ação não pode ser desfeita.`)) return;

  try {
    await Store.deletarPraga(id);
    delete _acoes[id];
    renderPragas();
    toastOk('Ocorrência removida.');
  } catch (e) { toastErr(e.message ?? 'Erro ao remover.'); }
};

window._toggleAcoes = async (pragaId) => {
  const body = document.getElementById(`body-praga-${pragaId}`);
  const chev = document.getElementById(`chev-${pragaId}`);
  if (!body) return;

  const abrindo = !body.classList.contains('open');
  body.classList.toggle('open', abrindo);
  chev?.classList.toggle('open', abrindo);

  if (abrindo && !_acoes[pragaId]) {
    try {
      _acoes[pragaId] = await Store.carregarAcoesPraga(pragaId);
    } catch {
      toastErr('Erro ao carregar ações.');
      _acoes[pragaId] = [];
    }
  }
  if (abrindo) _renderAcoes(pragaId);
};

window._salvarAcao = async (pragaId) => {
  const descricao      = document.getElementById(`acao-desc-${pragaId}`)?.value?.trim() ?? '';
  const produtoUsado   = document.getElementById(`acao-prod-${pragaId}`)?.value?.trim() || null;
  const custo          = parseFloat(document.getElementById(`acao-custo-${pragaId}`)?.value || 0) || null;
  const dataAplicacao  = document.getElementById(`acao-data-${pragaId}`)?.value ?? '';

  if (!descricao)     { toastErr('Informe a descrição da ação.'); return; }
  if (!dataAplicacao) { toastErr('Informe a data de aplicação.'); return; }

  try {
    const nova = await Store.criarAcaoPraga(pragaId, { descricao, produtoUsado, custo, dataAplicacao });
    _acoes[pragaId] = [...(_acoes[pragaId] ?? []), nova];
    _renderAcoes(pragaId);
    /* limpa formulário */
    ['desc','prod','custo','data'].forEach(f => {
      const el = document.getElementById(`acao-${f}-${pragaId}`);
      if (el) el.value = '';
    });
    toastOk('Ação registrada!');
  } catch (e) { toastErr(e.message ?? 'Erro ao salvar.'); }
};

window._deletarAcao = async (pragaId, acaoId) => {
  if (!confirm('Excluir esta ação de controle? Essa ação não pode ser desfeita.')) return;

  try {
    await Store.deletarAcaoPraga(pragaId, acaoId);
    _acoes[pragaId] = (_acoes[pragaId] ?? []).filter(a => a.id !== acaoId);
    _renderAcoes(pragaId);
    toastOk('Ação removida.');
  } catch (e) { toastErr(e.message ?? 'Erro ao remover.'); }
};

function _renderAcoes(pragaId) {
  const el    = document.getElementById(`lista-acoes-${pragaId}`);
  const count = document.getElementById(`acoes-count-${pragaId}`);
  const lista = _acoes[pragaId] ?? [];

  if (count) count.textContent = `${lista.length} ação(ões)`;
  if (!el) return;

  if (!lista.length) {
    el.innerHTML = '<p style="font-size:.82rem;color:var(--app-text-secondary)">Nenhuma ação registrada ainda.</p>';
    return;
  }

  el.innerHTML = `<div class="tw" style="margin-bottom:10px">
    <table>
      <thead><tr><th>Data</th><th>Descrição</th><th>Produto</th><th>Custo</th><th></th></tr></thead>
      <tbody>
        ${[...lista].sort((a, b) => b.dataAplicacao.localeCompare(a.dataAplicacao)).map(a => `<tr>
          <td>${dataFmt(a.dataAplicacao)}</td>
          <td>${a.descricao}</td>
          <td>${a.produtoUsado ?? '—'}</td>
          <td>${a.custo ? moeda(a.custo) : '—'}</td>
          <td><button class="btn-d" onclick="window._deletarAcao('${pragaId}','${a.id}')">✕</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

window._deletarIrrigacao = async (id) => {
  if (!confirm('Excluir este registro de irrigação? Essa ação não pode ser desfeita.')) return;

  try {
    await Store.deletarIrrigacao(id);
    renderIrrigacao();
    toastOk('Registro removido.');
  } catch (e) { toastErr(e.message ?? 'Erro ao remover.'); }
};