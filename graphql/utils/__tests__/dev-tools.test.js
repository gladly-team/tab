/* eslint-env jest */

import {
  getGraphQLContextFromRequest
} from '../dev-tools'

describe('dev-tools', () => {
  it('corrently forms GraphQL context from a request object', () => {
    // Note: will have to update this when we remove hardcoded
    // user claims.
    const minimalRequestObject = {}
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
