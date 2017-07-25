/* eslint-env jest */

import tableNames from '../../tables'
import Charity from '../CharityModel'

jest.mock('../../database')

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
    const charity = await Charity.create({ name: 'something' })
    expect(charity.id).toBeDefined()
    expect(charity.name).toEqual('something')
  })

  // TODO: test getting charities
})
