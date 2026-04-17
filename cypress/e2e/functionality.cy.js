import DashboardPage from './pages/DashboardPage';

describe('[FORMS] Testes de Colmeia Forms', () => {
    beforeEach(() => {
        DashboardPage.visit();
    });

    it('[BUG-FORMS-001] Página de Colmeia Forms está em branco sem conteúdo', () => {
        cy.visit('/dashboard/campanha/colmeia-forms');

        // Esperado: exibir lista de formulários ou opção de criar
        // Obtido: página em branco
        cy.contains('Colmeia Forms').should('be.visible');
        cy.contains('Criar').should('not.exist');

        cy.log('BUG-FORMS-001: Página não possui conteúdo funcional');
    });
});

describe('[EASTER-EGGS] Página de Easter Eggs', () => {
    it('[TC-EE-001] Página de Easter Eggs deve estar acessível', () => {
        cy.visit('/easter-eggs');
        cy.url().should('include', '/easter-eggs');
    });

    it('[TC-EE-002] Página de Easter Eggs deve listar todos os bugs documentados', () => {
        cy.visit('/easter-eggs');

        // Login bugs
        cy.contains('Esqueceu sua senha').should('be.visible');
        cy.contains('Continuar').or(cy.contains('login ocorre normalmente')).should('exist');

        // Database bugs
        cy.contains('lupa').or(cy.contains('lupa da pesquisa')).should('exist');
        cy.contains('Nenhum banco de dados encontrado').should('be.visible');
        cy.contains('refresh').or(cy.contains('Refresh')).should('exist');
        cy.contains('arquivar').or(cy.contains('Arquivar')).should('exist');

        // Forms
        cy.contains('Página em branco').or(cy.contains('branco')).should('exist');
    });
});
