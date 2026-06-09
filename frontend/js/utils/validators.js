/**
 * Validadores de formulário.
 * Retornam { ok: boolean, msg: string }.
 */

export const Validators = {

  required(val, campo = 'Campo') {
    if (val === undefined || val === null || String(val).trim() === '') {
      return { ok: false, msg: `${campo} é obrigatório.` };
    }
    return { ok: true };
  },

  email(val) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(val)) return { ok: false, msg: 'E-mail inválido.' };
    return { ok: true };
  },

  minLen(val, min, campo = 'Campo') {
    if (String(val).trim().length < min) {
      return { ok: false, msg: `${campo} deve ter pelo menos ${min} caracteres.` };
    }
    return { ok: true };
  },

  positivo(val, campo = 'Valor') {
    const n = parseFloat(val);
    if (isNaN(n) || n <= 0) return { ok: false, msg: `${campo} deve ser maior que zero.` };
    return { ok: true };
  },

  /* Valida múltiplas regras em sequência — retorna o primeiro erro */
  all(...rules) {
    for (const r of rules) {
      if (!r.ok) return r;
    }
    return { ok: true };
  },
};
