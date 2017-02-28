jest.mock('../../utils/database')
const hearts = require('../hearts');

test('get hearts returns 400 when no id specified', () => {
  return hearts.handler({ params: { }})
    .then( response => expect(response.statusCode).toBe(400));
});

test('get hearts returns 404 when user id not found', () => {
  return hearts.handler({ params: { id: '4' }})
    .then( response => expect(response.statusCode).toBe(404));
});

test('get hearts returns 200 and hearts when user id is found', () => {
  return hearts.handler({ params: { id: '42' }})
    .then( response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify({
            "message": "User 42 has 350 hearts!"
        }));
    });
});

test('get hearts returns 200 and hearts when user id is not a string', () => {
  return hearts.handler({ params: { id: 42 }})
    .then( response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify({
            "message": "User 42 has 350 hearts!"
        }));
    });
});
