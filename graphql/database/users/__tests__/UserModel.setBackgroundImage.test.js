/* eslint-env jest */

import UserModel from '../UserModel'
import {
  USER_BACKGROUND_OPTION_PHOTO,
  USER_BACKGROUND_OPTION_CUSTOM
} from '../../constants'
import {
  getMockUserObj,
  mockQueryMethods
} from '../../test-utils'

// Return a mock background image.
const mockImage = {
  id: 'fb5082cc-151a-4a9a-9289-06906670fd4e',
  updated: '2017-07-18T20:45:53Z',
  created: '2017-07-18T20:45:53Z',
  name: 'Mountain Lake',
  fileName: 'lake.jpg',
  timestamp: '2017-08-01T21:35:48Z'
}
jest.mock('../../backgroundImages/backgroundImage', () => ({
  getBackgroundImage: () => mockImage
}))

const user = getMockUserObj()
mockQueryMethods(UserModel)

beforeEach(() => {
  jest.clearAllMocks()
})

describe('setBackgroundImage', () => {
  it('works as expected', async () => {
    const userId = user.id
    const imageId = 'abc-123'
    const mode = USER_BACKGROUND_OPTION_PHOTO
    await UserModel.setBackgroundImage(user, userId, imageId, mode)
    expect(UserModel.update).toHaveBeenCalledWith(user, {
      id: userId,
      backgroundImage: mockImage,
      backgroundOption: USER_BACKGROUND_OPTION_PHOTO
    })
  })

  it('defaults to photo mode if no mode is provided', async () => {
    const userId = user.id
    const imageId = 'abc-123'
    const mode = null
    await UserModel.setBackgroundImage(user, userId, imageId, mode)
    expect(UserModel.update).toHaveBeenCalledWith(user, {
      id: userId,
      backgroundImage: mockImage,
      backgroundOption: USER_BACKGROUND_OPTION_PHOTO
    })
  })

  it('uses another mode if provided', async () => {
    const userId = user.id
    const imageId = 'abc-123'
    const mode = USER_BACKGROUND_OPTION_CUSTOM
    await UserModel.setBackgroundImage(user, userId, imageId, mode)
    expect(UserModel.update).toHaveBeenCalledWith(user, {
      id: userId,
      backgroundImage: mockImage,
      backgroundOption: USER_BACKGROUND_OPTION_CUSTOM
    })
  })
})
