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

  it('no longer returns the user survey notification, even when the feature is enabled', async () => {
    expect.assertions(1)
    getUserFeature.mockImplementation((_userContext, _user, featureName) => {
      if (featureName === 'user-survey-2022-notification') {
        return {
          featureName: 'user-survey-2022-notification',
          inExperiment: true,
          variation: true,
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

  it('returns the college ambassador notification when enabled', async () => {
    expect.assertions(1)
    getUserFeature.mockImplementation((_userContext, _user, featureName) => {
      if (featureName === 'college-ambassador-2022-notif') {
        return {
          featureName: 'college-ambassador-2022-notif',
          inExperiment: true,
          variation: true,
        }
      }
      return {
        featureName,
        inExperiment: false,
      }
    })
    const notifications = await getUserNotifications(userContext, user)
    expect(notifications).toEqual([{ code: 'collegeAmbassador2022' }])
  })

  it('does not return the college ambassador notification when not enabled', async () => {
    expect.assertions(1)
    getUserFeature.mockImplementation((_userContext, _user, featureName) => {
      if (featureName === 'college-ambassador-2022-notif') {
        return {
          featureName: 'college-ambassador-2022-notif',
          inExperiment: true,
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
