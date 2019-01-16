/* eslint-env jest */
/* global jasmine */

import { loadFixtures, deleteFixtures } from '../utils/fixture-utils'
import { deleteUser, getNewAuthedUser } from '../utils/auth-utils'
import fetchQuery from '../utils/fetch-graphql'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 180e3

let username = null
let userId = null
let userIdToken = null
const fixtureUserId = 'gqltest1-12ab-12ab-12ab-123abc456def'

beforeAll(async () => {
  // Create a authed user.
  const userInfo = await getNewAuthedUser()
  userId = userInfo.userId
  userIdToken = userInfo.idToken
  username = userInfo.username
})

afterAll(async () => {
  // Delete the authed user.
  await deleteUser(username)
})

beforeEach(async () => {
  // Load fixtures, replacing one of the hardcoded user IDs
  // with the authed user's ID.
  await loadFixtures('users', [{ before: fixtureUserId, after: userId }])
})

afterEach(async () => {
  await deleteFixtures('users', [{ before: fixtureUserId, after: userId }])
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
    const response = await fetchQuery(
      query,
      {
        userId,
      },
      userIdToken
    )
    expect(response.data.user.userId).toBe(userId)
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
      userId,
    })
    expect(response.data).toBeUndefined()
    expect(response.message).toBe('Unauthorized')
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
    const response = await fetchQuery(
      query,
      {
        userId: 'gqltest1-yz89-yz80-yz80-xyz789tuv456', // another user
      },
      userIdToken
    )
    expect(response.data.user).toBeNull()
    expect(response.errors[0].message).toContain('Internal Error: ')
  }, 60e3)

  // // TODO
  // it('allows new user creation', async () => {)
  // }, 60e3)

  // // TODO
  // it('does not allow new user creation with a different user ID then then authed user ID', async () => {
  // }, 60e3)
})
