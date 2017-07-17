/* eslint-env jest */

import {
  loadFixtures,
  deleteFixtures
} from '../utils/fixture-utils'
import {
  deleteUser,
  getNewAuthedUser
} from '../utils/auth-utils'
import fetchQuery from '../utils/fetch-graphql'

describe('GraphQL with authorized user', () => {
  var cognitoUsername = null
  var cognitoUserId = null
  var cognitoUserIdToken = null
  const origUserId = 'xyz789vw-yz89-yz80-yz80-xyz789tuv456'

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
      { before: origUserId, after: cognitoUserId }
    ])
  })

  afterEach(async () => {
    await deleteFixtures('users', [
      { before: origUserId, after: cognitoUserId }
    ])
  })

  test('it fetches the user when authorized', async () => {
    const response = await fetchQuery(`
      query UserViewQuery(
        $userId: String!
      ) {
        user(userId: $userId) {
          userId
          username
        }
      }`,
      {
        userId: cognitoUserId
      },
      cognitoUserIdToken
    )
    expect(response.data.user.userId).toBe(cognitoUserId)
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
    const response = await fetchQuery(`
      query UserViewQuery(
        $userId: String!
      ) {
        user(userId: $userId) {
          username
        }
      }`,
      {
        userId: 'xyz789vw-yz89-yz80-yz80-xyz789tuv456'
      }
    )
    expect(response.message).toBe('Unauthorized')
    expect(response.data).toBeUndefined()
  })

  test('it fails with a false user ID token', async () => {
    const response = await fetchQuery(`
      query UserViewQuery(
        $userId: String!
      ) {
        user(userId: $userId) {
          username
        }
      }`,
      {
        userId: 'xyz789vw-yz89-yz80-yz80-xyz789tuv456'
      },
      'falsetoken123falsetoken123falsetoken123falsetoken123'
    )
    expect(response.message).toBe('Unauthorized')
    expect(response.data).toBeUndefined()
  })
})
