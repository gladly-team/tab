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
      [userContext, userId, '4262cc79-d192-4435-91bd-5fda9b6f7c08', true],
      [userContext, userId, '4162cc79-d192-4435-91bd-5fda9b6f7c08', true],
      [userContext, userId, 'ab58d2da-550b-414f-895a-7bcb2cbc9d62', true]
    ])
    expect(returnedVal).toBe(true)
  })
})
