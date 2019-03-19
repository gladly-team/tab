/* eslint-env jest */

import moment from 'moment'
import tableNames from '../../tables'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'
import User from '../UserModel'
import config from '../../../config'
import {
  DatabaseOperation,
  mockDate,
  getMockUserContext,
  setMockDBResponse,
} from '../../test-utils'
import {
  UnauthorizedQueryException,
  UserDoesNotExistException,
} from '../../../utils/exceptions'

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
    expect(User.tableName).toBe(tableNames.users)
  })

  it('has the correct get permission', () => {
    expect(User.permissions.get).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })

  it('has the correct update permission', () => {
    expect(User.permissions.update).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })

  it('has the correct getAll permission', () => {
    expect(User.permissions.getAll()).toBe(false)
  })

  it('allows create when the user context matches the item to create', () => {
    const userContext = {
      id: 'abc',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    const item = {
      id: 'abc',
      email: 'foo@bar.com',
      username: 'myName',
    }
    expect(User.permissions.create(userContext, null, null, item)).toBe(true)
  })

  it('does not allow create when user ID is different', () => {
    const userContext = {
      id: 'abcd',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    const item = {
      id: 'abc',
      email: 'foo@bar.com',
      username: 'myName',
    }
    expect(User.permissions.create(userContext, null, null, item)).toBe(false)
  })

  it("does not allow create when the user's email is different", () => {
    const userContext = {
      id: 'abc',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    const item = {
      id: 'abc',
      email: 'foo+hi@bar.com',
      username: 'myName',
    }
    expect(User.permissions.create(userContext, null, null, item)).toBe(false)
  })

  it('allows create when the user has a null email in both their token and the item to create', () => {
    const userContext = {
      id: 'abc',
      email: null,
      emailVerified: false,
    }
    const item = {
      id: 'abc',
      email: null,
      username: 'myName',
    }
    expect(User.permissions.create(userContext, null, null, item)).toBe(true)
  })

  it('allows create when the user has an undefined email (in their token) and tries to create an item with a null email', () => {
    const userContext = {
      id: 'abc',
      email: undefined,
      emailVerified: false,
    }
    const item = {
      id: 'abc',
      email: null,
      username: 'myName',
    }
    expect(User.permissions.create(userContext, null, null, item)).toBe(true)
  })

  it('allows create when the user does not have an email in their token nor in the item to create', () => {
    const userContext = {
      id: 'abc',
    }
    const item = {
      id: 'abc',
      email: null,
      username: 'myName',
    }
    expect(User.permissions.create(userContext, null, null, item)).toBe(true)
  })

  it("does not allow create when the user's email exists in the token but not in the item", () => {
    const userContext = {
      id: 'abc',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    const item = {
      id: 'abc',
      email: null,
      username: 'myName',
    }
    expect(User.permissions.create(userContext, null, null, item)).toBe(false)
  })

  it('does not allow create when the user context is not provided', () => {
    const userContext = null
    const item = {
      id: 'abc',
      email: 'foo@bar.com',
      username: 'myOtherName',
    }
    expect(User.permissions.create(userContext, null, null, item)).toBe(false)
  })

  it('does not allow create when the item is not provided', () => {
    const userContext = {
      id: 'abcd',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    const item = null
    expect(User.permissions.create(userContext, null, null, item)).toBe(false)
  })

  it('throws an UserDoesNotExistException error when a `get` returns no item', () => {
    const userContext = getMockUserContext()
    const mockItemId = userContext.id

    // Set mock response from DB client.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: null,
    })
    return expect(User.get(userContext, mockItemId)).rejects.toEqual(
      new UserDoesNotExistException()
    )
  })

  it('throws an error when `get` throws an error other than "item does not exist"', () => {
    const userContext = getMockUserContext()

    // Use an unauthorized request to get its error.
    return expect(
      User.get(userContext, 'unauthorized-user-id-here')
    ).rejects.toEqual(new UnauthorizedQueryException())
  })

  it('does not throw an error when a `get` returns an item', () => {
    const userContext = getMockUserContext()
    const mockItemId = userContext.id

    // Set mock response from DB client.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: {
        // Actual item would have more properties
        id: mockItemId,
      },
    })

    return expect(User.get(userContext, mockItemId)).resolves.toBeDefined()
  })

  it('constructs as expected', () => {
    const item = Object.assign(
      {},
      new User({
        id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
        email: 'foo@bar.com',
        username: 'Foo Bar',
      })
    )
    expect(item).toEqual({
      id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      email: 'foo@bar.com',
      username: 'Foo Bar',
      vcCurrent: 0,
      vcAllTime: 0,
      level: 0,
      tabs: 0,
      tabsToday: 0,
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 0,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 0,
        },
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
        timestamp: moment.utc().toISOString(),
      },
      backgroundOption: 'daily',
      searches: 0,
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 0,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 0,
        },
      },
      searchesToday: 0,
    })
  })

  it('constructs with the expected "tabsToday" value', () => {
    const item = Object.assign(
      {},
      new User({
        id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
        email: 'foo@bar.com',
        username: 'Foo Bar',
        maxTabsDay: {
          maxDay: {
            date: moment.utc().toISOString(),
            numTabs: 300,
          },
          recentDay: {
            date: moment.utc().toISOString(),
            numTabs: 47,
          },
        },
      })
    )
    expect(item).toMatchObject({
      id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      tabsToday: 47,
    })
  })

  it('constructs with the expected "searchesToday" value', () => {
    const item = Object.assign(
      {},
      new User({
        id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
        email: 'foo@bar.com',
        username: 'Foo Bar',
        maxSearchesDay: {
          maxDay: {
            date: moment.utc().toISOString(),
            numSearches: 300,
          },
          recentDay: {
            date: moment.utc().toISOString(),
            numSearches: 47,
          },
        },
      })
    )
    expect(item).toMatchObject({
      id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      searchesToday: 47,
    })
  })
})
