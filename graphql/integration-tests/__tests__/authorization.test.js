/* eslint-env jest */

import { loadFixtures, deleteFixtures } from '../utils/fixture-utils'
import { deleteUser, getNewAuthedUser } from '../utils/auth-utils'
import fetchQuery from '../utils/fetch-graphql'

describe('GraphQL with authorized user', () => {
  var username = null
  var userId = null
  var userIdToken = null
  const origUserId = 'gqltest1-yz89-yz80-yz80-xyz789tuv456'

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
    await loadFixtures('users', [{ before: origUserId, after: userId }])
  })

  afterEach(async () => {
    await deleteFixtures('users', [{ before: origUserId, after: userId }])
  })

  test('it fetches the user when authorized', async () => {
    const response = await fetchQuery(
      `
      query UserViewQuery(
        $userId: String!
      ) {
        user(userId: $userId) {
          userId
          username
        }
      }`,
      {
        userId: userId,
      },
      userIdToken
    )
    expect(response.data.user.userId).toBe(userId)
    expect(response.data.user.username).toBe('susan')
    expect(response.message).not.toBe('Unauthorized')
  })
})

describe('GraphQL with unauthorized user', () => {
  beforeEach(async () => {
    await loadFixtures('users')
  })

  afterEach(async () => {
    await deleteFixtures('users')
  })

  test('it fails without an Authorization header', async () => {
    const response = await fetchQuery(
      `
      query UserViewQuery(
        $userId: String!
      ) {
        user(userId: $userId) {
          username
        }
      }`,
      {
        userId: 'gqltest1-yz89-yz80-yz80-xyz789tuv456',
      }
    )
    expect(response.message).toBe('Unauthorized')
    expect(response.data).toBeUndefined()
  })

  test('it fails with a false user ID token', async () => {
    const response = await fetchQuery(
      `
      query UserViewQuery(
        $userId: String!
      ) {
        user(userId: $userId) {
          username
        }
      }`,
      {
        userId: 'gqltest1-yz89-yz80-yz80-xyz789tuv456',
      },
      'falsetoken123falsetoken123falsetoken123falsetoken123'
    )
    expect(response.message).toBe('Unauthorized')
    expect(response.data).toBeUndefined()
  })
})
