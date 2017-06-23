/* global expect jest describe it */

import mockDatabase from '../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../utils/test-utils'
import tablesNames from '../../tables'
import { ReferralData, logReferralData } from '../referralData'

jest.mock('../../database', () => {
  return mockDatabase
})

function setup () {
  mockDatabase.init()
  return mockDatabase
}

describe('ReferralData class', function () {
  it('getTable name to be implemented', () => {
    expect(ReferralData.getTableName()).toBe(tablesNames.referralDataLog)
  })

  it('getFields to be implemented', () => {
    const expected = [
      'referringUser',
      'timestamp'
    ]

    expect(ReferralData.getFields().length).toBe(expected.length)
    expect(ReferralData.getFields()).toEqual(expect.arrayContaining(expected))
  })

  it('auto create id', () => {
    const refData = new ReferralData(null)
    expect(refData.id).not.toBe(null)
  })

  it('create with existing user id and referring user id', () => {
    const refData = new ReferralData('userId', 'referringUserId')
    expect(refData.id).toBe('userId')
    expect(refData.referringUser).toBe('referringUserId')
  })

  it('deserialize to be implemented', () => {
    const refData = ReferralData.deserialize({
      id: 1,
      referringUser: 2
    })

    expect(refData instanceof ReferralData).toBe(true)
    expect(refData.id).toBe(1)
    expect(refData.referringUser).toBe(2)
  })

  it('should log referral data', () => {
    const database = setup()
    const userId = '45bbefbf-63d1-4d36-931e-212fbe2bc3d9'
    const referringUserId = 'fb5082cc-151a-4a9a-9289-06906670fd4e'
    const referralData = {
      referringUser: referringUserId
    }

    database.pushDatabaseOperation(
      new DatabaseOperation(OperationType.PUT, (params) => {
        const item = params.Item
        expect(item.id).toBe(userId)
        expect(item.referringUser).toBe(referringUserId)
        return { Item: item }
      })
    )

    return logReferralData(userId, referralData)
                .then(refDataLog => { return refDataLog })
  })
})
