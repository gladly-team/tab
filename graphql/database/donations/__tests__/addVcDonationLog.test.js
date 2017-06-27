/* eslint-env jest */

import mockDatabase from '../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../utils/test-utils'
import { addVcDonationLog, VcDonationLog } from '../vcDonationLog'

jest.mock('../../database', () => {
  return mockDatabase
})

function setup () {
  mockDatabase.init()
  return mockDatabase
}

test('add vc donation log', () => {
  const database = setup()

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.PUT, (params) => {})
  )

  const userId = '45bbefbf-63d1-4d36-931e-212fbe2bc3d9'
  const charityId = 'fb5082cc-151a-4a9a-9289-06906670fd4e'
  const vcDonated = 20

  return addVcDonationLog(userId, charityId, vcDonated)
    .then(response => {
      expect(response).not.toBe(null)
      expect(response.Item).not.toBe(null)
      expect(response.Item instanceof VcDonationLog).toBe(true)
      expect(response.Item.id).toBe(userId)
      expect(response.Item.charityId).toBe(charityId)
      expect(response.Item.vcDonated).toBe(vcDonated)
      expect(response.Item.timestamp).not.toBe(null)
    })
})
