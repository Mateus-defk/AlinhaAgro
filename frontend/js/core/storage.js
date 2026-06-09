/**
 * Camada de acesso ao localStorage.
 * Centraliza serialização/deserialização e
 * isola os módulos do storage bruto.
 */

import { CONFIG } from './config.js';
import { State } from './state.js';

/* ── Helpers internos */
const parse  = (raw) => { try { return JSON.parse(raw); } catch { return null; } };
const serial = (val) => JSON.stringify(val);

/* ── API pública */
export const Storage = {

  /* Usuários globais */
  getUsers()        { return parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS)) ?? []; },
  setUsers(users)   { localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, serial(users)); },
  saveUser(user)    {
    const users = this.getUsers();
    const idx   = users.findIndex(u => u.id === user.id);
    if (idx >= 0) users[idx] = user; else users.push(user);
    this.setUsers(users);
  },

  /* Sessão */
  getSession()      { return parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SESSION)); },
  setSession(data)  { localStorage.setItem(CONFIG.STORAGE_KEYS.SESSION, serial(data)); },
  clearSession()    { localStorage.removeItem(CONFIG.STORAGE_KEYS.SESSION); },

  /* Preços médios HF Brasil (admin) */
  getPrecos()       { return parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PRECOS)) ?? []; },
  setPrecos(p)      { localStorage.setItem(CONFIG.STORAGE_KEYS.PRECOS, serial(p)); },

  /* Dados por usuário — prefixo automático via State.key() */
  get(suffix)       { return parse(localStorage.getItem(State.key(suffix))) ?? []; },
  set(suffix, val)  { localStorage.setItem(State.key(suffix), serial(val)); },
  remove(suffix)    { localStorage.removeItem(State.key(suffix)); },
};
