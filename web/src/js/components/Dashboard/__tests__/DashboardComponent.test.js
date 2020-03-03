/* eslint-env jest */

import React from 'react'
import MockDate from 'mockdate'
import moment from 'moment'
import { cloneDeep } from 'lodash/lang'
import { shallow } from 'enzyme'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'
import UserBackgroundImage from 'js/components/Dashboard/UserBackgroundImageContainer'
import UserMenu from 'js/components/Dashboard/UserMenuContainer'
import WidgetsContainer from 'js/components/Widget/WidgetsContainer'
import LogTab from 'js/components/Dashboard/LogTabContainer'
import LogConsentData from 'js/components/Dashboard/LogConsentDataContainer'
import LogAccountCreation from 'js/components/Dashboard/LogAccountCreationContainer'
import AssignExperimentGroups from 'js/components/Dashboard/AssignExperimentGroupsContainer'
import ErrorMessage from 'js/components/General/ErrorMessage'
import NewUserTour from 'js/components/Dashboard/NewUserTourContainer'
import localStorageMgr from 'js/utils/localstorage-mgr'
import {
  CHROME_BROWSER,
  FIREFOX_BROWSER,
  UNSUPPORTED_BROWSER,
  STORAGE_NEW_USER_HAS_COMPLETED_TOUR,
} from 'js/constants'
import { getCurrentUser } from 'js/authentication/user'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {
  goTo,
  inviteFriendsURL,
  searchChromeExtensionPage,
  searchFirefoxExtensionPage,
} from 'js/navigation/navigation'
import {
  areAdsEnabled,
  getAdUnits,
  shouldShowAdExplanation,
  showMockAds,
} from 'js/ads/adHelpers'
import {
  setUserDismissedAdExplanation,
  hasUserDismissedCampaignRecently,
  hasUserDismissedNotificationRecently,
  hasUserClickedNewTabSearchIntroNotif,
  setUserClickedNewTabSearchIntroNotif,
  hasUserClickedNewTabSearchIntroNotifV2,
  setUserClickedNewTabSearchIntroNotifV2,
  removeCampaignDismissTime,
} from 'js/utils/local-user-data-mgr'
import {
  showGlobalNotification,
  showSearchIntroductionMessage,
} from 'js/utils/feature-flags'
import { getUserExperimentGroup } from 'js/utils/experiments'
import { detectSupportedBrowser } from 'js/utils/detectBrowser'
import LogUserExperimentActionsMutation from 'js/mutations/LogUserExperimentActionsMutation'
import LogUserRevenueMutation from 'js/mutations/LogUserRevenueMutation'
import { AdComponent, fetchAds } from 'tab-ads'
import { isInEuropeanUnion } from 'js/utils/client-location'
import { getHostname, getCurrentURL } from 'js/navigation/utils'

jest.mock('uuid/v4', () =>
  jest.fn(() => '101b73c7-468c-4d29-b224-0c07f621bc52')
)
jest.mock('js/analytics/logEvent')
jest.mock('js/utils/localstorage-mgr')
jest.mock('js/authentication/user')
jest.mock('js/navigation/navigation')
jest.mock('js/ads/adHelpers')
jest.mock('js/utils/local-user-data-mgr')
jest.mock('js/utils/feature-flags')
jest.mock('js/utils/experiments')
jest.mock('js/utils/detectBrowser')
jest.mock('js/mutations/LogUserExperimentActionsMutation')
jest.mock('js/mutations/LogUserRevenueMutation')
jest.mock('js/utils/client-location')
jest.mock('js/navigation/utils')

const mockNow = '2018-05-15T10:30:00.000'

// Enzyme does not yet support React.lazy and React.Suspense,
// so let's just not render lazy-loaded children for now.
// https://github.com/airbnb/enzyme/issues/1917
jest.mock('react', () => {
  const React = jest.requireActual('react')
  React.Suspense = () => null
  React.lazy = jest.fn(() => () => null)
  return React
})

beforeAll(() => {
  MockDate.set(moment(mockNow))
})

beforeEach(() => {
  detectSupportedBrowser.mockReturnValue(CHROME_BROWSER)
  LogUserExperimentActionsMutation.mockResolvedValue()

  // Default to showing three ad units.
  getAdUnits.mockReturnValue({
    leaderboard: {
      // The long leaderboard ad.
      adId: 'div-gpt-ad-1464385677836-0',
      adUnitId: '/43865596/HBTL',
      sizes: [[728, 90]],
    },
    rectangleAdPrimary: {
      // The primary rectangle ad (bottom-right).
      adId: 'div-gpt-ad-1464385742501-0',
      adUnitId: '/43865596/HBTR',
      sizes: [[300, 250]],
    },
    rectangleAdSecondary: {
      // The second rectangle ad (right side, above the first).
      adId: 'div-gpt-ad-1539903223131-0',
      adUnitId: '/43865596/HBTR2',
      sizes: [[300, 250]],
    },
  })

  // Default to enabled ads.
  areAdsEnabled.mockReturnValue(true)
  showMockAds.mockReturnValue(false)

  // Provide mock hostname and URL.
  getHostname.mockReturnValue('example.com')
  getCurrentURL.mockReturnValue('https://example.com/my-new-tab/')
})

afterEach(() => {
  localStorageMgr.clear()
  getUserExperimentGroup.mockReturnValue('none')
  jest.clearAllMocks()
})

afterAll(() => {
  MockDate.reset()
})

const mockProps = {
  user: {
    id: 'abc-123',
    joined: '2017-04-10T14:00:00.000',
    searches: 0,
    tabs: 12,
    experimentActions: {},
  },
  app: {
    campaign: {
      isLive: false,
    },
  },
}

