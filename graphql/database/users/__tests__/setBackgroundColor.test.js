/* eslint-env jest */

import moment from 'moment'
import UserModel from '../UserModel'
import setBackgroundColor from '../setBackgroundColor'
import {
  USER_BACKGROUND_OPTION_COLOR
} from '../../constants'
import {
  getMockUserContext,
  mockDate
} from '../../test-utils'

jest.mock('../../databaseClient')
const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('setBackgroundColor', () => {
  it('works as expected', async () => {
    const updateQuery = jest.spyOn(UserModel, 'update')
    const color = '#FFF'
    await setBackgroundColor(userContext, userContext.id, color)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      backgroundColor: '#FFF',
      backgroundOption: USER_BACKGROUND_OPTION_COLOR,
      updated: moment.utc().toISOString()
    })
  })
})
