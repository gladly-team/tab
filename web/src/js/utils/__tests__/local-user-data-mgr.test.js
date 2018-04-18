/* eslint-env jest */

import moment from 'moment'
import MockDate from 'mockdate'
import localStorageMgr, {
  __mockClear
} from '../localstorage-mgr'

jest.mock('../localstorage-mgr')

const mockNow = '2018-04-12T10:30:00.000'

beforeAll(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  __mockClear()
})

afterAll(() => {
  MockDate.reset()
})

describe('local user data manager', () => {
  it('returns tabs today when the user has opened tabs today', () => {
    localStorageMgr.setItem('tab.user.lastTabDay.date', moment('2018-04-12T12:50:42.000').utc().toISOString())
    localStorageMgr.setItem('tab.user.lastTabDay.count', 14)
    const getTabsOpenedToday = require('../local-user-data-mgr').getTabsOpenedToday
    expect(getTabsOpenedToday()).toBe(14)
  })

  it('returns zero tabs today when the user last opened tabs more than one day ago', () => {
    localStorageMgr.setItem('tab.user.lastTabDay.date', moment('2018-04-11T08:05:10.000').utc().toISOString())
    localStorageMgr.setItem('tab.user.lastTabDay.count', 14)
    const getTabsOpenedToday = require('../local-user-data-mgr').getTabsOpenedToday
    expect(getTabsOpenedToday()).toBe(0)
  })

  it('returns zero tabs today when the last tab day values are not set in localStorage', () => {
    const getTabsOpenedToday = require('../local-user-data-mgr').getTabsOpenedToday
    expect(getTabsOpenedToday()).toBe(0)
  })

  it('returns zero tabs today when the last tab date value is not set in localStorage', () => {
    localStorageMgr.setItem('tab.user.lastTabDay.count', 6)
    const getTabsOpenedToday = require('../local-user-data-mgr').getTabsOpenedToday
    expect(getTabsOpenedToday()).toBe(0)
  })

  it('returns zero tabs today when the last tab day count is not set in localStorage', () => {
    localStorageMgr.setItem('tab.user.lastTabDay.date', moment('2018-04-12T12:50:42.000').utc().toISOString())
    const getTabsOpenedToday = require('../local-user-data-mgr').getTabsOpenedToday
    expect(getTabsOpenedToday()).toBe(0)
  })
})
