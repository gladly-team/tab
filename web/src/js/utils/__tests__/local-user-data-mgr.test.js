/* eslint-env jest */

import moment from 'moment'
import uuid from 'uuid/v4'
import MockDate from 'mockdate'
import localStorageMgr, { __mockClear } from 'js/utils/localstorage-mgr'

jest.mock('js/utils/localstorage-mgr')
jest.mock('uuid/v4')

const mockNow = '2018-04-12T10:30:00.000'

beforeAll(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  __mockClear()
  jest.clearAllMocks()
})

afterAll(() => {
  MockDate.reset()
})

describe('local user data manager', () => {
  // getTabsOpenedToday method
  it('returns tabs today when the user has opened tabs today', () => {
    localStorageMgr.setItem(
      'tab.user.lastTabDay.date',
      moment('2018-04-12T12:50:42.000')
        .utc()
        .toISOString()
    )
    localStorageMgr.setItem('tab.user.lastTabDay.count', 14)
    const getTabsOpenedToday = require('js/utils/local-user-data-mgr')
      .getTabsOpenedToday
    expect(getTabsOpenedToday()).toBe(14)
  })

  it('returns zero tabs today when the user last opened tabs more than one day ago', () => {
    localStorageMgr.setItem(
      'tab.user.lastTabDay.date',
      moment('2018-04-11T08:05:10.000')
        .utc()
        .toISOString()
    )
    localStorageMgr.setItem('tab.user.lastTabDay.count', 14)
    const getTabsOpenedToday = require('js/utils/local-user-data-mgr')
      .getTabsOpenedToday
    expect(getTabsOpenedToday()).toBe(0)
  })

  it('returns zero tabs today when the last tab day values are not set in localStorage', () => {
    const getTabsOpenedToday = require('js/utils/local-user-data-mgr')
      .getTabsOpenedToday
    expect(getTabsOpenedToday()).toBe(0)
  })

  it('returns zero tabs today when the last tab date value is not set in localStorage', () => {
    localStorageMgr.setItem('tab.user.lastTabDay.count', 6)
    const getTabsOpenedToday = require('js/utils/local-user-data-mgr')
      .getTabsOpenedToday
    expect(getTabsOpenedToday()).toBe(0)
  })

  it('returns zero tabs today when the last tab day count is not set in localStorage', () => {
    localStorageMgr.setItem(
      'tab.user.lastTabDay.date',
      moment('2018-04-12T12:50:42.000')
        .utc()
        .toISOString()
    )
    const getTabsOpenedToday = require('js/utils/local-user-data-mgr')
      .getTabsOpenedToday
    expect(getTabsOpenedToday()).toBe(0)
  })

  // incrementTabsOpenedToday method
  it('increments the tabs today when the user has opened tabs today', () => {
    localStorageMgr.setItem(
      'tab.user.lastTabDay.date',
      moment('2018-04-12T12:50:42.000')
        .utc()
        .toISOString()
    )
    localStorageMgr.setItem('tab.user.lastTabDay.count', 14)
    jest.clearAllMocks()
    const { incrementTabsOpenedToday } = require('js/utils/local-user-data-mgr')
    incrementTabsOpenedToday()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.count',
      15
    )
    expect(localStorageMgr.setItem).not.toHaveBeenCalledWith(
      'tab.user.lastTabDay.date',
      moment.utc().toISOString()
    )
  })

  it('resets the counter of tabs today when the user last opened tabs more than one day ago', () => {
    localStorageMgr.setItem(
      'tab.user.lastTabDay.date',
      moment('2018-04-11T08:05:10.000')
        .utc()
        .toISOString()
    )
    localStorageMgr.setItem('tab.user.lastTabDay.count', 14)
    jest.clearAllMocks()
    const { incrementTabsOpenedToday } = require('js/utils/local-user-data-mgr')
    incrementTabsOpenedToday()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.count',
      1
    )
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.date',
      moment.utc().toISOString()
    )
  })

  it('resets the counter of tabs today when the last tab day values are not set in localStorage', () => {
    const { incrementTabsOpenedToday } = require('js/utils/local-user-data-mgr')
    incrementTabsOpenedToday()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.count',
      1
    )
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.date',
      moment.utc().toISOString()
    )
  })

  it('resets the counter of tabs today when the last tab date value is not set in localStorage', () => {
    localStorageMgr.setItem('tab.user.lastTabDay.count', 6)
    jest.clearAllMocks()
    const { incrementTabsOpenedToday } = require('js/utils/local-user-data-mgr')
    incrementTabsOpenedToday()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.count',
      1
    )
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.date',
      moment.utc().toISOString()
    )
  })

  it('resets the counter of tabs today when the last tab day count is not set in localStorage', () => {
    localStorageMgr.setItem(
      'tab.user.lastTabDay.date',
      moment('2018-04-12T12:50:42.000')
        .utc()
        .toISOString()
    )
    jest.clearAllMocks()
    const { incrementTabsOpenedToday } = require('js/utils/local-user-data-mgr')
    incrementTabsOpenedToday()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.count',
      1
    )
    expect(localStorageMgr.setItem).not.toHaveBeenCalledWith(
      'tab.user.lastTabDay.date',
      moment.utc().toISOString()
    )
  })

  // setBrowserExtensionInstallId method
  it('sets the extension install ID in localStorage', () => {
    const mockUUID = '9359e548-1bd8-4bf1-9e10-09b5b6b4df34'
    uuid.mockReturnValueOnce(mockUUID)
    const {
      setBrowserExtensionInstallId,
    } = require('js/utils/local-user-data-mgr')
    setBrowserExtensionInstallId()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.newUser.extensionInstallId',
      mockUUID
    )
  })

  // getBrowserExtensionInstallId
  it('gets the extension install ID from localStorage', () => {
    const mockUUID = '9359e548-1bd8-4bf1-9e10-09b5b6b4df34'
    uuid.mockReturnValueOnce(mockUUID)
    localStorageMgr.setItem('tab.newUser.extensionInstallId', mockUUID)
    const {
      getBrowserExtensionInstallId,
    } = require('js/utils/local-user-data-mgr')
    const installId = getBrowserExtensionInstallId()
    expect(installId).toBe(mockUUID)
  })

  it('returns null if the extension ID in localStorage does not exist', () => {
    localStorageMgr.removeItem('tab.newUser.extensionInstallId')
    const {
      getBrowserExtensionInstallId,
    } = require('js/utils/local-user-data-mgr')
    const installTime = getBrowserExtensionInstallId()
    expect(installTime).toBeNull()
  })

  // setBrowserExtensionInstallTime method
  it('sets the extension install time timestamp in localStorage', () => {
    const {
      setBrowserExtensionInstallTime,
    } = require('js/utils/local-user-data-mgr')
    setBrowserExtensionInstallTime()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.newUser.approxInstallTime',
      moment.utc().toISOString()
    )
  })

  // getBrowserExtensionInstallTime
  it('gets the extension install date from localStorage', () => {
    const now = moment('2018-04-12T12:50:42.000')
    localStorageMgr.setItem(
      'tab.newUser.approxInstallTime',
      now.utc().toISOString()
    )
    const {
      getBrowserExtensionInstallTime,
    } = require('js/utils/local-user-data-mgr')
    const installTime = getBrowserExtensionInstallTime()
    expect(installTime.isSame(now)).toBe(true)
  })

  it('returns null if the extension install date in localStorage is invalid', () => {
    // Suppress expected MomentJS warning
    jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

    localStorageMgr.setItem('tab.newUser.approxInstallTime', 'foo')
    const {
      getBrowserExtensionInstallTime,
    } = require('js/utils/local-user-data-mgr')
    const installTime = getBrowserExtensionInstallTime()
    expect(installTime).toBeNull()
  })

  it('returns null if the extension install date in localStorage does not exist', () => {
    localStorageMgr.removeItem('tab.newUser.approxInstallTime')
    const {
      getBrowserExtensionInstallTime,
    } = require('js/utils/local-user-data-mgr')
    const installTime = getBrowserExtensionInstallTime()
    expect(installTime).toBeNull()
  })

  // setUserDismissedAdExplanation method
  it('sets the ad explanation dismissal in localStorage', () => {
    const {
      setUserDismissedAdExplanation,
    } = require('js/utils/local-user-data-mgr')
    setUserDismissedAdExplanation()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.newUser.dismissedAdExplanation',
      'true'
    )
  })

  // hasUserDismissedAdExplanation
  it('gets the ad explanation dismissal in localStorage', () => {
    localStorageMgr.setItem('tab.newUser.dismissedAdExplanation', 'true')
    const {
      hasUserDismissedAdExplanation,
    } = require('js/utils/local-user-data-mgr')
    expect(hasUserDismissedAdExplanation()).toBe(true)
    localStorageMgr.setItem('tab.newUser.dismissedAdExplanation', 'blah')
    expect(hasUserDismissedAdExplanation()).toBe(false)
  })

  // setNotificationDismissTime method
  it('sets the notification dismiss time timestamp in localStorage', () => {
    const {
      setNotificationDismissTime,
    } = require('js/utils/local-user-data-mgr')
    setNotificationDismissTime()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.notifications.dismissTime',
      moment.utc().toISOString()
    )
  })

  // hasUserDismissedNotificationRecently method
  it('returns true if the user dismissed a notification recently', () => {
    const now = moment('2018-04-11T12:50:42.000') // ~1 day ago
    localStorageMgr.setItem(
      'tab.user.notifications.dismissTime',
      now.utc().toISOString()
    )
    const {
      hasUserDismissedNotificationRecently,
    } = require('js/utils/local-user-data-mgr')
    const recentlyDismissed = hasUserDismissedNotificationRecently()
    expect(recentlyDismissed).toBe(true)
  })

  it('returns false if the user has not dismissed a notification recently', () => {
    const now = moment('2018-04-01T12:50:42.000') // ~12 days ago
    localStorageMgr.setItem(
      'tab.user.notifications.dismissTime',
      now.utc().toISOString()
    )
    const {
      hasUserDismissedNotificationRecently,
    } = require('js/utils/local-user-data-mgr')
    const recentlyDismissed = hasUserDismissedNotificationRecently()
    expect(recentlyDismissed).toBe(false)
  })

  it('returns false if the extension install date in localStorage is invalid', () => {
    // Suppress expected MomentJS warning
    jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

    localStorageMgr.setItem('tab.user.notifications.dismissTime', 'foo')
    const {
      hasUserDismissedNotificationRecently,
    } = require('js/utils/local-user-data-mgr')
    const recentlyDismissed = hasUserDismissedNotificationRecently()
    expect(recentlyDismissed).toBe(false)
  })

  it('returns null if the extension install date in localStorage does not exist', () => {
    localStorageMgr.removeItem('tab.user.notifications.dismissTime')
    const {
      hasUserDismissedNotificationRecently,
    } = require('js/utils/local-user-data-mgr')
    const recentlyDismissed = hasUserDismissedNotificationRecently()
    expect(recentlyDismissed).toBe(false)
  })

  // setUserClickedNewTabSearchIntroNotif method
  it('marks the new tab search intro notification click in localStorage', () => {
    const {
      setUserClickedNewTabSearchIntroNotif,
    } = require('js/utils/local-user-data-mgr')
    setUserClickedNewTabSearchIntroNotif()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.newUser.clickedNewTabSearchIntro',
      'true'
    )
  })

  // hasUserClickedNewTabSearchIntroNotif
  it('gets the new tab search intro notification click from localStorage', () => {
    localStorageMgr.setItem('tab.newUser.clickedNewTabSearchIntro', 'true')
    const {
      hasUserClickedNewTabSearchIntroNotif,
    } = require('js/utils/local-user-data-mgr')
    expect(hasUserClickedNewTabSearchIntroNotif()).toBe(true)
    localStorageMgr.setItem('tab.newUser.clickedNewTabSearchIntro', 'blah')
    expect(hasUserClickedNewTabSearchIntroNotif()).toBe(false)
    localStorageMgr.removeItem('tab.newUser.clickedNewTabSearchIntro')
    expect(hasUserClickedNewTabSearchIntroNotif()).toBe(false)
  })

  // setCampaignDismissTime method
  it('sets the notification dismiss time timestamp in localStorage', () => {
    const { setCampaignDismissTime } = require('js/utils/local-user-data-mgr')
    setCampaignDismissTime()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.campaign.dismissTime',
      moment.utc().toISOString()
    )
  })

  // hasUserDismissedCampaignRecently method
  it('returns true if the user dismissed a notification recently', () => {
    const now = moment('2018-04-11T12:50:42.000') // ~1 day ago
    localStorageMgr.setItem(
      'tab.user.campaign.dismissTime',
      now.utc().toISOString()
    )
    const {
      hasUserDismissedCampaignRecently,
    } = require('js/utils/local-user-data-mgr')
    const recentlyDismissed = hasUserDismissedCampaignRecently()
    expect(recentlyDismissed).toBe(true)
  })

  it('returns false if the user has not dismissed a notification recently', () => {
    const now = moment('2018-03-28T12:50:42.000') // ~15 days ago
    localStorageMgr.setItem(
      'tab.user.campaign.dismissTime',
      now.utc().toISOString()
    )
    const {
      hasUserDismissedCampaignRecently,
    } = require('js/utils/local-user-data-mgr')
    const recentlyDismissed = hasUserDismissedCampaignRecently()
    expect(recentlyDismissed).toBe(false)
  })

  it('returns false if the extension install date in localStorage is invalid', () => {
    // Suppress expected MomentJS warning
    jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

    localStorageMgr.setItem('tab.user.campaign.dismissTime', 'foo')
    const {
      hasUserDismissedCampaignRecently,
    } = require('js/utils/local-user-data-mgr')
    const recentlyDismissed = hasUserDismissedCampaignRecently()
    expect(recentlyDismissed).toBe(false)
  })

  it('returns null if the extension install date in localStorage does not exist', () => {
    localStorageMgr.removeItem('tab.user.campaign.dismissTime')
    const {
      hasUserDismissedCampaignRecently,
    } = require('js/utils/local-user-data-mgr')
    const recentlyDismissed = hasUserDismissedCampaignRecently()
    expect(recentlyDismissed).toBe(false)
  })

  // setUserDismissedSearchIntro method
  it('sets the search intro dismissal in localStorage', () => {
    const {
      setUserDismissedSearchIntro,
    } = require('js/utils/local-user-data-mgr')
    setUserDismissedSearchIntro()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'search.newUser.dismissedIntro',
      'true'
    )
  })

  // getUserDismissedSearchIntro
  it('gets the search intro dismissal in localStorage', () => {
    localStorageMgr.setItem('search.newUser.dismissedIntro', 'true')
    const {
      hasUserDismissedSearchIntro,
    } = require('js/utils/local-user-data-mgr')
    expect(hasUserDismissedSearchIntro()).toBe(true)
    localStorageMgr.setItem('search.newUser.dismissedIntro', 'blah')
    expect(hasUserDismissedSearchIntro()).toBe(false)
  })

  // setBingClientID method
  it('sets the Bing client ID in localStorage', () => {
    const { setBingClientID } = require('js/utils/local-user-data-mgr')
    setBingClientID('my-bing-id')
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'search.user.bingClientID',
      'my-bing-id'
    )
  })

  // getBingClientID
  it('gets the Bing client ID in localStorage', () => {
    localStorageMgr.setItem('search.user.bingClientID', 'my-bing-id')
    const { getBingClientID } = require('js/utils/local-user-data-mgr')
    expect(getBingClientID()).toBe('my-bing-id')
    localStorageMgr.setItem('search.user.bingClientID', 'blah')
    expect(getBingClientID()).toBe('blah')
  })
})
