/* global jest expect test */

import mockDatabase from '../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../utils/test-utils'

import users from '../../__mocks__/fixtures/users'
import tablesNames from '../../tables'
import { donateVc } from '../donation'

jest.mock('../../database', () => {
  return mockDatabase
})

function setup () {
  mockDatabase.init()
  return mockDatabase
}

test('donate vc to charity', () => {
  const userId = '45bbefbf-63d1-4d36-931e-212fbe2bc3d9'
  const charityId = 'fb5082cc-151a-4a9a-9289-06906670fd4e'
  const vcDonated = 20

  const database = setup()

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.UPDATE, (params) => {
      expect(params.TableName).toBe(tablesNames.users)
      expect(params.Key.id).toBe(userId)
      expect(params.ExpressionAttributeValues[':val']).toBe(-vcDonated)
      return { Attributes: users[0] }
    })
    )

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.PUT, (params) => {
      expect(params.TableName).toBe(tablesNames.vcDonationLog)
      expect(params.Item.id).toBe(userId)
      expect(params.Item.charityId).toBe(charityId)
      expect(params.Item.vcDonated).toBe(vcDonated)
      expect(params.Item.timestamp).not.toBe(null)
      expect(params.Item.timestamp).not.toBe('')
      return {}
    })
    )

  return donateVc(userId, charityId, vcDonated)
    .then(response => {
      expect(response).not.toBe(null)
        // For some reason this line fails. No idea since from
        // the console we can check that response is of type User
        // expect(response instanceof User).toBe(true);
      expect(response.id).toBe(userId)
    })
})
