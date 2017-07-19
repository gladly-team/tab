/* eslint-env jest */
/* global jasmine */

import {
    loadFixtures,
    deleteFixtures
} from '../utils/fixture-utils'
import {
  deleteUser,
  getNewAuthedUser
} from '../utils/auth-utils'
import fetchQuery from '../utils/fetch-graphql'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 180e3

var cognitoUsername = null
var cognitoUserId = null
var cognitoUserIdToken = null
const fixtureUserId = 'gqltest1-12ab-12ab-12ab-123abc456def'

beforeAll(async () => {
  // Create a Cognito user.
  const userInfo = await getNewAuthedUser()
  cognitoUserId = userInfo.userId
  cognitoUserIdToken = userInfo.idToken
  cognitoUsername = userInfo.username
})

afterAll(async () => {
  // Delete the Cognito user.
  await deleteUser(cognitoUsername)
})

beforeEach(async () => {
  // Load fixtures, replacing one of the hardcoded user IDs
  // with the Cognito user's ID.
  await loadFixtures('users', [
    { before: fixtureUserId, after: cognitoUserId }
  ])
})

afterEach(async () => {
  await deleteFixtures('users', [
    { before: fixtureUserId, after: cognitoUserId }
  ])
})

describe('User table queries', () => {
  it('allows read access for the user', async () => {
    const query = `
      query UserViewQuery(
        $userId: String!) {
          user(userId: $userId) {
            userId
            username
            vcCurrent
            vcAllTime
            email
          }
      }
    `
    const response = await fetchQuery(query, {
      userId: cognitoUserId
    }, cognitoUserIdToken)
    expect(response.data.user.userId).toBe(cognitoUserId)
    expect(response.data.user.username).toBe('kevin')
    expect(response.data.user.email).toBe('foo@bar.com')
  }, 60e3)

  it('does not allow read access without a token', async () => {
    const query = `
      query UserViewQuery(
        $userId: String!) {
          user(userId: $userId) {
            userId
            username
            vcCurrent
            vcAllTime
            email
          }
      }
    `
    const response = await fetchQuery(query, {
      userId: cognitoUserId
    })
    expect(response.message).toBe('Unauthorized')
    expect(response.data).toBeUndefined()
  }, 60e3)

  it('does not allow a user to fetch another user', async () => {
    const query = `
      query UserViewQuery(
        $userId: String!) {
          user(userId: $userId) {
            userId
            username
            vcCurrent
            vcAllTime
            email
          }
      }
    `
    const response = await fetchQuery(query, {
      userId: 'gqltest1-yz89-yz80-yz80-xyz789tuv456' // another user
    }, cognitoUserIdToken)
    expect(response.message).toBe('Unauthorized')
    expect(response.data).toBeUndefined()
  }, 60e3)
})
