# Auditoria de Qualidade ColmeIA

Este repositório contém a suíte de testes E2E (End-to-End) e a documentação técnica da auditoria realizada na plataforma ColmeIA. O escopo do projeto não se limitou à automação de fluxos felizes, englobando também a adoção de **Offensive QA**, análise estática de código (engenharia reversa do bundle JavaScript) e mapeamento de falhas de UX.

## Relatório Executivo e Casos de Teste

Para manter este repositório objetivo, toda a documentação de testes manuais, exploratórios e os relatórios de vulnerabilidade foram centralizados no documento abaixo:

**[Acessar Relatório Executivo completo (Google Docs)](https://docs.google.com/document/d/1uuzRHT5-TVnZpk4Tcq9vyIohMBGoJx_BVi4aLWsCr8c/edit?usp=sharing)**

**O relatório abrange detalhadamente:**
* **Arquitetura POM:** Estruturação dos testes automatizados utilizando Page Object Model.
* **Segurança (Offensive QA):** Provas de conceito (PoC) para vulnerabilidades de IDOR (falta de autenticação nas rotas) e Stored XSS.
* **Code Review:** Análise do bundle Angular para identificar a raiz de bugs complexos (como erros de Timezone e colisões de métodos).
* **Easter Eggs:** Mapeamento de comportamentos falhos inseridos intencionalmente no desafio.

---

## Arquitetura do Projeto

A automação foi desenvolvida em **Cypress** utilizando o padrão **Page Object Model (POM)** para garantir fácil manutenção e escalabilidade da suíte.

```text
├── cypress/e2e/
│   ├── pages/                   # Page Objects (Abstração de seletores e métodos)
│   │   ├── DatabasePage.js      # Ações do CRUD de Bancos de Dados
│   │   ├── LoginPage.js         # Ações do fluxo de Autenticação
│   │   └── DashboardPage.js     # Ações e navegação do Dashboard principal
│   │
│   ├── specs/                   # Suítes de Testes (Specs)
│   │   ├── database.cy.js       # Validação de persistência e regras de negócio
│   │   ├── login.cy.js          # Fluxos de autenticação (Happy/Sad paths)
│   │   └── dashboard.cy.js      # Verificações de UI/UX e estado da página
│
├── src/
│   └── main-OLCR30TF.js         # Bundle JS da aplicação alvo (utilizado para Code Review estático)
```

---

## Como Executar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/LuanLgn/QA-COLMEIA.git
cd QA-COLMEIA
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Execução dos Testes

**Modo Interativo (Cypress Test Runner):**
Ideal para visualização e depuração dos testes em tempo real.
```bash
npx cypress open
```

**Modo Headless (CI/CD Pipeline):**
Ideal para execução rápida no terminal, gerando relatórios sem interface gráfica.
```bash
npx cypress run
```

---
## Considerações finais

Este projeto foi desenvolvido com foco em uma abordagem real de QA moderno, indo além da automação tradicional para incluir análise de segurança, investigação de comportamento da aplicação e leitura de código em nível de bundle.

O objetivo foi demonstrar capacidade de identificar não apenas falhas funcionais, mas também problemas estruturais, riscos de segurança e inconsistências de arquitetura.

Obrigado pela oportunidade! ^_^
