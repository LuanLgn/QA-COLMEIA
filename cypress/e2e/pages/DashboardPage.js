class DashboardPage {
    visit() {
        cy.visit('/dashboard');
    }

    visitEasterEggs() {
        cy.visit('/easter-eggs');
    }

    getSidebarToggle() {
        return cy.get('nav a').first();
    }

    getColmeiaFormsLink() {
        return cy.contains('Colmeia Forms');
    }

    getDatabaseLink() {
        return cy.contains('Bancos de dados');
    }

    getProfileButton() {
        return cy.contains('button', 'Candidato');
    }

    verifyDashboardLoaded() {
        cy.url().should('include', '/dashboard');
        cy.contains('Candidato').should('be.visible');
    }
}

export default new DashboardPage();
