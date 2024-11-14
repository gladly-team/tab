/* eslint-env jest */

import { v4 as uuid } from 'uuid'
import moment from 'moment'

import UserModel from '../UserModel'
import deleteUser from '../deleteUser'
import {
  getMockUserContext,
  getMockUserInfo,
  mockDate,
  clearAllMockDBResponses,
} from '../../test-utils'
import constructFullWidget from '../../widgets/constructFullWidget'
import BaseWidgetModel from '../../widgets/baseWidget/BaseWidgetModel'
import UserWidgetModel from '../../widgets/userWidget/UserWidgetModel'
import getWidgets from '../../widgets/getWidgets'

jest.mock('../../databaseClient')
jest.mock('../../widgets/getWidgets')
jest.mock('uuid')

beforeAll(() => {
  mockDate.on(null, { mockCurrentTimeOnly: true })
})

afterAll(() => {
  mockDate.off()
})

afterEach(() => {
  jest.clearAllMocks()
  clearAllMockDBResponses()
})

describe('deleteUser', () => {
  it('successful delete updates widgets and scrubs email/username as expected', async () => {
    const widgetId = 'ab5082cc-151a-4a9a-9289-06906670fd40'
    const widgetId2 = 'ab5082cc-151a-4a9a-9289-06906670fd41'

    const userInfo = getMockUserInfo()
    expect.assertions(3)

    // Set mock query responses.
    const userWidgetsToGet = [
      new UserWidgetModel({
        userId: userInfo.id,
        widgetId,
      }),
      new UserWidgetModel({
        userId: userInfo.id,
        widgetId: widgetId2,
      }),
    ]
    const baseWidgetsToGet = [
      new BaseWidgetModel({
        id: widgetId,
        position: 2,
      }),
      new BaseWidgetModel({
        id: widgetId2,
        position: 1,
      }),
    ]
    const sortedFullWidgets = [
      constructFullWidget(userWidgetsToGet[1], baseWidgetsToGet[1]),
      constructFullWidget(userWidgetsToGet[0], baseWidgetsToGet[0]),
    ]
    getWidgets.mockResolvedValueOnce(sortedFullWidgets)

    const uuidVal = 'ab5082cc-151a-4a9a-9289-06906670fd42'
    uuid.mockReturnValueOnce(uuidVal)

    const updateMethod = jest.spyOn(UserModel, 'update')
    const userWidgetUpdateMethod = jest.spyOn(UserWidgetModel, 'update')

    const defaultUserContext = getMockUserContext()
    defaultUserContext.authTime = moment.utc().unix()
    await deleteUser(defaultUserContext, userInfo.id)

    userWidgetsToGet.forEach((widget) =>
      expect(userWidgetUpdateMethod).toHaveBeenCalledWith(defaultUserContext, {
        userId: userInfo.id,
        widgetId: widget.widgetId,
        enabled: false,
        data: {},
        config: {},
        updated: moment.utc().toISOString(),
      })
    )

    expect(updateMethod).toHaveBeenCalledWith(defaultUserContext, {
      id: userInfo.id,
      email: `deleted-${uuidVal}@example.com`,
      username: `deleted-${uuidVal}`,
      backgroundImage: UserModel.fieldDefaults.backgroundImage(),
      deleted: true,
      updated: moment.utc().toISOString(),
    })
  })
})
