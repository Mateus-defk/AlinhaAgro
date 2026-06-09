/**
 * Utilitários de formatação — moeda, data, número, ID.
 */

/* ── Moeda BRL */
export const moeda = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);

/* ── Número com casas decimais */
export const num = (v, decimais = 2) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: decimais }).format(v ?? 0);

/* ── Data DD/MM/AAAA */
export const dataFmt = (iso) => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

/* ── Mês/Ano por extenso */
export const mesAno = (iso) => {
  if (!iso) return '—';
  const dt = new Date(iso + 'T00:00:00');
  return dt.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};

/* ── Percentual */
export const pct = (v) => `${num(v, 1)}%`;

/* ── ID único */
export const gerarId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ── Truncar texto */
export const truncar = (str, max = 40) =>
  str?.length > max ? str.slice(0, max) + '…' : (str ?? '');

/* ── Parsear número de string BR (1.234,56 → 1234.56) */
export const parseBR = (str) => {
  if (typeof str === 'number') return str;
  return parseFloat(String(str).replace(/\./g, '').replace(',', '.')) || 0;
};

/* ── Nome do mês (0-indexed) */
export const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
