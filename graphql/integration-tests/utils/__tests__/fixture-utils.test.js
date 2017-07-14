/* eslint-env jest */

import {
    loadFixturesIntoTable,
    deleteFixturesFromTable
} from '../fixture-utils'
import fetchQuery from '../fetch-graphql'

beforeEach(async () => {
  await loadFixturesIntoTable('Users.json', 'Users')
  await loadFixturesIntoTable('Widgets.json', 'Widgets')
  await loadFixturesIntoTable('UserWidgets.json', 'UserWidgets')
})

afterEach(async () => {
  await deleteFixturesFromTable('Users.json', 'Users', 'id')
  await deleteFixturesFromTable('Widgets.json', 'Widgets', 'id')
  await deleteFixturesFromTable('UserWidgets.json', 'UserWidgets', 'userId', 'widgetId')
})

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
      }
    `
    await deleteFixturesFromTable('Users.json', 'Users', 'id')

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

  test('works for tables with both a hash and range key', async () => {
    const userId = '123abc45-12ab-12ab-12ab-123abc456def'
    // const widgetId = 'asdfghjk-asdf-asdf-asdf-asdfghjklzxc'
    const query = `
      query WidgetsViewQuery(
        $userId: String!
      ) {
        user(userId: $userId) {
          ...WidgetsContainer_user
          id
        }
      }

      fragment WidgetsContainer_user on User {
        id
        activeWidget
        widgets(first: 20, enabled: true) {
          edges {
            node {
              id
              type
              ...BookmarksWidgetContainer_widget
            }
          }
        }
      }

      fragment BookmarksWidgetContainer_widget on Widget {
        id
        name
        enabled
        visible
        data
        icon
        type
      }
    `
    await deleteFixturesFromTable('UserWidgets.json', 'UserWidgets', 'userId', 'widgetId')

    // UserWidget should not exist.
    const responseOne = await fetchQuery(query, {
      userId: `${userId}`
    })
    expect(responseOne.data.user.widgets.edges.length).toBe(0)

    // Load UserWidget fixtures.
    await loadFixturesIntoTable('UserWidgets.json', 'UserWidgets')
    const responseTwo = await fetchQuery(query, {
      userId: `${userId}`
    })
    expect(responseTwo.data.user.widgets.edges.length).toBe(1)

    // Delete fixtures. User should not exist again.
    await deleteFixturesFromTable('UserWidgets.json', 'UserWidgets', 'userId', 'widgetId')
    const responseThree = await fetchQuery(query, {
      userId: `${userId}`
    })
    expect(responseThree.data.user.widgets.edges.length).toBe(0)
  })
})
