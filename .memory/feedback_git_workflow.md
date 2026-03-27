---
name: Git workflow — branches e PRs
description: Nunca commitar direto na main. Sempre criar branch + PR.
type: feedback
---

Nunca commitar direto na main. Sempre criar branch de feature/fix e abrir PR.

**Why:** Gui corrigiu esse padrão durante a sessão inicial. Os primeiros commits foram direto na main e ele pediu para parar.

**How to apply:** Para qualquer mudança, criar branch (`fix/...`, `feat/...`), commitar lá, pushar, abrir PR via `gh pr create`, e só fazer merge após validação.
