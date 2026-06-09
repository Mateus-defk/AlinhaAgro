/**
 * Store — cache em memória dos dados da API.
 * Centraliza áreas e lançamentos para que todos os módulos
 * leiam de um único lugar sem chamadas duplicadas.
 */

import { api } from './api.js';

const _data = {
  areas:       [],
  lancamentos: [],
};

export const Store = {

  /* ── Getters ───────────────────────────────────────────── */
  get areas()       { return _data.areas; },
  get lancamentos() { return _data.lancamentos; },

  /* ── Carregamento inicial (chamado após login/restaurarSessao) */
  async load() {
    const [areas, lancamentos] = await Promise.all([
      api.get('/areas'),
      api.get('/lancamentos'),
    ]);
    _data.areas       = areas       ?? [];
    _data.lancamentos = lancamentos ?? [];
  },

  /* ── Areas ─────────────────────────────────────────────── */
  async criarArea(payload) {
    const nova = await api.post('/areas', payload);
    _data.areas.push(nova);
    _data.areas.sort((a, b) => a.nome.localeCompare(b.nome));
    return nova;
  },

  async atualizarArea(id, payload) {
    const atualizada = await api.put(`/areas/${id}`, payload);
    const idx = _data.areas.findIndex(a => a.id === id);
    if (idx >= 0) _data.areas[idx] = atualizada;
    return atualizada;
  },

  async deletarArea(id) {
    await api.delete(`/areas/${id}`);
    _data.areas = _data.areas.filter(a => a.id !== id);
  },

  /* ── Lançamentos ────────────────────────────────────────── */
  async criarLancamento(payload) {
    const novo = await api.post('/lancamentos', payload);
    _data.lancamentos.unshift(novo);
    return novo;
  },

  async atualizarLancamento(id, payload) {
    const atualizado = await api.put(`/lancamentos/${id}`, payload);
    const idx = _data.lancamentos.findIndex(l => l.id === id);
    if (idx >= 0) _data.lancamentos[idx] = atualizado;
    return atualizado;
  },

  async deletarLancamento(id) {
    await api.delete(`/lancamentos/${id}`);
    _data.lancamentos = _data.lancamentos.filter(l => l.id !== id);
  },

  async resumoLancamentos(inicio, fim) {
    const params = new URLSearchParams();
    if (inicio) params.set('inicio', inicio);
    if (fim)    params.set('fim',    fim);
    return api.get(`/lancamentos/resumo?${params}`);
  },

  /* ── Utilitários ────────────────────────────────────────── */
  areaById(id) {
    return _data.areas.find(a => a.id === id) ?? null;
  },

  clear() {
    _data.areas       = [];
    _data.lancamentos = [];
  },
};
