/* global jest expect test */

import tablesNames from '../../tables'
import { Charity } from '../charity'

jest.mock('../../database')

test('getTable name to be implemented', () => {
  expect(Charity.getTableName()).toBe(tablesNames.charities)
})

test('getFields to be implemented', () => {
  const expected = [
    'name',
    'category',
    'logo',
    'image',
    'website',
    'description',
    'impact'
  ]

  expect(Charity.getFields().length).toBe(expected.length)
  expect(Charity.getFields()).toEqual(expect.arrayContaining(expected))
})

test('auto create id', () => {
  const charity = new Charity(null)
  expect(charity.id).not.toBe(null)
})

test('create with existing id', () => {
  const charity = new Charity('some_bad_id')
  expect(charity.id).toBe('some_bad_id')
})

test('deserialize to be implemented', () => {
  const charity = Charity.deserialize({
    id: 'someid',
    name: 'charity_name',
    category: 'charity_category'
  })

  expect(charity instanceof Charity).toBe(true)
  expect(charity.id).toBe('someid')
  expect(charity.name).toBe('charity_name')
  expect(charity.category).toBe('charity_category')
})
