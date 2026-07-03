/**
 * Roteador SPA simples baseado em seções HTML.
 * Controla qual tela (#tela-*) e qual seção (#sec-*) está visível.
 */

const TELAS = ['boot', 'landing', 'auth', 'app', 'admin'];

/* Mapa: id de seção → função de render (preenchida pelos módulos) */
const renderMap = {};

export const router = {

  /* ── Troca a tela principal */
  go(tela) {
    TELAS.forEach(t => {
      const el = document.getElementById(`tela-${t}`);
      if (el) el.classList.toggle('ativa', t === tela);
    });
  },

  /* ── Navega para uma seção dentro do app */
  ir(secId) {
    document.querySelectorAll('.sec').forEach(el => el.classList.remove('ativa'));
    const sec = document.getElementById(`sec-${secId}`);
    if (sec) sec.classList.add('ativa');

    /* Atualiza nav */
    document.querySelectorAll('.app-nav-row1 a, .app-nav-row2 a').forEach(a => a.classList.remove('ativo'));
    const navLink = document.getElementById(`nt-${secId}`);
    if (navLink) navLink.classList.add('ativo');

    /* Dispara render da seção */
    renderMap[secId]?.();
  },

  /* ── Registra função de render para uma seção */
  register(secId, fn) {
    renderMap[secId] = fn;
  },
};
