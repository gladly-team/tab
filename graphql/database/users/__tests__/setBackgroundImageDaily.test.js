/* eslint-env jest */

import moment from 'moment'
import UserModel from '../UserModel'
import setBackgroundImageDaily from '../setBackgroundImageDaily'
import getRandomBackgroundImage from '../../backgroundImages/getRandomBackgroundImage'
import {
  USER_BACKGROUND_OPTION_DAILY,
  BACKGROUND_IMAGE_LEGACY_CATEGORY,
} from '../../constants'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse,
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../../backgroundImages/getRandomBackgroundImage')
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
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance(),
    })
    await setBackgroundImageDaily(userContext, userId)
    const mockImage = await getRandomBackgroundImage(userContext)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userId,
      backgroundImage: {
        id: mockImage.id,
        image: mockImage.image,
        timestamp: moment.utc().toISOString(),
      },
      backgroundOption: USER_BACKGROUND_OPTION_DAILY,
      updated: moment.utc().toISOString(),
    })
  })

  it('calls the database as expected', async () => {
    const userId = userContext.id
    const expectedReturnedUser = getMockUserInstance()
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance(),
    })
    const dbUpdateMock = setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturnedUser,
    })
    const returnedUser = await setBackgroundImageDaily(userContext, userId)
    expect(dbUpdateMock).toHaveBeenCalled()
    expect(returnedUser).toEqual(expectedReturnedUser)
  })

  it('passes along the legacy category to get random background image if user is not on v4', async () => {
    const userId = userContext.id
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance({
        causeId: 'CA6A5C2uj',
      }),
    })
    await setBackgroundImageDaily(userContext, userId)
    expect(getRandomBackgroundImage).toHaveBeenCalledWith(
      userContext,
      BACKGROUND_IMAGE_LEGACY_CATEGORY
    )
  })

  it('passes along cat category to get random background image', async () => {
    const userId = userContext.id
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance({
        causeId: 'CA6A5C2uj',
        v4BetaEnabled: true,
      }),
    })
    await setBackgroundImageDaily(userContext, userId)
    expect(getRandomBackgroundImage).toHaveBeenCalledWith(userContext, 'cats')
  })

  it('passes along seas category to get random background image', async () => {
    const userId = userContext.id
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance({
        causeId: 'SGa6zohkY',
        v4BetaEnabled: true,
      }),
    })
    await setBackgroundImageDaily(userContext, userId)
    expect(getRandomBackgroundImage).toHaveBeenCalledWith(userContext, 'seas')
  })
})
