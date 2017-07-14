/* eslint-env jest */

import {
    loadFixturesIntoTable,
    deleteFixturesFromTable
} from '../utils/fixture-utils'
import fetchQuery from '../utils/fetch-graphql'

describe('GraphQL authorization', () => {
  // TODO: actually use authorization
  test('it fetches the user when authorized', async () => {
    await loadFixturesIntoTable('Users.json', 'Users')
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
    expect(response.data.user.username).toBe('susan')
    await deleteFixturesFromTable('Users.json', 'Users', 'id')
  })
})
