/* eslint-env jest */

import tablesNames from '../../tables'
import { BackgroundImage } from '../backgroundImage'

jest.mock('../../database')

test('getTable name to be implemented', () => {
  expect(BackgroundImage.getTableName()).toBe(tablesNames.backgroundImages)
})

test('getFields to be implemented', () => {
  const expected = [
    'name',
    'fileName'
  ]

  expect(BackgroundImage.getFields().length).toBe(expected.length)
  expect(BackgroundImage.getFields()).toEqual(expect.arrayContaining(expected))
})

test('auto create id', () => {
  const bImage = new BackgroundImage(null)
  expect(bImage.id).not.toBe(null)
})

test('create with existing id', () => {
  const bImage = new BackgroundImage('some_bad_id')
  expect(bImage.id).toBe('some_bad_id')
})

test('deserialize to be implemented', () => {
  const bImage = BackgroundImage.deserialize({
    id: 'someid',
    name: 'My Image Name',
    fileName: 'image.png'
  })

  expect(bImage instanceof BackgroundImage).toBe(true)
  expect(bImage.id).toBe('someid')
  expect(bImage.name).toBe('My Image Name')
  expect(bImage.fileName).toBe('image.png')
})