describe('Dashboard component', () => {
  it('renders without error', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    shallow(<DashboardComponent {...mockProps} />)
  })

  it('renders UserBackgroundImage component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(UserBackgroundImage).length).toBe(1)
  })

  it('renders UserMenu component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(UserMenu).length).toBe(1)
  })

  it('renders WidgetsContainer component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(WidgetsContainer).length).toBe(1)
  })

  it('renders LogTab component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(LogTab).length).toBe(1)
  })

  it('renders LogConsentData component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(LogConsentData).length).toBe(1)
  })

  it('renders LogAccountCreation component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(LogAccountCreation).length).toBe(1)
  })

  it('renders AssignExperimentGroups component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const comp = wrapper.find(AssignExperimentGroups)
    expect(comp.length).toBe(1)
    expect(comp.prop('isNewUser')).toBe(false)
  })

  // Disabling test until Enzyme fixes a bug with React.lazy and React.Suspense:
  // https://github.com/airbnb/enzyme/issues/2200

  // it('renders the NewUserTour component when the user recently joined and has not already viewed it', () => {
  //   const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
  //     .default

  //   // Mock that the user joined recently
  //   const modifiedProps = cloneDeep(mockProps)
  //   modifiedProps.user.joined = '2018-05-15T09:54:11.000'

  //   // Mock that the user has not viewed the tour
  //   localStorageMgr.removeItem(STORAGE_NEW_USER_HAS_COMPLETED_TOUR)

  //   const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
  //   expect(wrapper.find(NewUserTour).length).toBe(1)
  // })

  it('does not render the NewUserTour component when the user has already viewed it', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default

    // Mock that the user joined recently
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.joined = '2018-05-15T09:54:11.000'

    // Mock that the user has already viewed the tour
    localStorageMgr.setItem(STORAGE_NEW_USER_HAS_COMPLETED_TOUR, 'true')

    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    expect(wrapper.find(NewUserTour).length).toBe(0)
  })

  it('does not renders the NewUserTour component when some time has passed since the user joined', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default

    // Mock that the user joined more than a few hours ago
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.joined = '2018-05-14T09:54:11.000'

    // Mock that the user has not viewed the tour
    localStorageMgr.removeItem(STORAGE_NEW_USER_HAS_COMPLETED_TOUR)

    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    expect(wrapper.find(NewUserTour).length).toBe(0)
  })

  it('does not render MoneyRaised component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(<DashboardComponent {...mockPropsWithoutUser} />)
    expect(wrapper.find(MoneyRaised).length).toBe(0)
  })

  it('does not render UserMenu component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(<DashboardComponent {...mockPropsWithoutUser} />)
    expect(wrapper.find(UserMenu).length).toBe(0)
  })

  it('does not render LogTab component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(<DashboardComponent {...mockPropsWithoutUser} />)
    expect(wrapper.find(LogTab).length).toBe(0)
  })

  it('does not render LogConsentData component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(<DashboardComponent {...mockPropsWithoutUser} />)
    expect(wrapper.find(LogConsentData).length).toBe(0)
  })

  it('does not render LogAccountCreation component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(<DashboardComponent {...mockPropsWithoutUser} />)
    expect(wrapper.find(LogAccountCreation).length).toBe(0)
  })

  it('does not render AssignExperimentGroups component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(<DashboardComponent {...mockPropsWithoutUser} />)
    expect(wrapper.find(AssignExperimentGroups).length).toBe(0)
  })

  it('does not render NewUserTour component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(<DashboardComponent {...mockPropsWithoutUser} />)
    expect(wrapper.find(NewUserTour).length).toBe(0)
  })

  it('does not display the ErrorMessage component when no error message is set', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(ErrorMessage).prop('open')).toBe(false)
  })

  it('displays the ErrorMessage component when WidgetsContainer calls its "showError" prop', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    wrapper.find(WidgetsContainer).prop('showError')('Big widget problem!')
    wrapper.update()
    expect(wrapper.find(ErrorMessage).prop('open')).toBe(true)
    expect(wrapper.find(ErrorMessage).prop('message')).toBe(
      'Big widget problem!'
    )
  })

  it('displays the anonymous user sign-in prompt when the user is anonymous', async () => {
    expect.assertions(1)

    getCurrentUser.mockReset()
    getCurrentUser.mockResolvedValueOnce({
      id: 'some-id-here',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false,
    })

    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)

    // Wait for the component to determine whether the
    // user is anonymous.
    await wrapper.instance().determineAnonymousStatus()
    wrapper.update()
    expect(
      wrapper.find('[data-test-id="anon-sign-in-prompt-dashboard"]').length
    ).toBe(1)
  })

  it('displays the correct text for the anonymous user sign-in prompt', async () => {
    expect.assertions(1)

    getCurrentUser.mockReset()
    getCurrentUser.mockResolvedValueOnce({
      id: 'some-id-here',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false,
    })

    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)

    // Wait for the component to determine whether the
    // user is anonymous.
    await wrapper.instance().determineAnonymousStatus()
    wrapper.update()

    expect(
      wrapper
        .find('[data-test-id="anon-sign-in-prompt-dashboard"]')
        .find(Typography)
        .children()
        .text()
    ).toBe('Sign in to save your progress!')
  })

  it('the anonymous user sign-in button leads to the correct URL', async () => {
    expect.assertions(1)

    getCurrentUser.mockReset()
    getCurrentUser.mockResolvedValueOnce({
      id: 'some-id-here',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false,
    })

    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)

    // Wait for the component to determine whether the
    // user is anonymous.
    await wrapper.instance().determineAnonymousStatus()
    wrapper.update()

    const button = wrapper
      .find('[data-test-id="anon-sign-in-prompt-dashboard"]')
      .find(Button)
    button.simulate('click')
    expect(goTo).toHaveBeenCalledWith('/newtab/auth/', { noredirect: 'true' })
  })

  it('does not display the anonymous user sign-in prompt when the user is not anonymous', async () => {
    expect.assertions(1)

    getCurrentUser.mockReset()
    getCurrentUser.mockResolvedValueOnce({
      id: 'some-id-here',
      email: 'somebody@example.com',
      username: 'IAmSomebody',
      isAnonymous: false,
      emailVerified: true,
    })

    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)

    // Wait for the component to determine whether the
    // user is anonymous.
    await wrapper.instance().determineAnonymousStatus()
    wrapper.update()

    expect(
      wrapper.find('[data-test-id="anon-sign-in-prompt-dashboard"]').length
    ).toBe(0)
  })

  it('the ad explanation disappears when clicking to dismiss it', () => {
    shouldShowAdExplanation.mockReturnValue(true)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const button = wrapper.find('[data-test-id="ad-explanation"]').find(Button)
    button.simulate('click')
    expect(setUserDismissedAdExplanation).toHaveBeenCalled()
    expect(
      wrapper.find('[data-test-id="ad-explanation"]').find(Button).length
    ).toBe(0)
  })

  it('the ad explanation does not render when we should not show it', () => {
    shouldShowAdExplanation.mockReturnValue(false)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="ad-explanation"]').find(Button).length
    ).toBe(0)
  })
})

