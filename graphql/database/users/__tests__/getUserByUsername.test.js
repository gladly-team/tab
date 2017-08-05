/* eslint-env jest */

import UserModel from '../UserModel'
import getUserByUsername from '../getUserByUsername'
import {
  getMockUserObj,
  mockQueryMethods
} from '../../test-utils'

mockQueryMethods(UserModel)
const user = getMockUserObj()

afterEach(() => {
  jest.clearAllMocks()
})

describe('getUserByUsername', () => {
  it('works as expected', async () => {
    const username = 'jonsnow'
    await getUserByUsername(user, username)
    expect(UserModel.query)
      .toHaveBeenCalledWith(user, username)
    expect(UserModel.query().usingIndex)
      .toHaveBeenCalledWith('UsersByUsername')
    expect(UserModel.query().execute)
      .toHaveBeenCalled()
  })
})
