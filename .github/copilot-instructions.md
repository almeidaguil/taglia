# Instrucoes para Agentes de IA

Ao iniciar uma sessao neste projeto, siga este checklist.

## 1. Entenda o projeto

Leia estes arquivos na ordem:

1. `.memory/MEMORY.md` — indice da memoria do projeto
2. `.memory/project_status.md` — estado atual e historico
3. `CLAUDE.md` — arquitetura, stack, como adicionar modelos
4. `STYLE_GUIDE.md` — padroes de codigo (80 col, Clean Code)
5. `CONTRIBUTING.md` — workflow de Git, branches, commits, PRs

## 2. Verifique o ambiente

Se o usuario pedir para configurar o ambiente ou se
detectar que dependencias estao faltando:

```bash
npm install
npm run check
```

No Windows, o script `setup.ps1` instala tudo:

```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
```

## 3. Siga as convencoes

- **Nunca** commitar direto na `main`
- Criar branch com prefixo: `feat/`, `fix/`, `docs/`,
  `refactor/`, `chore/`
- Commits em ingles, verbo imperativo: `Add`, `Fix`,
  `Update`, `Remove`, `Refactor`
- Abrir PR via `gh pr create`
- Rodar `npm run check` antes de pushar
- Formatar com `npm run format` se necessario
- Sem Co-Authored-By de IA nos commits
- Sem rodapes de IA nos PRs

## 4. Atualize a memoria

**Antes de cada commit**, verificar se algum arquivo em
`.memory/` precisa ser atualizado. Incluir no mesmo commit.

**Ao final de cada sessao**, atualizar:
- `.memory/project_status.md` — o que foi feito e proximos passos
- `PROJECT_STATUS.md` — espelho publico do status

Novas decisoes ou feedbacks do usuario devem virar
arquivos em `.memory/` com frontmatter adequado.
