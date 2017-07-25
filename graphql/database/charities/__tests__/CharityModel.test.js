/* eslint-env jest */

import tableNames from '../../tables'
import Charity from '../CharityModel'

jest.mock('../../database')

describe('CharityModel', () => {
  it('implements the name property', () => {
    expect(Charity.name).not.toBeNull()
  })

  it('implements the hashKey property', () => {
    expect(Charity.hashKey).not.toBeNull()
  })

  it('implements the tableName property', () => {
    expect(Charity.tableName).toBe(tableNames['charities'])
  })

  // TODO: test creation with ID
  // TODO: test getting charities
  // it('auto creates an id', () => {
})