describe('Dashboard component: campaign / charity spotlight', () => {
  // Disabling test until Enzyme fixes a bug with React.lazy and React.Suspense:
  // https://github.com/airbnb/enzyme/issues/2200
  // https://github.com/airbnb/enzyme/issues/1917
  // it('renders CampaignBase component when the campaign is live and the user has not dismissed it', () => {
  //   const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
  //     .default
  //   const modifiedProps = cloneDeep(mockProps)
  //   modifiedProps.app.isGlobalCampaignLive = true
  //   hasUserDismissedCampaignRecently.mockReturnValueOnce(false)
  //   const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
  //   expect(wrapper.find(CampaignBase).length).toBe(1)
  // })
  // it('does not render the CampaignBase component when the campaign is live but the user has dismissed it', () => {
  //   const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
  //     .default
  //   const modifiedProps = cloneDeep(mockProps)
  //   modifiedProps.app.isGlobalCampaignLive = true
  //   hasUserDismissedCampaignRecently.mockReturnValueOnce(true)
  //   const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
  //   expect(wrapper.find(CampaignBase).length).toBe(0)
  // })
  // it("does not render the CampaignBase component when the campaign is live but the it's the user's first tab", () => {
  //   const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
  //     .default
  //   const modifiedProps = cloneDeep(mockProps)
  //   modifiedProps.user.tabs = 1
  //   modifiedProps.app.isGlobalCampaignLive = true
  //   hasUserDismissedCampaignRecently.mockReturnValueOnce(false)
  //   const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
  //   expect(wrapper.find(CampaignBase).length).toBe(0)
  // })
  // it("does render the CampaignBase component when the campaign is live and it's the user's second tab", () => {
  //   const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
  //     .default
  //   const modifiedProps = cloneDeep(mockProps)
  //   modifiedProps.user.tabs = 2
  //   modifiedProps.app.isGlobalCampaignLive = true
  //   hasUserDismissedCampaignRecently.mockReturnValueOnce(false)
  //   const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
  //   expect(wrapper.find(CampaignBase).length).toBe(1)
  // })
  // it('does not render CampaignBase component when the campaign is not live', () => {
  //   const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
  //     .default
  //   const modifiedProps = cloneDeep(mockProps)
  //   modifiedProps.app.isGlobalCampaignLive = false
  //   hasUserDismissedCampaignRecently.mockReturnValueOnce(false)
  //   const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
  //   expect(wrapper.find(CampaignBase).length).toBe(0)
  // })
  // it('hides the campaign when the onDismiss callback is called', () => {
  //   const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
  //     .default
  //   const modifiedProps = cloneDeep(mockProps)
  //   modifiedProps.app.isGlobalCampaignLive = true
  //   hasUserDismissedCampaignRecently.mockReturnValueOnce(false)
  //   const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
  //   // Campaign should be visible.
  //   expect(wrapper.find(CampaignBase).length).toBe(1)
  //   // Mock that the user dismisses the notification.
  //   wrapper.find(CampaignBase).prop('onDismiss')()
  //   // Notification should be gone.
  //   expect(wrapper.find(CampaignBase).length).toBe(0)
  // })
  // it('changes the value of the isCampaignLive passed to widgets when the campaign is dismissed', () => {
  //   const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
  //     .default
  //   const modifiedProps = cloneDeep(mockProps)
  //   modifiedProps.app.isGlobalCampaignLive = true
  //   hasUserDismissedCampaignRecently.mockReturnValueOnce(false)
  //   const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
  //   expect(wrapper.find(WidgetsContainer).prop('isCampaignLive')).toBe(true)
  //   // Mock that the user dismisses the notification.
  //   wrapper.find(CampaignBase).prop('onDismiss')()
  //   // Prop should change.
  //   expect(wrapper.find(WidgetsContainer).prop('isCampaignLive')).toBe(false)
  // })
})

