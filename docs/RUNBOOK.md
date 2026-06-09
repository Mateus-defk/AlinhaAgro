# AlinhaAgro — Runbook Operacional

## Desenvolvimento local

### Pré-requisitos
- Java 21 (`java -version`)
- Maven 3.9+ (ou usar o `mvnw` incluído)
- Docker Desktop

### Subir o ambiente

> **ATENÇÃO**: O `compose.yaml` fica dentro de `api/`, não na raiz do projeto.
> Execute os comandos de dentro do diretório `api/`.

```powershell
# Entrar no diretório correto
cd C:\Users\natanael.adm\ArgoGestao\api

# Subir PostgreSQL em background
docker compose up -d

# Verificar se o container está saudável
docker compose ps

# Rodar a API (Maven)
.\mvnw spring-boot:run

# OU rodar pelo IntelliJ — botão Run em ApiApplication.java
```

A API sobe em `http://localhost:8080`.  
O Swagger fica em `http://localhost:8080/swagger-ui.html`.  
O Flyway roda as migrations automaticamente na primeira inicialização.

### Parar o ambiente

```powershell
# Parar container (dados preservados no volume pgdata)
docker compose stop

# Parar e remover container (dados preservados no volume)
docker compose down

# Parar E apagar os dados (reset completo do banco)
docker compose down -v
```

---

## Erro comum: "no configuration file provided: not found"

**Causa**: `docker compose` rodado na pasta errada (`ArgoGestao/` em vez de `ArgoGestao/api/`).

**Solução**:
```powershell
# Opção 1 — entrar na pasta correta
cd ArgoGestao\api
docker compose up -d

# Opção 2 — especificar o arquivo diretamente
docker compose -f ArgoGestao\api\compose.yaml up -d
```

---

## Rodar os testes

```powershell
cd C:\Users\natanael.adm\ArgoGestao\api

# Todos os testes (unitários + integração com H2)
.\mvnw test

# Teste específico
.\mvnw test -Dtest=AuthServiceTest

# Com relatório
.\mvnw verify
# Relatório em: target/surefire-reports/
```

---

## Banco de dados

### Acessar o PostgreSQL local

```powershell
# Via Docker
docker compose exec postgres psql -U myuser -d alinhaagro

# Listar tabelas
\dt

# Ver migrations aplicadas
SELECT version, description, installed_on FROM flyway_schema_history ORDER BY installed_rank;

# Sair
\q
```

### Adicionar uma nova migration

1. Criar `src/main/resources/db/migration/V9__descricao_da_mudanca.sql`
2. **Nunca editar** migrations já commitadas (Flyway vai falhar com checksum mismatch)
3. Reiniciar a aplicação — Flyway aplica automaticamente

### Reset completo do banco (dev only)

```powershell
docker compose down -v        # apaga volume pgdata
docker compose up -d          # recria container limpo
# próximo start da API recria todas as tabelas via Flyway
```

---

## Variáveis de ambiente necessárias

| Variável | Obrigatória em prod | Descrição |
|---|---|---|
| `DATABASE_URL` | Sim | `jdbc:postgresql://host:5432/alinhaagro` |
| `DATABASE_USER` | Sim | Usuário do banco |
| `DATABASE_PASS` | Sim | Senha do banco |
| `JWT_SECRET` | Sim | Mínimo 256 bits (32+ caracteres aleatórios) |
| `SENTRY_DSN` | Não | DSN do projeto Sentry (vazio = desativado) |
| `PORT` | Não | Porta HTTP (padrão: 8080) |
| `SPRING_PROFILES_ACTIVE` | Não | `prod` em produção |

### Gerar JWT_SECRET seguro

```powershell
# PowerShell — gera 64 caracteres aleatórios
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object { [char]$_ })
```

---

## Deploy — Railway

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Inicializar projeto (primeira vez)
railway init

# 4. Configurar variáveis
railway variables set DATABASE_URL=jdbc:postgresql://...
railway variables set JWT_SECRET=seu_secret_aqui
railway variables set SENTRY_DSN=https://...

# 5. Deploy
railway up
```

---

## Monitoramento

### Health check
```
GET http://localhost:8080/actuator/health
# Resposta esperada: {"status":"UP"}
```

### Logs em produção (Railway)
```bash
railway logs --tail
```

### Sentry
- Dashboard: `https://sentry.io`
- Erros capturados automaticamente: exceções não tratadas, erros 5xx
- Alertas configurados no painel Sentry

---

## Troubleshooting

| Sintoma | Causa provável | Solução |
|---|---|---|
| `Connection refused :5432` | Container não está rodando | `docker compose up -d` dentro de `api/` |
| `Flyway checksum mismatch` | Migration editada após ser aplicada | Nunca edite migrations aplicadas; crie uma nova V{N+1} |
| `401 Unauthorized` em toda rota | JWT_SECRET diferente entre restarts | Usar variável de ambiente fixa, não valor default |
| `402 Payment Required` | Limite do plano atingido | Upgrade do plano ou admin pode aumentar limite |
| `Sentry não reporta erros` | DSN vazio ou errado | Verificar variável `SENTRY_DSN` |
| Swagger não abre em prod | SpringDoc não deve ficar exposto | Adicionar `@Profile("!prod")` no `OpenApiConfig` |