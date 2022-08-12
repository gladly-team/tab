/* eslint-env jest */
import { cloneDeep } from 'lodash/lang'

jest.mock('../decrypt-utils')
jest.mock('uuid')
jest.mock('../initNFA')

beforeEach(() => {
  jest.clearAllMocks()
  jest.resetModules()

  process.env.LAMBDA_FIREBASE_PRIVATE_KEY = 'encrypted-fake-firebase-key'
  process.env.LAMBDA_FIREBASE_PROJECT_ID = 'fake-firebase-project-id'
  process.env.LAMBDA_FIREBASE_CLIENT_EMAIL = 'fake-firebase-client-email'
  process.env.LAMBDA_FIREBASE_DATABASE_URL = 'fake-firebase-database-url'
  process.env.FIREBASE_PUBLIC_API_KEY = 'fake-firebase-public-api-key'
  process.env.COOKIE_SECRET_20220711 = 'encrypted-fake-cookie-secret-20220711'

  const decryptValue = require('../decrypt-utils').default
  decryptValue.mockImplementation(async value => {
    if (value === 'encrypted-fake-firebase-key') {
      return 'fake-firebase-key'
    }
    if (value === 'encrypted-fake-cookie-secret-20220711') {
      return 'fake-cookie-secret-20220711'
    }
    throw new Error(`Could not decrypt value: ${value}`)
  })
})

const getMockEvent = () => {
  return {
    headers: {
      Authorization: 'fake-token-here',
    },
    methodArn: 'arn:execute-api:blah:blah',
  }
}

// Note on the uid property: "This value is not actually in the JWT token claims itself.
// It is added as a convenience, and is set as the value of the sub property."
// https://firebase.google.com/docs/reference/admin/node/admin.auth.DecodedIdToken#uid

// https://firebase.google.com/docs/reference/admin/node/admin.auth.DecodedIdToken#uid
const mockDecodedToken = {
  iss: 'https://securetoken.google.com/dev-tab-for-a-cause',
  aud: 'dev-tab-for-a-cause',
  auth_time: 1533144713,
  user_id: 'abc123xyz987',
  sub: 'abc123xyz987',
  iat: 1533144713,
  exp: 1533148313,
  email: 'meow@hogwarts.com',
  email_verified: true,
  firebase: { identities: { email: [] }, sign_in_provider: 'password' },
  // Added by Firebase admin
  uid: 'abc123xyz987',
}

// Anonymous user tokens don't have the email or email_verified fields.
const mockDecodedTokenAnonymousUser = {
  iss: 'https://securetoken.google.com/dev-tab-for-a-cause',
  provider_id: 'anonymous',
  aud: 'dev-tab-for-a-cause',
  auth_time: 1533145495,
  user_id: 'qwerty236810',
  sub: 'qwerty236810',
  iat: 1533145495,
  exp: 1533149095,
  firebase: { identities: {}, sign_in_provider: 'anonymous' },
  // Added by Firebase admin
  uid: 'qwerty236810',
}

