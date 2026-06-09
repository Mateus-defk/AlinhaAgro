/**
 * Módulo: Campo — Pragas e Irrigação
 */

import { State }   from '../core/state.js';
import { Storage } from '../core/storage.js';
import { router }  from '../core/router.js';
import { toastOk, toastErr } from '../utils/toast.js';
import { dataFmt, gerarId } from '../utils/formatters.js';

router.register('pragas',   renderPragas);
router.register('irrigacao', renderIrrigacao);

/* ── Pragas */
export function salvarPraga(dados) {
  if (!dados.area || !dados.praga) { toastErr('Área e praga são obrigatórios.'); return; }
  const itens = Storage.get('ag_pragas');
  itens.push({ id: gerarId(), ...dados, data: dados.data || new Date().toISOString().slice(0, 10) });
  Storage.set('ag_pragas', itens);
  toastOk('Ocorrência registrada!');
  renderPragas();
}

export function renderPragas() {
  const itens = Storage.get('ag_pragas');
  const el    = document.getElementById('lista-pragas');
  if (!el) return;

  el.innerHTML = !itens.length
    ? '<div class="empty"><span class="ei">🐛</span><p>Nenhuma ocorrência registrada.</p></div>'
    : `<div class="tw"><table>
        <thead><tr><th>Data</th><th>Área</th><th>Praga/Doença</th><th>Severidade</th><th>Controle</th><th></th></tr></thead>
        <tbody>
          ${itens.sort((a, b) => b.data.localeCompare(a.data)).map(p => `<tr>
            <td>${dataFmt(p.data)}</td>
            <td>${p.area}</td>
            <td>${p.praga}</td>
            <td>${_severidadeBadge(p.severidade)}</td>
            <td>${p.controle ?? '—'}</td>
            <td><button class="btn-d" onclick="window._deletarPraga('${p.id}')">✕</button></td>
          </tr>`).join('')}
        </tbody>
      </table></div>`;
}

/* ── Irrigação */
export function salvarIrrigacao(dados) {
  if (!dados.area) { toastErr('Selecione uma área.'); return; }
  const itens = Storage.get('ag_irrigacao');
  itens.push({ id: gerarId(), ...dados, data: dados.data || new Date().toISOString().slice(0, 10) });
  Storage.set('ag_irrigacao', itens);
  toastOk('Irrigação registrada!');
  renderIrrigacao();
}

export function renderIrrigacao() {
  const itens = Storage.get('ag_irrigacao');
  const el    = document.getElementById('lista-irrigacao');
  if (!el) return;

  el.innerHTML = !itens.length
    ? '<div class="empty"><span class="ei">💧</span><p>Nenhum registro de irrigação.</p></div>'
    : `<div class="tw"><table>
        <thead><tr><th>Data</th><th>Área</th><th>Horas</th><th>Consumo (m³)</th><th>Custo (R$)</th><th></th></tr></thead>
        <tbody>
          ${itens.sort((a, b) => b.data.localeCompare(a.data)).map(i => `<tr>
            <td>${dataFmt(i.data)}</td>
            <td>${i.area}</td>
            <td>${i.horas ?? '—'}</td>
            <td>${i.consumo ?? '—'}</td>
            <td class="vm">${i.custo ? `R$ ${i.custo}` : '—'}</td>
            <td><button class="btn-d" onclick="window._deletarIrrigacao('${i.id}')">✕</button></td>
          </tr>`).join('')}
        </tbody>
      </table></div>`;
}

function _severidadeBadge(s) {
  const map = { baixa: '#dcfce7:#166534', media: '#fef9c3:#854d0e', alta: '#fee2e2:#991b1b' };
  const [bg, color] = (map[s] ?? map.media).split(':');
  return `<span style="background:${bg};color:${color};padding:2px 8px;border-radius:12px;font-size:.7rem;font-weight:700">${s ?? 'média'}</span>`;
}

/* Expor para onclick inline */
window._deletarPraga = (id) => {
  Storage.set('ag_pragas', Storage.get('ag_pragas').filter(p => p.id !== id));
  renderPragas();
};
window._deletarIrrigacao = (id) => {
  Storage.set('ag_irrigacao', Storage.get('ag_irrigacao').filter(i => i.id !== id));
  renderIrrigacao();
};
