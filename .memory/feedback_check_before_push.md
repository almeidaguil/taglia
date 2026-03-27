---
name: Rodar npm run check antes de pushar
description: Sempre rodar npm run check (TS + ESLint + Prettier) antes de criar PR
type: feedback
---

Sempre rodar `npm run check` antes de pushar. Garante que TS compila, ESLint passa e Prettier está aplicado.

**Why:** O projeto agora tem 0 errors e 0 warnings. Qualquer novo código deve manter esse padrão.

**How to apply:** Antes de `git push`, rodar `npm run check`. Se falhar, corrigir com `npm run format && npm run lint:fix` e depois commitar as correções.
