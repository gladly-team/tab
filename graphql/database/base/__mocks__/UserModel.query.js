/* eslint-env jest */

const query = require('dynogels/lib/query').prototype

// Mock each method, returning `this` so it is chainable.
const mockQuery = {}
for (var method in query) {
  mockQuery[method] = jest.fn(() => mockQuery)
}

// Our custom method.
mockQuery.execute = jest.fn()

module.exports = jest.fn(() => mockQuery)
