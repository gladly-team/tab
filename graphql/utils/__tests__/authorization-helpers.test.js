/* eslint-env jest */

import {
  createGraphQLContext,
  getUserClaimsFromLambdaEvent,
  isUserAuthorized,
  permissionAuthorizers,
  getPermissionsOverride,
  isValidPermissionsOverride
} from '../authorization-helpers'

describe('authorization-helpers', () => {
  it('correctly gets user claims from AWS Lambda event obj', () => {
    const claims = {
      sub: 'abcdef',
      'cognito:username': 'my-name',
      email_verified: 'true'
    }
    const minimalLambdaEventObj = {
      requestContext: {
        authorizer: {
          claims: claims
        }
      }
    }
    const fetchedClaims = getUserClaimsFromLambdaEvent(minimalLambdaEventObj)
    expect(fetchedClaims).toEqual(claims)
  })

  it('creates expected GraphQL context', () => {
    const userClaims = {
      sub: 'abcdef',
      'cognito:username': 'my-name',
      email_verified: 'true'
    }
    const expectedContext = {
      user: {
        id: 'abcdef',
        'username': 'my-name',
        'emailVerified': true
      }
    }
    const context = createGraphQLContext(userClaims)
    expect(expectedContext).toEqual(context)
  })

  it('does not authorize a user who does not have a verified email', () => {
    const userClaims = {
      sub: 'abcdef',
      'cognito:username': 'my-name',
      email_verified: 'false'
    }
    expect(isUserAuthorized(userClaims)).toBe(false)
  })

  it('does not authorize a user who does not have a username', () => {
    const userClaims = {
      sub: 'abcdef',
      email_verified: 'true'
    }
    expect(isUserAuthorized(userClaims)).toBe(false)
  })

  it('does not authorize a user who does not have an ID', () => {
    const userClaims = {
      'cognito:username': 'my-name',
      email_verified: 'true'
    }
    expect(isUserAuthorized(userClaims)).toBe(false)
  })

  it('authorizes a user who has appropriate claims', () => {
    const userClaims = {
      sub: 'abcdef',
      'cognito:username': 'my-name',
      email_verified: 'true'
    }
    expect(isUserAuthorized(userClaims)).toBe(true)
  })
})

describe('permission authorizer functions', () => {
  const user = {
    id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
    username: 'MyName',
    emailVerified: true
  }

  test('userIdMatchesHashKey works if user ID matches hash key', () => {
    expect(permissionAuthorizers.userIdMatchesHashKey(
      user, '45bbefbf-63d1-4d36-931e-212fbe2bc3d9')
    ).toBe(true)
  })

  test('userIdMatchesHashKey fails if user ID does not match hash key', () => {
    expect(permissionAuthorizers.userIdMatchesHashKey(
      user, '95bbefbf-63d1-4d36-931e-212fbe2bc3d9')
    ).toBe(false)
  })

  test('usernameMatchesHashKey works if username matches hash key', () => {
    expect(permissionAuthorizers.usernameMatchesHashKey(
      user, 'MyName')
    ).toBe(true)
  })

  test('usernameMatchesHashKey fails if username does not match hash key', () => {
    expect(permissionAuthorizers.usernameMatchesHashKey(
      user, 'NotMyName')
    ).toBe(false)
  })
})

describe('permission overrides', () => {
  test('checker returns true when the override is valid', () => {
    const override = getPermissionsOverride()
    expect(isValidPermissionsOverride(override)).toBe(true)
  })

  test('checker returns false when the override is invalid', () => {
    const override = 'WRONG-OVERRIDE'
    expect(isValidPermissionsOverride(override)).toBe(false)
  })

  test('getPermissionsOverride returns expected value', () => {
    expect(getPermissionsOverride()).toBe('PLACEHOLDER')
  })
})
