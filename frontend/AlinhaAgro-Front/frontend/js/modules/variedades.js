/**
 * Módulo: Cadastros (Variedades, Produtos, Mão de Obra)
 */

import { State }   from '../core/state.js';
import { Storage } from '../core/storage.js';
import { router }  from '../core/router.js';
import { toastOk, toastErr } from '../utils/toast.js';
import { gerarId } from '../utils/formatters.js';

router.register('variedades', renderVariedades);

const CHAVES = {
  variedades: 'ag_variedades',
  produtos:   'ag_produtos',
  maodeobra:  'ag_maodeobra',
};

let _abaAtiva = 'variedades';

export function mudarCadTab(aba) {
  _abaAtiva = aba;
  document.querySelectorAll('.cad-tab').forEach(t => t.classList.remove('ativo'));
  document.getElementById(`ctab-${aba}`)?.classList.add('ativo');
  renderVariedades();
}

export function renderVariedades() {
  if (_abaAtiva === 'variedades') _renderVariedades();
  else if (_abaAtiva === 'produtos')   _renderProdutos();
  else if (_abaAtiva === 'maodeobra')  _renderMaoDeObra();
}

function _renderVariedades() {
  const itens = Storage.get(CHAVES.variedades);
  const el    = document.getElementById('lista-variedades');
  if (!el) return;

  el.innerHTML = !itens.length
    ? '<div class="var-vazio"><span class="vz-icon">🌿</span><p>Nenhuma variedade cadastrada.</p></div>'
    : `<div class="var-grid">${itens.map(v => `
        <div class="var-card">
          <div class="var-card-header">
            <span class="var-fruta-badge">🥭 ${v.fruta ?? 'Manga'}</span>
            <button class="var-card-del" onclick="window._deletarVar('${v.id}','variedades')">✕</button>
          </div>
          <div class="var-card-nome">${v.nome}</div>
          <div class="var-card-meta">
            <span>⚖️ ${v.peso ?? '—'} kg</span>
            <span>📅 ${v.ciclo ?? '—'} dias</span>
            <span>🗓 Col.: ${v.colheita ?? '—'}</span>
          </div>
          ${v.obs ? `<div class="var-card-obs">${v.obs}</div>` : ''}
        </div>`).join('')}
      </div>`;
}

function _renderProdutos() {
  const itens = Storage.get(CHAVES.produtos);
  const el    = document.getElementById('lista-variedades');
  if (!el) return;

  el.innerHTML = !itens.length
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
      </div>`;
}

function _renderMaoDeObra() {
  const itens = Storage.get(CHAVES.maodeobra);
  const el    = document.getElementById('lista-variedades');
  if (!el) return;

  el.innerHTML = !itens.length
    ? '<div class="var-vazio"><span class="vz-icon">👷</span><p>Nenhum colaborador cadastrado.</p></div>'
    : `<div class="var-grid">${itens.map(m => `
        <div class="var-card">
          <div class="var-card-header">
            <span class="var-fruta-badge">👷 ${m.tipo ?? 'Diarista'}</span>
            <button class="var-card-del" onclick="window._deletarVar('${m.id}','maodeobra')">✕</button>
          </div>
          <div class="var-card-nome">${m.nome}</div>
          <div class="var-card-meta">
            <span>💰 R$ ${m.valor ?? '—'}/${m.unidade ?? 'diária'}</span>
          </div>
        </div>`).join('')}
      </div>`;
}

export function salvarCadastro(chaveLogica, dados) {
  const itens = Storage.get(CHAVES[chaveLogica]);
  itens.push({ id: gerarId(), ...dados });
  Storage.set(CHAVES[chaveLogica], itens);
  toastOk('Cadastro salvo!');
  renderVariedades();
}

export function deletarCadastro(id, chaveLogica) {
  const itens = Storage.get(CHAVES[chaveLogica]).filter(i => i.id !== id);
  Storage.set(CHAVES[chaveLogica], itens);
  renderVariedades();
  toastOk('Removido.');
}

window._deletarVar = deletarCadastro;
