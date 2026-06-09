/**
 * AlinhaAgro — Entry Point
 * Inicializa a aplicação, restaura sessão e registra handlers globais.
 */

import { restaurarSessao, fazerLogin, fazerCadastro, sair } from './core/auth.js';
import { State }  from './core/state.js';
import { router } from './core/router.js';

/* ── Importa módulos (cada um registra sua rota via router.register) */
import './modules/dashboard.js';
import './modules/areas.js';
import './modules/lancamentos.js';
import './modules/colheita.js';
import './modules/relatorio.js';
import './modules/estoque.js';
import './modules/variedades.js';
import './modules/campo.js';
import './modules/mercado.js';
import './modules/admin.js';

/* ── Inicialização */
document.addEventListener('DOMContentLoaded', async () => {
  _criarParticulas();

  const sessaoAtiva = await restaurarSessao();
  if (sessaoAtiva) {
    _atualizarHeaderUsuario();
    router.go('app');
    router.ir('dash');
  } else {
    router.go('landing');
  }

  _bindAuthHandlers();
  _bindNavHandlers();

  window.addEventListener('ag:sessionExpired', () => {
    router.go('landing');
  });
});

/* ── Auth */
function _bindAuthHandlers() {
  /* Login */
  document.getElementById('btn-login')?.addEventListener('click', async () => {
    const email = document.getElementById('login-email')?.value?.trim() ?? '';
    const senha = document.getElementById('login-senha')?.value ?? '';
    const result = await fazerLogin(email, senha);
    if (!result.ok) {
      _mostrarMsgAuth('login-msg', result.msg, 'erro');
    } else {
      _atualizarHeaderUsuario();
      router.ir('dash');
    }
  });

  /* Cadastro */
  document.getElementById('btn-cad')?.addEventListener('click', async () => {
    const nome  = document.getElementById('cad-nome')?.value?.trim()  ?? '';
    const email = document.getElementById('cad-email')?.value?.trim() ?? '';
    const senha = document.getElementById('cad-senha')?.value         ?? '';
    const plano = document.getElementById('cad-plano')?.value         ?? 'mensal';
    const result = await fazerCadastro({ nome, email, senha, plano });
    if (!result.ok) {
      _mostrarMsgAuth('cad-msg', result.msg, 'erro');
    } else {
      _atualizarHeaderUsuario();
      router.ir('dash');
    }
  });

  /* Sair */
  document.querySelector('.btn-sair')?.addEventListener('click', sair);
}

/* ── Navegação */
function _bindNavHandlers() {
  document.querySelectorAll('[data-ir]').forEach(el => {
    el.addEventListener('click', () => router.ir(el.dataset.ir));
  });
}

/* ── Helpers globais (compatibilidade com onclick inline no HTML) */
window.ir           = (id) => router.ir(id);
window.sair         = sair;

window.mostrarAuth  = (modo, plano) => {
  router.go('auth');
  const loginBox = document.getElementById('box-login');
  const cadBox   = document.getElementById('box-cadastro');
  if (modo === 'login')    { loginBox?.classList.remove('hidden'); cadBox?.classList.add('hidden'); }
  if (modo === 'cadastro') {
    cadBox?.classList.remove('hidden'); loginBox?.classList.add('hidden');
    if (plano) { const sel = document.getElementById('cad-plano'); if (sel) sel.value = plano; }
  }
};

window.voltarLanding = () => router.go('landing');
window.trocarAuth    = (modo) => window.mostrarAuth(modo);

window.toggleSenha = (id, btn) => {
  const input = document.getElementById(id);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  btn.textContent = input.type === 'password' ? '👁' : '🙈';
};

/* ── Atualiza header com dados do usuário logado */
function _atualizarHeaderUsuario() {
  const user = State.user;
  if (!user) return;
  const nameEl = document.getElementById('app-user-name');
  const planEl = document.getElementById('app-user-plan');
  const tagEl  = document.getElementById('app-plano-tag');
  if (nameEl) nameEl.textContent = user.nome;
  if (planEl) planEl.textContent = user.plano;
  if (tagEl)  tagEl.textContent  = user.plano.toUpperCase();
}

function _mostrarMsgAuth(id, msg, tipo) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `auth-msg ${tipo}`;
  el.textContent = msg;
}

/* ── Partículas decorativas no fundo do app */
function _criarParticulas() {
  const container = document.getElementById('tela-app');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = [
      `left: ${Math.random() * 100}%`,
      `top: ${Math.random() * 100}%`,
      `width: ${size}px`,
      `height: ${size}px`,
      `animation-duration: ${Math.random() * 10 + 8}s`,
      `animation-delay: ${Math.random() * 8}s`,
      `opacity: ${Math.random() * 0.4 + 0.1}`,
    ].join(';');
    container.appendChild(p);
  }
}
