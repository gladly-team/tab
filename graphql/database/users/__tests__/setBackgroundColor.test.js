/* eslint-env jest */

import moment from 'moment'
import UserModel from '../UserModel'
import setBackgroundColor from '../setBackgroundColor'
import { USER_BACKGROUND_OPTION_COLOR } from '../../constants'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse,
} from '../../test-utils'

jest.mock('../../databaseClient')
const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('setBackgroundColor', () => {
  it('works as expected', async () => {
    const updateQuery = jest.spyOn(UserModel, 'update')
    const color = '#FFF'
    await setBackgroundColor(userContext, userContext.id, color)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      backgroundColor: '#FFF',
      backgroundOption: USER_BACKGROUND_OPTION_COLOR,
      updated: moment.utc().toISOString(),
    })
  })

  it('calls the database as expected', async () => {
    const userId = userContext.id
    const color = '#FFF'
    const expectedReturnedUser = getMockUserInstance()
    const dbUpdateMock = setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturnedUser,
    })
    const returnedUser = await setBackgroundColor(userContext, userId, color)
    expect(dbUpdateMock).toHaveBeenCalled()
    expect(returnedUser).toEqual(expectedReturnedUser)
  })
})
