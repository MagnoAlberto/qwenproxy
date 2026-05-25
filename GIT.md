# GIT — Guia de Configuração de Remotes (Fork)

Este documento registra o procedimento para redirecionar o repositório local
(clonado do original) para um fork pessoal no GitHub.

---

## Contexto

| Repositório | URL |
|-------------|-----|
| **Original** | `https://github.com/pedrofariasx/qwenproxy.git` |
| **Fork (pessoal)** | `https://github.com/MagnoAlberto/qwenproxy.git` |

---

## Passo 1 — Verificar o remote atual

Antes de qualquer alteração, verificar para onde o `origin` aponta:

```bash
git remote -v
```

Saída esperada (antes da alteração):

```
origin  https://github.com/pedrofariasx/qwenproxy (fetch)
origin  https://github.com/pedrofariasx/qwenproxy (push)
```

> Se já existir um remote chamado `upstream`, ajuste os nomes conforme necessário.

---

## Passo 2 — Renomear o remote original para `upstream`

Isso preserva a referência ao repositório original, permitindo buscar atualizações
futuras do autor:

```bash
git remote rename origin upstream
```

> **Por que `upstream`?** É a convenção do GitHub para indicar o repositório
> de onde o fork se originou. O nome `origin` fica reservado para o *seu* repositório.

---

## Passo 3 — Adicionar o fork como `origin`

Agora, apontar o `origin` para o seu fork pessoal:

```bash
git remote add origin https://github.com/MagnoAlberto/qwenproxy.git
```

---

## Passo 4 — Verificar a configuração final

```bash
git remote -v
```

Saída esperada (após a alteração):

```
origin    https://github.com/MagnoAlberto/qwenproxy.git (fetch)
origin    https://github.com/MagnoAlberto/qwenproxy.git (push)
upstream  https://github.com/pedrofariasx/qwenproxy (fetch)
upstream  https://github.com/pedrofariasx/qwenproxy (push)
```

---

## Passo 5 — Subir alterações para o fork

### 5.1 Verificar o status das alterações

```bash
git status
```

### 5.2 Adicionar os arquivos alterados

```bash
# Adicionar todos os arquivos modificados/novos
git add .

# Ou adicionar arquivos específicos
git add src/tools/parser.ts UPDATE.md GIT.md
```

### 5.3 Criar o commit

```bash
git commit -m "fix: corrige 4 testes falhando no StreamingToolParser"
```

### 5.4 Enviar para o GitHub (fork)

```bash
# Primeira vez (define o tracking branch)
git push -u origin main

# Nas vezes seguintes, basta:
git push
```

> **Nota:** Se o fork foi criado recentemente e tem um commit inicial diferente,
> pode ser necessário usar `git push -u origin main --force` na primeira vez.
> **Cuidado:** `--force` sobrescreve o histórico remoto.

---

## Operações futuras

### Sincronizar com o repositório original

Quando o autor original fizer atualizações e você quiser trazê-las para o seu fork:

```bash
# 1. Buscar as atualizações do upstream
git fetch upstream

# 2. Garantir que está na branch main
git checkout main

# 3. Mesclar as alterações do upstream
git merge upstream/main

# 4. Subir a branch atualizada para o seu fork
git push origin main
```

### Verificar diferenças com o upstream

```bash
# Ver commits que existem no upstream mas não no seu fork
git log main..upstream/main --oneline

# Ver commits que você tem mas o upstream não
git log upstream/main..main --oneline
```

### Remover um remote (se necessário)

```bash
git remote remove upstream
```

---

## Resumo dos remotes

| Remote | Aponta para | Uso |
|--------|-------------|-----|
| `origin` | Seu fork (`MagnoAlberto/qwenproxy`) | `git push` / `git pull` — seu trabalho |
| `upstream` | Repo original (`pedrofariasx/qwenproxy`) | `git fetch upstream` — buscar atualizações do autor |

---

## Referência rápida de comandos

```bash
git remote -v                    # Ver remotes configurados
git remote rename <old> <new>    # Renomear um remote
git remote add <name> <url>      # Adicionar um remote
git remote remove <name>         # Remover um remote
git remote set-url <name> <url>  # Alterar a URL de um remote existente
```