describe('firebase-authorizer', () => {
  it('fails when token verification throws an error', async () => {
    expect.assertions(1)
    // Hide expected errors.
    jest
      .spyOn(console, 'error')
      .mockImplementationOnce(() => {})
      .mockImplementationOnce(() => {})

    const admin = require('firebase-admin')
    admin.auth.mockImplementation(() => ({
      verifyIdToken: jest.fn(() =>
        Promise.reject(new Error('Verification failed!'))
      ),
    }))
    const { handler } = require('../firebase-authorizer')
    const event = getMockEvent()
    await expect(handler(event)).rejects.toThrow('Error: Invalid token')
  })

  it('allows access when a good token is provided (for an authenticated email/password user)', async () => {
    const decodedToken = cloneDeep(mockDecodedToken)

    const admin = require('firebase-admin')
    admin.auth.mockImplementation(() => ({
      verifyIdToken: jest.fn(() => Promise.resolve(decodedToken)),
    }))
    const { handler } = require('../firebase-authorizer')
    const event = getMockEvent()
    const result = await handler(event)
    expect(result).toEqual({
      principalId: decodedToken.uid,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: 'arn:execute-api:blah:blah',
          },
        ],
      },
      context: {
        id: decodedToken.uid,
        email: decodedToken.email,
        email_verified: decodedToken.email_verified,
        auth_time: decodedToken.auth_time,
      },
    })
  })

  it("authorization still allows access when the user's email is not verified (for an authenticated email/password user)", async () => {
    const decodedToken = cloneDeep(mockDecodedToken)

    const admin = require('firebase-admin')
    admin.auth.mockImplementation(() => ({
      verifyIdToken: jest.fn(() => Promise.resolve(decodedToken)),
    }))
    const { handler } = require('../firebase-authorizer')
    const event = getMockEvent()
    const result = await handler(event)
    expect(result).toEqual({
      principalId: decodedToken.uid,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: 'arn:execute-api:blah:blah',
          },
        ],
      },
      context: {
        id: decodedToken.uid,
        email: decodedToken.email,
        email_verified: decodedToken.email_verified,
        auth_time: decodedToken.auth_time,
      },
    })
  })

  it('denies access when the user does not have an ID', async () => {
    const uuid = require('uuid').v4
    uuid.mockReturnValue('b919f576-36d7-43a9-8a92-fb978a4c346e')

    // Token does not have user ID data
    const decodedToken = cloneDeep(mockDecodedToken)
    delete decodedToken.uid
    delete decodedToken.sub

    const admin = require('firebase-admin')
    admin.auth.mockImplementation(() => ({
      verifyIdToken: jest.fn(() => Promise.resolve(decodedToken)),
    }))
    const { handler } = require('../firebase-authorizer')
    const event = getMockEvent()
    const result = await handler(event)
    expect(result).toEqual({
      principalId: 'unauthenticated-b919f576-36d7-43a9-8a92-fb978a4c346e',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: 'arn:execute-api:blah:blah',
          },
        ],
      },
      context: {},
    })
  })

  it('allows access when the user is anonymous (token does not have any email properties)', async () => {
    // Token does not have email info
    const decodedToken = cloneDeep(mockDecodedTokenAnonymousUser)

    const admin = require('firebase-admin')
    admin.auth.mockImplementation(() => ({
      verifyIdToken: jest.fn(() => Promise.resolve(decodedToken)),
    }))
    const { handler } = require('../firebase-authorizer')
    const event = getMockEvent()
    const result = await handler(event)
    expect(result).toEqual({
      principalId: decodedToken.uid,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: 'arn:execute-api:blah:blah',
          },
        ],
      },
      context: {
        id: decodedToken.uid,
        email: null,
        email_verified: false,
        auth_time: decodedToken.auth_time,
      },
    })
  })

  it('allows access with no claims when the user has a placeholder "unauthenticated" Authorization header value', async () => {
    const uuid = require('uuid').v4
    uuid.mockReturnValue('b919f576-36d7-43a9-8a92-fb978a4c346e')
    const { handler } = require('../firebase-authorizer')
    const event = {
      ...getMockEvent(),
      headers: {
        Authorization: 'unauthenticated',
      },
    }
    const result = await handler(event)
    expect(result).toEqual({
      principalId: 'unauthenticated-b919f576-36d7-43a9-8a92-fb978a4c346e',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: 'arn:execute-api:blah:blah',
          },
        ],
      },
      context: {
        id: null,
        email: null,
        email_verified: false,
        auth_time: 0,
      },
    })
  })

  it('works, calling checkUserAuthorization when applicable', async () => {
    expect.assertions(2)
    const uuid = require('uuid').v4
    uuid.mockReturnValue('b919f576-36d7-43a9-8a92-fb978a4c346e')
    const { handler } = require('../firebase-authorizer')
    const initNFA = require('../initNFA').default
    const event = {
      ...getMockEvent(),
      headers: {
        Authorization: 'unauthenticated',
      },
    }
    const result = await handler(event)
    expect(result).toEqual({
      principalId: 'unauthenticated-b919f576-36d7-43a9-8a92-fb978a4c346e',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: 'arn:execute-api:blah:blah',
          },
        ],
      },
      context: {
        id: null,
        email: null,
        email_verified: false,
        auth_time: 0,
      },
    })
    expect(initNFA).toHaveBeenCalledTimes(1)
  })

  it('works when called a second time (with an existing decrypted key)', async () => {
    expect.assertions(2)
    const uuid = require('uuid').v4
    uuid.mockReturnValue('b919f576-36d7-43a9-8a92-fb978a4c346e')
    const { handler } = require('../firebase-authorizer')
    const initNFA = require('../initNFA').default
    const event = {
      ...getMockEvent(),
      headers: {
        Authorization: 'unauthenticated',
      },
    }
    await handler(event)
    // Second call should succeed with correct value
    const result = await handler(event)
    expect(result).toEqual({
      principalId: 'unauthenticated-b919f576-36d7-43a9-8a92-fb978a4c346e',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: 'arn:execute-api:blah:blah',
          },
        ],
      },
      context: {
        id: null,
        email: null,
        email_verified: false,
        auth_time: 0,
      },
    })
    expect(initNFA).toHaveBeenCalledTimes(1)
  })
})
