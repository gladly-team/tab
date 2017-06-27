/* eslint-env jest */

import mockDatabase from '../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../utils/test-utils'
import charities from '../../__mocks__/fixtures/charities'
import { getCharity, Charity } from '../charity'

jest.mock('../../database', () => {
  return mockDatabase
})

function setup () {
  mockDatabase.init()
  return mockDatabase
}

test('fetch user by id', () => {
  const database = setup()

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.GET, (params) => {
      return { Item: charities[0] }
    })
  )

  return getCharity('fb5082cc-151a-4a9a-9289-06906670fd4e')
    .then(charity => {
      expect(charity).not.toBe(null)
      expect(charity instanceof Charity).toBe(true)
      expect(charity.id).toBe('fb5082cc-151a-4a9a-9289-06906670fd4e')
      expect(charity.name).toBe('Water.org')
      expect(charity.category).toBe('Water')
    })
})
