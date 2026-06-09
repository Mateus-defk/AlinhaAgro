/**
 * Geração de gráficos SVG inline.
 * Retorna strings HTML prontas para inserção via innerHTML.
 */

import { moeda, MESES } from './formatters.js';

/* ── Pizza SVG */
export function gerarPizzaSVG(fatias) {
  /* fatias: [{ label, valor, cor }] */
  const total = fatias.reduce((s, f) => s + (f.valor || 0), 0);
  if (!total) return '<p style="color:var(--texto3);font-size:.82rem">Sem dados</p>';

  const SIZE = 180, CX = 90, CY = 90, R = 75;
  let paths = '';
  let legenda = '';
  let angulo = -Math.PI / 2;

  fatias.forEach(f => {
    if (!f.valor) return;
    const sweep = (f.valor / total) * 2 * Math.PI;
    const x1 = CX + R * Math.cos(angulo);
    const y1 = CY + R * Math.sin(angulo);
    angulo += sweep;
    const x2 = CX + R * Math.cos(angulo);
    const y2 = CY + R * Math.sin(angulo);
    const large = sweep > Math.PI ? 1 : 0;

    paths += `<path d="M${CX},${CY} L${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} Z"
      fill="${f.cor}" opacity=".9" stroke="#fff" stroke-width="2"/>`;

    const pct = ((f.valor / total) * 100).toFixed(1);
    legenda += `<div style="display:flex;align-items:center;gap:6px;font-size:.72rem;color:var(--texto2);margin-bottom:5px">
      <span style="width:10px;height:10px;border-radius:2px;background:${f.cor};flex-shrink:0"></span>
      ${f.label} — ${pct}%
    </div>`;
  });

  return `<div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
    <svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${paths}</svg>
    <div>${legenda}</div>
  </div>`;
}

/* ── Barras mensais SVG */
export function gerarBarrasSVG(dados, { corDespesa = '#c0392b', corReceita = '#16a34a' } = {}) {
  /* dados: Array de 12 itens { desp, rec } indexados por mês (0..11) */
  const maxVal = Math.max(...dados.flatMap(d => [d.desp || 0, d.rec || 0]), 1);
  const W = 460, H = 120, BAR_W = 14, GAP = 4, MARGIN = 24;
  const groupW = BAR_W * 2 + GAP + 8;
  const scaleY  = (v) => H - (v / maxVal) * (H - 10);

  let bars = '';
  let labels = '';

  dados.forEach((d, i) => {
    const x = MARGIN + i * groupW;
    if (d.desp) bars += `<rect x="${x}" y="${scaleY(d.desp)}" width="${BAR_W}" height="${H - scaleY(d.desp)}" fill="${corDespesa}" rx="2" opacity=".85"><title>${moeda(d.desp)}</title></rect>`;
    if (d.rec)  bars += `<rect x="${x + BAR_W + GAP}" y="${scaleY(d.rec)}" width="${BAR_W}" height="${H - scaleY(d.rec)}" fill="${corReceita}" rx="2" opacity=".85"><title>${moeda(d.rec)}</title></rect>`;
    labels += `<text x="${x + BAR_W}" y="${H + 14}" text-anchor="middle" font-size="8" fill="var(--texto3)">${MESES[i]}</text>`;
  });

  return `<svg width="100%" viewBox="0 0 ${W} ${H + 20}" style="overflow:visible">${bars}${labels}</svg>`;
}
