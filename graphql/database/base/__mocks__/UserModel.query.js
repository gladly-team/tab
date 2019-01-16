/* eslint-env jest */

const query = require('dynogels/lib/query').prototype

// Mock each method, returning `this` so it is chainable.
const mockQuery = {}
Object.keys(query).forEach(method => {
  mockQuery[method] = jest.fn(() => mockQuery)
})

// Our custom method.
mockQuery.execute = jest.fn()

module.exports = jest.fn(() => mockQuery)
