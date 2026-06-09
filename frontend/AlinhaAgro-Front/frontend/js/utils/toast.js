/**
 * Sistema de notificações (toast).
 * Usa o elemento #toast já presente no HTML.
 */

let _timer = null;

/**
 * Exibe um toast.
 * @param {string} msg   - Mensagem a exibir
 * @param {'sucesso'|'erro'|''} tipo - Variante visual
 * @param {number} duracao - Milissegundos até fechar (default 3000)
 */
export function toast(msg, tipo = '', duracao = 3000) {
  const el = document.getElementById('toast');
  if (!el) return;

  el.textContent = msg;
  el.className   = `toast ${tipo}`.trim();

  /* Força reflow para reiniciar a animação */
  void el.offsetWidth;
  el.classList.add('show');

  clearTimeout(_timer);
  _timer = setTimeout(() => el.classList.remove('show'), duracao);
}

export const toastOk  = (msg) => toast(msg, 'sucesso');
export const toastErr = (msg) => toast(msg, 'erro');
