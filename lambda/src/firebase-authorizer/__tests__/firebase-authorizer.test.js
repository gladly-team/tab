/* eslint-env jest */
import { cloneDeep } from 'lodash/lang'

jest.mock('firebase-admin')
jest.mock('next-firebase-auth')
jest.mock('../decrypt-utils')
jest.mock('uuid')
jest.mock('../initNFA')

const getMockEvent = () => {
  return {
    headers: {
      Authorization: 'fake-token-here',
    },
    methodArn: 'arn:execute-api:blah:blah',
  }
}

const getMockNFAUser = () => ({
  id: 'abc123xyz987',
  email: 'headmaster@hogwarts.edu',
  emailVerified: true,
  phoneNumber: undefined,
  displayName: undefined,
  photoURL: undefined,
  claims: {},
  getIdToken: jest.fn(),
  clientInitialized: false,
  firebaseUser: null,
  signOut: jest.fn(),
  serialize: jest.fn(),
})

const getMockUnauthedNFAUser = () => ({
  id: null,
  email: null,
  emailVerified: false,
  phoneNumber: null,
  displayName: null,
  photoURL: null,
  claims: {},
  clientInitialized: false,
  firebaseUser: null,
  getIdToken: () => {},
  signOut: () => {},
  serialize: () => {},
})

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
  email: 'headmaster@hogwarts.edu',
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

  const { getUserFromCookies } = require('next-firebase-auth')
  getUserFromCookies.mockImplementation(
    async ({ authCookieValue, authCookieSigValue }) => {
      if (authCookieValue && authCookieSigValue) {
        return getMockNFAUser()
      }
      return null
    }
  )

  const uuid = require('uuid').v4
  uuid.mockReturnValue('b919f576-36d7-43a9-8a92-fb978a4c346e')
})

