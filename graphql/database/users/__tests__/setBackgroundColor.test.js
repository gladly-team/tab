/* eslint-env jest */

import UserModel from '../UserModel'
import setBackgroundColor from '../setBackgroundColor'
import {
  USER_BACKGROUND_OPTION_COLOR
} from '../../constants'
import {
  getMockUserContext,
  mockQueryMethods
} from '../../test-utils'

const user = getMockUserContext()
mockQueryMethods(UserModel)

describe('setBackgroundColor', () => {
  it('works as expected', async () => {
    const color = '#FFF'
    await setBackgroundColor(user, user.id, color)
    expect(UserModel.update).toHaveBeenCalledWith(user, {
      id: user.id,
      backgroundColor: '#FFF',
      backgroundOption: USER_BACKGROUND_OPTION_COLOR
    })
  })
})
