jest.mock('../tfac_auth');

var mockRegisterUser = jest.fn((email, password, onSuccessCallback, onFailureCallback) => {
  onSuccessCallback({
    sub: 'some-sub',
    email: 'user@email.com',
    password: 'SomeUserPassword1'
  });
});

jest.mock('../cognito', () => {
  return {
    registerUser: mockRegisterUser
  };
});

const migrateAuth = require('../migrate_auth');

describe('Migrate Auth', function() {
  
  it('migrate auth returns 400 when no id specified', () => {
    return migrateAuth.handler({ queryStringParameters: {}})
      .then( response => expect(response.statusCode).toBe(400));
  });

  it('migrate auth returns 200 when migration finish', () => {
    return migrateAuth.handler({ queryStringParameters: { id: 'abc123', email: 'user@email.com' }})
      .then( response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toBe(JSON.stringify({
              "message": "User created."
          }));
      });
  });

  it('calls to tfac to set the created user credentials', () => {
    const registerUserCalls = mockRegisterUser.mock.calls.length;
    const parameters = {
      id: 'some-tfac-id',
      email: 'user@email.com'
    }

    return migrateAuth.handler({ queryStringParameters: { id: parameters.id, email: parameters.email }})
      .then( response => {
          expect(mockRegisterUser.mock.calls.length - 
            registerUserCalls).toBe(1);
          const registerUser = mockRegisterUser.mock.
                  calls[mockRegisterUser.mock.calls.length - 1];
          
          expect(registerUser[0]).toBe(parameters.email);

          const p = registerUser[1];
          const passwordCorrect = (/[a-z]/.test(p)) && 
              (/[A-Z]/.test(p)) && (/[0-9]/.test(p));

          expect(passwordCorrect).toBe(true);
      });
  });


});