describe('Dashboard component: ads logic', () => {
  it('calls tab-ads fetchAds on mount', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    shallow(<DashboardComponent {...mockProps} />)
    expect(fetchAds).toHaveBeenCalled()
  })

  it('provides the expected config to fetchAds', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    shallow(<DashboardComponent {...mockProps} />)
    expect(fetchAds.mock.calls[0][0]).toEqual({
      adUnits: [
        {
          // The long leaderboard ad.
          adId: 'div-gpt-ad-1464385677836-0',
          adUnitId: '/43865596/HBTL',
          sizes: [[728, 90]],
        },
        {
          // The primary rectangle ad (bottom-right).
          adId: 'div-gpt-ad-1464385742501-0',
          adUnitId: '/43865596/HBTR',
          sizes: [[300, 250]],
        },
        {
          // The second rectangle ad (right side, above the first).
          adId: 'div-gpt-ad-1539903223131-0',
          adUnitId: '/43865596/HBTR2',
          sizes: [[300, 250]],
        },
      ],
      consent: {
        isEU: expect.any(Function),
      },
      publisher: {
        domain: 'example.com',
        pageUrl: 'https://example.com/my-new-tab/',
      },
      logLevel: 'debug',
      disableAds: false,
      useMockAds: false,
    })
  })

  it('passes isInEuropeanUnion function to the tab-ads config property consent.isEU', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    shallow(<DashboardComponent {...mockProps} />)
    expect(fetchAds.mock.calls[0][0].consent.isEU).toBe(isInEuropeanUnion)
  })

  it('passes the expected hostname and page URL to the tab-ads config', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getHostname.mockReturnValue('foo.com')
    getCurrentURL.mockReturnValue('https://foo.com/hi/')
    shallow(<DashboardComponent {...mockProps} />)

    expect(fetchAds.mock.calls[0][0].publisher).toEqual({
      domain: 'foo.com',
      pageUrl: 'https://foo.com/hi/',
    })
  })

  it('passes disableAds === true to the tab-ads config if adHelpers.areAdsEnabled() returns false', () => {
    areAdsEnabled.mockReturnValue(false)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    shallow(<DashboardComponent {...mockProps} />)
    expect(fetchAds.mock.calls[0][0].disableAds).toBe(true)
  })

  it('passes disableAds === false to the tab-ads config if adHelpers.areAdsEnabled() returns true', () => {
    areAdsEnabled.mockReturnValue(true)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    shallow(<DashboardComponent {...mockProps} />)
    expect(fetchAds.mock.calls[0][0].disableAds).toBe(false)
  })

  it('passes showMockAds === true to the tab-ads config if adHelpers.showMockAds() returns true', () => {
    showMockAds.mockReturnValue(true)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    shallow(<DashboardComponent {...mockProps} />)
    expect(fetchAds.mock.calls[0][0].useMockAds).toBe(true)
  })

  it('passes showMockAds === false to the tab-ads config if adHelpers.showMockAds() returns true', () => {
    showMockAds.mockReturnValue(false)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    shallow(<DashboardComponent {...mockProps} />)
    expect(fetchAds.mock.calls[0][0].useMockAds).toBe(false)
  })

  it('calls LogUserRevenueMutation for each Ad when the onAdDisplayed prop is invoked', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const firstAd = wrapper.find(AdComponent).at(0)
    const secondAd = wrapper.find(AdComponent).at(1)
    const thirdAd = wrapper.find(AdComponent).at(2)

    const mockDisplayedAdInfo = {
      adId: 'first-ad-here',
      revenue: 0.0123,
      encodedRevenue: 'encoded-first-ad',
      GAMAdvertiserId: 1111,
      GAMAdUnitId: '/12345/SomeAdUnit',
      adSize: '728x90',
    }

    // Call each Ad's onAdDisplayed with a mock ad info.
    firstAd.prop('onAdDisplayed')(mockDisplayedAdInfo)
    secondAd.prop('onAdDisplayed')({
      ...mockDisplayedAdInfo,
      adId: 'second-ad-here',
      revenue: 0.082,
      encodedRevenue: 'encoded-second-ad',
      GAMAdvertiserId: 2222,
      GAMAdUnitId: '/12345/SecondAdThing',
      adSize: '300x250',
    })
    thirdAd.prop('onAdDisplayed')({
      ...mockDisplayedAdInfo,
      adId: 'third-ad-here',
      revenue: 0.0001472,
      encodedRevenue: 'encoded-third-ad',
      GAMAdvertiserId: 3333,
      GAMAdUnitId: '/12345/ThirdAdHere',
      adSize: '300x250',
    })

    expect(LogUserRevenueMutation.mock.calls[0][0]).toEqual({
      userId: 'abc-123',
      revenue: 0.0123,
      encodedRevenue: {
        encodingType: 'AMAZON_CPM',
        encodedValue: 'encoded-first-ad',
      },
      dfpAdvertiserId: '1111',
      adSize: '728x90',
      aggregationOperation: 'MAX',
      tabId: '101b73c7-468c-4d29-b224-0c07f621bc52',
      adUnitCode: '/12345/SomeAdUnit',
    })
    expect(LogUserRevenueMutation.mock.calls[1][0]).toEqual({
      userId: 'abc-123',
      revenue: 0.082,
      encodedRevenue: {
        encodingType: 'AMAZON_CPM',
        encodedValue: 'encoded-second-ad',
      },
      dfpAdvertiserId: '2222',
      adSize: '300x250',
      aggregationOperation: 'MAX',
      tabId: '101b73c7-468c-4d29-b224-0c07f621bc52',
      adUnitCode: '/12345/SecondAdThing',
    })
    expect(LogUserRevenueMutation.mock.calls[2][0]).toEqual({
      userId: 'abc-123',
      revenue: 0.0001472,
      encodedRevenue: {
        encodingType: 'AMAZON_CPM',
        encodedValue: 'encoded-third-ad',
      },
      dfpAdvertiserId: '3333',
      adSize: '300x250',
      aggregationOperation: 'MAX',
      tabId: '101b73c7-468c-4d29-b224-0c07f621bc52',
      adUnitCode: '/12345/ThirdAdHere',
    })
  })

  it('does not call LogUserRevenueMutation when the ad info is null', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const firstAd = wrapper.find(AdComponent).at(0)
    const secondAd = wrapper.find(AdComponent).at(1)

    const mockDisplayedAdInfo = {
      adId: 'first-ad-here',
      revenue: 0.0123,
      encodedRevenue: 'encoded-first-ad',
      GAMAdvertiserId: 1111,
      GAMAdUnitId: '/12345/SomeAdUnit',
      adSize: '728x90',
    }

    // Call each Ad's onAdDisplayed with a mock ad info.
    firstAd.prop('onAdDisplayed')(mockDisplayedAdInfo)
    secondAd.prop('onAdDisplayed')(null) // no ad

    expect(LogUserRevenueMutation).toHaveBeenCalledTimes(1)
    expect(LogUserRevenueMutation.mock.calls[0][0]).toEqual({
      userId: 'abc-123',
      revenue: 0.0123,
      encodedRevenue: {
        encodingType: 'AMAZON_CPM',
        encodedValue: 'encoded-first-ad',
      },
      dfpAdvertiserId: '1111',
      adSize: '728x90',
      aggregationOperation: 'MAX',
      tabId: '101b73c7-468c-4d29-b224-0c07f621bc52',
      adUnitCode: '/12345/SomeAdUnit',
    })
  })

  it('does not include encodedRevenue in the LogUserRevenueMutation when the encodedRevenue value is nil', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const firstAd = wrapper.find(AdComponent).at(0)

    const mockDisplayedAdInfo = {
      adId: 'first-ad-here',
      revenue: 0.0123,
      encodedRevenue: null, // no encodedRevenue
      GAMAdvertiserId: 1111,
      GAMAdUnitId: '/12345/SomeAdUnit',
      adSize: '728x90',
    }

    // Call each Ad's onAdDisplayed with a mock ad info.
    firstAd.prop('onAdDisplayed')(mockDisplayedAdInfo)

    expect(LogUserRevenueMutation).toHaveBeenCalledTimes(1)
    expect(LogUserRevenueMutation.mock.calls[0][0]).toEqual({
      userId: 'abc-123',
      revenue: 0.0123,
      // no encodedRevenue value
      dfpAdvertiserId: '1111',
      adSize: '728x90',
      aggregationOperation: null,
      tabId: '101b73c7-468c-4d29-b224-0c07f621bc52',
      adUnitCode: '/12345/SomeAdUnit',
    })
  })

  it('does not render any ad components when 0 ads are enabled', () => {
    getAdUnits.mockReturnValue({})
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(AdComponent).length).toBe(0)
  })

  it('renders the expected 1 ad component when 1 ad is enabled', () => {
    getAdUnits.mockReturnValue({
      leaderboard: {
        // The long leaderboard ad.
        adId: 'div-gpt-ad-1464385677836-0',
        adUnitId: '/43865596/HBTL',
        sizes: [[728, 90]],
      },
    })
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(AdComponent).length).toBe(1)
    const leaderboardAd = wrapper.find(AdComponent).at(0)
    expect(leaderboardAd.prop('adId')).toBe(getAdUnits().leaderboard.adId)
  })

  it('renders the expected 2 ad components when 2 ads are enabled', () => {
    getAdUnits.mockReturnValue({
      leaderboard: {
        // The long leaderboard ad.
        adId: 'div-gpt-ad-1464385677836-0',
        adUnitId: '/43865596/HBTL',
        sizes: [[728, 90]],
      },
      rectangleAdPrimary: {
        // The primary rectangle ad (bottom-right).
        adId: 'div-gpt-ad-1464385742501-0',
        adUnitId: '/43865596/HBTR',
        sizes: [[300, 250]],
      },
    })
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(AdComponent).length).toBe(2)
    const rectangleAd = wrapper.find(AdComponent).at(0)
    const leaderboardAd = wrapper.find(AdComponent).at(1)
    expect(rectangleAd.prop('adId')).toBe(getAdUnits().rectangleAdPrimary.adId)
    expect(leaderboardAd.prop('adId')).toBe(getAdUnits().leaderboard.adId)
  })

  it('renders the expected 3 ad components when 3 ads are enabled', () => {
    getAdUnits.mockReturnValue({
      leaderboard: {
        // The long leaderboard ad.
        adId: 'div-gpt-ad-1464385677836-0',
        adUnitId: '/43865596/HBTL',
        sizes: [[728, 90]],
      },
      rectangleAdPrimary: {
        // The primary rectangle ad (bottom-right).
        adId: 'div-gpt-ad-1464385742501-0',
        adUnitId: '/43865596/HBTR',
        sizes: [[300, 250]],
      },
      rectangleAdSecondary: {
        // The second rectangle ad (right side, above the first).
        adId: 'div-gpt-ad-1539903223131-0',
        adUnitId: '/43865596/HBTR2',
        sizes: [[300, 250]],
      },
    })
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(AdComponent).length).toBe(3)
    const rectangleAdNumberTwo = wrapper.find(AdComponent).at(0)
    const rectangleAd = wrapper.find(AdComponent).at(1)
    const leaderboardAd = wrapper.find(AdComponent).at(2)
    expect(rectangleAd.prop('adId')).toBe(getAdUnits().rectangleAdPrimary.adId)
    expect(rectangleAdNumberTwo.prop('adId')).toBe(
      getAdUnits().rectangleAdSecondary.adId
    )
    expect(leaderboardAd.prop('adId')).toBe(getAdUnits().leaderboard.adId)
  })

  it('does not render any ad components until the user is defined', () => {
    getAdUnits.mockReturnValue({
      leaderboard: {
        // The long leaderboard ad.
        adId: 'div-gpt-ad-1464385677836-0',
        adUnitId: '/43865596/HBTL',
        sizes: [[728, 90]],
      },
      rectangleAdPrimary: {
        // The primary rectangle ad (bottom-right).
        adId: 'div-gpt-ad-1464385742501-0',
        adUnitId: '/43865596/HBTR',
        sizes: [[300, 250]],
      },
      rectangleAdSecondary: {
        // The second rectangle ad (right side, above the first).
        adId: 'div-gpt-ad-1539903223131-0',
        adUnitId: '/43865596/HBTR2',
        sizes: [[300, 250]],
      },
    })
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const mockPropsWithoutUser = {
      ...mockProps,
      user: null,
    }
    const wrapper = shallow(<DashboardComponent {...mockPropsWithoutUser} />)

    // No ads rendered yet.
    expect(wrapper.find(AdComponent).length).toBe(0)

    // Now that the user is defined, the ads should load.
    wrapper.setProps({
      user: mockProps.user,
    })
    expect(wrapper.find(AdComponent).length).toBe(3)
  })

  it('does not render any ad components if the tabId is not set in state', () => {
    getAdUnits.mockReturnValue({
      leaderboard: {
        // The long leaderboard ad.
        adId: 'div-gpt-ad-1464385677836-0',
        adUnitId: '/43865596/HBTL',
        sizes: [[728, 90]],
      },
      rectangleAdPrimary: {
        // The primary rectangle ad (bottom-right).
        adId: 'div-gpt-ad-1464385742501-0',
        adUnitId: '/43865596/HBTR',
        sizes: [[300, 250]],
      },
      rectangleAdSecondary: {
        // The second rectangle ad (right side, above the first).
        adId: 'div-gpt-ad-1539903223131-0',
        adUnitId: '/43865596/HBTR2',
        sizes: [[300, 250]],
      },
    })
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default

    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    wrapper.setState({ tabId: null })

    // No ads should be rendered.
    expect(wrapper.find(AdComponent).length).toBe(0)

    // Now that the tab ID is defined, the ads should load.
    wrapper.setState({
      tabId: 'abc-123',
    })
    expect(wrapper.find(AdComponent).length).toBe(3)
  })

  it('the ads have expected IDs matched with their sizes', () => {
    getAdUnits.mockReturnValue({
      leaderboard: {
        // The long leaderboard ad.
        adId: 'div-gpt-ad-1464385677836-0',
        adUnitId: '/43865596/HBTL',
        sizes: [[728, 90]],
      },
      rectangleAdPrimary: {
        // The primary rectangle ad (bottom-right).
        adId: 'div-gpt-ad-1464385742501-0',
        adUnitId: '/43865596/HBTR',
        sizes: [[300, 250]],
      },
      rectangleAdSecondary: {
        // The second rectangle ad (right side, above the first).
        adId: 'div-gpt-ad-1539903223131-0',
        adUnitId: '/43865596/HBTR2',
        sizes: [[300, 250]],
      },
    })
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const rectangleAdNumberTwo = wrapper.find(AdComponent).at(0)
    const rectangleAd = wrapper.find(AdComponent).at(1)
    const leaderboardAd = wrapper.find(AdComponent).at(2)
    expect(rectangleAd.prop('adId')).toBe(getAdUnits().rectangleAdPrimary.adId)
    expect(rectangleAd.prop('style').minWidth).toBe(300)
    expect(rectangleAdNumberTwo.prop('adId')).toBe(
      getAdUnits().rectangleAdSecondary.adId
    )
    expect(rectangleAdNumberTwo.prop('style').minWidth).toBe(300)
    expect(leaderboardAd.prop('adId')).toBe(getAdUnits().leaderboard.adId)
    expect(leaderboardAd.prop('style').minWidth).toBe(728)
  })
})

