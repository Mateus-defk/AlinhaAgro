/**
 * Módulo: Cadastros
 * - Variedades e Produtos: integrados com /api/variedades e /api/produtos
 * - Mão de Obra: integrado com /api/mao-de-obra
 */

import { Store }  from '../core/store.js';
import { router } from '../core/router.js';
import { toastOk, toastErr } from '../utils/toast.js';
import { dataFmt, moeda } from '../utils/formatters.js';

router.register('variedades', _init);

let _abaAtiva = 'variedades';

async function _init() {
  await _carregarAba(_abaAtiva);
  renderVariedades();
}

export async function mudarCadTab(aba) {
  _abaAtiva = aba;
  document.querySelectorAll('.cad-tab').forEach(t => t.classList.remove('ativo'));
  document.getElementById(`ctab-${aba}`)?.classList.add('ativo');
  await _carregarAba(aba);
  renderVariedades();
}

async function _carregarAba(aba) {
  try {
    if (aba === 'variedades') await Store.carregarVariedades();
    else if (aba === 'produtos')   await Store.carregarProdutos();
    else if (aba === 'maodeobra')  await Store.carregarMaoDeObra();
  } catch {
    toastErr(`Erro ao carregar ${aba}.`);
  }
}

export function renderVariedades() {
  if (_abaAtiva === 'variedades') _renderVariedades();
  else if (_abaAtiva === 'produtos')  _renderProdutos();
  else if (_abaAtiva === 'maodeobra') _renderMaoDeObra();
}

/* ── Variedades (API) ──────────────────────────────────────── */

function _renderVariedades() {
  const itens = Store.variedades;
  const el    = document.getElementById('lista-variedades');
  if (!el) return;

  el.innerHTML = `
    <div class="fc" style="margin-bottom:20px">
      <h3>➕ Nova Variedade</h3>
      <div class="fg">
        <div class="g"><label>Nome da variedade</label><input type="text" id="v-nome" placeholder="Ex: Tommy Atkins"></div>
        <div class="g"><label>Fruta</label><input type="text" id="v-fruta" placeholder="Ex: Manga" value="Manga"></div>
        <div class="g"><label>Peso médio (kg)</label><input type="number" id="v-peso" step="0.1" min="0"></div>
        <div class="g"><label>Ciclo (dias)</label><input type="number" id="v-ciclo" min="1"></div>
        <div class="g"><label>Mês colheita</label><input type="text" id="v-colheita" placeholder="Ex: Mar–Abr"></div>
        <div class="g full"><label>Observações</label><textarea id="v-obs" placeholder="Características, clima, resistência..."></textarea></div>
      </div>
      <button class="btn-p" onclick="salvarCadastro('variedades')">✓ Salvar Variedade</button>
    </div>
    ${!itens.length
      ? '<div class="var-vazio"><span class="vz-icon">🌿</span><p>Nenhuma variedade cadastrada.</p></div>'
      : `<div class="var-grid">${itens.map(v => `
          <div class="var-card">
            <div class="var-card-header">
              <span class="var-fruta-badge">🥭 ${v.fruta ?? 'Manga'}</span>
              <button class="var-card-del" onclick="window._deletarVar('${v.id}','variedades')">✕</button>
            </div>
            <div class="var-card-nome">${v.nome}</div>
            <div class="var-card-meta">
              <span>⚖️ ${v.pesoMedioKg ?? '—'} kg</span>
              <span>📅 ${v.cicloDias ?? '—'} dias</span>
              <span>🗓 Col.: ${v.mesColheita ?? '—'}</span>
            </div>
            ${v.obs ? `<div class="var-card-obs">${v.obs}</div>` : ''}
          </div>`).join('')}
        </div>`}`;
}

/* ── Produtos (API) ────────────────────────────────────────── */

