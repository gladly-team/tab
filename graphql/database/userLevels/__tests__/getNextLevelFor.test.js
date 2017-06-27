/* eslint-env jest */

import mockDatabase from '../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../utils/test-utils'
import { getNextLevelFor, UserLevel } from '../userLevel'

jest.mock('../../database', () => {
  return mockDatabase
})

function setup () {
  mockDatabase.init()
  return mockDatabase
}

test('get next level consecutive level', () => {
  const database = setup()

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.BATCHGET, (params) => {
      const response = {}
      response['Responses'] = {}
      response['Responses'][UserLevel.getTableName()] = [
        {
          id: 2,
          hearts: 100
        },
        {
          id: 3,
          hearts: 200
        },
        {
          id: 4,
          hearts: 300
        },
        {
          id: 5,
          hearts: 400
        }
      ]
      return response
    })
  )

  return getNextLevelFor(1, 50)
      .then(level => {
        expect(level).not.toBe(null)
        expect(level.id).toBe(2)
        expect(level.hearts).toBe(100)
      })
})

test('get next level: jump multiple levels in first batch', () => {
  const database = setup()

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.BATCHGET, (params) => {
      const response = {}
      response['Responses'] = {}
      response['Responses'][UserLevel.getTableName()] = [
        {
          id: 2,
          hearts: 100
        },
        {
          id: 3,
          hearts: 200
        },
        {
          id: 4,
          hearts: 300
        },
        {
          id: 5,
          hearts: 400
        }
      ]
      return response
    })
  )

  return getNextLevelFor(1, 230)
      .then(level => {
        expect(level).not.toBe(null)
        expect(level.id).toBe(4)
        expect(level.hearts).toBe(300)
      })
})

test('get next level: recursive call to another batch of levels', () => {
  const database = setup()

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.BATCHGET, (params) => {
      const response = {}
      response['Responses'] = {}
      response['Responses'][UserLevel.getTableName()] = [
        {
          id: 2,
          hearts: 100
        },
        {
          id: 3,
          hearts: 200
        }
      ]
      return response
    })
  )

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.BATCHGET, (params) => {
      const response = {}
      response['Responses'] = {}
      response['Responses'][UserLevel.getTableName()] = [
        {
          id: 4,
          hearts: 300
        },
        {
          id: 5,
          hearts: 400
        }
      ]
      return response
    })
  )

  return getNextLevelFor(1, 330)
      .then(level => {
        expect(level).not.toBe(null)
        expect(level.id).toBe(5)
        expect(level.hearts).toBe(400)
      })
})
