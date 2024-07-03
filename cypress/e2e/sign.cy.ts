describe('로그인 테스트', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/sign');
  });
  it('로그인', () => {
    cy.get('[data-cy="sign-in-Btn"]').click();
    cy.url().should('include', '/signin');
    cy.contains('이메일');
    cy.contains('비밀번호');
    cy.get('#email').click().type('hohoj@4bujak.com');
    cy.get('#password').click().type('Office123!');
    cy.get('#signIn-Btn').click();
    cy.contains(
      '등록되지 않은 계정이거나 비밀번호가 올바르지 않습니다.입력하신 내용을 다시 확인해주세요'
    );
    cy.get('#email').clear().type('hohoj@4busak.com');
    cy.get('#signIn-Btn').click();
  });
});
