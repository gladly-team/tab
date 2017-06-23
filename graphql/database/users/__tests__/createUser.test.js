/* global expect jest describe it */

import moment from 'moment'
import mockDatabase from '../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../utils/test-utils'

jest.mock('../../database', () => {
  return mockDatabase
})

var mockLogReferralData = jest.fn((userId, data) => {
  return Promise.resolve(true)
})

jest.mock('../../referrals/referralData', () => {
  return {
    logReferralData: mockLogReferralData
  }
})

const _user = require('../user')

let User = _user.User
let createUser = _user.createUser

function setup () {
  mockDatabase.init()
  return mockDatabase
}

describe('Create new user tests', function () {
  it('should create a new user', () => {
    const database = setup()
    const userId = '45bbefbf-63d1-4d36-931e-212fbe2bc3d9'
    const userEmail = 'testuser@gladly.io'

    const defaultBackgroundImage = {
      id: 'fb5082cc-151a-4a9a-9289-06906670fd4e',
      name: 'Mountain Lake',
      fileName: 'lake.jpg',
      timestamp: moment.utc().format()
    }

    database.pushDatabaseOperation(
            new DatabaseOperation(OperationType.PUT, (params) => {
              return { Item: params.Item }
            })
        )

    const userData = new User(userId)
    userData.email = userEmail

    return createUser(userData)
        .then(user => {
          expect(user).not.toBe(null)
          expect(user instanceof User).toBe(true)
          expect(user.id).toBe(userId)
          expect(user.username).toBe(null)
          expect(user.email).toBe(userEmail)

          expect(user.vcCurrent).toBe(0)
          expect(user.vcAllTime).toBe(0)
          expect(user.level).toBe(1)
          expect(user.heartsUntilNextLevel).toBe(5)

          expect(user.backgroundImage.id).toBe(defaultBackgroundImage.id)
          expect(user.backgroundImage.name).toBe(defaultBackgroundImage.name)
          expect(user.backgroundImage.fileName).toBe(defaultBackgroundImage.fileName)

          expect(user.backgroundOption).toBe(User.BACKGROUND_OPTION_PHOTO)
          expect(user.customImage).toBe(null)
          expect(user.backgroundColor).toBe(null)
        })
  })

  it('should call to log the referral data', () => {
    const database = setup()
    const userId = '45bbefbf-63d1-4d36-931e-212fbe2bc3d9'
    const userEmail = 'testuser@gladly.io'

    database.pushDatabaseOperation(
            new DatabaseOperation(OperationType.PUT, (params) => {
              return { Item: params.Item }
            })
        )

    const userData = new User(userId)
    userData.email = userEmail

    const referralData = 'referral-data'

    return createUser(userData, referralData)
        .then(user => {
          const referralLogCalls = mockLogReferralData.mock.calls.length
          expect(referralLogCalls).toBe(1)

          const referralLog = mockLogReferralData.mock
                  .calls[mockLogReferralData.mock.calls.length - 1]

          expect(referralLog[0]).toBe(userId)
          expect(referralLog[1]).toBe(referralData)
        })
  })
})
