/**
 * Módulo: Estoque
 * Integrado com /api/estoque — dados persistidos no banco.
 */

import { Store }  from '../core/store.js';
import { router } from '../core/router.js';
import { toastOk, toastErr } from '../utils/toast.js';
import { moeda, dataFmt } from '../utils/formatters.js';
import { confirmar } from '../utils/confirmDialog.js';

router.register('estoque', _init);

async function _init() {
  _popularAreaSelect('est-area');
  try {
    await Store.carregarEstoque();
  } catch (e) {
    toastErr('Erro ao carregar estoque.');
  }
  renderEstoque();
}

export async function salvarEstoque() {
  const produto    = _val('est-produto');
  const quantidade = parseFloat(_val('est-qtd') || 0);
  const unidade    = _val('est-unidade');
  const tipo       = _val('est-tipo') || 'fertilizante';

  if (!produto)        { toastErr('Informe o nome do produto.'); return false; }
  if (!(quantidade > 0)) { toastErr('Quantidade deve ser maior que zero.'); return false; }

  const payload = {
    areaId:        _val('est-area') || null,
    produto,
    tipo,
    quantidade,
    unidade,
    custoUnitario: parseFloat(_val('est-valor') || 0) || null,
    validade:      _val('est-validade') || null,
  };

  try {
    await Store.criarEstoque(payload);
    toastOk(`${produto} adicionado ao estoque.`);
    _limparForm();
    renderEstoque();
    return true;
  } catch (e) {
    toastErr(e.message ?? 'Erro ao salvar.');
    return false;
  }
}

export function renderEstoque() {
  const container = document.getElementById('lista-estoque');
  if (!container) return;

  const itens = Store.estoque;
  if (!itens.length) {
    container.innerHTML = '<div class="empty"><span class="ei">📦</span><p>Estoque vazio. Adicione materiais acima.</p></div>';
    return;
  }

  const grupos = {};
  itens.forEach(item => { (grupos[item.tipo] ??= []).push(item); });

  const LABEL = { semente: '🌾 Sementes', fertilizante: '🌱 Fertilizantes', defensivo: '🧪 Defensivos', outro: '📦 Outros' };

  container.innerHTML = Object.entries(grupos).map(([tipo, lista]) => `
    <div class="est-accordion">
      <div class="est-acc-hdr" onclick="this.nextElementSibling.classList.toggle('open');this.querySelector('.est-acc-chev').classList.toggle('open')">
        <div class="est-acc-left">${LABEL[tipo] ?? tipo}</div>
        <div class="est-acc-right">
          <span class="est-acc-stat ok">${lista.length} item(s)</span>
          <span class="est-acc-chev">▾</span>
        </div>
      </div>
      <div class="est-acc-body">
        <table class="est-tbl">
          <thead><tr><th>Produto</th><th>Área</th><th>Qtd</th><th>Unid.</th><th>Custo Unit.</th><th>Validade</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${lista.map(item => {
              const cls   = item.quantidade === 0 ? 'zerado' : 'ok';
              const label = cls === 'zerado' ? 'Zerado' : 'OK';
              return `<tr>
                <td>${item.produto}</td>
                <td>${Store.areaNome(item.areaId)}</td>
                <td>${item.quantidade}</td>
                <td>${item.unidade}</td>
                <td>${item.custoUnitario ? moeda(item.custoUnitario) : '—'}</td>
                <td>${item.validade ? dataFmt(item.validade) : '—'}</td>
                <td><span class="est-status ${cls}">${label}</span></td>
                <td style="display:flex;gap:6px;align-items:center">
                  <button class="btn-edit" onclick="window._baixarEstoque('${item.id}')">↓ Baixar</button>
                  <button class="btn-d"    onclick="window._deletarEstoque('${item.id}')">✕</button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`).join('');
}

function _popularAreaSelect(id) {
  const sel = document.getElementById(id);
  if (!sel) return;
  const areas = Store.areas;
  sel.innerHTML = '<option value="">— Nenhuma área —</option>' +
    areas.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');
}

function _val(id) { return document.getElementById(id)?.value?.trim() ?? ''; }

function _limparForm() {
  ['est-produto','est-qtd','est-valor','est-validade'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

window._deletarEstoque = async (id) => {
  const item = Store.estoque.find(e => e.id === id);
  if (!(await confirmar(`Excluir "${item?.produto ?? 'este item'}" do estoque? Essa ação não pode ser desfeita.`))) return;

  try {
    await Store.deletarEstoque(id);
    renderEstoque();
    toastOk('Item removido.');
  } catch (e) {
    toastErr(e.message ?? 'Erro ao remover.');
  }
};

window._baixarEstoque = (id) => {
  document.getElementById('baixar-est-id').value = id;
  document.getElementById('baixar-est-qtd').value = '';
  document.getElementById('modal-baixar-estoque').classList.add('open');
  document.getElementById('baixar-est-qtd').focus();
};

export async function confirmarBaixa(quantidade) {
  const id = document.getElementById('baixar-est-id').value;
  if (!(quantidade > 0)) { toastErr('Quantidade inválida.'); return false; }
  try {
    await Store.baixarEstoque(id, quantidade);
    renderEstoque();
    toastOk('Baixa registrada.');
    return true;
  } catch (e) {
    toastErr(e.message ?? 'Erro ao baixar.');
    return false;
  }
}