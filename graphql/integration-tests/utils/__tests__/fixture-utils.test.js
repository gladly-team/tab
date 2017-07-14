/* eslint-env jest */

import {
    loadFixturesIntoTable,
    deleteFixturesFromTable
} from '../fixture-utils'
import fetchQuery from '../fetch-graphql'

describe('Fixture utils', () => {
  test('creates and deletes items as expected', async () => {
    const userId = 'xyz789vw-yz89-yz80-yz80-xyz789tuv456'
    const query = `
      query UserViewQuery(
        $userId: String!
      ) {
        user(userId: $userId) {
          username
        }
      }`
    // User should not exist.
    const responseOne = await fetchQuery(query, {
      userId: `${userId}`
    })
    expect(responseOne.data.user).toBeNull()

    // Load user fixtures. User should exist.
    await loadFixturesIntoTable('Users.json', 'Users')
    const responseTwo = await fetchQuery(query, {
      userId: `${userId}`
    })
    expect(responseTwo.data.user.username).toBe('susan')

    // Delete fixtures. User should not exist again.
    await deleteFixturesFromTable('Users.json', 'Users', 'id')
    const responseThree = await fetchQuery(query, {
      userId: `${userId}`
    })
    expect(responseThree.data.user).toBeNull()
  })
})
