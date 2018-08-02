/* eslint-env jest */

import * as admin from 'firebase-admin'
import { cloneDeep } from 'lodash/lang'

afterEach(() => {
  jest.clearAllMocks()
})

// Note on the uid property: "This value is not actually in the JWT token claims itself.
// It is added as a convenience, and is set as the value of the sub property."
// https://firebase.google.com/docs/reference/admin/node/admin.auth.DecodedIdToken#uid

// https://firebase.google.com/docs/reference/admin/node/admin.auth.DecodedIdToken#uid
const mockDecodedToken = { iss: 'https://securetoken.google.com/dev-tab-for-a-cause',
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
  uid: 'abc123xyz987'
}

test('authorization fails when no token is provided', (done) => {
  // Hide expected error.
  jest.spyOn(console, 'error')
    .mockImplementationOnce(() => {})

  const checkUserAuthorization = require('../firebase-authorizer').checkUserAuthorization
  const event = {
    authorizationToken: null,
    methodArn: 'arn:execute-api:blah:blah'
  }
  const context = {}
  const callback = (err, _) => {
    expect(err).toBe('Error: Invalid token')
    done()
  }
  checkUserAuthorization(event, context, callback)
})

test('authorization fails when token verification throws an error', (done) => {
  // Hide expected error.
  jest.spyOn(console, 'error')
    .mockImplementationOnce(() => {})

  admin.auth.mockImplementation(() => ({
    verifyIdToken: jest.fn(() => {
      return Promise.reject(new Error('Verification failed!'))
    })
  }))
  const checkUserAuthorization = require('../firebase-authorizer').checkUserAuthorization
  const event = {
    authorizationToken: 'fake-token-here',
    methodArn: 'arn:execute-api:blah:blah'
  }
  const context = {}
  const callback = (err, _) => {
    expect(err).toBe('Error: Invalid token')
    done()
  }
  checkUserAuthorization(event, context, callback)
})

test('authorization allows access when a good token is provided (for an authenticated email/password user)', (done) => {
  const decodedToken = cloneDeep(mockDecodedToken)

  admin.auth.mockImplementation(() => ({
    verifyIdToken: jest.fn(() => {
      return Promise.resolve(decodedToken)
    })
  }))
  const checkUserAuthorization = require('../firebase-authorizer').checkUserAuthorization
  const event = {
    authorizationToken: 'fake-token-here',
    methodArn: 'arn:execute-api:blah:blah'
  }
  const context = {}
  const callback = (_, data) => {
    expect(data).toEqual({
      principalId: decodedToken.uid,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: 'arn:execute-api:blah:blah'
          }
        ]
      },
      context: {
        id: decodedToken.uid,
        email: decodedToken.email,
        email_verified: decodedToken.email_verified
      }
    })
    done()
  }
  checkUserAuthorization(event, context, callback)
})

test('authorization still allows access when the user\'s email is not verified (for an authenticated email/password user)', (done) => {
  const decodedToken = cloneDeep(mockDecodedToken)

  admin.auth.mockImplementation(() => ({
    verifyIdToken: jest.fn(() => {
      return Promise.resolve(decodedToken)
    })
  }))
  const checkUserAuthorization = require('../firebase-authorizer').checkUserAuthorization
  const event = {
    authorizationToken: 'fake-token-here',
    methodArn: 'arn:execute-api:blah:blah'
  }
  const context = {}
  const callback = (_, data) => {
    expect(data).toEqual({
      principalId: decodedToken.uid,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: 'arn:execute-api:blah:blah'
          }
        ]
      },
      context: {
        id: decodedToken.uid,
        email: decodedToken.email,
        email_verified: decodedToken.email_verified
      }
    })
    done()
  }
  checkUserAuthorization(event, context, callback)
})

test('authorization denies access when the user does not have an ID', (done) => {
  // Token does not have user ID data
  const decodedToken = cloneDeep(mockDecodedToken)
  delete decodedToken.uid
  delete decodedToken.sub

  admin.auth.mockImplementation(() => ({
    verifyIdToken: jest.fn(() => {
      return Promise.resolve(decodedToken)
    })
  }))
  const checkUserAuthorization = require('../firebase-authorizer').checkUserAuthorization
  const event = {
    authorizationToken: 'fake-token-here',
    methodArn: 'arn:execute-api:blah:blah'
  }
  const context = {}
  const callback = (_, data) => {
    expect(data).toEqual({
      principalId: undefined,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: 'arn:execute-api:blah:blah'
          }
        ]
      },
      context: {}
    })
    done()
  }
  checkUserAuthorization(event, context, callback)
})