function _renderProdutos() {
  const itens = Store.produtos;
  const el    = document.getElementById('lista-variedades');
  if (!el) return;

  el.innerHTML = `
    <div class="fc" style="margin-bottom:20px">
      <h3>➕ Novo Produto</h3>
      <div class="fg">
        <div class="g"><label>Nome</label><input type="text" id="prod-nome" placeholder="Ex: Mancozebe WP"></div>
        <div class="g"><label>Tipo</label>
          <select id="prod-tipo">
            <option value="organico">Orgânico</option>
            <option value="quimico">Químico</option>
          </select>
        </div>
        <div class="g"><label>Unidade</label><input type="text" id="prod-unidade" placeholder="kg, L, saco..."></div>
        <div class="g"><label>Princípio ativo</label><input type="text" id="prod-ativo" placeholder="Opcional"></div>
        <div class="g full"><label>Observações</label><textarea id="prod-obs"></textarea></div>
      </div>
      <button class="btn-p" onclick="salvarCadastro('produtos')">✓ Salvar Produto</button>
    </div>
    ${!itens.length
      ? '<div class="var-vazio"><span class="vz-icon">🧪</span><p>Nenhum produto cadastrado.</p></div>'
      : `<div class="var-grid">${itens.map(p => `
          <div class="var-card ${p.tipo}">
            <div class="var-card-header">
              <span class="prod-tipo-badge ${p.tipo}">${p.tipo}</span>
              <button class="var-card-del" onclick="window._deletarVar('${p.id}','produtos')">✕</button>
            </div>
            <div class="var-card-nome">${p.nome}</div>
            <div class="var-card-meta">
              <span>📦 ${p.unidade ?? 'kg'}</span>
              ${p.principioAtivo ? `<span>🔬 ${p.principioAtivo}</span>` : ''}
            </div>
            ${p.obs ? `<div class="var-card-obs">${p.obs}</div>` : ''}
          </div>`).join('')}
        </div>`}`;
}

/* ── Mão de Obra (API) ─────────────────────────────────────── */

function _renderMaoDeObra() {
  const itens = Store.maoDeObra;
  const el    = document.getElementById('lista-variedades');
  if (!el) return;

  el.innerHTML = `
    <div class="fc" style="margin-bottom:20px">
      <h3>➕ Registrar Mão de Obra</h3>
      <div class="fg">
        <div class="g"><label>Área</label>
          <select id="mo-area">
            <option value="">— Nenhuma —</option>
            ${Store.areas.map(a => `<option value="${a.id}">${a.nome}</option>`).join('')}
          </select>
        </div>
        <div class="g"><label>Descrição</label><input type="text" id="mo-desc" placeholder="Ex: Colheita manga, capina..."></div>
        <div class="g"><label>Tipo</label>
          <select id="mo-tipo">
            <option value="diarista">Diarista</option>
            <option value="mensalista">Mensalista</option>
            <option value="empreitada">Empreitada</option>
          </select>
        </div>
        <div class="g"><label>Nº de Pessoas</label><input type="number" id="mo-pessoas" min="1" value="1"></div>
        <div class="g"><label>Valor Total (R$)</label><input type="number" id="mo-valor" min="0.01" step="0.01" placeholder="Ex: 250,00"></div>
        <div class="g"><label>Data</label><input type="date" id="mo-data"></div>
      </div>
      <button class="btn-p" onclick="salvarMaoDeObra()">✓ Registrar</button>
    </div>
    ${!itens.length
      ? '<div class="var-vazio"><span class="vz-icon">👷</span><p>Nenhum registro de mão de obra.</p></div>'
      : `<div class="tw"><table>
          <thead><tr><th>Data</th><th>Área</th><th>Descrição</th><th>Tipo</th><th>Pessoas</th><th>Valor Total</th><th></th></tr></thead>
          <tbody>
            ${[...itens].sort((a, b) => b.data.localeCompare(a.data)).map(m => `<tr>
              <td>${dataFmt(m.data)}</td>
              <td>${Store.areaNome(m.areaId)}</td>
              <td>${m.descricao}</td>
              <td>${m.tipo}</td>
              <td>${m.quantidadePessoas}</td>
              <td>${moeda(m.valorTotal)}</td>
              <td><button class="btn-d" onclick="window._deletarMaoDeObra('${m.id}')">✕</button></td>
            </tr>`).join('')}
          </tbody>
        </table></div>`}`;
}

