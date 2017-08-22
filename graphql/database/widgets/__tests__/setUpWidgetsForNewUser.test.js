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
      [userContext, userId, 'a8cfd733-639b-49d4-a822-116cc7e5c2e2', true],
      [userContext, userId, '63859963-f691-42f6-bc80-ac83eddc4104', true],
      [userContext, userId, '4f254eca-36c8-45d8-a91c-e5b6051b0d6d', true]
    ])
    expect(returnedVal).toBe(true)
  })
})
