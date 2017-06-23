/* eslint-env jest */

import mockDatabase from '../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../utils/test-utils'
import users from '../../__mocks__/fixtures/users'
import { getUser, User } from '../user'

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
      return { Item: users[0] }
    })
  )

  return getUser('45bbefbf-63d1-4d36-931e-212fbe2bc3d9')
    .then(user => {
      expect(user).not.toBe(null)
      expect(user instanceof User).toBe(true)
      expect(user.id).toBe('45bbefbf-63d1-4d36-931e-212fbe2bc3d9')
      expect(user.username).toBe('raulchall')
      expect(user.email).toBe('raul@tfac.com')
      expect(user.vcCurrent).toBe(100)
    })
})
