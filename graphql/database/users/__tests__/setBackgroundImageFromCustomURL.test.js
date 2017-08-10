/* eslint-env jest */

import moment from 'moment'
import UserModel from '../UserModel'
import setBackgroundImageFromCustomURL from '../setBackgroundImageFromCustomURL'
import {
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
const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('setBackgroundImageFromCustomURL', () => {
  it('works as expected', async () => {
    const updateQuery = jest.spyOn(UserModel, 'update')
    const imgUrl = 'https://imgur.com/fake-image/'
    await setBackgroundImageFromCustomURL(userContext, userContext.id, imgUrl)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      customImage: imgUrl,
      backgroundOption: USER_BACKGROUND_OPTION_CUSTOM,
      updated: moment.utc().toISOString()
    })
  })

  it('calls the database as expected', async () => {
    const imgUrl = 'https://imgur.com/fake-image/'
    const expectedReturnedUser = getMockUserInstance()
    const dbUpdateMock = setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: expectedReturnedUser
      }
    )
    const returnedUser = await setBackgroundImageFromCustomURL(userContext, userContext.id, imgUrl)
    expect(dbUpdateMock).toHaveBeenCalled()
    expect(returnedUser).toEqual(expectedReturnedUser)
  })
})
