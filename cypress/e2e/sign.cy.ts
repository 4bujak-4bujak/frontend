//test1 : 로그인과정 테스트

describe('Signin Form Test', () => {
  // 로그인 api 검증
  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: 'https://joo-api.store/login',
      body: {
        email: 'c@gmail.com',
        password: 'qwer1234!'
      }
    }).then((resp) => {
      const token = resp.body.data.accessToken;
      if (typeof token === 'string' && token.length > 0) {
        cy.setCookie('token', token);
      } else {
        throw new Error('Token is not a valid string.');
      }
    });
    cy.visit('http://localhost:3000/signin');
  });

  //  로그인 및 리다이렉션 검증
  it('successfully logs in', () => {
    cy.visit('http://localhost:3000/signin');
    cy.get('input[id="email"]').type('c@gmail.com');
    cy.get('input[id="password"]').type('qwer1234!');
    cy.get('form').submit();
    cy.url().should('include', '/');
    cy.visit('http://localhost:3000/');
  });
});
