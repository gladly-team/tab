/* eslint-env jest */

import UserModel from '../UserModel'
import {
  USER_BACKGROUND_OPTION_COLOR
} from '../../constants'
import {
  getMockUserObj,
  mockQueryMethods
} from '../../test-utils'

const user = getMockUserObj()
mockQueryMethods(UserModel)

beforeEach(() => {
  jest.clearAllMocks()
})

describe('setBackgroundColor', () => {
  it('works as expected', async () => {
    const color = '#FFF'
    await UserModel.setBackgroundColor(user, user.id, color)
    expect(UserModel.update).toHaveBeenCalledWith(user, {
      id: user.id,
      backgroundColor: '#FFF',
      backgroundOption: USER_BACKGROUND_OPTION_COLOR
    })
  })
})
