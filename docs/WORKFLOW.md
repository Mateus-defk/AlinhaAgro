# AlinhaAgro — Workflow de Desenvolvimento

## Estrutura de branches

```
main                    ← produção (deploy automático no Railway + Vercel)
  └── feature/nome-da-feature
  └── fix/nome-do-bug
  └── docs/nome-da-doc
  └── chore/nome-da-tarefa
```

Time pequeno (3 devs), sem branch `dev` intermediária — esse é o modelo
**GitHub Flow**: toda branch nasce direto da `main` e volta pra `main` via
PR. Mais simples que Git Flow e adequado pro deploy contínuo já existente.

## Fluxo de trabalho

```
1. Criar branch a partir da main
   git checkout master && git pull
   git checkout -b feature/area-controller

2. Desenvolver com commits atômicos
   git add src/main/java/...
   git commit -m "feat(area): add AreaController with CRUD endpoints"

3. Rodar testes antes do push
   cd api && .\mvnw test

4. Abrir PR: feature → main
   - Título: "feat(area): CRUD de áreas com validação de plano"
   - Descrever o que mudou e como testar

5. Revisão por outro dev (ou pelo responsável pelo merge) antes de aprovar
6. Merge na main → deploy automático
```

## Fluxo de hotfix (bug crítico em produção)

```
1. Criar branch a partir de main
   git checkout master && git pull
   git checkout -b hotfix/corrigir-login-invalido

2. Corrigir o bug com o menor diff possível

3. Testar localmente
   cd api && .\mvnw test

4. PR: hotfix → main  (revisar antes de mergear)
5. Merge para main → deploy automático em produção
```

> Sem branch `dev`, hotfix e feature seguem o mesmo fluxo — a diferença
> entre eles é só a urgência e o tamanho do diff, não o caminho até a main.

---

## Convenção de commits (Conventional Commits)

```
feat(modulo): descrição      ← nova funcionalidade
fix(modulo): descrição       ← correção de bug
refactor(modulo): descrição  ← refatoração sem mudança de comportamento
test(modulo): descrição      ← adição ou correção de testes
chore(modulo): descrição     ← configuração, build, deps
docs(modulo): descrição      ← documentação
```

**Exemplos:**
```
feat(auth): add refresh token endpoint
fix(lancamento): correct valor check on update
test(area): add PlanLimitService unit tests
chore(deps): bump jjwt to 0.12.6
docs(api): add estoque endpoints to API.md
```

## Adicionando um novo recurso (padrão)

Siga sempre esta ordem para cada recurso novo (ex: `Area`):

```
1. Migration SQL (V{N}__create_{tabela}.sql)
2. Entidade JPA (@Entity) em domain/
3. Repository (JpaRepository) em repository/
4. DTOs em dto/{recurso}/ (Request + Response)
5. Service em service/
6. Controller em controller/
7. Testes unitários do Service
```

### Checklist por recurso

- [ ] Migration não quebra migrations anteriores
- [ ] Entidade tem `user_id` (isolamento de dados)
- [ ] Service busca sempre filtrando por `userId` do token
- [ ] Controller usa `@AuthenticationPrincipal UserDetails` (não aceita userId do body)
- [ ] DTOs usam `record` com `@Valid` e anotações de validação
- [ ] Service chama `PlanLimitService.check*` antes de criar
- [ ] `GlobalExceptionHandler` cobre todos os novos tipos de erro
- [ ] Testes unitários: happy path + cenários de erro
- [ ] Swagger documenta o endpoint (automático via SpringDoc)
- [ ] `CHANGELOG.md` atualizado
- [ ] `API.md` atualizado com request/response

## Regras de qualidade

| Regra | Por quê |
|---|---|
| Nunca editar migration já commitada | Flyway usa checksum — vai quebrar todos os ambientes |
| `ddl-auto: validate` em produção | O banco é a fonte da verdade; JPA não altera schema |
| `userId` sempre do token, nunca do body | Evita que usuário acesse dados de outro |
| BCrypt custo 12 | Balanceia segurança e performance |
| Testes antes de abrir PR | `.\mvnw test` deve passar sem erros |
| ProblemDetail para todos os erros | Formato padronizado facilita integração com frontend |
| `send-default-pii: false` no Sentry | Conformidade com LGPD |

## Comandos úteis

```powershell
# Rodar só os testes unitários (sem subir contexto Spring)
.\mvnw test -Dtest="JwtServiceTest,AuthServiceTest"

# Ver relatório de cobertura
.\mvnw verify
# Abrir: target/site/jacoco/index.html

# Compilar sem rodar testes
.\mvnw compile -DskipTests

# Limpar build
.\mvnw clean

# Gerar JAR para produção
.\mvnw package -DskipTests
```