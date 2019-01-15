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
    const getTodayTabCount = require('../user-utils').getTodayTabCount
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
    const getTodayTabCount = require('../user-utils').getTodayTabCount
    expect(getTodayTabCount(mockUser)).toBe(0)
  })
})
