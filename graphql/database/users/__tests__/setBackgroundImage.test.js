/* eslint-env jest */

import moment from 'moment'
import UserModel from '../UserModel'
import setBackgroundImage from '../setBackgroundImage'
import BackgroundImageModel from '../../backgroundImages/BackgroundImageModel'
import {
  USER_BACKGROUND_OPTION_PHOTO,
  USER_BACKGROUND_OPTION_CUSTOM
} from '../../constants'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../../backgroundImages/BackgroundImageModel')
const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('setBackgroundImage', () => {
  it('works as expected', async () => {
    const updateQuery = jest.spyOn(UserModel, 'update')
    const userId = userContext.id
    const imageId = 'abc-123'
    const mode = USER_BACKGROUND_OPTION_PHOTO
    const mockImage = await BackgroundImageModel.get(userContext, imageId)
    await setBackgroundImage(userContext, userId, imageId, mode)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userId,
      backgroundImage: mockImage,
      backgroundOption: USER_BACKGROUND_OPTION_PHOTO,
      updated: moment.utc().toISOString()
    })
  })

  it('defaults to photo mode if no mode is provided', async () => {
    const updateQuery = jest.spyOn(UserModel, 'update')
    const userId = userContext.id
    const imageId = 'abc-123'
    const mode = null
    const mockImage = await BackgroundImageModel.get(userContext, imageId)
    await setBackgroundImage(userContext, userId, imageId, mode)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userId,
      backgroundImage: mockImage,
      backgroundOption: USER_BACKGROUND_OPTION_PHOTO,
      updated: moment.utc().toISOString()
    })
  })

  it('uses another mode if provided', async () => {
    const updateQuery = jest.spyOn(UserModel, 'update')
    const userId = userContext.id
    const imageId = 'abc-123'
    const mode = USER_BACKGROUND_OPTION_CUSTOM
    const mockImage = await BackgroundImageModel.get(userContext, imageId)
    await setBackgroundImage(userContext, userId, imageId, mode)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userId,
      backgroundImage: mockImage,
      backgroundOption: USER_BACKGROUND_OPTION_CUSTOM,
      updated: moment.utc().toISOString()
    })
  })

  it('calls the database as expected', async () => {
    const userId = userContext.id
    const imageId = 'abc-123'
    const mode = USER_BACKGROUND_OPTION_CUSTOM
    const expectedReturnedUser = getMockUserInstance()
    const dbUpdateMock = setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: expectedReturnedUser
      }
    )
    const returnedUser = await setBackgroundImage(userContext, userId, imageId, mode)
    expect(dbUpdateMock).toHaveBeenCalled()
    expect(returnedUser).toEqual(expectedReturnedUser)
  })
})
