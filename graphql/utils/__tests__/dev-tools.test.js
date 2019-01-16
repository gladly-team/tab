/* eslint-env jest */

import jwtDecode from 'jwt-decode'
import { cloneDeep } from 'lodash/lang'

jest.mock('jwt-decode')

// A mock of the decoded Firebase token.
const mockDecodedToken = {
  iss: 'https://securetoken.google.com/dev-tab-for-a-cause',
  aud: 'dev-tab-for-a-cause',
  auth_time: 1533144713,
  user_id: 'abc123xyz987',
  sub: 'abc123xyz987',
  iat: 1533144713,
  exp: 1533148313,
  email: 'somebody@example.com',
  email_verified: true,
  firebase: { identities: { email: [] }, sign_in_provider: 'password' },
}

describe('dev-tools', () => {
  it('correctly forms GraphQL context from a request object when the user has a verified email', () => {
    const mockToken = cloneDeep(mockDecodedToken)
    jwtDecode.mockImplementationOnce(() => mockToken)
    const { getGraphQLContextFromRequest } = require('../dev-tools')
    const minimalRequestObject = {
      header: headerName => {
        if (headerName === 'Authorization') {
          return 'fake.token'
        }
        return null
      },
    }
    const expectedContext = {
      user: {
        id: 'abc123xyz987',
        email: 'somebody@example.com',
        emailVerified: true,
      },
    }
    const context = getGraphQLContextFromRequest(minimalRequestObject)
    expect(context).toEqual(expectedContext)
  })

  it('correctly forms GraphQL context from a request object when the user does not have an email', () => {
    const mockToken = cloneDeep(mockDecodedToken)
    delete mockToken.email
    delete mockToken.email_verified
    jwtDecode.mockImplementationOnce(() => mockToken)

    const { getGraphQLContextFromRequest } = require('../dev-tools')
    const minimalRequestObject = {
      header: headerName => {
        if (headerName === 'Authorization') {
          return 'fake.token'
        }
        return null
      },
    }
    const expectedContext = {
      user: {
        id: 'abc123xyz987',
        email: null,
        emailVerified: false,
      },
    }
    const context = getGraphQLContextFromRequest(minimalRequestObject)
    expect(context).toEqual(expectedContext)
  })

  it('correctly forms GraphQL context from a request object when there is no Authorization header token', () => {
    // Suppress expected console.warn statements.
    jest.spyOn(console, 'warn').mockImplementation(() => {})

    const { getGraphQLContextFromRequest } = require('../dev-tools')
    const minimalRequestObject = {
      header: () => null,
    }
    const expectedContext = {
      user: {
        id: 'abcdefghijklmno',
        email: 'kevin@example.com',
        emailVerified: true,
      },
    }
    const context = getGraphQLContextFromRequest(minimalRequestObject)
    expect(context).toEqual(expectedContext)
  })

  it('correctly forms GraphQL context from a request object when the user has an Authorization header value of "unauthenticated"', () => {
    const { getGraphQLContextFromRequest } = require('../dev-tools')
    const minimalRequestObject = {
      header: headerName => {
        if (headerName === 'Authorization') {
          return 'unauthenticated'
        }
        return null
      },
    }
    const expectedContext = {
      user: {
        id: null,
        email: null,
        emailVerified: false,
      },
    }
    const context = getGraphQLContextFromRequest(minimalRequestObject)
    expect(context).toEqual(expectedContext)
  })
})
