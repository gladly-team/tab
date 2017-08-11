/* eslint-env jest */

import moment from 'moment'
import updateUserWidgetData from '../updateUserWidgetData'
import UserWidgetModel from '../UserWidgetModel'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInfo,
  mockDate,
  setMockDBResponse
} from '../../../test-utils'

jest.mock('../../../databaseClient')
const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('updateUserWidgetData', () => {
  it('works as expected', async () => {
    const userInfo = getMockUserInfo()
    const userWidget = new UserWidgetModel({
      userId: userInfo.id,
      widgetId: 'ab5082cc-151a-4a9a-9289-06906670fd4e',
      enabled: true,
      data: {
        foo: 'bar'
      }
    })
    const newData = { foo: 'boop' }
    const expectedWidget = Object.assign({}, userWidget, {
      data: newData,
      updated: moment.utc().toISOString()
    })
    setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: expectedWidget
      }
    )

    const userWidgetUpdateMethod = jest.spyOn(UserWidgetModel, 'update')
    const updatedWidget = await updateUserWidgetData(userContext, userInfo.id,
      userWidget.widgetId, newData)
    expect(userWidgetUpdateMethod)
      .toHaveBeenCalledWith(userContext, {
        userId: userInfo.id,
        widgetId: userWidget.widgetId,
        updated: moment.utc().toISOString(),
        data: newData
      })
    expect(updatedWidget).toEqual(expectedWidget)
  })
})
