class LoginPage {
    visit() {
        cy.visit('/');
    }

    getEmailInput() {
        return cy.get('#email');
    }

    getPasswordInput() {
        return cy.get('#password');
    }

    getLoginButton() {
        return cy.contains('button', 'Entrar');
    }

    getForgotPasswordLink() {
        return cy.contains('Esqueceu sua senha?');
    }

    getIncorrectLoginModal() {
        return cy.contains('Seu login está incorreto, quer continuar?');
    }

    getContinueButton() {
        return cy.contains('button', 'Continuar');
    }

    getErrorMessage() {
        return cy.contains('Usuário ou senha inválidos');
    }

    login(email, password) {
        this.getEmailInput().clear().type(email);
        this.getPasswordInput().clear().type(password);
        this.getLoginButton().click();
    }

    loginAndContinue(email, password) {
        this.login(email, password);
        this.getContinueButton().click();
    }
}

export default new LoginPage();
