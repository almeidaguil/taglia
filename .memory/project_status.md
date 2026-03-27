---
name: Status do projeto Taglia
description: Estado atual do projeto, o que foi feito, o que falta, e próximos passos
type: project
---

## Estado atual (2026-03-27, fim da sessão 1)

### Infraestrutura — tudo OK
- Repositório: `almeidaguil/taglia` (público)
- GitHub Pages: https://almeidaguil.github.io/taglia/
- Deploy automático: `.github/workflows/deploy.yml` (push para main)
- Vite: `base: '/taglia/'` + BrowserRouter com `basename`
- Code style: Prettier 80 col + ESLint Clean Code + EditorConfig
- VS Code: MCPs (Context7, GitHub, Filesystem), Copilot instructions, extensions recomendadas
- Setup Windows: `setup.ps1` com menu interativo (Git, Node, gh CLI, npm, extensões VS Code)
- Documentação: CLAUDE.md, CONTRIBUTING.md, STYLE_GUIDE.md, PROJECT_STATUS.md, copilot-instructions.md

### Code quality — 0 errors, 0 warnings
- 48 arquivos formatados (Prettier 80 col)
- 14 arquivos refatorados (Clean Code: funções < 50 linhas, complexidade < 10)
- `npm run check` passa limpo (TS + ESLint + Prettier)

### PRs merged nesta sessão: #1 a #10

### Pendente de validação
- Testar em produção se as 3 camadas do letreiro funcionam (fix de fontes PR #1)
- Testar outros modelos baseados em texto

### Não implementado (Grupo C)
- `string-art-rectangle-name-radial` — String Art Retângulo
- `social-handle-string-art-floating` — String Art Social
- `string-art-heart-name-vertical-floating` — String Art Coração

### Próximos passos possíveis
- Validar fix de fontes em produção
- Adicionar thumbnails/imagens aos modelos no catálogo
- Implementar modelos do Grupo C (String Art)

### Observações técnicas
- Deploy do Pages só funciona a partir da branch main
- Para testar localmente com subpath: `npm run build && npx vite preview`
- gh CLI autenticado como `guisalmeida_meli`, com acesso ao repo `almeidaguil`
