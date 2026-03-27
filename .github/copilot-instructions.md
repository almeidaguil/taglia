# Instrucoes para Agentes de IA

Ao iniciar uma sessao neste projeto, siga este checklist.

## 1. Entenda o projeto

Leia estes arquivos na ordem:

1. `CLAUDE.md` — arquitetura, stack, como adicionar modelos
2. `STYLE_GUIDE.md` — padroes de codigo (80 col, Clean Code)
3. `CONTRIBUTING.md` — workflow de Git, branches, commits, PRs
4. `PROJECT_STATUS.md` — estado atual e historico de sessoes

## 2. Verifique o ambiente

Se o usuario pedir para configurar o ambiente ou se
detectar que dependencias estao faltando:

```bash
# Instalar dependencias do projeto
npm install

# Verificar se tudo funciona
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

## 4. Atualize o status

Ao final de cada sessao produtiva, atualize o arquivo
`PROJECT_STATUS.md` com:

- O que foi feito
- Decisoes tomadas
- Proximos passos
