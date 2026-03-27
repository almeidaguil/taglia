# Taglia — Guia de Estilo

Padroes de codigo baseados nos principios de
**Clean Code** (Robert C. Martin) e
**Clean Architecture** (Robert C. Martin).

## Regras gerais

| Regra                  | Valor  | Referencia              |
|------------------------|--------|-------------------------|
| Largura maxima         | 80 col | Clean Code, Cap. 5      |
| Indentacao             | 2 esp  | Padrao React/TS         |
| Ponto-e-virgula        | nao    | Prettier (consistencia) |
| Aspas                  | single | Prettier (consistencia) |
| Trailing comma         | sim    | Seguranca em diffs      |
| Final newline          | sim    | POSIX                   |

## Principios do Clean Code aplicados

### 1. Funcoes pequenas (Cap. 3)

> "A primeira regra das funcoes e que devem ser pequenas.
> A segunda regra e que devem ser ainda menores."

- **Max 50 linhas** por funcao (warn)
- **Max 4 parametros** (warn)
- **Max 3 niveis** de aninhamento (warn)
- **Complexidade ciclomatica max 10** (warn)

Funcao grande? Extraia subfuncoes com nomes descritivos.

### 2. Nomes significativos (Cap. 2)

> "O nome de uma variavel, funcao ou classe deve responder
> todas as grandes questoes."

```typescript
// ruim
const d = 4
const fn = (t: string) => t.split('')

// bom
const layerHeight = 4
const splitText = (text: string) => text.split('')
```

- Nomes devem revelar intencao
- Evite abreviacoes obscuras
- Use convencoes do dominio (ex: `offset`, `tolerance`)

### 3. Sem efeitos colaterais (Cap. 3)

> "Funcoes devem fazer uma coisa. Devem faze-la bem.
> Devem fazer somente ela."

- `no-param-reassign` — nao modificar argumentos
- `no-return-assign` — nao atribuir em return
- `prefer-const` — imutabilidade por padrao

### 4. Codigo morto e DRY (Cap. 17)

> "Codigo morto e codigo que nao e executado."

- `no-unused-expressions` — sem expressoes orfas
- `no-shadow` — sem variaveis que escondem outras
- `no-duplicate-imports` — imports organizados

### 5. Formatacao vertical (Cap. 5)

> "Conceitos proximamente relacionados devem ficar
> verticalmente proximos."

A regra de 80 colunas forca:
- Quebra de linhas longas em partes legiveis
- Nomes mais concisos
- Funcoes menores por natureza

## Principios do Clean Architecture aplicados

### Separacao de responsabilidades

```
src/
  types/       -> Entidades (regras de negocio)
  models/      -> Casos de uso (definicao parametrica)
  scad/        -> Adaptador (OpenSCAD templates)
  workers/     -> Infraestrutura (WASM runtime)
  hooks/       -> Interface adapter (React <-> Worker)
  components/  -> UI (apresentacao)
  pages/       -> Composicao de UI
```

### Regra da dependencia

> "Dependencias de codigo-fonte so podem apontar
> para dentro, em direcao a politicas de nivel superior."

- `types/` nao importa de ninguem
- `models/` importa apenas de `types/`
- `components/` importa de `types/` e `models/`
- `pages/` compoe tudo

## Ferramentas

| Ferramenta | Funcao                      | Comando              |
|------------|-----------------------------|----------------------|
| Prettier   | Formatacao automatica       | `npm run format`     |
| ESLint     | Regras de qualidade         | `npm run lint`       |
| TypeScript | Tipagem estatica            | `tsc -b`             |
| Tudo junto | Verifica antes de commitar  | `npm run check`      |

### Comandos

```bash
npm run format       # formata tudo automaticamente
npm run format:check # verifica sem alterar
npm run lint         # verifica regras ESLint
npm run lint:fix     # corrige o que for automatico
npm run check        # TS + ESLint + Prettier (pre-commit)
```

## Aplicando ao codigo existente

Para formatar todo o codigo de uma vez:

```bash
npm run format && npm run lint:fix
```

As regras de Clean Code estao como `warn` (aviso),
nao `error`, para permitir adocao gradual sem quebrar
o build.
