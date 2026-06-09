/**
 * Módulo: Estoque (Premium)
 * Controle de materiais com alertas de estoque mínimo.
 */

import { State }   from '../core/state.js';
import { Storage } from '../core/storage.js';
import { router }  from '../core/router.js';
import { toastOk, toastErr } from '../utils/toast.js';
import { moeda, gerarId } from '../utils/formatters.js';
import { CONFIG } from '../core/config.js';

router.register('estoque', renderEstoque);

const CHAVE = 'ag_estoque';

export function salvarEstoque() {
  const user  = State.user;
  if (!_verificarPremium(user, 'estoque')) return;

  const produto = _val('est-produto')?.trim();
  const qtd     = parseFloat(_val('est-qtd') || 0);
  const unidade = _val('est-unidade');
  const tipo    = _val('est-tipo') || 'organico';

  if (!produto)        { toastErr('Informe o nome do produto.'); return; }
  if (!(qtd > 0))      { toastErr('Quantidade deve ser maior que zero.'); return; }

  const itens = Storage.get(CHAVE);
  const plano = CONFIG.PLANOS[user.plano];

  if (itens.length >= plano.maxEstoque) {
    toastErr(`Limite de ${plano.maxEstoque} itens atingido no plano ${user.plano}.`);
    return;
  }

  itens.push({
    id: gerarId(), tipo, produto, qtd, unidade,
    valor:    parseFloat(_val('est-valor') || 0),
    minimo:   parseFloat(_val('est-min')   || 0),
    validade: _val('est-validade'),
    local:    _val('est-local'),
    obs:      _val('est-obs'),
    criado:   new Date().toISOString(),
  });

  Storage.set(CHAVE, itens);
  toastOk(`${produto} adicionado ao estoque.`);
  _limparForm();
  renderEstoque();
}

export function renderEstoque() {
  const container = document.getElementById('lista-estoque');
  if (!container) return;

  const itens = Storage.get(CHAVE);
  if (!itens.length) {
    container.innerHTML = '<div class="empty"><span class="ei">📦</span><p>Estoque vazio. Adicione materiais acima.</p></div>';
    return;
  }

  /* Agrupa por tipo */
  const grupos = {};
  itens.forEach(item => {
    (grupos[item.tipo] ??= []).push(item);
  });

  container.innerHTML = Object.entries(grupos).map(([tipo, lista]) => {
    const label = { organico: '🌿 Orgânicos', quimico: '🧪 Químicos', adubo: '🌱 Adubos' }[tipo] ?? tipo;
    return `<div class="est-accordion">
      <div class="est-acc-hdr" onclick="this.nextElementSibling.classList.toggle('open');this.querySelector('.est-acc-chev').classList.toggle('open')">
        <div class="est-acc-left">${label}</div>
        <div class="est-acc-right">
          <span class="est-acc-stat ok">${lista.length} item(s)</span>
          <span class="est-acc-chev">▾</span>
        </div>
      </div>
      <div class="est-acc-body">
        <table class="est-tbl">
          <thead><tr><th>Produto</th><th>Qtd</th><th>Unid.</th><th>Valor Unit.</th><th>Mínimo</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${lista.map(item => {
              const pct  = item.minimo > 0 ? Math.min((item.qtd / item.minimo) * 100, 100) : 100;
              const cls  = item.qtd === 0 ? 'zerado' : item.minimo > 0 && item.qtd <= item.minimo ? 'baixo' : 'ok';
              const label = { ok: 'OK', baixo: 'Baixo', zerado: 'Zerado' }[cls];
              return `<tr>
                <td>${item.produto}</td>
                <td>${item.qtd}</td>
                <td>${item.unidade}</td>
                <td>${moeda(item.valor)}</td>
                <td>${item.minimo || '—'}</td>
                <td><span class="est-status ${cls}">${label}</span></td>
                <td><button class="btn-d" onclick="window._deletarEstoque('${item.id}')">✕</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }).join('');
}

export function deletarEstoque(id) {
  Storage.set(CHAVE, Storage.get(CHAVE).filter(i => i.id !== id));
  renderEstoque();
  toastOk('Item removido.');
}

function _verificarPremium(user, modulo) {
  const plano = CONFIG.PLANOS[user?.plano];
  if (!plano || plano.maxEstoque === 0) {
    toastErr('Módulo disponível a partir do plano Trimestral.');
    return false;
  }
  return true;
}

function _val(id) { return document.getElementById(id)?.value?.trim() ?? ''; }
function _limparForm() {
  ['est-produto','est-qtd','est-valor','est-min','est-validade','est-local','est-obs'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

window._deletarEstoque = deletarEstoque;
