/* eslint-env jest */

import tableNames from '../../tables'
import BackgroundImageModel from '../BackgroundImageModel'
import config from '../../../config'

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

  it('constructs as expected', () => {
    const item = Object.assign({}, new BackgroundImageModel({
      id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      name: 'Cool Photo',
      image: 'cool.png',
      thumbnail: 'cool-thumb.png'
    }))
    expect(item).toEqual({
      id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      name: 'Cool Photo',
      image: 'cool.png',
      thumbnail: 'cool-thumb.png',
      imageURL: `${mediaRoot}/img/backgrounds/cool.png`,
      thumbnailURL: `${mediaRoot}/img/background-thumbnails/cool-thumb.png`
    })
  })
})
