/* eslint-env jest */

import moment from 'moment'
import UserModel from '../UserModel'
import setBackgroundImageDaily from '../setBackgroundImageDaily'
import { getRandomImage } from '../../backgroundImages/backgroundImage'
import {
  USER_BACKGROUND_OPTION_DAILY
} from '../../constants'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../../backgroundImages/backgroundImage')
const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('setBackgroundImageDaily', () => {
  it('works as expected', async () => {
    const updateQuery = jest.spyOn(UserModel, 'update')
    const userId = userContext.id
    await setBackgroundImageDaily(userContext, userId)
    const mockImage = await getRandomImage()
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userId,
      backgroundImage: mockImage,
      backgroundOption: USER_BACKGROUND_OPTION_DAILY,
      updated: moment.utc().toISOString()
    })
  })

  it('calls the database as expected', async () => {
    const userId = userContext.id
    const expectedReturnedUser = getMockUserInstance()
    const dbUpdateMock = setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: expectedReturnedUser
      }
    )
    const returnedUser = await setBackgroundImageDaily(userContext, userId)
    expect(dbUpdateMock).toHaveBeenCalled()
    expect(returnedUser).toEqual(expectedReturnedUser)
  })
})
