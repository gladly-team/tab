/* eslint-env jest */

import {
  loadFixtures,
  deleteFixtures
} from '../utils/fixture-utils'
import {
  createUserAndLogIn,
  getMockUserInfo
} from '../utils/auth-utils'
import fetchQuery from '../utils/fetch-graphql'

beforeEach(async () => {
  await loadFixtures('users')
})

afterEach(async () => {
  await deleteFixtures('users')
})

describe('GraphQL authorization', () => {
  test('it fetches the user when authorized', async () => {
    // Get a valid Cognito id token.
    const userInfo = getMockUserInfo()
    const authResponse = await createUserAndLogIn(
      userInfo.email, userInfo.username, userInfo.password)
    const idToken = authResponse.AuthenticationResult.IdToken

    // TODO: need to load valid fixtures with Cognito user ID.
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
      idToken
    )
    console.log(response)
    expect(response.message).not.toBe('Unauthorized')
    expect(response.data.user.username).toBe('susan')
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
    expect(response.data).toBeNull()
  })
})
