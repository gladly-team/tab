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
import Ad from 'js/components/Ad/Ad'
import LogTab from 'js/components/Dashboard/LogTabContainer'
import LogRevenue from 'js/components/Dashboard/LogRevenueContainer'
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
  searchChromeExtensionPage,
  searchFirefoxExtensionPage,
} from 'js/navigation/navigation'
import {
  getNumberOfAdsToShow,
  shouldShowAdExplanation,
  VERTICAL_AD_SLOT_DOM_ID,
  SECOND_VERTICAL_AD_SLOT_DOM_ID,
  HORIZONTAL_AD_SLOT_DOM_ID,
} from 'js/ads/adSettings'
import {
  setUserDismissedAdExplanation,
  hasUserDismissedNotificationRecently,
} from 'js/utils/local-user-data-mgr'
import { showGlobalNotification } from 'js/utils/feature-flags'
import { getUserExperimentGroup } from 'js/utils/experiments'
import { detectSupportedBrowser } from 'js/utils/detectBrowser'
import LogUserExperimentActionsMutation from 'js/mutations/LogUserExperimentActionsMutation'

jest.mock('js/analytics/logEvent')
jest.mock('js/utils/localstorage-mgr')
jest.mock('js/authentication/user')
jest.mock('js/navigation/navigation')
jest.mock('js/ads/adSettings')
jest.mock('js/utils/local-user-data-mgr')
jest.mock('js/utils/feature-flags')
jest.mock('js/utils/experiments')
jest.mock('js/utils/detectBrowser')
jest.mock('js/mutations/LogUserExperimentActionsMutation')

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
    tabs: 12,
    experimentActions: {},
  },
  app: {
    isGlobalCampaignLive: false,
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

  // TODO: enable when Enzyme supports React.Suspense:
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

  it('does not render any ad components when 0 ads are enabled', () => {
    getNumberOfAdsToShow.mockReturnValue(0)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(Ad).length).toBe(0)
  })

  it('renders the expected 1 ad component when 1 ad is enabled', () => {
    getNumberOfAdsToShow.mockReturnValue(1)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(Ad).length).toBe(1)
    const leaderboardAd = wrapper.find(Ad).at(0)
    expect(leaderboardAd.prop('adId')).toBe(HORIZONTAL_AD_SLOT_DOM_ID)
  })

  it('renders the expected 2 ad components when 2 ads are enabled', () => {
    getNumberOfAdsToShow.mockReturnValue(2)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(Ad).length).toBe(2)
    const rectangleAd = wrapper.find(Ad).at(0)
    const leaderboardAd = wrapper.find(Ad).at(1)
    expect(rectangleAd.prop('adId')).toBe(VERTICAL_AD_SLOT_DOM_ID)
    expect(leaderboardAd.prop('adId')).toBe(HORIZONTAL_AD_SLOT_DOM_ID)
  })

  it('renders the expected 3 ad components when 3 ads are enabled', () => {
    getNumberOfAdsToShow.mockReturnValue(3)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(Ad).length).toBe(3)
    const rectangleAdNumberTwo = wrapper.find(Ad).at(0)
    const rectangleAd = wrapper.find(Ad).at(1)
    const leaderboardAd = wrapper.find(Ad).at(2)
    expect(rectangleAd.prop('adId')).toBe(VERTICAL_AD_SLOT_DOM_ID)
    expect(rectangleAdNumberTwo.prop('adId')).toBe(
      SECOND_VERTICAL_AD_SLOT_DOM_ID
    )
    expect(leaderboardAd.prop('adId')).toBe(HORIZONTAL_AD_SLOT_DOM_ID)
  })

  it('the ads have expected IDs matched with their sizes', () => {
    getNumberOfAdsToShow.mockReturnValue(3)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const rectangleAdNumberTwo = wrapper.find(Ad).at(0)
    const rectangleAd = wrapper.find(Ad).at(1)
    const leaderboardAd = wrapper.find(Ad).at(2)
    expect(rectangleAd.prop('adId')).toBe(VERTICAL_AD_SLOT_DOM_ID)
    expect(rectangleAd.prop('style').minWidth).toBe(300)
    expect(rectangleAdNumberTwo.prop('adId')).toBe(
      SECOND_VERTICAL_AD_SLOT_DOM_ID
    )
    expect(rectangleAdNumberTwo.prop('style').minWidth).toBe(300)
    expect(leaderboardAd.prop('adId')).toBe(HORIZONTAL_AD_SLOT_DOM_ID)
    expect(leaderboardAd.prop('style').minWidth).toBe(728)
  })

  it('renders LogTab component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(LogTab).length).toBe(1)
  })

  it('renders LogRevenue component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(LogRevenue).length).toBe(1)
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

  // Disabling test until Enzyme support React.lazy and React.Suspense:
  // https://github.com/airbnb/enzyme/issues/1917
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

  it('does not render LogRevenue component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(<DashboardComponent {...mockPropsWithoutUser} />)
    expect(wrapper.find(LogRevenue).length).toBe(0)
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

  it('does not render the ErrorMessage component when no error message is set', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find(ErrorMessage).length).toBe(0)
  })

  it('renders the ErrorMessage component when WidgetsContainer calls its "showError" prop', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    wrapper.find(WidgetsContainer).prop('showError')('Big widget problem!')
    wrapper.update()
    expect(wrapper.find(ErrorMessage).length).toBe(1)
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

  it('[search-intro-A] does not render the search intro notification when the user is in the control group', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('none')
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find('[data-test-id="search-intro-a"]').exists()).toBe(false)
  })

  it('[search-intro-A] renders the search intro notification when the user is in the experimental group', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('introA')
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    const elem = wrapper.find('[data-test-id="search-intro-a"]')
    expect(elem.exists()).toBe(true)
    expect(elem.prop('title')).toEqual(`Introducing Search for a Cause`)
  })

  it('[search-intro-A] does not render the search intro notification when the user has previously clicked it', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('introA')
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.experimentActions.searchIntro = 'CLICK'
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    const elem = wrapper.find('[data-test-id="search-intro-a"]')
    expect(elem.exists()).toBe(false)
  })

  it('[search-intro-A] does not render the search intro notification when the user has previously dismissed it', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('introA')
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.experimentActions.searchIntro = 'DISMISS'
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    const elem = wrapper.find('[data-test-id="search-intro-a"]')
    expect(elem.exists()).toBe(false)
  })

  it('[search-intro-A] does render the search intro notification if the user has not taken any action', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    getUserExperimentGroup.mockReturnValue('introA')
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.experimentActions.searchIntro = 'NONE'
    const wrapper = shallow(<DashboardComponent {...modifiedProps} />)
    const elem = wrapper.find('[data-test-id="search-intro-a"]')
    expect(elem.exists()).toBe(true)
  })

  it('[search-intro-A] hides the search intro when the onClick callback is called', async () => {
    expect.assertions(2)
    getUserExperimentGroup.mockReturnValue('introA')
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find('[data-test-id="search-intro-a"]').length).toBe(1)
    await wrapper.find('[data-test-id="search-intro-a"]').prop('onClick')()
    expect(wrapper.find('[data-test-id="search-intro-a"]').length).toBe(0)
  })

  it('[search-intro-A] hides the search intro when the onDismiss callback is called', async () => {
    expect.assertions(2)
    getUserExperimentGroup.mockReturnValue('introA')
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    expect(wrapper.find('[data-test-id="search-intro-a"]').length).toBe(1)
    await wrapper.find('[data-test-id="search-intro-a"]').prop('onDismiss')()
    expect(wrapper.find('[data-test-id="search-intro-a"]').length).toBe(0)
  })

  it('[search-intro-A] logs the search intro experiment action when the onClick callback is called', async () => {
    expect.assertions(1)
    getUserExperimentGroup.mockReturnValue('introA')
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    await wrapper.find('[data-test-id="search-intro-a"]').prop('onClick')()
    expect(LogUserExperimentActionsMutation).toHaveBeenCalledWith({
      userId: 'abc-123',
      experimentActions: {
        searchIntro: 'CLICK',
      },
    })
  })

  it('[search-intro-A] logs the search intro experiment action when the onDismiss callback is called', async () => {
    expect.assertions(1)
    getUserExperimentGroup.mockReturnValue('introA')
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    await wrapper.find('[data-test-id="search-intro-a"]').prop('onDismiss')()
    expect(LogUserExperimentActionsMutation).toHaveBeenCalledWith({
      userId: 'abc-123',
      experimentActions: {
        searchIntro: 'DISMISS',
      },
    })
  })

  it('[search-intro-A] redirects to the Chrome web store when the user clicks the search intro action button on a Chrome browser', async () => {
    expect.assertions(1)
    detectSupportedBrowser.mockReturnValue(CHROME_BROWSER)
    getUserExperimentGroup.mockReturnValue('introA')
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    await wrapper.find('[data-test-id="search-intro-a"]').prop('onClick')()
    expect(goTo).toHaveBeenCalledWith(searchChromeExtensionPage)
  })

  it('[search-intro-A] redirects to the Firefox addons store when the user clicks the search intro action button on a Firefox browser', async () => {
    expect.assertions(1)
    detectSupportedBrowser.mockReturnValue(FIREFOX_BROWSER)
    getUserExperimentGroup.mockReturnValue('introA')
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    await wrapper.find('[data-test-id="search-intro-a"]').prop('onClick')()
    expect(goTo).toHaveBeenCalledWith(searchFirefoxExtensionPage)
  })

  it('[search-intro-A] redirects to the Chrome web store when the user clicks the search intro action button on an unknown/unsupported browser', async () => {
    expect.assertions(1)
    detectSupportedBrowser.mockReturnValue(UNSUPPORTED_BROWSER)
    getUserExperimentGroup.mockReturnValue('introA')
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    const wrapper = shallow(<DashboardComponent {...mockProps} />)
    await wrapper.find('[data-test-id="search-intro-a"]').prop('onClick')()
    expect(goTo).toHaveBeenCalledWith(searchChromeExtensionPage)
  })
})
