/* eslint-env jest */

import moment from 'moment'
import updateUserWidgetEnabled from '../updateUserWidgetEnabled'
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

describe('updateUserWidgetEnabled', () => {
  it('works as expected', async () => {
    const userInfo = getMockUserInfo()
    const userWidget = new UserWidgetModel({
      userId: userInfo.id,
      widgetId: 'ab5082cc-151a-4a9a-9289-06906670fd4e',
      enabled: true
    })
    const expectedWidget = Object.assign({}, userWidget, {
      enabled: false,
      updated: moment.utc().toISOString()
    })
    setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: expectedWidget
      }
    )

    const userWidgetUpdateMethod = jest.spyOn(UserWidgetModel, 'update')
    const updatedWidget = await updateUserWidgetEnabled(userContext, userInfo.id,
      userWidget.widgetId, false)
    expect(userWidgetUpdateMethod)
      .toHaveBeenCalledWith(userContext, {
        userId: userInfo.id,
        widgetId: userWidget.widgetId,
        updated: moment.utc().toISOString(),
        enabled: false
      })
    expect(updatedWidget).toEqual(expectedWidget)
  })

  it('tries to create the object if it does not already exist', async () => {
    expect.assertions(1)

    const userInfo = getMockUserInfo()
    const userWidgetCreate = jest.spyOn(UserWidgetModel, 'create')

    // Set that the item doesn't exist when updating.
    setMockDBResponse(
      DatabaseOperation.UPDATE,
      null,
      { code: 'ConditionalCheckFailedException' }
    )

    // Set the return for the created object.
    const userWidget = new UserWidgetModel({
      userId: userInfo.id,
      widgetId: 'ab5082cc-151a-4a9a-9289-06906670fd4e',
      enabled: false
    })
    const newEnabledStatus = true
    const expectedWidget = Object.assign({}, userWidget, {
      enabled: newEnabledStatus,
      updated: moment.utc().toISOString()
    })
    setMockDBResponse(
      DatabaseOperation.CREATE,
      {
        Attributes: expectedWidget
      }
    )

    await updateUserWidgetEnabled(userContext, userInfo.id,
      userWidget.widgetId, newEnabledStatus)
    expect(userWidgetCreate).toHaveBeenCalledWith(userContext, {
      userId: userInfo.id,
      widgetId: userWidget.widgetId,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
      enabled: newEnabledStatus
    })
  })

  it('returns the created object if it does not already exist', async () => {
    expect.assertions(1)

    const userInfo = getMockUserInfo()

    // Set that the item doesn't exist when updating.
    setMockDBResponse(
      DatabaseOperation.UPDATE,
      null,
      { code: 'ConditionalCheckFailedException' }
    )

    // Set the return for the created object.
    const userWidget = new UserWidgetModel({
      userId: userInfo.id,
      widgetId: 'ab5082cc-151a-4a9a-9289-06906670fd4e',
      enabled: false
    })
    const newEnabledStatus = true
    const expectedWidget = Object.assign({}, userWidget, {
      enabled: newEnabledStatus,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString()
    })
    setMockDBResponse(
      DatabaseOperation.CREATE,
      {
        Attributes: expectedWidget
      }
    )

    const returnedUserWidget = await updateUserWidgetEnabled(userContext,
      userInfo.id, userWidget.widgetId, newEnabledStatus)
    expect(returnedUserWidget).toEqual(expectedWidget)
  })

  it('throws when there is an update error other than failed conditional check', async () => {
    expect.assertions(1)

    const userInfo = getMockUserInfo()
    const widgetId = 'ab5082cc-151a-4a9a-9289-06906670fd4e'

    // Set some other update error.
    setMockDBResponse(
      DatabaseOperation.UPDATE,
      null,
      { code: 'SomethingElse' }
    )

    return expect(updateUserWidgetEnabled(userContext,
        userInfo.id, widgetId, true))
      .rejects.toThrow()
  })

  it('throws when there is a create error', async () => {
    expect.assertions(1)

    const userInfo = getMockUserInfo()
    const widgetId = 'ab5082cc-151a-4a9a-9289-06906670fd4e'

    // Set that the item doesn't exist when updating.
    setMockDBResponse(
      DatabaseOperation.UPDATE,
      null,
      { code: 'ConditionalCheckFailedException' }
    )

    // Set some error during creation.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      { code: 'SomethingWentWrong' }
    )

    return expect(updateUserWidgetEnabled(userContext,
        userInfo.id, widgetId, true))
      .rejects.toThrow()
  })
})
