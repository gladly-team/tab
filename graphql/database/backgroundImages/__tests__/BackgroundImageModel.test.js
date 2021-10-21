/* eslint-env jest */

import tableNames from '../../tables'
import BackgroundImageModel from '../BackgroundImageModel'
import config from '../../../config'
import {
  BACKGROUND_IMAGE_LEGACY_CATEGORY,
  BACKGROUND_IMAGE_CAT_CATEGORY,
  BACKGROUND_IMAGE_SEAS_CATEGORY,
} from '../../constants'

const mediaRoot = config.MEDIA_ENDPOINT
jest.mock('../../databaseClient')

describe('BackgroundImageModel', () => {
  it('implements the name property', () => {
    expect(BackgroundImageModel.name).toBe('BackgroundImage')
  })

  it('implements the hashKey property', () => {
    expect(BackgroundImageModel.hashKey).toBe('id')
  })

  it('implements the tableName property', () => {
    expect(BackgroundImageModel.tableName).toBe(tableNames.backgroundImages)
  })

  it('implements a global secondary index on category', () => {
    expect(BackgroundImageModel.indexes).toContainEqual({
      hashKey: 'category',
      name: 'ImagesByCategory',
      type: 'global',
    })
  })

  it('has the correct get permission', () => {
    expect(BackgroundImageModel.permissions.get()).toBe(true)
  })

  it('has the correct getAll permission', () => {
    expect(BackgroundImageModel.permissions.getAll()).toBe(true)
  })

  it('has the correct update permission', () => {
    expect(BackgroundImageModel.permissions.update).toBeUndefined()
  })

  it('has the correct create permission', () => {
    expect(BackgroundImageModel.permissions.create).toBeUndefined()
  })

  it('has the correct imagesByCategory index permission', () => {
    expect(
      BackgroundImageModel.permissions.indexPermissions.ImagesByCategory.get()
    ).toBe(true)
    expect(
      BackgroundImageModel.permissions.indexPermissions.ImagesByCategory.getAll()
    ).toBe(true)
    expect(
      BackgroundImageModel.permissions.indexPermissions.ImagesByCategory.update
    ).toBeUndefined()
    expect(
      BackgroundImageModel.permissions.indexPermissions.ImagesByCategory.create
    ).toBeUndefined()
  })

  it('returns a list of allowed categories', () => {
    expect(BackgroundImageModel.allowedValues.category).toEqual([
      BACKGROUND_IMAGE_LEGACY_CATEGORY,
      BACKGROUND_IMAGE_CAT_CATEGORY,
      BACKGROUND_IMAGE_SEAS_CATEGORY,
    ])
  })

  it('constructs as expected', () => {
    const item = Object.assign(
      {},
      new BackgroundImageModel({
        id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
        name: 'Cool Photo',
        image: 'cool.png',
        thumbnail: 'cool-thumb.png',
      })
    )
    expect(item).toEqual({
      id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      name: 'Cool Photo',
      image: 'cool.png',
      category: 'legacy',
      thumbnail: 'cool-thumb.png',
      imageURL: `${mediaRoot}/img/backgrounds/cool.png`,
      thumbnailURL: `${mediaRoot}/img/background-thumbnails/cool-thumb.png`,
    })
  })

  it('adds a default value of legacy to category', () => {
    const item = Object.assign(
      {},
      new BackgroundImageModel({
        id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
        name: 'Cool Photo',
        image: 'cool.png',
        thumbnail: 'cool-thumb.png',
      })
    )
    expect(item).toEqual({
      id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      name: 'Cool Photo',
      image: 'cool.png',
      category: 'legacy',
      thumbnail: 'cool-thumb.png',
      imageURL: `${mediaRoot}/img/backgrounds/cool.png`,
      thumbnailURL: `${mediaRoot}/img/background-thumbnails/cool-thumb.png`,
    })
  })
})
