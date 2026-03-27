---
name: Manter .memory/ atualizada antes de cada commit
description: Toda alteracao no projeto deve incluir atualizacao dos arquivos em .memory/ no mesmo commit
type: feedback
---

Antes de cada commit, verificar se algum arquivo em `.memory/` precisa ser atualizado. Incluir as alteracoes de memoria no mesmo commit da feature/fix.

**Why:** A pasta `.memory/` no repositorio e o ponto de continuidade entre agentes de IA e sessoes. Se ficar desatualizada, o proximo agente tera contexto errado e tomara decisoes ruins.

**How to apply:**
1. Ao criar uma branch: verificar se `project_status.md` precisa refletir o trabalho em andamento
2. Ao commitar: se a mudanca afeta convencoes, decisoes ou estado do projeto, atualizar o arquivo de memoria correspondente no mesmo commit
3. Ao finalizar uma sessao: atualizar `project_status.md` com o que foi feito e proximos passos
4. Novas decisoes ou feedbacks do usuario: criar/atualizar o arquivo de feedback correspondente
5. Sempre manter `MEMORY.md` (indice) sincronizado se adicionar/remover arquivos
