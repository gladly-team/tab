/* eslint-env jest */

import getUserNotifications from '../getUserNotifications'
import { getMockUserContext, getMockUserInstance } from '../../test-utils'
import getUserFeature from '../../experiments/getUserFeature'
import logger from '../../../utils/logger'

jest.mock('../../experiments/getUserFeature')
jest.mock('../../../utils/logger')

const userContext = getMockUserContext()
const user = getMockUserInstance()

describe('getUserNotifications', () => {
  it('returns the expected notifications data (no notification enabled)', async () => {
    expect.assertions(1)
    getUserFeature.mockImplementation((_userContext, _user, featureName) => {
      // By default, any inactive experiment will return this.
      return {
        featureName,
        inExperiment: false,
      }
    })
    const notifications = await getUserNotifications(userContext, user)
    expect(notifications).toEqual([])
  })

  it('returns the $1.5M raised notification when enabled', async () => {
    expect.assertions(1)
    getUserFeature.mockImplementation((_userContext, _user, featureName) => {
      if (featureName === 'one-and-half-mil-raised-notif') {
        return {
          featureName: 'one-and-half-mil-raised-notif',
          inExperiment: false,
          variation: true,
        }
      }
      return {
        featureName,
        inExperiment: false,
      }
    })
    const notifications = await getUserNotifications(userContext, user)
    expect(notifications).toEqual([{ code: '1.5Mraised' }])
  })

  it('does not return the $1.5M raised notification when not enabled', async () => {
    expect.assertions(1)
    getUserFeature.mockImplementation((_userContext, _user, featureName) => {
      if (featureName === 'one-and-half-mil-raised-notif') {
        return {
          featureName: 'one-and-half-mil-raised-notif',
          inExperiment: false,
          variation: false,
        }
      }
      return {
        featureName,
        inExperiment: false,
      }
    })
    const notifications = await getUserNotifications(userContext, user)
    expect(notifications).toEqual([])
  })

  it('logs an error and returns an empty array if something goes wrong', async () => {
    expect.assertions(2)
    getUserFeature.mockImplementationOnce(() => {
      throw new Error('Something went wrong.')
    })
    const notifications = await getUserNotifications(userContext, user)
    expect(logger.error).toHaveBeenCalledWith(
      new Error('Something went wrong.')
    )
    expect(notifications).toEqual([])
  })
})
