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

## Decisões e convenções

- **Git workflow**: sempre criar branch + PR. Nunca commitar direto na main.
- **Deploy preview**: GitHub Pages só deploya da main. Para testar localmente com subpath: `npm run build && npx vite preview`
- **Autenticação GitHub**: gh CLI autenticado como `guisalmeida_meli`, com acesso ao repo `almeidaguil/taglia`
- **Este arquivo**: deve ser atualizado a cada sessão produtiva com o que foi feito e próximos passos

## Histórico de sessões

### Sessão 1 — 2026-03-27

**O que foi feito:**
1. Configuração do repositório remoto (`almeidaguil/taglia`) e primeiro push
2. Configuração do GitHub Pages com GitHub Actions (workflow de deploy)
3. Fix do `BrowserRouter` — adicionado `basename` para funcionar no subpath `/taglia/`
4. Fix do `vite.config.ts` — alterado `base` de `'./'` para `'/taglia/'` (paths absolutos)
5. **PR #1 (merged)** — Fix font loading no worker: URL das fontes usava `/fonts/` (raiz) em vez de `/taglia/fonts/`, causando falha nas camadas Middle e Top de modelos multi-camada
6. Criação deste arquivo de status e do sistema de memória persistente

**Problema resolvido:**
- Modelos multi-camada (ex: "Letreiro de Palavra - 3 Camadas") falhavam nas camadas Middle e Top
- Causa raiz: fontes não carregavam no GitHub Pages porque o worker buscava em `/fonts/` em vez de `/taglia/fonts/`
- Base funcionava porque tem geometria sólida (placa retangular) independente de texto
- Fix: usar `import.meta.env.BASE_URL` no worker para montar URL das fontes

**Pendente de validação:**
- [ ] Testar em produção (Pages) se as 3 camadas do letreiro agora funcionam
- [ ] Testar outros modelos baseados em texto (chaveiros, social handles)

## Próximos passos possíveis

- Validar fix de fontes em produção
- Implementar modelos do Grupo C (String Art) — alta complexidade, não implementados:
  - `string-art-rectangle-name-radial`
  - `social-handle-string-art-floating`
  - `string-art-heart-name-vertical-floating`
- Melhorias gerais conforme necessidade do Gui
