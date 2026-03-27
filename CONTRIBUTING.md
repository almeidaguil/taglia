# Contribuindo com o Taglia

Guia de workflow, padrões de commit e convenções para humanos e agentes de IA.

## Fluxo de trabalho (Git workflow)

**Regra principal: nunca commitar direto na `main`.**

```
main (protegida)
 └── feat/novo-modelo ──── PR ──── merge ──── deploy automático
 └── fix/bug-fontes ────── PR ──── merge ──── deploy automático
 └── docs/readme ────────── PR ──── merge ──── deploy automático
```

### Passo a passo

```bash
# 1. Partir sempre da main atualizada
git checkout main
git pull

# 2. Criar branch com prefixo semântico
git checkout -b feat/nome-descritivo

# 3. Trabalhar, commitar (ver padrões abaixo)
git add <arquivos>
git commit -m "Add modelo xyz"

# 4. Pushar e criar PR
git push -u origin feat/nome-descritivo
gh pr create --title "Add modelo xyz" --body "..."

# 5. Após validação, fazer merge
gh pr merge <número> --merge

# 6. Voltar para main
git checkout main
git pull
```

## Branches — prefixos

| Prefixo | Quando usar | Exemplo |
|---------|-------------|---------|
| `feat/` | Novo modelo ou funcionalidade | `feat/string-art-rectangle` |
| `fix/` | Correção de bug | `fix/word-offset-3color-layers` |
| `docs/` | Documentação | `docs/contributing-guide` |
| `refactor/` | Refatoração sem mudança de comportamento | `refactor/worker-cleanup` |
| `chore/` | Infraestrutura, CI, configs | `chore/update-deploy-workflow` |

## Commits — padrões

### Formato

```
<verbo no imperativo> <o que mudou>

<corpo opcional — explica o "porquê", não o "o quê">

Co-Authored-By: <agente> <email>
```

### Verbos

| Verbo | Quando usar |
|-------|-------------|
| `Add` | Algo totalmente novo (modelo, feature, arquivo) |
| `Fix` | Correção de bug |
| `Update` | Melhoria em algo existente |
| `Remove` | Remoção de código/arquivo |
| `Refactor` | Reestruturação sem mudar comportamento |

### Exemplos reais do projeto

```bash
# Novo modelo
git commit -m "Add modelo string-art-rectangle"

# Bug fix com contexto
git commit -m "$(cat <<'EOF'
Fix font URL path in worker for GitHub Pages subpath

The worker was fetching fonts from /fonts/ (root) instead of
/taglia/fonts/, causing font loading to fail on GitHub Pages.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"

# Infraestrutura
git commit -m "Add GitHub Pages deploy workflow"

# Documentação
git commit -m "Add PROJECT_STATUS.md for cross-session continuity"
```

### Co-Authored-By

Quando o commit for feito por um agente de IA, incluir a linha:
```
Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
```

## Pull Requests — formato

### Título
- Curto (< 70 caracteres)
- Mesmo padrão dos commits: `<Verbo> <o que mudou>`

### Body

```markdown
## Summary
- Bullet points do que foi feito

## Test plan
- [ ] Como validar que funciona

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Deploy

O deploy é **automático** via GitHub Actions ao fazer push/merge na `main`.

- Workflow: `.github/workflows/deploy.yml`
- URL: https://almeidaguil.github.io/taglia/
- Preview local: `npm run build && npx vite preview`
- Não é possível fazer deploy de preview a partir de branches (limitação do GitHub Pages free)

## Para agentes de IA

1. **Sempre criar branch + PR** — nunca commitar na main
2. **Atualizar `PROJECT_STATUS.md`** ao final de cada sessão produtiva
3. **Ler `CLAUDE.md`** para entender a arquitetura e como adicionar modelos
4. **Ler `PROJECT_STATUS.md`** para saber onde paramos e o que falta
5. **Testar o build** antes de pushar: `npm run build`