/* ── Salvar ────────────────────────────────────────────────── */

export async function salvarCadastro(chaveLogica) {
  if (chaveLogica === 'variedades') {
    const nome = _val('v-nome');
    if (!nome) { toastErr('Informe o nome da variedade.'); return; }
    try {
      await Store.criarVariedade({
        nome,
        fruta:        _val('v-fruta') || 'Manga',
        pesoMedioKg:  _num('v-peso')  || null,
        cicloDias:    _int('v-ciclo') || null,
        mesColheita:  _val('v-colheita') || null,
        obs:          _val('v-obs') || null,
      });
      toastOk('Variedade salva!');
      renderVariedades();
    } catch (e) { toastErr(e.message ?? 'Erro ao salvar.'); }
    return;
  }

  if (chaveLogica === 'produtos') {
    const nome = _val('prod-nome');
    if (!nome) { toastErr('Informe o nome do produto.'); return; }
    try {
      await Store.criarProduto({
        nome,
        tipo:           _val('prod-tipo') || 'organico',
        unidade:        _val('prod-unidade') || 'kg',
        principioAtivo: _val('prod-ativo') || null,
        obs:            _val('prod-obs') || null,
      });
      toastOk('Produto salvo!');
      renderVariedades();
    } catch (e) { toastErr(e.message ?? 'Erro ao salvar.'); }
    return;
  }
}

export async function salvarMaoDeObra() {
  const areaId            = _val('mo-area');
  const descricao         = _val('mo-desc');
  const tipo              = _val('mo-tipo') || 'diarista';
  const quantidadePessoas = parseInt(_val('mo-pessoas') || 1);
  const valorTotal        = parseFloat(_val('mo-valor') || 0);
  const data              = _val('mo-data');

  if (!descricao)       { toastErr('Informe a descrição.'); return; }
  if (!(valorTotal > 0)) { toastErr('Valor deve ser maior que zero.'); return; }
  if (!data)            { toastErr('Informe a data.'); return; }

  try {
    await Store.criarMaoDeObra({
      areaId: areaId || null,
      descricao,
      tipo,
      quantidadePessoas,
      valorTotal,
      data,
    });
    toastOk('Mão de obra registrada!');
    renderVariedades();
  } catch (e) {
    toastErr(e.message ?? 'Erro ao salvar.');
  }
}

function _val(id) { return document.getElementById(id)?.value?.trim() ?? ''; }
function _num(id) { const v = parseFloat(_val(id)); return isNaN(v) ? null : v; }
function _int(id) { const v = parseInt(_val(id)); return isNaN(v) ? null : v; }

window._deletarVar = async (id, tipo) => {
  const lista = tipo === 'variedades' ? Store.variedades : Store.produtos;
  const nome  = lista.find(x => x.id === id)?.nome ?? 'este item';
  if (!confirm(`Excluir "${nome}"? Essa ação não pode ser desfeita.`)) return;

  try {
    if (tipo === 'variedades') await Store.deletarVariedade(id);
    else                       await Store.deletarProduto(id);
    renderVariedades();
    toastOk('Removido.');
  } catch (e) { toastErr(e.message ?? 'Erro ao remover.'); }
};

window._deletarMaoDeObra = async (id) => {
  const m = Store.maoDeObra.find(x => x.id === id);
  if (!confirm(`Excluir o registro "${m?.descricao ?? 'de mão de obra'}"? Essa ação não pode ser desfeita.`)) return;

  try {
    await Store.deletarMaoDeObra(id);
    renderVariedades();
    toastOk('Registro removido.');
  } catch (e) { toastErr(e.message ?? 'Erro ao remover.'); }
};