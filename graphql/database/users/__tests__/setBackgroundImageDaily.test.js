/* eslint-env jest */

import UserModel from '../UserModel'
import { getRandomImage } from '../../backgroundImages/backgroundImage'
import {
  USER_BACKGROUND_OPTION_DAILY
} from '../../constants'
import {
  getMockUserObj,
  mockQueryMethods
} from '../../test-utils'

jest.mock('../../backgroundImages/backgroundImage')

const user = getMockUserObj()
mockQueryMethods(UserModel)

describe('setBackgroundImageDaily', () => {
  it('works as expected', async () => {
    const userId = user.id
    await UserModel.setBackgroundImageDaily(user, userId)
    const mockImage = await getRandomImage()
    expect(UserModel.update).toHaveBeenCalledWith(user, {
      id: userId,
      backgroundImage: mockImage,
      backgroundOption: USER_BACKGROUND_OPTION_DAILY
    })
  })
})
