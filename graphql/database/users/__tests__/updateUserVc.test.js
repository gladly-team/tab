/* eslint-env jest */

import mockDatabase from '../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../utils/test-utils'
import { updateUserVc, incrementVcBy1 } from '../updateUserVc'
import moment from 'moment'

jest.mock('../../database', () => {
  return mockDatabase
})

jest.mock('../../userLevels/userLevel', () => {
  return {
    getNextLevelFor: jest.fn((level, vc) => {
      return Promise.resolve({
        id: 4,
        hearts: 400
      })
    })
  }
})

function setup () {
  mockDatabase.init()
  return mockDatabase
}

describe('ReferralData class', function () {
  it('user update vc', () => {
    const database = setup()

    database.pushDatabaseOperation(
      new DatabaseOperation(OperationType.UPDATE, (params) => {
        return {
          Attributes: {
            id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
            vcCurrent: 50,
            vcAllTime: 190,
            heartsUntilNextLevel: 10
          }
        }
      })
    )

    return updateUserVc('45bbefbf-63d1-4d36-931e-212fbe2bc3d9', 15)
      .then(data => {
        expect(data).not.toBe(null)
        expect(data.id).toBe('45bbefbf-63d1-4d36-931e-212fbe2bc3d9')
        expect(data.vcCurrent).toBe(50)
        expect(data.vcAllTime).toBe(190)
        expect(data.heartsUntilNextLevel).toBe(10)
      })
  })

  it('user level up', () => {
    const database = setup()

    const userAfterVcUpdated = new DatabaseOperation(OperationType.UPDATE, (params) => {
      return {
        Attributes: {
          id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
          level: 2,
          vcCurrent: 50,
          vcAllTime: 300,
          heartsUntilNextLevel: 0
        }
      }
    })

    const userUpdatedAfterLevelUpResolved = new DatabaseOperation(OperationType.UPDATE, (params) => {
      expect(params.ExpressionAttributeValues[':level']).toBe(3)
      expect(params.ExpressionAttributeValues[':nextLevelHearts']).toBe(100)

      return {
        Attributes: {
          id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
          level: 3,
          vcCurrent: 50,
          vcAllTime: 300,
          heartsUntilNextLevel: 100
        }
      }
    })

    database.pushDatabaseOperation(userAfterVcUpdated)
    database.pushDatabaseOperation(userUpdatedAfterLevelUpResolved)

    return updateUserVc('45bbefbf-63d1-4d36-931e-212fbe2bc3d9', 1)
      .then(data => {
        expect(data).not.toBe(null)
        expect(data.id).toBe('45bbefbf-63d1-4d36-931e-212fbe2bc3d9')
      })
  })

  it('Should increment vc by 1', () => {
    const database = setup()

    database.pushDatabaseOperation(
      new DatabaseOperation(OperationType.GET, (params) => {
        return { Item: {
          id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
          username: 'raulchall',
          email: 'raul@tfac.com',
          vcCurrent: 100
        }
        }
      })
    )

    database.pushDatabaseOperation(
      new DatabaseOperation(OperationType.UPDATE, (params) => {
        expect(params.ExpressionAttributeValues[':val']).toBe(1)
        expect(params.ExpressionAttributeValues[':subval']).toBe(-1)
        return {
          Attributes: {
            id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
            vcCurrent: 50,
            vcAllTime: 190,
            heartsUntilNextLevel: 10
          }
        }
      })
    )

    return incrementVcBy1('45bbefbf-63d1-4d36-931e-212fbe2bc3d9')
      .then(data => {
        expect(data).not.toBe(null)
        expect(data.id).toBe('45bbefbf-63d1-4d36-931e-212fbe2bc3d9')
        expect(data.vcCurrent).toBe(50)
        expect(data.vcAllTime).toBe(190)
        expect(data.heartsUntilNextLevel).toBe(10)
      })
  })

  it('Should not increment vc by 1 if last updated was less than 2 seconds ago', () => {
    const database = setup()

    database.pushDatabaseOperation(
      new DatabaseOperation(OperationType.GET, (params) => {
        return { Item: {
          id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
          username: 'raulchall',
          email: 'raul@tfac.com',
          vcCurrent: 100,
          lastTabTimestamp: moment.utc()
        }
        }
      })
    )

    // How do we know this incrementVcBy1 is not calling to updateUserVc?
    // If this were happening we would get an exception from the database
    // since an update operation that wasn't being expected was invoked.
    return incrementVcBy1('45bbefbf-63d1-4d36-931e-212fbe2bc3d9')
      .then(data => {
        expect(data).not.toBe(null)
        expect(data.id).toBe('45bbefbf-63d1-4d36-931e-212fbe2bc3d9')
        expect(data.vcCurrent).toBe(100)
      })
  })

  it('Should increment vc by 1 if last updated was more than 2 seconds ago', () => {
    const database = setup()

    database.pushDatabaseOperation(
      new DatabaseOperation(OperationType.GET, (params) => {
        return { Item: {
          id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
          username: 'raulchall',
          email: 'raul@tfac.com',
          vcCurrent: 100,
          lastTabTimestamp: moment.utc().subtract(3, 'seconds')
        }
        }
      })
    )

    database.pushDatabaseOperation(
      new DatabaseOperation(OperationType.UPDATE, (params) => {
        expect(params.ExpressionAttributeValues[':val']).toBe(1)
        expect(params.ExpressionAttributeValues[':subval']).toBe(-1)
        const lastTabTimestamp = moment.utc(params.ExpressionAttributeValues[':lastTabTimestamp'])
        var now = moment.utc()
        var diff = now.diff(lastTabTimestamp, 'seconds')
        expect(diff).toBeLessThan(1)
        return {
          Attributes: {
            id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
            vcCurrent: 100,
            vcAllTime: 190,
            heartsUntilNextLevel: 10
          }
        }
      })
    )

    return incrementVcBy1('45bbefbf-63d1-4d36-931e-212fbe2bc3d9')
      .then(data => {
        expect(data).not.toBe(null)
        expect(data.id).toBe('45bbefbf-63d1-4d36-931e-212fbe2bc3d9')
        expect(data.vcCurrent).toBe(100)
      })
  })
})
