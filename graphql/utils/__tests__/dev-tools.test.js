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
        id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
        emailVerified: true,
        username: 'myUserName'
      }
    }
    const context = getGraphQLContextFromRequest(minimalRequestObject)
    expect(context).toEqual(expectedContext)
  })
})