describe('firebase-authorizer', () => {
  it('[ID token] fails when token verification throws an error', async () => {
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

  it('[ID token] allows access when a good token is provided (for an authenticated email/password user)', async () => {
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

  it("[ID token] still allows access when the user's email is not verified (for an authenticated email/password user)", async () => {
    const decodedToken = cloneDeep(mockDecodedToken)
    decodedToken.email_verified = false

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
        email_verified: false,
        auth_time: decodedToken.auth_time,
      },
    })
  })

  it('[ID token] denies access when the user does not have an ID', async () => {
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

  it('[ID token] allows access when the user is anonymous (token does not have any email properties)', async () => {
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

  it('[unauthenticated] allows access with no claims when the user has a placeholder "unauthenticated" Authorization header value', async () => {
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

  it('[cookies] allows access when the Authorization header contains a valid JSON string of auth values', async () => {
    const decodedToken = cloneDeep(mockDecodedToken)

    // Auth values from cookies will call NFA for verification.
    const { getUserFromCookies } = require('next-firebase-auth')
    getUserFromCookies.mockImplementation(
      async ({ authCookieValue, authCookieSigValue }) => {
        if (authCookieValue && authCookieSigValue) {
          return getMockNFAUser()
        }
        return null
      }
    )

    // This should not be a valid ID token.
    const admin = require('firebase-admin')
    admin.auth.mockImplementation(() => ({
      verifyIdToken: jest.fn(() =>
        Promise.reject(new Error('Verification failed!'))
      ),
    }))

    const { handler } = require('../firebase-authorizer')
    const event = {
      ...getMockEvent(),
      headers: {
        Authorization: JSON.stringify({
          tabAuthUserTokens: 'value-of-the-auth-user-tokens-cookie',
          tabAuthUserTokensSig: 'sig-value-of-the-auth-cookie',
        }),
      },
    }
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
        id: 'abc123xyz987',
        email: 'headmaster@hogwarts.edu',
        email_verified: true,
        auth_time: 0, // We won't have an auth_time from NFA
      },
    })
  })

  it('[cookies] returns an unauthed user when the Authorization header contains auth values but they are not valid', async () => {
    // Auth values from cookies will call NFA for verification.
    const { getUserFromCookies } = require('next-firebase-auth')
    getUserFromCookies.mockImplementation(async () => {
      // Mock that the tokens are not valid. NFA returns an "empty" user.
      return getMockUnauthedNFAUser()
    })

    // This should not be a valid ID token.
    const admin = require('firebase-admin')
    admin.auth.mockImplementation(() => ({
      verifyIdToken: jest.fn(() =>
        Promise.reject(new Error('Verification failed!'))
      ),
    }))

    const { handler } = require('../firebase-authorizer')
    const event = {
      ...getMockEvent(),
      headers: {
        Authorization: JSON.stringify({
          tabAuthUserTokens: 'value-of-the-auth-user-tokens-cookie',
          tabAuthUserTokensSig: 'sig-value-of-the-auth-cookie',
        }),
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

  it('[cookies] continues on to ID token verification if the Authorization header does not JSON-parse', async () => {
    const decodedToken = cloneDeep(mockDecodedToken)

    // Auth values from cookies will call NFA for verification.
    const { getUserFromCookies } = require('next-firebase-auth')
    getUserFromCookies.mockImplementation(async () => {
      // Mock that the tokens are not valid. NFA returns an "empty" user.
      return getMockUnauthedNFAUser()
    })

    // This should not be a valid ID token.
    const admin = require('firebase-admin')
    const mockVerifyIdToken = jest.fn(async () => decodedToken)
    admin.auth.mockImplementation(() => ({
      verifyIdToken: mockVerifyIdToken,
    }))

    const { handler } = require('../firebase-authorizer')
    const event = {
      ...getMockEvent(),
      headers: {
        Authorization: 'this-is-not-json',
      },
    }
    await handler(event)
    expect(mockVerifyIdToken).toHaveBeenCalledTimes(1)
  })

  it('does not decrypt values more than once because it keeps decrypted values in memory', async () => {
    expect.assertions(2)
    const decodedToken = cloneDeep(mockDecodedToken)
    const admin = require('firebase-admin')
    admin.auth.mockImplementation(() => ({
      verifyIdToken: jest.fn(() => Promise.resolve(decodedToken)),
    }))
    const { handler } = require('../firebase-authorizer')
    const decryptValue = require('../decrypt-utils').default
    const event = getMockEvent()
    await handler(event)
    expect(decryptValue).toHaveBeenCalled()
    decryptValue.mockClear()
    await handler(event)
    expect(decryptValue).not.toHaveBeenCalled()
  })

  it('does not initialize next-firebase-auth more than once', async () => {
    expect.assertions(2)
    const decodedToken = cloneDeep(mockDecodedToken)
    const admin = require('firebase-admin')
    admin.auth.mockImplementation(() => ({
      verifyIdToken: jest.fn(() => Promise.resolve(decodedToken)),
    }))
    const { handler } = require('../firebase-authorizer')
    const initNFA = require('../initNFA').default
    const event = {
      ...getMockEvent(),
      headers: {
        Authorization: 'unauthenticated',
      },
    }
    await handler(event)
    expect(initNFA).toHaveBeenCalled()
    initNFA.mockClear()
    await handler(event)
    expect(initNFA).not.toHaveBeenCalled()
  })

  it('initializes next-firebase-auth with the expected values', async () => {
    expect.assertions(1)
    const decodedToken = cloneDeep(mockDecodedToken)
    const admin = require('firebase-admin')
    admin.auth.mockImplementation(() => ({
      verifyIdToken: jest.fn(() => Promise.resolve(decodedToken)),
    }))
    const { handler } = require('../firebase-authorizer')
    const initNFA = require('../initNFA').default
    const event = getMockEvent()
    await handler(event)
    expect(initNFA).toHaveBeenCalledWith({
      firebaseProjectId: 'fake-firebase-project-id',
      firebasePrivateKey: 'fake-firebase-key',
      firebaseClientEmail: 'fake-firebase-client-email',
      firebaseDatabaseURL: 'fake-firebase-database-url',
      firebasePublicAPIKey: 'fake-firebase-public-api-key',
      cookieKeys: ['fake-cookie-secret-20220711'],
    })
  })

  it('initializes firebase-admin with the expected values', async () => {
    expect.assertions(1)
    const decodedToken = cloneDeep(mockDecodedToken)
    const admin = require('firebase-admin')
    admin.auth.mockImplementation(() => ({
      verifyIdToken: jest.fn(() => Promise.resolve(decodedToken)),
    }))
    const { handler } = require('../firebase-authorizer')
    const event = getMockEvent()
    await handler(event)
    expect(admin.initializeApp).toHaveBeenCalledWith({
      credential: admin.credential.cert({
        projectId: 'fake-firebase-project-id',
        clientEmail: 'fake-firebase-client-email',
        privateKey: 'fake-firebase-key',
      }),
      databaseURL: process.env.LAMBDA_FIREBASE_DATABASE_URL,
    })
  })
})
