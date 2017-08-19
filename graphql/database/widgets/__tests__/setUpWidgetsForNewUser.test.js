/* eslint-env jest */

import setUpWidgetsForNewUser from '../setUpWidgetsForNewUser'
import {
  updateWidgetEnabled
} from '../updateWidget'
import {
  getMockUserContext
} from '../../test-utils'

jest.mock('../updateWidget')

const userContext = getMockUserContext()
const userId = userContext.id

describe('setUpWidgetsForNewUser', () => {
  it('calls expected functions', async () => {
    const returnedVal = await setUpWidgetsForNewUser(userContext, userId)
    expect(updateWidgetEnabled.mock.calls).toEqual([
      [userContext, userId, 'book7d35-639b-49d4-a822-116cc7e5c2e2', true],
      [userContext, userId, 'notecb66-c544-465c-96e9-20646060d8d2', true],
      [userContext, userId, 'search0f-36c8-45d8-a91c-e5b6051b0d6d', true]
    ])
    expect(returnedVal).toBe(true)
  })
})
