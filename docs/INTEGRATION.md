# AlinhaAgro — Guia de Integração Frontend ↔ Backend

## Configuração base no frontend

```javascript
// js/api.js
const API_BASE = 'https://api.alinhaagro.com.br'; // prod
// const API_BASE = 'http://localhost:8080';      // dev local

async function apiFetch(path, options = {}) {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (res.status === 401) {
        const refreshed = await tryRefresh();
        if (refreshed) return apiFetch(path, options); // retry
        window.location.href = '/login.html';
        return;
    }

    if (!res.ok) {
        const problem = await res.json();
        throw new ApiError(problem);
    }

    return res.status === 204 ? null : res.json();
}

class ApiError extends Error {
    constructor(problem) {
        super(problem.detail || 'Erro inesperado');
        this.status  = problem.status;
        this.errors  = problem.errors || [];
    }
}
```

---

## Fluxo de autenticação

### Login

```javascript
async function login(email, senha) {
    const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
    });
    localStorage.setItem('accessToken',  data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('plano',        data.plano);
}
```

### Refresh automático

```javascript
async function tryRefresh() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;
    try {
        const data = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        }).then(r => r.json());
        localStorage.setItem('accessToken', data.accessToken);
        return true;
    } catch {
        localStorage.clear();
        return false;
    }
}
```

### Logout

```javascript
function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('plano');
    window.location.href = '/login.html';
}
```

---

## Exemplos de uso por recurso

### Áreas

```javascript
// Listar
const areas = await apiFetch('/api/areas');

// Criar
const novaArea = await apiFetch('/api/areas', {
    method: 'POST',
    body: JSON.stringify({
        nome: 'Talhão 01',
        tamanhoHa: 5.5,
        cultura: 'Manga Tommy',
        dataPlantio: '2024-03-15',
        status: 'ativa',
    }),
});

// Atualizar
await apiFetch(`/api/areas/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...area, status: 'colhida' }),
});

// Deletar
await apiFetch(`/api/areas/${id}`, { method: 'DELETE' });
```

### Lançamentos

```javascript
// Com filtros e paginação
const resultado = await apiFetch(
    '/api/lancamentos?tipo=despesa&areaId=uuid&page=0&size=20'
);

// Criar despesa
await apiFetch('/api/lancamentos', {
    method: 'POST',
    body: JSON.stringify({
        areaId: 'uuid',
        tipo: 'despesa',
        categoria: 'Defensivos',
        descricao: 'Fungicida Captan',
        valor: 850.00,
        data: '2025-06-01',
    }),
});

// Resumo financeiro
const resumo = await apiFetch(
    '/api/lancamentos/resumo?dataInicio=2025-01-01&dataFim=2025-06-30'
);
// { totalReceitas, totalDespesas, saldo }
```

---

## Tratamento de erros na UI

```javascript
async function salvarArea(dados) {
    try {
        await apiFetch('/api/areas', { method: 'POST', body: JSON.stringify(dados) });
        mostrarSucesso('Área criada com sucesso!');
    } catch (err) {
        if (err instanceof ApiError) {
            if (err.status === 402) {
                mostrarModal('Limite atingido', 'Faça upgrade do seu plano para adicionar mais áreas.');
            } else if (err.status === 400) {
                mostrarErrosValidacao(err.errors); // ['nome: não deve estar em branco']
            } else {
                mostrarErro(err.message);
            }
        }
    }
}
```

---

## CORS — configuração atual

O backend aceita qualquer origem em desenvolvimento (`allowedOriginPatterns: "*"`).

**Para produção**, altere em `SecurityConfig.java`:

```java
config.setAllowedOrigins(List.of("https://alinhaagro.com.br", "https://www.alinhaagro.com.br"));
```

---

## Variáveis de ambiente por ambiente

| Variável | Local | Produção |
|---|---|---|
| `API_BASE` | `http://localhost:8080` | `https://api.alinhaagro.com.br` |
| `DATABASE_URL` | auto (docker compose) | `jdbc:postgresql://...` |
| `JWT_SECRET` | default no yml | Secret gerado (256+ bits) |
| `SENTRY_DSN` | vazio | DSN do projeto Sentry |

---

## Checklist de integração

- [ ] `localStorage` usa `accessToken` e `refreshToken`
- [ ] Toda chamada autenticada envia `Authorization: Bearer ...`
- [ ] Interceptor de 401 tenta refresh antes de redirecionar para login
- [ ] Erros `402` mostram modal de upgrade de plano
- [ ] Erros `400` mostram os campos inválidos ao usuário
- [ ] CORS configurado com a origem correta em produção
- [ ] Variável `API_BASE` alternada por ambiente (não hardcoded)