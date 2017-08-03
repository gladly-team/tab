/* eslint-env jest */

import UserModel from '../UserModel'
import { getBackgroundImage } from '../../backgroundImages/backgroundImage'
import {
  USER_BACKGROUND_OPTION_PHOTO,
  USER_BACKGROUND_OPTION_CUSTOM
} from '../../constants'
import {
  getMockUserObj,
  mockQueryMethods
} from '../../test-utils'

jest.mock('../../backgroundImages/backgroundImage')

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
    const mockImage = await getBackgroundImage(imageId)
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
    const mockImage = await getBackgroundImage(imageId)
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
    const mockImage = await getBackgroundImage(imageId)
    await UserModel.setBackgroundImage(user, userId, imageId, mode)
    expect(UserModel.update).toHaveBeenCalledWith(user, {
      id: userId,
      backgroundImage: mockImage,
      backgroundOption: USER_BACKGROUND_OPTION_CUSTOM
    })
  })
})
