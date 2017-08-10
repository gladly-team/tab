/* eslint-env jest */

import moment from 'moment'
import UserModel from '../UserModel'
import setActiveWidget from '../setActiveWidget'
import {
  DatabaseOperation,
  getMockUserContext,
  mockDate,
  setMockDBResponse
} from '../../test-utils'

jest.mock('../../databaseClient')

const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('setActiveWidget', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('works as expected', async () => {
    const updateMethod = jest.spyOn(UserModel, 'update')
    const widgetId = 'abcdefgh-12ab-12ab-12ab-123abc456def'
    await setActiveWidget(userContext, userContext.id, widgetId)
    expect(updateMethod).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      activeWidget: widgetId,
      updated: moment.utc().toISOString()
    })
  })

  it('calls the database', async () => {
    const widgetId = 'abcdefgh-12ab-12ab-12ab-123abc456def'

    const userInfo = {
      id: userContext.id,
      username: userContext.username,
      email: userContext.email
    }
    const mockUser = Object.assign({}, new UserModel(userInfo))
    const expectedReturnedUser = Object.assign({}, mockUser, {
      updated: moment.utc().toISOString()
    })
    const dbUpdateMock = setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: expectedReturnedUser
      }
    )
    const response = await setActiveWidget(userContext,
      userContext.id, widgetId)
    expect(dbUpdateMock).toHaveBeenCalled()
    expect(response).toEqual(expectedReturnedUser)
  })
})
