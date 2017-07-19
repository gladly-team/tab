/* eslint-env jest */
/* global jasmine */

import {
    loadFixtures,
    deleteFixtures
} from '../fixture-utils'
import {
  deleteUser,
  getNewAuthedUser
} from '../auth-utils'
import fetchQuery from '../fetch-graphql'

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
  await loadFixtures('widgets', [
    { before: fixtureUserId, after: cognitoUserId }
  ])
  await loadFixtures('userWidgets', [
    { before: fixtureUserId, after: cognitoUserId }
  ])
})

afterEach(async () => {
  await deleteFixtures('users', [
    { before: fixtureUserId, after: cognitoUserId }
  ])
  await deleteFixtures('widgets', [
    { before: fixtureUserId, after: cognitoUserId }
  ])
  await deleteFixtures('userWidgets', [
    { before: fixtureUserId, after: cognitoUserId }
  ])
})

describe('Fixture utils', () => {
  test('creates and deletes items as expected', async () => {
    const query = `
      query UserViewQuery(
        $userId: String!
      ) {
        user(userId: $userId) {
          username
        }
      }
    `
    await deleteFixtures('users', [
      { before: fixtureUserId, after: cognitoUserId }
    ])

    // User should not exist.
    const responseOne = await fetchQuery(query, {
      userId: cognitoUserId
    }, cognitoUserIdToken)
    expect(responseOne.data.user).toBeNull()

    // Load user fixtures. User should exist.
    await loadFixtures('users', [
      { before: fixtureUserId, after: cognitoUserId }
    ])
    const responseTwo = await fetchQuery(query, {
      userId: cognitoUserId
    }, cognitoUserIdToken)
    expect(responseTwo.data.user.username).toBe('kevin')

    // Delete fixtures. User should not exist again.
    await deleteFixtures('users', [
      { before: fixtureUserId, after: cognitoUserId }
    ])
    const responseThree = await fetchQuery(query, {
      userId: cognitoUserId
    }, cognitoUserIdToken)
    expect(responseThree.data.user).toBeNull()
  }, 60e3)

  test('works for tables with both a hash and range key', async () => {
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
    // await deleteFixtures('userWidgets', [
    //   { before: fixtureUserId, after: cognitoUserId }
    // ])

    // // UserWidget should not exist.
    // const responseOne = await fetchQuery(query, {
    //   userId: cognitoUserId
    // }, cognitoUserIdToken)
    // expect(responseOne.data.user.widgets.edges.length).toBe(0)

    // Load UserWidget fixtures.
    await loadFixtures('userWidgets', [
      { before: fixtureUserId, after: cognitoUserId }
    ])
    console.log('cognito user ID', cognitoUserId)
    const responseTwo = await fetchQuery(query, {
      userId: cognitoUserId
    }, cognitoUserIdToken)
    console.log('responseTwo', responseTwo)
    console.log('responseTwo widgets', responseTwo.data.user.widgets)
    expect(responseTwo.data.user.widgets.edges.length).toBe(1)

    // Delete fixtures. User should not exist again.
    await deleteFixtures('userWidgets', [
      { before: fixtureUserId, after: cognitoUserId }
    ])
    const responseThree = await fetchQuery(query, {
      userId: cognitoUserId
    }, cognitoUserIdToken)
    expect(responseThree.data.user.widgets.edges.length).toBe(0)
  }, 60e3)
})
