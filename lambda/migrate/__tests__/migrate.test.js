jest.mock('../tfac');

const migrate = require('../migrate');

describe('Migrate Data Tests', function() {
  
  it('migrate returns 400 when no id specified', () => {
    return migrate.handler({ queryStringParameters: {}})
      .then( response => expect(response.statusCode).toBe(400));
  });

  it('migrate returns 200 when migration finish', () => {
    return migrate.handler({ queryStringParameters: { id: 'abc123' }})
      .then( response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toBe(JSON.stringify({
              "message": "Migration successful."
          }));
      });
  });
});
