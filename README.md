# Teste Técnico — ColmeIA QA

Este repositório contém a suíte de testes E2E (End-to-End) e a documentação técnica da auditoria realizada na plataforma ColmeIA.

O escopo do projeto vai além da automação de fluxos funcionais, incluindo:
- Testes exploratórios com foco em segurança
- Análise estática do bundle JavaScript (engenharia reversa)
- Mapeamento de falhas de UX e inconsistências de comportamento
- Documentação de bugs com impacto real no sistema

---

Durante a análise da aplicação foram identificados:

-  2 Vulnerabilidades críticas de segurança (IDOR / ausência de autenticação)
-  4 bugs de alto impacto funcional
-  3 problemas de UX e comportamento inconsistente
-  Análise de código (main.js minificado no front-end)
-  Cobertura de testes E2E com Cypress + Page Object Model (POM)

---

#  Arquitetura de Automação

A automação foi estruturada utilizando **Cypress** com padrão **Page Object Model (POM)**, garantindo escalabilidade e manutenção.

```text
cypress/e2e/
├── pages/
│   ├── LoginPage.js
│   ├── DatabasePage.js
│   └── DashboardPage.js
│
├── specs/
│   ├── login.cy.js
│   ├── database.cy.js
│   └── dashboard.cy.js
│
src/
└── main-OLCR30TF.js   # Bundle analisado via code review estático
````

---

## Análise de Segurança

### SEC-001 — Acesso sem autenticação (IDOR)

**Resultado Esperado**
Bloquear acesso não autenticado de usuário.

**Resultado Obtido**
Falha de controle de acesso — usuário não autenticado consegue acessar rotas internas diretamente.

---

### SEC-002 — Rotas internas expostas

* `/dashboard`
* `/dashboard/campanha/bancos-de-dados`
* `/dashboard/campanha/colmeia-forms`

**Resultado:**
Todas acessíveis sem autenticação.

---

### SEC-003 — XSS potencial (armazenamento)

**Descrição:** Inputs aceitam HTML sem sanitização explícita.

**Resultado:**
Payload armazenado no sistema, sem execução no ambiente atual.

---

# Code Review — Erros de Lógica (Bundle JS)

---

### ERR-01 — Bug de timezone (data de criação)

**Problema:**
Datas são exibidas com +1 dia dependendo do fuso horário.

**Causa raiz:**
Uso de `toISOString()` (UTC ao invés de data local).

---

### ERR-02 — Arquivar = Apagar

**Problema:**
Botão “Arquivar” executa a mesma função de deleção.

---

### ERR-03 — Bypass de validação

**Problema:**
Campo vazio pode ser salvo via múltiplos cliques.

---

### ERR-04 — Refresh destrói dados

**Problema:**
Botão de refresh limpa estado local sem aviso.

---

### ERR-05 — Lupa decorativa

**Problema:**
Botão de busca não possui handler (somente input filtra).

---

### ERR-06 — Empty state inconsistente

**Problema:**
Mensagem de lista vazia não reaparece após deletar todos os itens.

---

### ERR-07 — Login com falso erro

**Problema:**
Credenciais válidas exibem modal de erro antes do login.

---

### ERR-08 — Recuperação de senha inexistente

**Problema:**
Link não possui ação ou rota associada.

---

# Casos de Teste (QA Evidence)

---

## TC-LOGIN-001 — Login válido

**Pré-condição:** Usuário na tela de login

### Passos:

1. Inserir email válido
2. Inserir senha válida
3. Clicar em “Entrar”

### Resultado esperado:

Redirecionamento direto para `/dashboard`

### Resultado observado:

Modal de erro exibido mesmo com credenciais corretas. Após clicar em “Continuar”, login é efetuado.

---

## TC-DB-001 — Criar item no banco de dados

### Passos:

1. Acessar módulo “Bancos de Dados”
2. Criar novo item
3. Salvar

### Resultado esperado:

Item persistido via backend e mantido após reload

### Resultado observado:

Item existe apenas em memória, sendo perdido após refresh

---

## TC-DB-002 — Exclusão de item

### Resultado esperado:

Item removido corretamente

### Resultado observado:

Item removido da lista (sem persistência backend envolvida)

---

# Mapeamento de Bugs e Easter Eggs

| Módulo         | Problema                      |
| -------------- | ----------------------------- |
| Login          | Modal de erro em login válido |
| Login          | Recuperação de senha inativa  |
| Banco de Dados | Arquivar = Apagar             |
| Banco de Dados | Busca decorativa              |
| Banco de Dados | Refresh apaga estado          |
| Banco de Dados | Validação bypassável          |
| Forms          | Página em branco              |

---

Dá sim — e faz sentido você querer isso, porque em README de portfólio a **primeira pessoa geralmente vende melhor tua responsabilidade direta no trabalho**.

Só tem um cuidado: não exagerar no “eu fiz tudo” num tom meio inflado. Tem que ficar **confiante, mas profissional**.

Aqui vai tua seção reescrita em 1ª pessoa, bem ajustada:

---

## Considerações finais

Neste projeto, atuei como QA com uma abordagem moderna e ofensiva de qualidade, indo além da automação tradicional de testes.

Minha análise incluiu:

* automação de testes E2E com Cypress (Page Object Model)
* análise de segurança com foco em vulnerabilidades 
* investigação de comportamento da aplicação em runtime
* leitura e engenharia reversa de bundle JavaScript (code review estático)
* identificação de inconsistências estruturais e falhas de UX
* validação de fluxos críticos e regras de negócio

O objetivo não foi apenas validar funcionalidades, mas sim simular uma análise real de qualidade em ambiente de produção, identificando riscos funcionais, estruturais e de segurança.

## Relatório complementar

A documentação completa dos testes manuais, exploratórios e achados de segurança está disponível no [Caderno de Testes](https://docs.google.com/document/d/1uuzRHT5-TVnZpk4Tcq9vyIohMBGoJx_BVi4aLWsCr8c/edit?usp=sharing)


---

# Encerramento

Obrigado pela oportunidade de participar do desafio técnico.

Fico à disposição para os próximos passos ^_^
