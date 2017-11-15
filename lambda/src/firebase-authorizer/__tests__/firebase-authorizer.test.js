/* eslint-env jest */

import * as admin from 'firebase-admin'

afterEach(() => {
  jest.clearAllMocks()
})

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

test('authorization succeeds when a good token is provided', (done) => {
  const firebaseUser = {
    uid: 'magicat77',
    email: 'meow@hogwarts.com',
    email_verified: true
  }

  admin.auth.mockImplementation(() => ({
    verifyIdToken: jest.fn(() => {
      return Promise.resolve(firebaseUser)
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
      principalId: firebaseUser.uid,
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
        id: firebaseUser.uid,
        email: firebaseUser.email,
        email_verified: firebaseUser.email_verified
      }
    })
    done()
  }
  checkUserAuthorization(event, context, callback)
})

test('authorization succeeds when the user does not have an ID', (done) => {
  const userObj = {
    // missing uid
    email: 'meow@hogwarts.com',
    email_verified: true
  }

  admin.auth.mockImplementation(() => ({
    verifyIdToken: jest.fn(() => {
      return Promise.resolve(userObj)
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
