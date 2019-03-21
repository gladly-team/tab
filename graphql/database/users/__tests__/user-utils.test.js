/* eslint-env jest */

import moment from 'moment'
import { getMockUserInstance, mockDate } from '../../test-utils'

const mockCurrentTime = '2017-06-22T01:13:28.000Z'

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})

afterAll(() => {
  mockDate.off()
})

describe('user utils', () => {
  test('getTodayTabCount calculates the correct amount when maxTabsDay has a recentDay of today', () => {
    const mockUser = getMockUserInstance({
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 148,
        },
      },
    })
    const { getTodayTabCount } = require('../user-utils')
    expect(getTodayTabCount(mockUser)).toBe(148)
  })

  test('getTodayTabCount calculates the correct amount when maxTabsDay has a recentDay of prior to today', () => {
    const mockUser = getMockUserInstance({
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 400,
        },
        recentDay: {
          date: '2017-06-18T01:13:28.000Z', // not today
          numTabs: 14,
        },
      },
    })
    const { getTodayTabCount } = require('../user-utils')
    expect(getTodayTabCount(mockUser)).toBe(0)
  })

  test('getTodaySearchCount calculates the correct amount when maxSearchesDay has a recentDay of today', () => {
    const mockUser = getMockUserInstance({
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 148,
        },
      },
    })
    const { getTodaySearchCount } = require('../user-utils')
    expect(getTodaySearchCount(mockUser)).toBe(148)
  })

  test('getTodaySearchCount calculates the correct amount when maxSearchesDay has a recentDay of prior to today', () => {
    const mockUser = getMockUserInstance({
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 400,
        },
        recentDay: {
          date: '2017-06-18T01:13:28.000Z', // not today
          numSearches: 14,
        },
      },
    })
    const { getTodaySearchCount } = require('../user-utils')
    expect(getTodaySearchCount(mockUser)).toBe(0)
  })
})
