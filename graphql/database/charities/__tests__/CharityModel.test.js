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
})
