# Taglia — Plano de Acao

Plano para levar o projeto ao estado final.
Cada fase pode ser executada em uma ou mais sessoes.
Marcar como concluido conforme avancamos.

## Fase 1 — Fundacao (CONCLUIDA)

- [x] Setup do repositorio e GitHub Pages
- [x] Fix de font loading no worker (PR #1)
- [x] Documentacao: CLAUDE.md, CONTRIBUTING.md, STYLE_GUIDE.md
- [x] PROJECT_STATUS.md e sistema de memoria (.memory/)
- [x] Code style: Prettier 80 col, ESLint Clean Code, EditorConfig
- [x] Refatoracao completa: 0 errors, 0 warnings
- [x] VS Code: MCPs, Copilot instructions, extensions
- [x] setup.ps1 para Windows
- [x] PRs #1 a #11 merged

## Fase 2 — Validacao e Polish

- [ ] Testar em producao (Pages) todos os modelos:
  - [ ] Letreiro 3 Camadas (Base, Middle, Top)
  - [ ] Letreiro 2 Camadas
  - [ ] Chaveiros (todos os 8)
  - [ ] Social Handles (todos os 6)
  - [ ] Letras Separadas (2 e 3 cores)
  - [ ] Cozinha e Ferramentas (5 modelos)
  - [ ] Baseados em imagem (10 modelos)
- [ ] Corrigir bugs encontrados nos testes
- [ ] Adicionar thumbnails aos modelos no catalogo:
  - [ ] Criar `public/thumbnails/<slug>.webp` para cada modelo
  - [ ] Preencher `coverImage` em cada ModelDefinition
  - [ ] Atualizar ModelCard para exibir imagem
- [ ] Melhorar SEO e meta tags (og:image, description)

## Fase 3 — Modelos do Grupo C (String Art)

Alta complexidade. Cada modelo e um projeto em si.

- [ ] Pesquisar algoritmo de String Art para OpenSCAD
- [ ] `string-art-rectangle-name-radial`:
  - [ ] Criar .scad com logica de pinos + fios
  - [ ] Criar .ts com parametros
  - [ ] Registrar no index.ts
  - [ ] Testar
- [ ] `social-handle-string-art-floating`:
  - [ ] Criar .scad
  - [ ] Criar .ts
  - [ ] Registrar e testar
- [ ] `string-art-heart-name-vertical-floating`:
  - [ ] Criar .scad
  - [ ] Criar .ts
  - [ ] Registrar e testar

## Fase 4 — Experiencia do Usuario

- [ ] Loading state melhorado (progresso do OpenSCAD)
- [ ] Cache de modelos gerados (evitar re-render)
- [ ] Preview rapido antes do render completo
- [ ] Responsividade mobile
- [ ] Modo escuro/claro (se desejado)
- [ ] PWA (offline support)

## Fase 5 — Conteudo e Lancamento

- [ ] Descricoes detalhadas para cada modelo
- [ ] Instrucoes de impressao 3D por modelo
- [ ] Pagina "Sobre" ou "Como usar"
- [ ] Compartilhamento social (link direto para modelo)
- [ ] Analytics (se desejado)
- [ ] Dominio customizado (se desejado)

## Notas

- Cada fase pode ser feita em paralelo parcialmente
- Fase 2 e prioritaria: validar que tudo funciona
- Fase 3 e a mais complexa e pode ser feita por ultimo
- Fases 4 e 5 sao melhorias incrementais
- Atualizar `.memory/` e `PROJECT_STATUS.md` ao concluir itens
