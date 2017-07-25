/* eslint-env jest */

import uuid from 'uuid/v4'

import tableNames from '../../tables'
import Charity from '../CharityModel'
import databaseClient from '../../databaseClient'
import charitiesFixtures from '../../__mocks__/fixtures/charities'

jest.mock('../../databaseClient')

// TODO: move to standalone module
const setMockDbReturnValue = function (operation, returnVal) {
  databaseClient[operation] = jest.fn((params, callback) => {
    callback(null, returnVal)
  })
}

describe('CharityModel', () => {
  it('implements the name property', () => {
    expect(Charity.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(Charity.hashKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(Charity.tableName).toBe(tableNames['charities'])
  })

  it('auto creates an id', async () => {
    setMockDbReturnValue('put', null)
    const charity = await Charity.create({ name: 'something' })
    expect(charity.id).toBeDefined()
    expect(charity.name).toEqual('something')
  })

  it('creates with an existing id', async () => {
    setMockDbReturnValue('put', null)
    const someId = uuid()
    const charity = await Charity.create({
      id: someId,
      name: 'something'
    })
    expect(charity.id).toBe(someId)
  })

  it('correctly fetches all charities', () => {
    setMockDbReturnValue('scan', {
      Items: charitiesFixtures
    })
    return Charity.getAll()
      .then(response => {
        expect(response instanceof Array).toBe(true)
        expect(response.length).toBe(charitiesFixtures.length)
        for (var index in response) {
          expect(response[index].id).toBe(charitiesFixtures[index].id)
        }
      })
  })
})
