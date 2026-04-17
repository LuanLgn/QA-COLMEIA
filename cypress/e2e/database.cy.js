import DatabasePage from './pages/DatabasePage';

/**
 Suite de Testes: Banco de Dados
 
 Este módulo foca nas operações de CRUD. Durante os testes técnicos, foi observado que o estado é mantido apenas em memória nesta versão, o que implica na realização de testes voltados à consistência local antes de qualquer integração com um sistema de persistência real.

 */
describe('Módulo: Gestão de Banco de Dados (CRUD e Lógica)', () => {

    beforeEach(() => {

        // Nota técnica: hoje tem uma brecha de segurança (IDOR) que permite acessar a URL do dashboard direto, sem login. A gente está usando isso pra agilizar os testes de funcionalidade por enquanto, mas o bug já está documentado no security.cy.js.
        DatabasePage.visit();
    });

    context('Operações de Criação e Listagem', () => {
        it('Deve permitir a criação de um novo banco de dados e validar sua exibição na lista', () => {
            const dbName = `DB_AUDIT_${Date.now()}`;

            DatabasePage.openCreateModal();
            DatabasePage.getNameInput().type(dbName);
            DatabasePage.getSaveButton().click();

            // Verifica se o item foi renderizado corretamente na tabela
            cy.contains(dbName).should('be.visible');
        });

        it('Deve filtrar a lista corretamente através do campo de pesquisa (tempo real)', () => {
            const db1 = `PROD_DB_${Date.now()}`;
            const db2 = `DEV_DB_${Date.now()}`;

            // Populando dados para o teste de filtro
            DatabasePage.openCreateModal();
            DatabasePage.getNameInput().type(db1);
            DatabasePage.getSaveButton().click();

            DatabasePage.openCreateModal();
            DatabasePage.getNameInput().type(db2);
            DatabasePage.getSaveButton().click();

            // Executa a busca
            DatabasePage.getSearchInput().type('PROD');

            // Valida que apenas o item correspondente está visível
            cy.contains(db1).should('be.visible');
            cy.contains(db2).should('not.exist');
        });
    });

    context('Exclusão e Persistência de Estado', () => {
        it('Deve remover um item da lista ao clicar no botão de exclusão', () => {
            const dbName = `TEMP_DB_${Date.now()}`;

            DatabasePage.openCreateModal();
            DatabasePage.getNameInput().type(dbName);
            DatabasePage.getSaveButton().click();

            DatabasePage.getDeleteButtons().first().click();
            cy.contains(dbName).should('not.exist');
        });

        it('Validar que os dados são perdidos ao recarregar a página (Falta de Persistência)', () => {

            // Este teste evidencia uma limitação importante: os dados não estão sendo persistidos no backend qualquer F5 ou refresh acaba limpando o estado.

            const dbName = `VOLATILE_DB_${Date.now()}`;
            DatabasePage.openCreateModal();
            DatabasePage.getNameInput().type(dbName);
            DatabasePage.getSaveButton().click();

            cy.reload();
            cy.contains(dbName).should('not.exist');
        });
    });

    context('Análise de Defeitos e Inconsistências (Bugs Encontrados)', () => {
        it('Confirma que o botão de Refresh limpa a lista sem aviso prévio', () => {
            // Recriar o cenário de ERR-04
            DatabasePage.openCreateModal();
            DatabasePage.getNameInput().type('Item para Reset');
            DatabasePage.getSaveButton().click();

            // O botão de refresh atua como um Hard Reload
            DatabasePage.getRefreshButton().click();
            cy.get('table tbody tr').should('not.exist');
        });

        it('Valida defeito de duplicidade funcional: Arquivar vs Apagar', () => {
            // BUG ERR-02: Vimos no código que os dois botões chamam a mesma função de exclusão. Aqui a gente só valida esse comportamento igual entre eles.

            const dbName = `BUG_TEST_${Date.now()}`;
            DatabasePage.openCreateModal();
            DatabasePage.getNameInput().type(dbName);
            DatabasePage.getSaveButton().click();

            // Clica em 'arquivar', mas o item some como se tivesse sido deletado
            DatabasePage.getArchiveButtons().first().click();
            cy.contains(dbName).should('not.exist');
        });

        it('Deve expor a falha na mensagem de "Nenhum resultado" após deleção total', () => {
            // Cenário onde deletamos tudo e a mensagem de lista vazia some (ERR-06)
            DatabasePage.getDeleteButtons().each(($el) => {
                cy.wrap($el).click();
            });


            // Esperado: mensagem "Nenhum banco de dados encontrado"
            // Obtido: tela em branco (parece falha no re-render)

            DatabasePage.getEmptyStateMessage().should('not.exist');
        });

        it('Valida o bypass de validação por múltiplos cliques (Race Condition Mock)', () => {

            // BUG ERR-03: Se ficar clicando rápido (ou dar duplo clique) no botão salvar, a validação acaba sendo ignorada.

            DatabasePage.openCreateModal();
            // Clica repetidamente no Salvar sem preencher o nome
            DatabasePage.getSaveButton().click();
            DatabasePage.getSaveButton().click();

            // Se o bug ocorrer, o modal fecha e o item vazio surge na lista
            DatabasePage.getNameInput().should('not.exist');
        });
    });
});
