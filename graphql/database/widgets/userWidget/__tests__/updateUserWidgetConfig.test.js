/* eslint-env jest */

import moment from 'moment'
import updateUserWidgetConfig from '../updateUserWidgetConfig'
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

describe('updateUserWidgetConfig', () => {
  it('works as expected', async () => {
    expect.assertions(2)

    const userInfo = getMockUserInfo()
    const userWidget = new UserWidgetModel({
      userId: userInfo.id,
      widgetId: 'ab5082cc-151a-4a9a-9289-06906670fd4e',
      enabled: true,
      config: {
        foo: 'bar'
      }
    })
    const newConfig = { foo: 'boop' }
    const expectedWidget = Object.assign({}, userWidget, {
      config: newConfig,
      updated: moment.utc().toISOString()
    })
    setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: expectedWidget
      }
    )

    const userWidgetUpdateMethod = jest.spyOn(UserWidgetModel, 'update')
    const updatedWidget = await updateUserWidgetConfig(userContext, userInfo.id,
      userWidget.widgetId, newConfig)
    expect(userWidgetUpdateMethod)
      .toHaveBeenCalledWith(userContext, {
        userId: userInfo.id,
        widgetId: userWidget.widgetId,
        updated: moment.utc().toISOString(),
        config: newConfig
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
      enabled: false,
      config: {
        foo: 'bar'
      }
    })
    const newConfig = { foo: 'boop' }
    const expectedWidget = Object.assign({}, userWidget, {
      config: newConfig,
      updated: moment.utc().toISOString()
    })
    setMockDBResponse(
      DatabaseOperation.CREATE,
      {
        Attributes: expectedWidget
      }
    )

    await updateUserWidgetConfig(userContext, userInfo.id,
      userWidget.widgetId, newConfig)
    expect(userWidgetCreate).toHaveBeenCalledWith(userContext, {
      userId: userInfo.id,
      widgetId: userWidget.widgetId,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
      config: newConfig
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
      enabled: false,
      config: {
        foo: 'bar'
      }
    })
    const newConfig = { foo: 'boop' }
    const expectedWidget = Object.assign({}, userWidget, {
      config: newConfig,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString()
    })
    setMockDBResponse(
      DatabaseOperation.CREATE,
      {
        Attributes: expectedWidget
      }
    )

    const returnedUserWidget = await updateUserWidgetConfig(userContext,
      userInfo.id, userWidget.widgetId, newConfig)
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

    return expect(updateUserWidgetConfig(userContext,
        userInfo.id, widgetId, { some: 'config' }))
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

    return expect(updateUserWidgetConfig(userContext,
        userInfo.id, widgetId, { some: 'config' }))
      .rejects.toThrow()
  })
})
