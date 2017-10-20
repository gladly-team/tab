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

  it('has the correct UsersByUsername secondary index permissions', () => {
    expect(User.permissions.indexPermissions).toEqual({
      UsersByUsername: {
        get: permissionAuthorizers.usernameMatchesHashKey
      }
    })
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
      heartsUntilNextLevel: 0,
      vcDonatedAllTime: 0,
      numUsersRecruited: 0,
      backgroundImage: {
        id: '49fcb132-9b6b-431b-bda8-50455e215be7',
        image: '661651039af4454abb852927b3a5b8f9.jpg',
        imageURL: `${mediaRoot}/img/backgrounds/661651039af4454abb852927b3a5b8f9.jpg`,
        timestamp: moment.utc().toISOString()
      },
      backgroundOption: 'photo'
    })
  })
})
