/* eslint-env jest */

import setUpWidgetsForNewUser from '../setUpWidgetsForNewUser'
import UserWidgetModel from '../userWidget/UserWidgetModel'
import {
  addTimestampFieldsToItem,
  getMockUserContext,
  mockDate,
} from '../../test-utils'

jest.mock('../../databaseClient')

const userContext = getMockUserContext()
const userId = userContext.id

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('setUpWidgetsForNewUser', () => {
  it('sets up all the widgets we expect', async () => {
    const userWidgetModelCreate = jest.spyOn(UserWidgetModel, 'create')
    const returnedVal = await setUpWidgetsForNewUser(userContext, userId)

    expect(userWidgetModelCreate).toHaveBeenCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userId,
        widgetId: 'a8cfd733-639b-49d4-a822-116cc7e5c2e2',
        enabled: true,
      })
    )
    expect(userWidgetModelCreate).toHaveBeenCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userId,
        widgetId: '63859963-f691-42f6-bc80-ac83eddc4104',
        enabled: true,
      })
    )
    expect(userWidgetModelCreate).toHaveBeenCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userId,
        widgetId: '4f254eca-36c8-45d8-a91c-e5b6051b0d6d',
        enabled: true,
      })
    )
    expect(userWidgetModelCreate).toHaveBeenCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userId,
        widgetId: '8b5e572b-7f44-45ea-965b-55e6a22ca190',
        enabled: true,
      })
    )
    expect(userWidgetModelCreate).toHaveBeenCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userId,
        widgetId: 'b7645e93-62d0-4293-83fc-c19d499eaefe',
        enabled: false,
      })
    )
    expect(returnedVal).toBe(true)
  })

  it('returns true when there are no errors', async () => {
    const returnedVal = await setUpWidgetsForNewUser(userContext, userId)
    expect(returnedVal).toBe(true)
  })
})
