/**
 * Store — cache em memória dos dados da API.
 * Centraliza áreas e lançamentos para que todos os módulos
 * leiam de um único lugar sem chamadas duplicadas.
 */

import { api } from './api.js';

const _data = {
  areas:       [],
  lancamentos: [],
  estoque:     [],
  irrigacao:   [],
  pragas:      [],
  maoDeObra:   [],
};

export const Store = {

  /* ── Getters ───────────────────────────────────────────── */
  get areas()       { return _data.areas; },
  get lancamentos() { return _data.lancamentos; },
  get estoque()     { return _data.estoque; },
  get irrigacao()   { return _data.irrigacao; },
  get pragas()      { return _data.pragas; },
  get maoDeObra()   { return _data.maoDeObra; },

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

  /* ── Estoque ────────────────────────────────────────────── */
  async carregarEstoque() {
    _data.estoque = (await api.get('/estoque')) ?? [];
  },
  async criarEstoque(payload) {
    const novo = await api.post('/estoque', payload);
    _data.estoque.unshift(novo);
    return novo;
  },
  async baixarEstoque(id, quantidade) {
    const atualizado = await api.patch(`/estoque/${id}/baixar`, { quantidade });
    const idx = _data.estoque.findIndex(e => e.id === id);
    if (idx >= 0) _data.estoque[idx] = atualizado;
    return atualizado;
  },
  async deletarEstoque(id) {
    await api.delete(`/estoque/${id}`);
    _data.estoque = _data.estoque.filter(e => e.id !== id);
  },

  /* ── Irrigação ──────────────────────────────────────────── */
  async carregarIrrigacao() {
    _data.irrigacao = (await api.get('/irrigacao')) ?? [];
  },
  async criarIrrigacao(payload) {
    const novo = await api.post('/irrigacao', payload);
    _data.irrigacao.unshift(novo);
    return novo;
  },
  async deletarIrrigacao(id) {
    await api.delete(`/irrigacao/${id}`);
    _data.irrigacao = _data.irrigacao.filter(i => i.id !== id);
  },

  /* ── Pragas ─────────────────────────────────────────────── */
  async carregarPragas() {
    _data.pragas = (await api.get('/pragas')) ?? [];
  },
  async criarPraga(payload) {
    const nova = await api.post('/pragas', payload);
    _data.pragas.unshift(nova);
    return nova;
  },
  async deletarPraga(id) {
    await api.delete(`/pragas/${id}`);
    _data.pragas = _data.pragas.filter(p => p.id !== id);
  },
  async carregarAcoesPraga(pragaId) {
    return (await api.get(`/pragas/${pragaId}/acoes`)) ?? [];
  },
  async criarAcaoPraga(pragaId, payload) {
    return api.post(`/pragas/${pragaId}/acoes`, payload);
  },
  async deletarAcaoPraga(pragaId, acaoId) {
    await api.delete(`/pragas/${pragaId}/acoes/${acaoId}`);
  },

  /* ── Mão de Obra ────────────────────────────────────────── */
  async carregarMaoDeObra() {
    _data.maoDeObra = (await api.get('/mao-de-obra')) ?? [];
  },
  async criarMaoDeObra(payload) {
    const nova = await api.post('/mao-de-obra', payload);
    _data.maoDeObra.unshift(nova);
    return nova;
  },
  async deletarMaoDeObra(id) {
    await api.delete(`/mao-de-obra/${id}`);
    _data.maoDeObra = _data.maoDeObra.filter(m => m.id !== id);
  },

  /* ── Utilitários ────────────────────────────────────────── */
  areaById(id) {
    return _data.areas.find(a => a.id === id) ?? null;
  },

  areaNome(id) {
    return _data.areas.find(a => a.id === id)?.nome ?? '—';
  },

  clear() {
    _data.areas       = [];
    _data.lancamentos = [];
    _data.estoque     = [];
    _data.irrigacao   = [];
    _data.pragas      = [];
    _data.maoDeObra   = [];
  },
};
