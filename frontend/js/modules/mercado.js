/**
 * Módulo: Mercado HF Brasil (Premium)
 * Exibe preços médios de manga — busca da API backend.
 */

import { State }  from '../core/state.js';
import { api }    from '../core/api.js';
import { router } from '../core/router.js';
import { toastErr } from '../utils/toast.js';
import { moeda } from '../utils/formatters.js';
import { CONFIG } from '../core/config.js';

router.register('mercado', renderMercado);

export function tentarMercado() {
  const plano = CONFIG.PLANOS[State.user?.plano];
  if (!plano?.premium) {
    toastErr('Preços HF Brasil disponíveis no plano Anual Premium.');
    return;
  }
  router.ir('mercado');
}

export async function renderMercado() {
  const plano = CONFIG.PLANOS[State.user?.plano];

  const el = document.getElementById('sec-mercado');
  if (!el) return;

  if (!plano?.premium) {
    el.innerHTML = `<div class="premium-box">
      <div class="pb-header">
        <div class="premium-badge-icon">⭐</div>
        <h3>Mercado HF Brasil — Premium</h3>
      </div>
      <p style="color:rgba(255,255,255,.6);font-size:.88rem;margin-bottom:18px">
        Acesse preços médios de manga por região, compare com seu preço de venda e tome decisões com dados reais do mercado.
      </p>
      <button class="btn-upgrade" onclick="alert('Upgrade em breve!')">Fazer Upgrade para Anual ⭐</button>
    </div>`;
    return;
  }

  el.innerHTML = '<div class="empty"><span class="ei">⏳</span><p>Carregando preços...</p></div>';

  try {
    const precos = await api.get('/precos-mercado');

    if (!precos?.length) {
      el.innerHTML = '<div class="empty"><span class="ei">📊</span><p>Nenhum preço cadastrado pelo administrador ainda.</p></div>';
      return;
    }

    el.innerHTML = `<div class="premium-box">
      <div class="pb-header">
        <div class="premium-badge-icon">⭐</div>
        <h3>Preços Médios HF Brasil — Manga</h3>
      </div>
      <div class="preco-grid">
        ${precos.map(p => `
          <div class="preco-card">
            <div class="pc-label">${p.regiao ?? 'Região'}</div>
            <div class="pc-val">${moeda(p.preco)}<small>/kg</small></div>
            <div class="pc-sub">${p.variedade ?? 'Manga'} · ${p.semana ?? '—'}</div>
          </div>`).join('')}
      </div>
    </div>`;
  } catch {
    el.innerHTML = '<div class="empty"><span class="ei">⚠️</span><p>Erro ao carregar preços de mercado.</p></div>';
  }
}
