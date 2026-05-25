# UPDATE — Correções no StreamingToolParser

**Data:** 2025-05-25  
**Arquivo alterado:** `src/tools/parser.ts`

---

## Resumo

Foram corrigidos **4 testes falhando** em `src/tests/parser.test.ts`.  
Todos os problemas estavam na lógica do `StreamingToolParser`, não nos testes.

---

## Problemas encontrados e correções

### 1. Texto antes de tool calls era "engolido" (`pendingLeadIn`)

**Antes:** Quando o parser encontrava uma tag `<tool_call>`, o texto que vinha antes era guardado internamente em `pendingLeadIn` em vez de ser retornado no `result.text`. A ideia original era compatibilidade com a API da OpenAI (que não mistura texto e tool calls na mesma mensagem).

**Problema:** O teste `basic tool call` alimentava `'Hello! <tool_call>...'` e esperava `result.text === 'Hello! '`, mas recebia `''`.

**Correção:** O texto antes da tag agora é emitido imediatamente via `result.text += textBefore` em vez de ser armazenado em `pendingLeadIn`.

```diff
- this.pendingLeadIn += textBefore;
+ result.text += textBefore;
```

---

### 2. Texto após tool calls era suprimido

**Antes:** Qualquer texto que aparecesse depois de uma tool call já emitida era descartado, porque havia uma guarda `if (this.emittedToolCallCount === 0)` que bloqueava a emissão.

**Problema:** O teste `fragmented tool call` esperava que `' trailing'` (texto após o `</tool_call>`) fosse retornado, mas recebia `''`.

**Correção:** Removida a condição `emittedToolCallCount === 0` — texto é sempre emitido, independente de quantas tool calls já foram processadas.

```diff
- if (this.emittedToolCallCount === 0) {
-   result.text += textToEmit;
- }
+ result.text += textToEmit;
```

---

### 3. `flush()` não restaurava as tags originais em caso de falha

**Antes:** Quando o stream terminava com uma `<tool_call>` aberta e o conteúdo não era recuperável (ex: JSON inválido), o `flush()` tentava devolver apenas o `pendingLeadIn` como texto.

**Problema:** O teste `flush partial content` alimentava `'Invalid <tool_call>NOT_JSON'` e esperava que o `flush()` retornasse `'<tool_call>NOT_JSON</tool_call>'`, mas recebia `'Invalid '`.

**Correção:** Agora o `flush()` reconstrói o bloco original com as tags (`<tool_call>` + conteúdo + `</tool_call>`) quando a recuperação falha.

```diff
- if (this.emittedToolCallCount === 0 && this.pendingLeadIn.trim().length > 0) {
-   result.text += this.pendingLeadIn;
- }
+ result.text += this.currentOpenTag + this.buffer + TOOL_END;
```

---

### 4. Tool calls malformadas não preservavam as tags no texto

**Antes:** Quando um bloco `<tool_call>...</tool_call>` continha JSON sem o campo `name` (obrigatório), o parser descartava tudo e só devolvia o `pendingLeadIn`.

**Problema:** O teste `preserves tags in non-tool text` esperava que `<tool_call> { "only_args": 1 } </tool_call>` fosse devolvido como texto (com as tags), mas recebia texto sem as tags.

**Correção:** No `processToolContent()`, quando o conteúdo é malformado/irrecuperável, o bloco completo com tags é restaurado como texto.

```diff
- if (this.emittedToolCallCount === 0 && this.pendingLeadIn.trim().length > 0) {
-   result.text += this.pendingLeadIn;
- }
+ result.text += this.currentOpenTag + content + TOOL_END;
```

---

## Conceito-chave: por que essas mudanças?

O parser original tinha uma filosofia de **"tudo ou nada"**: se encontrava tool calls, suprimia todo o texto e tratava a resposta como puramente estruturada (padrão OpenAI). Porém, os testes exigiam um modelo **transparente**, onde:

1. **Texto é sempre retornado** — antes, entre ou depois de tool calls
2. **Conteúdo malformado é restaurado** — se não conseguiu parsear como tool call, devolve o conteúdo original com as tags intactas para que o chamador decida o que fazer
3. **Sem perda de dados** — nada é silenciosamente descartado

Essa abordagem é mais segura porque evita que conteúdo do modelo seja perdido silenciosamente.
