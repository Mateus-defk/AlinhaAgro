/**
 * Estado global da aplicação.
 * Centraliza o usuário corrente (CU) e expõe
 * getters/setters para que os módulos não
 * manipulem variáveis globais diretamente.
 */

let _currentUser = null;

export const State = {
  /** Usuário autenticado no momento */
  get user() { return _currentUser; },
  set user(u) { _currentUser = u; },

  /** Atalho para o ID do usuário corrente */
  get userId() { return _currentUser?.id ?? null; },

  /** Gera chave de localStorage isolada por usuário */
  key(suffix) {
    if (!_currentUser) throw new Error('Nenhum usuário autenticado');
    return `${suffix}_${_currentUser.id}`;
  },

  /** Limpa o estado (logout) */
  clear() { _currentUser = null; },
};
