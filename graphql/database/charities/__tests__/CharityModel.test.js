/* eslint-env jest */

import uuid from 'uuid/v4'

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

  it('create with existing id', async () => {
    const someId = uuid()
    const charity = await Charity.create({
      id: someId,
      name: 'something'
    })
    expect(charity.id).toBe(someId)
  })

  // TODO: test getting charities
})