describe('Dashboard component: global notification', () => {
  it('renders a notification when one is live and the user has not dismissed it', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    showGlobalNotification.mockReset()
    hasUserDismissedNotificationRecently.mockReset()
    showGlobalNotification.mockReturnValueOnce(true)
    hasUserDismissedNotificationRecently.mockReturnValueOnce(false)
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find('[data-test-id="global-notification"]').length).toBe(1)
  })

  it('does not render a notification when one is not live', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    showGlobalNotification.mockReset()
    hasUserDismissedNotificationRecently.mockReset()
    showGlobalNotification.mockReturnValueOnce(false)
    hasUserDismissedNotificationRecently.mockReturnValueOnce(false)
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find('[data-test-id="global-notification"]').length).toBe(0)
  })

  it('does not render a notification when one is live but the user has dismissed it', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    showGlobalNotification.mockReset()
    hasUserDismissedNotificationRecently.mockReset()
    showGlobalNotification.mockReturnValueOnce(true)
    hasUserDismissedNotificationRecently.mockReturnValueOnce(true)
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find('[data-test-id="global-notification"]').length).toBe(0)
  })

  it('sets the "useGlobalDismissalTime" on the global notification', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    showGlobalNotification.mockReset()
    hasUserDismissedNotificationRecently.mockReset()
    showGlobalNotification.mockReturnValueOnce(true)
    hasUserDismissedNotificationRecently.mockReturnValueOnce(false)
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(
      wrapper
        .find('[data-test-id="global-notification"]')
        .prop('useGlobalDismissalTime')
    ).toBe(true)
  })

  it('hides the notification when the onDismiss callback is called', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    showGlobalNotification.mockReset()
    hasUserDismissedNotificationRecently.mockReset()
    showGlobalNotification.mockReturnValueOnce(true)
    hasUserDismissedNotificationRecently.mockReturnValueOnce(false)
    const wrapper = shallow(<DashboardComponent {...mockProps} />)

    // Notification should be visible.
    expect(wrapper.find('[data-test-id="global-notification"]').length).toBe(1)

    // Mock that the user dismisses the notification.
    wrapper.find('[data-test-id="global-notification"]').prop('onDismiss')()

    // Notification should be gone.
    expect(wrapper.find('[data-test-id="global-notification"]').length).toBe(0)
  })
})

