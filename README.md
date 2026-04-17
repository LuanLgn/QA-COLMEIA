# Auditoria de Testes Q.A. - ColmeIA

Este repositório contém a suíte de testes automatizados e a documentação da auditoria técnica realizada na plataforma ColmeIA. O objetivo deste projeto é identificar vulnerabilidades de segurança, bugs de lógica e inconsistências de UX.

## 📁 Conteúdo do Repositório

- **`caderno_de_testes.md`**: Documentação detalhada de todos os cenários de teste (Happy Path, Sad Path), casos de teste de segurança e bugs encontrados.
- **`erro_de_logica.md`**: Relatório técnico com a análise de causa raiz de erros identificados no código-fonte, incluindo evidências do bundle minificado.
- **`cypress/e2e/`**: Suíte de testes automatizados escrita em Cypress, focando em:
    - Autenticação (Login)
    - Gestão de Banco de Dados (CRUD)
    - Auditoria de Segurança (IDOR e XSS)

## 🚀 Como Rodar o Projeto

Para executar os testes em sua máquina local, siga os passos abaixo:

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado (versão 14 ou superior recomendada).

### 1. Clonar o repositório
```bash
git clone https://github.com/LuanLgn/ANALISTA-DE-TESTES-Q-A---COLMEIA.git
cd ANALISTA-DE-TESTES-Q-A---COLMEIA
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Abrir o Cypress (Interface Gráfica)
```bash
npx cypress open
```

### 4. Executar os testes em modo Headless (Terminal)
```bash
npx cypress run
```

---
*Este projeto foi desenvolvido como parte de um desafio técnico de Q.A. Engineering.*
