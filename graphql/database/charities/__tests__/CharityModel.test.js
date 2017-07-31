/* eslint-env jest */

// import uuid from 'uuid/v4'

import tableNames from '../../tables'
import Charity from '../CharityModel'
// import { DatabaseOperation, setMockDBResponse } from '../../test-utils'

jest.mock('../../databaseClient')

afterEach(() => {
  jest.resetAllMocks()
})

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

  // TODO: use these in other models where `create` is useful.
  // it('auto creates an id', async () => {
  //   setMockDBResponse(DatabaseOperation.CREATE)
  //   const charity = await Charity.create({ name: 'something' })
  //   expect(charity.id).toBeDefined()
  //   expect(charity.name).toEqual('something')
  // })

  // it('creates with an existing id', async () => {
  //   const dbQueryMock = setMockDBResponse(DatabaseOperation.CREATE)
  //   const someId = uuid()
  //   const charity = await Charity.create({
  //     id: someId,
  //     name: 'my-charity-name'
  //   })
  //   const DBParam = dbQueryMock.mock.calls[0][0]
  //   expect(DBParam['Item']['name']).toEqual('my-charity-name')
  //   expect(DBParam['Item']['id']).toEqual(someId)
  //   expect(charity.id).toBe(someId)
  // })
})