describe('Dashboard component: search intro message', () => {
  beforeEach(() => {
    getUserExperimentGroup.mockReturnValue('none')
    hasUserClickedNewTabSearchIntroNotif.mockReturnValue(false)
    showSearchIntroductionMessage.mockReturnValue(true)
  })

  // Showing the intro globally now that the experiment is finished.
  it('[none group] renders the search intro notification when the user is not in the experiment', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('none')
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find('[data-test-id="search-intro-notif"]').exists()).toBe(
      true
    )
  })

  it('does not show the search intro notification when the "search intro" feature flag is disabled', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default

    // Disable the feature.
    showSearchIntroductionMessage.mockReturnValue(false)

    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find('[data-test-id="search-intro-notif"]').exists()).toBe(
      false
    )
  })

  // Showing the intro globally now that the experiment is finished.
  it('[control group] renders the search intro notification when the user is in the control group', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('noIntro')
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find('[data-test-id="search-intro-notif"]').exists()).toBe(
      true
    )
  })

  it('[search-intro-A] renders the search intro notification when the user is in the search-intro-A group', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('introA')
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const elem = wrapper.find('[data-test-id="search-intro-notif"]')
    expect(elem.exists()).toBe(true)
    expect(elem.prop('title')).toEqual(`We're working on Search for a Cause`)
  })

  it('[search-intro-homepage] renders the search intro notification when the user is in the search-intro-homepage group', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('introHomepage')
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const elem = wrapper.find('[data-test-id="search-intro-notif"]')
    expect(elem.exists()).toBe(true)
    expect(elem.prop('title')).toEqual(`We're working on Search for a Cause`)
  })

  it('does not render the search intro notification when the user has opened fewer than 4 tabs', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.tabs = 2
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    expect(wrapper.find('[data-test-id="search-intro-notif"]').exists()).toBe(
      false
    )
    wrapper.setProps({
      user: {
        ...modifiedProps.user,
        tabs: 4,
      },
    })
    expect(wrapper.find('[data-test-id="search-intro-notif"]').exists()).toBe(
      true
    )
  })

  it('does not render the search intro notification when the user has opened more than 99 tabs', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.tabs = 99
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    expect(wrapper.find('[data-test-id="search-intro-notif"]').exists()).toBe(
      true
    )
    wrapper.setProps({
      user: {
        ...modifiedProps.user,
        tabs: 100,
      },
    })
    expect(wrapper.find('[data-test-id="search-intro-notif"]').exists()).toBe(
      false
    )
  })

  it('does not render the search intro notification if the user has already searched', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.searches = 1
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    const elem = wrapper.find('[data-test-id="search-intro-notif"]')
    expect(elem.exists()).toBe(false)
  })

  it('does not render the search intro notification when the user has previously clicked it in the experiment', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.experimentActions.searchIntro = 'CLICK'
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    const elem = wrapper.find('[data-test-id="search-intro-notif"]')
    expect(elem.exists()).toBe(false)
  })

  it('does not render the search intro notification when the user has previously dismissed it in the experiment', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.experimentActions.searchIntro = 'DISMISS'
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    const elem = wrapper.find('[data-test-id="search-intro-notif"]')
    expect(elem.exists()).toBe(false)
  })

  it('renders the search intro notification if the user has not taken any action in the experiment', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.experimentActions.searchIntro = 'NONE'
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    const elem = wrapper.find('[data-test-id="search-intro-notif"]')
    expect(elem.exists()).toBe(true)
  })

  it('does not render the search intro notification if the user has previously interacted with it', () => {
    hasUserClickedNewTabSearchIntroNotif.mockReturnValue(true)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const modifiedProps = cloneDeep(mockProps)
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    const elem = wrapper.find('[data-test-id="search-intro-notif"]')
    expect(elem.exists()).toBe(false)
  })

  it('hides the search intro when the onClick callback is called', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find('[data-test-id="search-intro-notif"]').exists()).toBe(
      true
    )
    wrapper.find('[data-test-id="search-intro-notif"]').prop('onClick')()
    expect(wrapper.find('[data-test-id="search-intro-notif"]').exists()).toBe(
      false
    )
  })

  it('saves the search intro click action to local storage when the onClick callback is called', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find('[data-test-id="search-intro-notif"]').exists()).toBe(
      true
    )
    wrapper.find('[data-test-id="search-intro-notif"]').prop('onClick')()
    expect(setUserClickedNewTabSearchIntroNotif).toHaveBeenCalledTimes(1)
  })

  it('hides the search intro when the onDismiss callback is called', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find('[data-test-id="search-intro-notif"]').exists()).toBe(
      true
    )
    wrapper.find('[data-test-id="search-intro-notif"]').prop('onDismiss')()
    expect(wrapper.find('[data-test-id="search-intro-notif"]').exists()).toBe(
      false
    )
  })

  it('saves the search intro click action to local storage when the onDismiss callback is called', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find('[data-test-id="search-intro-notif"]').exists()).toBe(
      true
    )
    wrapper.find('[data-test-id="search-intro-notif"]').prop('onDismiss')()
    expect(setUserClickedNewTabSearchIntroNotif).toHaveBeenCalledTimes(1)
  })

  it('links to the Chrome web store when the user clicks the search intro action button on a Chrome browser', async () => {
    expect.assertions(1)
    detectSupportedBrowser.mockReturnValue(CHROME_BROWSER)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="search-intro-notif"]').prop('buttonURL')
    ).toEqual(searchChromeExtensionPage)
  })

  it('links to the Firefox addons store when the user clicks the search intro action button on a Firefox browser', async () => {
    expect.assertions(1)
    detectSupportedBrowser.mockReturnValue(FIREFOX_BROWSER)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="search-intro-notif"]').prop('buttonURL')
    ).toEqual(searchFirefoxExtensionPage)
  })

  it('links to the Chrome web store when the user clicks the search intro action button on an unsupported browser', async () => {
    expect.assertions(1)
    detectSupportedBrowser.mockReturnValue(UNSUPPORTED_BROWSER)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="search-intro-notif"]').prop('buttonURL')
    ).toEqual(searchChromeExtensionPage)
  })

  it('does NOT log the search intro experiment action when the onClick callback is called', async () => {
    expect.assertions(1)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    await wrapper.find('[data-test-id="search-intro-notif"]').prop('onClick')()
    expect(LogUserExperimentActionsMutation).not.toHaveBeenCalled()
  })

  it('does NOT log the search intro experiment action when the onDismiss callback is called', async () => {
    expect.assertions(1)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    await wrapper
      .find('[data-test-id="search-intro-notif"]')
      .prop('onDismiss')()
    expect(LogUserExperimentActionsMutation).not.toHaveBeenCalled()
  })

  it('does not set the "useGlobalDismissalTime" on the experiment notification', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const elem = wrapper.find('[data-test-id="search-intro-notif"]')
    expect(elem.prop('useGlobalDismissalTime')).toBe(false)
  })
})

