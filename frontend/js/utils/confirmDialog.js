/**
 * Modal de confirmação genérico — substitui o confirm() nativo do navegador.
 * confirmar(mensagem) retorna uma Promise<boolean> resolvida conforme o botão clicado.
 */

let _resolver = null;

export function confirmar(mensagem, { titulo = 'Confirmar exclusão', textoConfirmar = 'Excluir' } = {}) {
  document.getElementById('confirm-titulo').textContent = titulo;
  document.getElementById('confirm-msg').textContent = mensagem;
  document.getElementById('confirm-btn-ok').textContent = textoConfirmar;
  document.getElementById('modal-confirm')?.classList.add('open');
  document.getElementById('confirm-btn-cancelar')?.focus();

  return new Promise((resolve) => { _resolver = resolve; });
}

function _responder(resultado) {
  document.getElementById('modal-confirm')?.classList.remove('open');
  _resolver?.(resultado);
  _resolver = null;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('confirm-btn-cancelar')?.addEventListener('click', () => _responder(false));
  document.getElementById('confirm-btn-ok')?.addEventListener('click', () => _responder(true));
  document.getElementById('modal-confirm')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-confirm') _responder(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('modal-confirm')?.classList.contains('open')) {
      _responder(false);
    }
  });
});
