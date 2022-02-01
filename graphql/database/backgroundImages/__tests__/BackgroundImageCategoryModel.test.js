/* eslint-env jest */

import tableNames from '../../tables'
import BackgroundImageCategoryModel from '../BackgroundImageCategoryModel'

jest.mock('../../databaseClient')

describe('BackgroundImageCategoryModel', () => {
  it('implements the name property', () => {
    expect(BackgroundImageCategoryModel.name).toBe('BackgroundImageCategory')
  })

  it('implements the hashKey property', () => {
    expect(BackgroundImageCategoryModel.hashKey).toBe('id')
  })

  it('implements the tableName property', () => {
    expect(BackgroundImageCategoryModel.tableName).toBe(
      tableNames.backgroundImageCategory
    )
  })

  it('has the correct get permission', () => {
    expect(BackgroundImageCategoryModel.permissions.get()).toBe(true)
  })

  it('has the correct getAll permission', () => {
    expect(BackgroundImageCategoryModel.permissions.getAll()).toBe(true)
  })

  it('has the correct update permission', () => {
    expect(BackgroundImageCategoryModel.permissions.update).toBeUndefined()
  })

  it('has the correct create permission', () => {
    expect(BackgroundImageCategoryModel.permissions.create).toBeUndefined()
  })

  it('constructs as expected', () => {
    const item = Object.assign(
      {},
      new BackgroundImageCategoryModel({
        name: 'testCategory',
        collectionLink: 'test.com',
        collectionDescription: 'a description',
      })
    )
    expect(item).toEqual({
      name: 'testCategory',
      collectionLink: 'test.com',
      collectionDescription: 'a description',
    })
  })
})
