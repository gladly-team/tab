/* global jest test expect */

jest.mock('../../utils/database')
const hearts = require('../hearts')

test('get hearts returns 400 when no id specified', () => {
  return hearts.handler({ queryStringParameters: {} })
    .then(response => expect(response.statusCode).toBe(400))
})

test('get hearts returns 404 when user id not found', () => {
  return hearts.handler({ queryStringParameters: { id: '987zxy' } })
    .then(response => expect(response.statusCode).toBe(404))
})

test('get hearts returns 200 and hearts when user id is found', () => {
  return hearts.handler({ queryStringParameters: { id: 'abc123' } })
    .then(response => {
      expect(response.statusCode).toBe(200)
      expect(response.body).toBe(JSON.stringify({
        'message': 'User abc123 has 350 hearts!'
      }))
    })
})
