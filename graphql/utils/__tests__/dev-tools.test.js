/* eslint-env jest */

jest.mock('jwt-decode', () => {
  return () => ({
    sub: 'abcdefghijklmno',
    email: 'somebody@example.com',
    email_verified: 'true'
  })
})

describe('dev-tools', () => {
  it('corrently forms GraphQL context from a request object', () => {
    const getGraphQLContextFromRequest = require('../dev-tools').getGraphQLContextFromRequest
    // Note: will have to update this when we remove hardcoded
    // user claims.
    const minimalRequestObject = {
      header: () => {}
    }
    const expectedContext = {
      user: {
        id: 'abcdefghijklmno',
        email: 'somebody@example.com',
        emailVerified: true
      }
    }
    const context = getGraphQLContextFromRequest(minimalRequestObject)
    expect(context).toEqual(expectedContext)
  })
})