describe('Dashboard component: sparkly search intro button', () => {
  beforeEach(() => {
    getUserExperimentGroup.mockReturnValue('none')
    hasUserClickedNewTabSearchIntroNotif.mockReturnValue(false)
    hasUserClickedNewTabSearchIntroNotifV2.mockReturnValue(false)
    showSearchIntroductionMessage.mockReturnValue(true)
  })

  it('shows the sparkly search intro button when the user has not already clicked it, has opened more than 150 tabs, and has not already searched', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.tabs = 160
    modifiedProps.user.searches = 0
    hasUserClickedNewTabSearchIntroNotifV2.mockReturnValue(false)
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    expect(wrapper.find(UserMenu).prop('showSparklySearchIntroButton')).toBe(
      true
    )
  })

  it('does not shows the sparkly search intro button when the user has already searched', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.tabs = 160
    modifiedProps.user.searches = 1
    hasUserClickedNewTabSearchIntroNotifV2.mockReturnValue(false)
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    expect(wrapper.find(UserMenu).prop('showSparklySearchIntroButton')).toBe(
      false
    )
  })

  it('does not show the sparkly search intro button when the user has opened fewer than 151 tabs', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.tabs = 150
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    expect(wrapper.find(UserMenu).prop('showSparklySearchIntroButton')).toBe(
      false
    )
    wrapper.setProps({
      user: {
        ...modifiedProps.user,
        tabs: 151,
      },
    })
    expect(wrapper.find(UserMenu).prop('showSparklySearchIntroButton')).toBe(
      true
    )
  })

  it('does not show the search intro button when the user has previously clicked it', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.tabs = 160
    hasUserClickedNewTabSearchIntroNotifV2.mockReturnValue(true)
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    expect(wrapper.find(UserMenu).prop('showSparklySearchIntroButton')).toBe(
      false
    )
  })

  it('hides the search intro button when the UserMenu onClickSparklySearchIntroButton callback is called', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.tabs = 160
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    hasUserClickedNewTabSearchIntroNotifV2.mockReturnValue(false)
    expect(wrapper.find(UserMenu).prop('showSparklySearchIntroButton')).toBe(
      true
    )
    wrapper.find(UserMenu).prop('onClickSparklySearchIntroButton')()
    wrapper.update()
    expect(wrapper.find(UserMenu).prop('showSparklySearchIntroButton')).toBe(
      false
    )
  })

  it('saves the search intro click action to local storage when the UserMenu onClickSparklySearchIntroButton callback is called', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.tabs = 160
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    wrapper.find(UserMenu).prop('onClickSparklySearchIntroButton')()
    expect(setUserClickedNewTabSearchIntroNotifV2).toHaveBeenCalledTimes(1)
  })

  it('hides the search intro button when the UserMenu onClickSparklySearchIntroButton callback is called', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.tabs = 160
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    expect(wrapper.find(UserMenu).prop('showSparklySearchIntroButton')).toBe(
      true
    )
    wrapper.find(UserMenu).prop('onClickSparklySearchIntroButton')()
    expect(wrapper.find(UserMenu).prop('showSparklySearchIntroButton')).toBe(
      false
    )
  })

  it('passes the browser name to the UserMenu component', async () => {
    expect.assertions(1)
    detectSupportedBrowser.mockReturnValue(FIREFOX_BROWSER)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.tabs = 160
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    expect(wrapper.find(UserMenu).prop('browser')).toEqual('firefox')
  })

  it('does not show the sparkly search intro button when the "search intro" feature flag is disabled', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default

    // Disable the feature.
    showSearchIntroductionMessage.mockReturnValue(false)

    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.tabs = 160
    modifiedProps.user.searches = 0
    hasUserClickedNewTabSearchIntroNotifV2.mockReturnValue(false)
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    expect(wrapper.find(UserMenu).prop('showSparklySearchIntroButton')).toBe(
      false
    )
  })
})

