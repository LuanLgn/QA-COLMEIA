import LoginPage from './pages/LoginPage';

// Suite de testes de autenticação - ColmeIA

// Durante a exploração inicial, deu pra perceber que o fluxo de login tem alguns comportamentos meio "Easter Egg". A ideia aqui é validar isso pra garantir que, mesmo com essas inconsistências de UX, o usuário ainda consiga acessar o sistema.
describe('Fluxo de Autenticação e Acesso', () => {

    beforeEach(() => {
        // Garantimos que estamos na página limpa antes de cada cenário
        LoginPage.visit();
    });

    context('Cenários de Sucesso (Happy Path)', () => {
        it('Deve permitir o login com credenciais válidas e lidar com o modal de inconsistência', () => {
            // Note: qa@test.com / 123456 são as credenciais padrão do ambiente de teste
            LoginPage.login('qa@test.com', '123456');

            // BUG CONHECIDO: O sistema exibe um modal dizendo que o login está incorreto, mesmo quando os dados são válidos. Como analista, validei que clicar em "Continuar" é o workaround esperado.
            LoginPage.getIncorrectLoginModal().should('be.visible');
            LoginPage.getContinueButton().should('be.visible').click();

            // Validação final de redirecionamento para a Home do Dashboard
            cy.url().should('include', '/dashboard');
        });
    });

    context('Cenários de Exceção e Validações', () => {
        it('Deve exibir mensagem de erro ao tentar logar com senha inválida', () => {
            LoginPage.login('qa@test.com', 'senha_errada');

            // Garantimos que o feedback de erro visual está presente para o usuário
            LoginPage.getErrorMessage()
                .should('be.visible')
                .and('contain', 'Usuário ou senha inválidos');

            cy.url().should('not.include', '/dashboard');
        });

        it('Deve validar a obrigatoriedade dos campos de email e senha', () => {
            LoginPage.getLoginButton().click();

            // O sistema deve disparar mensagens de validação antes de tentar o submissão
            LoginPage.getErrorMessage().should('be.visible');
        });

        it('Deve impedir o acesso com email não cadastrado', () => {
            LoginPage.login('usuario_inexistente@colmeia.me', 'qualquer_senha');
            LoginPage.getErrorMessage().should('be.visible');
        });
    });

    context('Validação de Comportamentos Inesperados (Easter Eggs)', () => {
        it('Valida que o link "Esqueceu sua senha" ainda não possui implementação', () => {
            // Reportado como bug de UX: O link de recuperação de senha é decorativo.
            // Validamos aqui que ele não causa quebras (como loops ou erros 500), mas o comportamento atual é permanecer na mesma URL.
            LoginPage.getForgotPasswordLink().click();
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });
    });
});
