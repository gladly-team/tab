/* eslint-env jest */

import uuid from 'uuid/v4'
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
jest.mock('uuid/v4')

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

describe('updateMissionNotification', () => {
  it('updates UserToMission model', async () => {
    const defaultUserContext = getMockUserContext()
    await deleteUser(defaultUserContext, userInfo.id)

    userWidgetsToGet.forEach(widget =>
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