describe('Dashboard component: referral notification experiment', () => {
  it('[referral-notification-experiment] does not render the notification when the user is not in the experiment', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('none')
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="experiment-referral-notification"]').exists()
    ).toBe(false)
  })

  it('[referral-notification-experiment] does not render the notification when the user is in the control group', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('noNotification')
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="experiment-referral-notification"]').exists()
    ).toBe(false)
  })

  it('[referral-notification-experiment] renders the notification when the user is in an experimental group', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('copyA')
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const elem = wrapper.find(
      '[data-test-id="experiment-referral-notification"]'
    )
    expect(elem.exists()).toBe(true)
  })

  it('[referral-notification-experiment] does not render the notification when the user has previously clicked it', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('copyA')
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.experimentActions.referralNotification = 'CLICK'
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    const elem = wrapper.find(
      '[data-test-id="experiment-referral-notification"]'
    )
    expect(elem.exists()).toBe(false)
  })

  it('[referral-notification-experiment] does not render the notification when the user has previously dismissed it', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('copyA')
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.experimentActions.referralNotification = 'DISMISS'
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    const elem = wrapper.find(
      '[data-test-id="experiment-referral-notification"]'
    )
    expect(elem.exists()).toBe(false)
  })

  it('[referral-notification-experiment] does render the notification if the user has not taken any action', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('copyA')
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.experimentActions.referralNotification = 'NONE'
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    const elem = wrapper.find(
      '[data-test-id="experiment-referral-notification"]'
    )
    expect(elem.exists()).toBe(true)
  })

  it('[referral-notification-experiment] hides the search intro when the onClick callback is called', async () => {
    expect.assertions(2)
    getUserExperimentGroup.mockReturnValue('copyA')
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="experiment-referral-notification"]').length
    ).toBe(1)
    await wrapper
      .find('[data-test-id="experiment-referral-notification"]')
      .prop('onClick')()
    expect(
      wrapper.find('[data-test-id="experiment-referral-notification"]').length
    ).toBe(0)
  })

  it('[referral-notification-experiment] hides the search intro when the onDismiss callback is called', async () => {
    expect.assertions(2)
    getUserExperimentGroup.mockReturnValue('copyA')
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="experiment-referral-notification"]').length
    ).toBe(1)
    await wrapper
      .find('[data-test-id="experiment-referral-notification"]')
      .prop('onDismiss')()
    expect(
      wrapper.find('[data-test-id="experiment-referral-notification"]').length
    ).toBe(0)
  })

  it('[referral-notification-experiment] logs the search intro experiment action when the onClick callback is called', async () => {
    expect.assertions(1)
    getUserExperimentGroup.mockReturnValue('copyA')
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    await wrapper
      .find('[data-test-id="experiment-referral-notification"]')
      .prop('onClick')()
    expect(LogUserExperimentActionsMutation).toHaveBeenCalledWith({
      userId: 'abc-123',
      experimentActions: {
        referralNotification: 'CLICK',
      },
    })
  })

  it('[referral-notification-experiment] logs the search intro experiment action when the onDismiss callback is called', async () => {
    expect.assertions(1)
    getUserExperimentGroup.mockReturnValue('copyA')
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    await wrapper
      .find('[data-test-id="experiment-referral-notification"]')
      .prop('onDismiss')()
    expect(LogUserExperimentActionsMutation).toHaveBeenCalledWith({
      userId: 'abc-123',
      experimentActions: {
        referralNotification: 'DISMISS',
      },
    })
  })

  it('[referral-notification-experiment] navigates to the "invite friends" page when the user clicks the referral notification action button', async () => {
    expect.assertions(1)
    getUserExperimentGroup.mockReturnValue('copyA')
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    await wrapper
      .find('[data-test-id="experiment-referral-notification"]')
      .prop('onClick')()
    expect(goTo).toHaveBeenCalledWith(inviteFriendsURL)
  })

  it('[referral-notification-experiment] [copyA] renders the expected copy', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('copyA')
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const elem = wrapper.find(
      '[data-test-id="experiment-referral-notification"]'
    )
    expect(elem.prop('title')).toEqual(`Together we can change the world!`)
    expect(
      elem
        .prop('message')
        .indexOf('Tab for a Cause is likely the easiest way to raise') > -1
    ).toBe(true)
  })

  it('[referral-notification-experiment] [copyB] renders the expected copy', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('copyB')
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const elem = wrapper.find(
      '[data-test-id="experiment-referral-notification"]'
    )
    expect(elem.prop('title')).toEqual(`Earn more hearts!`)
    expect(
      elem
        .prop('message')
        .indexOf("Spread the word about Tab for a Cause and you'll earn") > -1
    ).toBe(true)
  })

  it('[referral-notification-experiment] [copyC] renders the expected copy', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('copyC')
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const elem = wrapper.find(
      '[data-test-id="experiment-referral-notification"]'
    )
    expect(elem.prop('title')).toEqual(`Recruit your first friend`)
    expect(
      elem
        .prop('message')
        .indexOf("It looks like you haven't gotten any friends to join") > -1
    ).toBe(true)
  })

  it('[referral-notification-experiment] [copyD] renders the expected copy', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('copyD')
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const elem = wrapper.find(
      '[data-test-id="experiment-referral-notification"]'
    )
    expect(elem.prop('title')).toEqual(`Help spread the word!`)
    expect(
      elem
        .prop('message')
        .indexOf("Sadly, most people don't know that Tab for a Cause exists.") >
        -1
    ).toBe(true)
  })

  it('[referral-notification-experiment] [copyE] renders the expected copy', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('copyE')
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const elem = wrapper.find(
      '[data-test-id="experiment-referral-notification"]'
    )
    expect(elem.prop('title')).toEqual(`Double your charitable impact!`)
    expect(
      elem
        .prop('message')
        .indexOf('Get a friend to join you on Tab for a Cause, and together') >
        -1
    ).toBe(true)
  })
})

describe('Dashboard component: campaign reopen click', () => {
  beforeEach(() => {
    hasUserDismissedCampaignRecently.mockReturnValueOnce(true)
  })

  it('passes showCampaignReopenButton === true to the UserMenu when hasUserDismissedCampaignRecently is true and the campaign is live', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const mockPropsWithCampaignLive = {
      ...mockProps,
      app: {
        ...mockProps.app,
        campaign: {
          ...mockProps.app.campaign,
          isLive: true,
        },
      },
    }
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithCampaignLive} />
    )
    hasUserDismissedCampaignRecently.mockReturnValueOnce(true)
    expect(wrapper.find(UserMenu).prop('showCampaignReopenButton')).toBe(true)
    wrapper.setState({ hasUserDismissedCampaignRecently: false })
    expect(wrapper.find(UserMenu).prop('showCampaignReopenButton')).toBe(false)
  })

  it('passes showCampaignReopenButton === false to the UserMenu when hasUserDismissedCampaignRecently is true but the campaign is not live', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default

    const mockPropsWithCampaignNotLive = {
      ...mockProps,
      app: {
        ...mockProps.app,
        campaign: {
          ...mockProps.app.campaign,
          isLive: false,
        },
      },
    }
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithCampaignNotLive} />
    )
    hasUserDismissedCampaignRecently.mockReturnValueOnce(true)
    expect(wrapper.find(UserMenu).prop('showCampaignReopenButton')).toBe(false)
  })

  it('reopens the campaign when the UserMenu calls the onClickCampaignReopen function', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)

    // It would be better to directly test that the campaign is rendered.
    // We're not doing that because of lack of Enzyme support for lazy/Suspense
    // (see notes above).
    expect(wrapper.state('hasUserDismissedCampaignRecently')).toBe(true)
    const callback = wrapper.find(UserMenu).prop('onClickCampaignReopen')
    callback()
    expect(wrapper.state('hasUserDismissedCampaignRecently')).toBe(false)
  })

  it('deletes local "campaign dismissed" state when the UserMenu calls the onClickCampaignReopen function', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)

    expect(removeCampaignDismissTime).not.toHaveBeenCalled()
    expect(wrapper.state('hasUserDismissedCampaignRecently')).toBe(true)
    const callback = wrapper.find(UserMenu).prop('onClickCampaignReopen')
    callback()
    expect(removeCampaignDismissTime).toHaveBeenCalledTimes(1)
  })
})
