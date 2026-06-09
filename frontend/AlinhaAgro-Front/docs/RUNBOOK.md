# AgroGestão — Runbook Operacional

Procedimentos para subir, operar e depurar o sistema localmente.

---

## Subir o ambiente local

### 1. Banco de dados (Docker)
```bash
docker start api-postgres-1
# ou, se o container não existir ainda:
# docker compose -f C:\Users\natanael.adm\ArgoGestao\api\docker-compose.yml up -d
```

Credenciais:
```
host: localhost:5432
db:   agrogestao
user: myuser
pass: secret
```

### 2. Backend (Spring Boot — IntelliJ)
- Abra `C:\Users\natanael.adm\ArgoGestao\api\` no IntelliJ
- Run `ApiApplication`
- Confirmar no log: `Flyway: Successfully applied N migrations` e `Started ApiApplication`
- Swagger UI: http://localhost:8080/swagger-ui/index.html

### 3. Frontend
```bash
npx serve C:\ArgoGestao\frontend -l 3000
```
Acesse: http://localhost:3000

---

## Conta administrador

```
E-mail: natan1918@gmail.com
Plano:  admin
```

Para promover outro usuário a admin via Docker:
```bash
docker exec api-postgres-1 psql -U myuser -d agrogestao \
  -c "UPDATE users SET plano = 'admin' WHERE email = 'EMAIL';"
```

---

## Flyway — migrações aplicadas

| Versão | Arquivo | Descrição |
|--------|---------|-----------|
| V1 | V1__create_users.sql | Tabela users |
| V2–V8 | ... | Tabelas restantes |
| V9 | V9__align_fields.sql | Renomeia colunas de areas; adiciona colheita_ini/fim e fornecedor |

Localização: `api/src/main/resources/db/migration/`

---

## Depuração comum

### LazyInitializationException em /api/lancamentos
**Causa:** Método de serviço sem `@Transactional` tenta acessar `lancamento.getArea().getNome()` após fechar a sessão.  
**Fix aplicado:** `@Transactional(readOnly = true)` em `LancamentoService.listar/buscar/resumo`.

### 403 em preflight CORS
**Causa:** `allowedOriginPatterns("*")` incompatível com `allowCredentials(true)`.  
**Fix aplicado:** Removido `allowCredentials`, adicionado OPTIONS `/**` em `permitAll()`.

### GET /api/lancamentos retorna 500
Verificar se V9 foi aplicada. Se o backend subiu sem reiniciar após criar V9, reiniciar IntelliJ.

### Frontend tela de login e app visíveis ao mesmo tempo
**Causa:** CSS specificity — `#tela-auth { display: flex }` sobrescrevia `.tela { display: none }`.  
**Fix aplicado:** Movido para `#tela-auth.ativa { display: flex }`.

---

## Pendências de desenvolvimento (2026-06-06)

- [ ] Testar fluxo completo após restart do IntelliJ (LazyInit fix + V9)
- [ ] Migrar `estoque.js` para `/api/estoque`
- [ ] Implementar formulários HTML para pragas e irrigação → migrar `campo.js`
- [ ] Modal de edição de área existente
- [ ] Migrar `variedades.js` (decidir: backend ou localStorage)
- [ ] Testar painel Admin com usuário real
- [ ] Deploy: configurar variáveis de ambiente para produção (Hostgator)
