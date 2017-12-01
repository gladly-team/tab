/* eslint-env jest */

import moment from 'moment'
import tableNames from '../../tables'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'
import User from '../UserModel'
import config from '../../../config'
import {
  mockDate
} from '../../test-utils'

const mediaRoot = config.MEDIA_ENDPOINT

jest.mock('../../databaseClient')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('UserModel', () => {
  it('implements the name property', () => {
    expect(User.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(User.hashKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(User.tableName).toBe(tableNames['users'])
  })

  it('has the correct get permission', () => {
    expect(User.permissions.get).toBe(
      permissionAuthorizers.userIdMatchesHashKey)
  })

  it('has the correct update permission', () => {
    expect(User.permissions.update).toBe(
      permissionAuthorizers.userIdMatchesHashKey)
  })

  it('has the correct getAll permission', () => {
    expect(User.permissions.getAll()).toBe(false)
  })

  it('allows create when user info matches item to create', () => {
    const userContext = {
      id: 'abc',
      email: 'foo@bar.com',
      username: 'myName'
    }
    const item = {
      id: 'abc',
      email: 'foo@bar.com',
      username: 'myName'
    }
    expect(User.permissions.create(userContext, null, null, item))
      .toBe(true)
  })

  it('does not allow create when user ID is different', () => {
    const userContext = {
      id: 'abcd',
      email: 'foo@bar.com',
      username: 'myName'
    }
    const item = {
      id: 'abc',
      email: 'foo@bar.com',
      username: 'myName'
    }
    expect(User.permissions.create(userContext, null, null, item))
      .toBe(false)
  })

  it('does not allow create when user ID is different', () => {
    const userContext = {
      id: 'abc',
      email: 'foo@bar.com',
      username: 'myName'
    }
    const item = {
      id: 'abc',
      email: 'foo+hi@bar.com',
      username: 'myName'
    }
    expect(User.permissions.create(userContext, null, null, item))
      .toBe(false)
  })

  it('does not allow create when username is different', () => {
    const userContext = {
      id: 'abcd',
      email: 'foo@bar.com',
      username: 'myName'
    }
    const item = {
      id: 'abc',
      email: 'foo@bar.com',
      username: 'myOtherName'
    }
    expect(User.permissions.create(userContext, null, null, item))
      .toBe(false)
  })

  it('does not allow create when the user context is not provided', () => {
    const userContext = null
    const item = {
      id: 'abc',
      email: 'foo@bar.com',
      username: 'myOtherName'
    }
    expect(User.permissions.create(userContext, null, null, item))
      .toBe(false)
  })

  it('does not allow create when the item is not provided', () => {
    const userContext = {
      id: 'abcd',
      email: 'foo@bar.com',
      username: 'myName'
    }
    const item = null
    expect(User.permissions.create(userContext, null, null, item))
      .toBe(false)
  })

  it('constructs as expected', () => {
    const item = Object.assign({}, new User({
      id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      email: 'foo@bar.com',
      username: 'Foo Bar'
    }))
    expect(item).toEqual({
      id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      email: 'foo@bar.com',
      username: 'Foo Bar',
      vcCurrent: 0,
      vcAllTime: 0,
      level: 0,
      tabs: 0,
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 0
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 0
        }
      },
      validTabs: 0,
      heartsUntilNextLevel: 0,
      vcDonatedAllTime: 0,
      numUsersRecruited: 0,
      backgroundImage: {
        id: '9308b921-44c7-4b4e-845d-3b01fa73fa2b',
        image: '94bbd29b17fe4fa3b45777281a392f21.jpg',
        thumbnail: '5d4dfd0b34134879903f0480720bd746.jpg',
        imageURL: `${mediaRoot}/img/backgrounds/94bbd29b17fe4fa3b45777281a392f21.jpg`,
        thumbnailURL: `${mediaRoot}/img/background-thumbnails/5d4dfd0b34134879903f0480720bd746.jpg`,
        timestamp: moment.utc().toISOString()
      },
      backgroundOption: 'photo'
    })
  })
})
