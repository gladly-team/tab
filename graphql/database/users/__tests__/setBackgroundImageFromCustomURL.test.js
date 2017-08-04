/* eslint-env jest */

import UserModel from '../UserModel'
import setBackgroundImageFromCustomURL from '../setBackgroundImageFromCustomURL'
import {
  USER_BACKGROUND_OPTION_CUSTOM
} from '../../constants'
import {
  getMockUserObj,
  mockQueryMethods
} from '../../test-utils'

const user = getMockUserObj()
mockQueryMethods(UserModel)

describe('setBackgroundImageFromCustomURL', () => {
  it('works as expected', async () => {
    const imgUrl = 'https://imgur.com/fake-image/'
    await setBackgroundImageFromCustomURL(user, user.id, imgUrl)
    expect(UserModel.update).toHaveBeenCalledWith(user, {
      id: user.id,
      customImage: imgUrl,
      backgroundOption: USER_BACKGROUND_OPTION_CUSTOM
    })
  })
})
