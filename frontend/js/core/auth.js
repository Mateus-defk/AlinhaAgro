/**
 * Autenticação — login, cadastro, logout.
 * Usa a API REST com JWT. Tokens armazenados via Token (api.js).
 */

import { api, Token, ApiError } from './api.js';
import { State }  from './state.js';
import { Store }  from './store.js';
import { router } from './router.js';

/* ── Login */
export async function fazerLogin(email, senha) {
  try {
    const auth = await api.post('/auth/login', { email, senha });
    Token.save(auth);

    const [user] = await Promise.all([api.get('/users/me'), Store.load()]);
    State.user = user;

    router.go('app');
    return { ok: true };
  } catch (err) {
    return { ok: false, msg: _msg(err) };
  }
}

/* ── Cadastro */
export async function fazerCadastro({ nome, email, senha, plano }) {
  if (!nome || !email || !senha || !plano) {
    return { ok: false, msg: 'Preencha todos os campos.' };
  }
  if (senha.length < 8) {
    return { ok: false, msg: 'Senha deve ter pelo menos 8 caracteres.' };
  }

  try {
    const auth = await api.post('/auth/register', { nome, email, senha, plano });
    Token.save(auth);

    const [user] = await Promise.all([api.get('/users/me'), Store.load()]);
    State.user = user;

    router.go('app');
    return { ok: true };
  } catch (err) {
    return { ok: false, msg: _msg(err) };
  }
}

/* ── Logout */
export function sair() {
  Token.clear();
  State.clear();
  Store.clear();
  router.go('landing');
}

/* ── Restaurar sessão ao carregar a página */
export async function restaurarSessao() {
  if (!Token.hasAccess()) return false;

  try {
    const [user] = await Promise.all([api.get('/users/me'), Store.load()]);
    State.user = user;
    return true;
  } catch {
    Token.clear();
    Store.clear();
    return false;
  }
}

/* ── Helpers internos */
function _msg(err) {
  if (err instanceof ApiError) {
    if (err.status === 401) return 'E-mail ou senha incorretos.';
    if (err.status === 409) return 'Este e-mail já está cadastrado.';
    if (err.status === 0 || !navigator.onLine) return 'Sem conexão com o servidor.';
    return err.message;
  }
  return 'Sem conexão com o servidor.';
}
