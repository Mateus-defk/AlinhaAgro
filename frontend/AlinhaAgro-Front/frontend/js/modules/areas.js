/**
 * Módulo: Áreas de Produção
 * CRUD via API REST — dados do Store, sem localStorage.
 */

import { State }  from '../core/state.js';
import { Store }  from '../core/store.js';
import { router } from '../core/router.js';
import { ApiError } from '../core/api.js';
import { toastOk, toastErr } from '../utils/toast.js';
import { moeda } from '../utils/formatters.js';
import { CONFIG } from '../core/config.js';

router.register('areas', renderAreas);

export function renderAreas() {
  const user  = State.user;
  const areas = Store.areas;
  const plano = CONFIG.PLANOS[user?.plano];

  const alertEl = document.getElementById('area-limit-alert');
  if (alertEl) {
    alertEl.innerHTML = plano && areas.length >= plano.maxAreas
      ? `<div class="alert-limite">⚠️ Limite de ${plano.maxAreas} áreas atingido no plano ${user.plano}. Faça upgrade para adicionar mais.</div>`
      : '';
  }

  const lista = document.getElementById('lista-areas');
  if (!lista) return;

  if (!areas.length) {
    lista.innerHTML = '<div class="empty"><span class="ei">🌳</span><p>Nenhuma área cadastrada.<br>Clique em <strong>Nova Área</strong> para começar.</p></div>';
    return;
  }

  lista.innerHTML = areas.map(a => {
    const lancs   = Store.lancamentos.filter(l => l.areaId === a.id);
    const receita = lancs.filter(l => l.tipo === 'receita').reduce((s, l) => s + Number(l.valor), 0);
    const despesa = lancs.filter(l => l.tipo !== 'receita').reduce((s, l) => s + Number(l.valor), 0);
    const saldo   = receita - despesa;

    return `<div class="area-card">
      <div class="ac-head">
        <div>
          <h3>${a.nome}</h3>
          <div class="var">${a.variedade ?? '—'} · ${a.ha ?? 0} ha</div>
        </div>
        <span class="ac-status s-prod">${a.status ?? 'ativa'}</span>
      </div>
      <div class="ac-body">
        <div class="ac-info">
          <div class="ac-info-i"><label>Área</label><span>${a.ha ?? '—'} ha</span></div>
          <div class="ac-info-i"><label>Variedade</label><span>${a.variedade ?? '—'}</span></div>
          <div class="ac-info-i"><label>Plantio</label><span>${a.plantio ?? '—'}</span></div>
          <div class="ac-info-i"><label>Lançamentos</label><span>${lancs.length}</span></div>
        </div>
        <div class="ac-fin">
          <div class="ac-fin-i"><label>Receita</label><span class="vp">${moeda(receita)}</span></div>
          <div class="ac-fin-i"><label>Despesa</label><span class="vn">${moeda(despesa)}</span></div>
          <div class="ac-fin-i"><label>Saldo</label><span class="${saldo >= 0 ? 'vp' : 'vn'}">${moeda(saldo)}</span></div>
        </div>
      </div>
      <div class="ac-foot">
        <span class="colh-badge">🌾 Colheita: ${_mesNome(a.colheitaIni)} → ${_mesNome(a.colheitaFim)}</span>
        <button class="btn-d" onclick="window._deletarArea('${a.id}')">Excluir</button>
      </div>
    </div>`;
  }).join('');
}

export async function salvarArea(dados) {
  const user  = State.user;
  const plano = CONFIG.PLANOS[user?.plano];

  if (plano && Store.areas.length >= plano.maxAreas) {
    toastErr(`Limite de ${plano.maxAreas} áreas atingido.`);
    return false;
  }

  try {
    await Store.criarArea({
      nome:        dados.nome,
      ha:          Number(dados.ha),
      variedade:   dados.variedade,
      plantio:     dados.plantio || null,
      status:      dados.status || 'ativa',
      obs:         dados.obs || null,
      colheitaIni: dados.colheitaIni ? Number(dados.colheitaIni) : null,
      colheitaFim: dados.colheitaFim ? Number(dados.colheitaFim) : null,
    });
    toastOk(`Área "${dados.nome}" cadastrada!`);
    renderAreas();
    return true;
  } catch (err) {
    toastErr(err instanceof ApiError ? err.message : 'Erro ao salvar área.');
    return false;
  }
}

export async function deletarArea(id) {
  try {
    await Store.deletarArea(id);
    renderAreas();
    toastOk('Área removida.');
  } catch (err) {
    toastErr(err instanceof ApiError ? err.message : 'Erro ao remover área.');
  }
}

function _mesNome(m) {
  const nomes = ['—','Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return nomes[m] ?? '—';
}

window._deletarArea = deletarArea;
