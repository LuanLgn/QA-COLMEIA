class DatabasePage {
    visit() {
        cy.visit('/dashboard/campanha/bancos-de-dados');
    }

    getSearchInput() {
        return cy.get("input[placeholder='Pesquisar']");
    }

    getLupaButton() {
        // Botão da lupa não faz nada
        return cy.get('button').filter(':has(svg)').first();
    }

    getRefreshButton() {
        // Botão de atualizar
        return cy.get('button[title="Refresh"], button[aria-label="refresh"]')
            .or(cy.contains('button', ''));
    }

    getCreateButton() {
        return cy.contains('button', 'Criar');
    }

    getNameInput() {
        return cy.get("input[placeholder='Nome do item']");
    }

    getSaveButton() {
        return cy.contains('button', 'Salvar');
    }

    getDeleteButtons() {
        return cy.get('button[title="Apagar"]');
    }

    getArchiveButtons() {
        return cy.get('button[title="Arquivar"]');
    }

    getDatabaseListItems() {
        return cy.get('table tbody tr').or(cy.get('[data-cy="db-item"]'));
    }

    getEmptyStateMessage() {
        return cy.contains('Nenhum banco de dados encontrado');
    }

    openCreateModal() {
        this.getCreateButton().click();
    }

    createDatabase(name) {
        this.openCreateModal();
        if (name) {
            this.getNameInput().type(name);
        }
        this.getSaveButton().click();
    }
}

export default new DatabasePage();
