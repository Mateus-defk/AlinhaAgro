/**
 * Configurações globais da aplicação.
 * Valores de produção são injetados via variáveis de ambiente
 * durante o build (Vite) ou pelo servidor (Spring Boot).
 */

export const CONFIG = {
  APP_NAME: 'AlinhaAgro',
  APP_VERSION: '2.1.0',

  /* URL base da API REST — definida pelo servidor em produção */
  API_URL: window.__ENV__?.API_URL ?? 'http://localhost:8080/api',

  /* Ambiente atual */
  ENV: window.__ENV__?.APP_ENV ?? 'development',

  /* Chaves de localStorage */
  STORAGE_KEYS: {
    USERS:    'ag_users',
    SESSION:  'ag_session',
    PRECOS:   'ag_precos_medios',
  },

  /* Planos e limites */
  PLANOS: {
    mensal:     { maxAreas: 3,    maxLancs: 50,   maxEstoque: 0,    maxCadastros: 0,    premium: false },
    trimestral: { maxAreas: 8,    maxLancs: 200,  maxEstoque: 30,   maxCadastros: 15,   premium: false },
    anual:      { maxAreas: 9999, maxLancs: 9999, maxEstoque: 9999, maxCadastros: 9999, premium: true  },
    admin:      { maxAreas: 9999, maxLancs: 9999, maxEstoque: 9999, maxCadastros: 9999, premium: true  },
  },

  /* Preços de planos */
  PRECOS_PLANOS: {
    mensal:     { label: 'Mensal',     valor: 159.90, periodo: 'mês'  },
    trimestral: { label: 'Trimestral', valor: 369.90, periodo: 'trim.' },
    anual:      { label: 'Anual',      valor: 1500.00, periodo: 'ano' },
  },
};

export const IS_DEV = CONFIG.ENV === 'development';
