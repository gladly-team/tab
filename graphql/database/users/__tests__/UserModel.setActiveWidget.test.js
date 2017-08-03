/* eslint-env jest */

import UserModel from '../UserModel'
import {
  getMockUserObj,
  mockQueryMethods
} from '../../test-utils'

const user = getMockUserObj()
mockQueryMethods(UserModel)

describe('setActiveWidget', () => {
  it('works as expected', async () => {
    const widgetId = 'abcdefgh-12ab-12ab-12ab-123abc456def'
    await UserModel.setActiveWidget(user, user.id, widgetId)
    expect(UserModel.update).toHaveBeenCalledWith(user, {
      id: user.id,
      activeWidget: widgetId
    })
  })
})
