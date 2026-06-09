/**
 * Módulo: Painel Administrativo
 * Visível apenas para usuários com plano 'admin'.
 * Usa a API REST — GET /api/users, DELETE /api/users/:id
 */

import { State }  from '../core/state.js';
import { api, ApiError }   from '../core/api.js';
import { router } from '../core/router.js';
import { toastOk, toastErr } from '../utils/toast.js';
import { moeda }  from '../utils/formatters.js';

router.register('admin', renderAdmin);

export async function renderAdmin() {
  if (State.user?.plano !== 'admin') { router.go('app'); return; }

  try {
    const users = await api.get('/users');
    _renderStats(users);
    _renderUserList(users);
  } catch (err) {
    toastErr(err instanceof ApiError ? err.message : 'Erro ao carregar usuários.');
  }
}

function _renderStats(users) {
  const el = document.getElementById('admin-stats');
  if (!el) return;

  const porPlano = { mensal: 0, trimestral: 0, anual: 0 };
  users.forEach(u => { if (porPlano[u.plano] !== undefined) porPlano[u.plano]++; });

  el.innerHTML = `<div class="admin-grid">
    <div class="admin-stat"><h4>Total Usuários</h4><p>${users.length}</p></div>
    <div class="admin-stat"><h4>Plano Mensal</h4><p>${porPlano.mensal}</p></div>
    <div class="admin-stat"><h4>Plano Trimestral</h4><p>${porPlano.trimestral}</p></div>
    <div class="admin-stat"><h4>Plano Anual</h4><p>${porPlano.anual}</p></div>
  </div>`;
}

function _renderUserList(users) {
  const el = document.getElementById('admin-users');
  if (!el) return;

  el.innerHTML = !users.length
    ? '<p style="color:var(--texto3)">Nenhum usuário cadastrado ainda.</p>'
    : users.map(u => `
        <div class="user-list-item">
          <div>
            <div class="un">${u.nome}</div>
            <div class="ue">${u.email}</div>
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <span class="plano-pill pp-${u.plano?.[0]}">${u.plano}</span>
            <button class="btn-d" onclick="window._deletarUser('${u.id}')">Remover</button>
          </div>
        </div>`).join('');
}

window._deletarUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
    toastOk('Usuário removido.');
    renderAdmin();
  } catch (err) {
    toastErr(err instanceof ApiError ? err.message : 'Erro ao remover usuário.');
  }
};
