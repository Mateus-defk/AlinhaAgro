/**
 * Cliente HTTP central — todas as chamadas à API REST passam por aqui.
 * Injeta o Bearer token automaticamente e tenta refresh em caso de 401.
 */

import { CONFIG } from './config.js';

const BASE = CONFIG.API_URL; // http://localhost:8080/api

/* ── Chaves de armazenamento local dos tokens */
const KEY_ACCESS  = 'ag_access_token';
const KEY_REFRESH = 'ag_refresh_token';
const KEY_PLANO   = 'ag_plano';

/* ── Gerenciamento de tokens */
export const Token = {
  get access()  { return localStorage.getItem(KEY_ACCESS); },
  get refresh() { return localStorage.getItem(KEY_REFRESH); },
  get plano()   { return localStorage.getItem(KEY_PLANO) ?? 'mensal'; },

  save({ accessToken, refreshToken, plano }) {
    localStorage.setItem(KEY_ACCESS,  accessToken);
    localStorage.setItem(KEY_REFRESH, refreshToken);
    if (plano) localStorage.setItem(KEY_PLANO, plano);
  },

  clear() {
    localStorage.removeItem(KEY_ACCESS);
    localStorage.removeItem(KEY_REFRESH);
    localStorage.removeItem(KEY_PLANO);
  },

  hasAccess() { return !!this.access; },
};

/* ── Erro tipado da API */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

/* ── Refresh automático do access token */
async function tryRefresh() {
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refreshToken: Token.refresh }),
    });
    if (!res.ok) return false;
    Token.save(await res.json());
    return true;
  } catch {
    return false;
  }
}

/* ── Base de todas as chamadas */
async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (Token.access) headers['Authorization'] = `Bearer ${Token.access}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  // Token expirado — tenta refresh uma vez e repete a chamada
  if (res.status === 401 && Token.refresh && !options._retry) {
    const ok = await tryRefresh();
    if (ok) return request(path, { ...options, _retry: true });
    Token.clear();
    window.dispatchEvent(new CustomEvent('ag:sessionExpired'));
    return;
  }

  if (!res.ok) {
    let msg = 'Erro na requisição';
    try {
      const body = await res.json();
      msg = body.detail ?? body.message ?? body.erro ?? msg;
    } catch { /* body não é JSON */ }
    throw new ApiError(res.status, msg);
  }

  if (res.status === 204) return null;
  return res.json();
}

/* ── Métodos HTTP públicos */
export const api = {
  get:    (path)       => request(path, { method: 'GET' }),
  post:   (path, body) => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body) => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (path, body) => request(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (path)       => request(path, { method: 'DELETE' }),
};
