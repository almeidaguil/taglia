# Taglia — Status do Projeto

> Este arquivo deve ser atualizado por qualquer agente de IA ou desenvolvedor ao final de cada sessão produtiva.
> Serve como ponto de continuidade entre sessões, chats e agentes diferentes.

## Última atualização: 2026-03-27

## Infraestrutura

| Item | Status | Detalhes |
|------|--------|----------|
| Repositório | OK | `almeidaguil/taglia` (público) |
| GitHub Pages | OK | https://almeidaguil.github.io/taglia/ |
| Deploy automático | OK | `.github/workflows/deploy.yml` — dispara no push para main |
| Vite base path | OK | `base: '/taglia/'` no vite.config.ts |
| Router basename | OK | `basename={import.meta.env.BASE_URL}` no BrowserRouter |
| Code style | OK | Prettier 80 col + ESLint Clean Code + EditorConfig |
| VS Code MCPs | OK | Context7, GitHub, Filesystem em `.vscode/mcp.json` |
| Copilot instructions | OK | `.github/copilot-instructions.md` + `.vscode/settings.json` |
| Setup Windows | OK | `setup.ps1` com menu interativo |

## Decisões e convenções

- **Git workflow**: sempre criar branch + PR. Nunca commitar direto na main.
- **Deploy preview**: GitHub Pages só deploya da main. Para testar localmente: `npm run build && npx vite preview`
- **Code style**: 80 colunas, single quotes, sem ponto-e-virgula. Ver `STYLE_GUIDE.md`
- **Clean Code**: max 50 linhas/função, max complexidade 10, max 4 params, max depth 3
- **Commits**: sem Co-Authored-By de IA. Ver `CONTRIBUTING.md`
- **Pre-commit**: rodar `npm run check` antes de pushar
- **Este arquivo**: deve ser atualizado a cada sessão produtiva

## Histórico de sessões

### Sessão 1 — 2026-03-27

**PRs merged:** #1 a #9

**O que foi feito:**

1. Setup do repositório remoto e GitHub Pages
2. PR #1 — Fix font loading no worker (subpath `/taglia/fonts/`)
3. PR #2 — `PROJECT_STATUS.md` para continuidade entre sessões
4. PR #3 — `CONTRIBUTING.md` com workflow, branches, commits, PRs
5. PR #4 — `setup.ps1` script Windows com menu interativo
6. PR #5 — Atualização da seção Dev no CLAUDE.md
7. PR #6 — Remoção de Co-Authored-By de IA das convenções
8. PR #7 — Code style (Prettier, ESLint Clean Code, EditorConfig, MCPs, Copilot instructions)
9. PR #8 — Aplicação do Prettier em 48 arquivos + fix ESLint errors
10. PR #9 — Refatoração completa: 24 warnings -> 0 warnings, 14 arquivos

**Resultado da refatoração (PR #9):**
- ParameterField: 6 subcomponentes tipados
- ModelViewer: helpers + custom hooks
- ModelPage: subcomponentes extraidos
- imageTrace: 4 funções grandes -> ~20 helpers focados
- 7 modelos: template builders com params tipados
- `npm run check`: 0 errors, 0 warnings

**Pendente de validação:**
- [ ] Testar em produção (Pages) se as 3 camadas do letreiro funcionam
- [ ] Testar outros modelos baseados em texto

## Próximos passos possíveis

- Validar fix de fontes em produção
- Adicionar thumbnails/imagens aos modelos no catálogo
- Implementar modelos do Grupo C (String Art):
  - `string-art-rectangle-name-radial`
  - `social-handle-string-art-floating`
  - `string-art-heart-name-vertical-floating`
