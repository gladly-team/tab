/* eslint-env jest */

import getUserNotifications from '../getUserNotifications'
import { getMockUserContext, getMockUserInstance } from '../../test-utils'

const userContext = getMockUserContext()
const user = getMockUserInstance()

describe('getUserNotifications', () => {
  it('returns the expected notifications data', async () => {
    expect.assertions(1)
    const notifications = await getUserNotifications(userContext, user)
    expect(notifications).toEqual([{ code: 'userSurvey2022' }])
  })
})
