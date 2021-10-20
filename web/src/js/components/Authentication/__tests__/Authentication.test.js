/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import MockDate from 'mockdate'
import { shallow } from 'enzyme'
import { Route, Switch } from 'react-router-dom'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import {
  createNewUser,
  redirectToAuthIfNeeded,
} from 'js/authentication/helpers'
import {
  goTo,
  dashboardURL,
  missingEmailMessageURL,
  searchBaseURL,
  verifyEmailURL,
} from 'js/navigation/navigation'
import { externalRedirect } from 'js/navigation/utils'
import { sendVerificationEmail } from 'js/authentication/user'
import { getBrowserExtensionInstallId } from 'js/utils/local-user-data-mgr'
import AssignExperimentGroups from 'js/components/Dashboard/AssignExperimentGroupsContainer'
import Logo from 'js/components/Logo/Logo'
import tabTheme from 'js/theme/defaultV1'
import searchTheme from 'js/theme/searchTheme'
import optIntoV4Beta from 'js/utils/v4-beta-opt-in'
import { isTabV4BetaUser, getCauseId } from 'js/utils/local-user-data-mgr'
import { STORAGE_CATS_CAUSE_ID, STORAGE_SEAS_CAUSE_ID } from 'js/constants'
import SetV4BetaMutation from 'js/mutations/SetV4BetaMutation'
import { flushAllPromises } from 'js/utils/test-utils'

jest.mock('react-router-dom')
jest.mock('js/authentication/helpers')
jest.mock('js/authentication/user')
jest.mock('js/navigation/navigation')
jest.mock('js/navigation/utils')
jest.mock('js/utils/utils')
jest.mock('js/utils/local-user-data-mgr')
jest.mock('js/components/Dashboard/AssignExperimentGroupsContainer')
jest.mock('js/components/Logo/Logo')
jest.mock('js/components/Authentication/EnterUsernameForm')
jest.mock('js/utils/v4-beta-opt-in')
jest.mock('js/mutations/SetV4BetaMutation')

const mockFetchUser = jest.fn()

const MockProps = () => {
  return {
    location: {
      pathname: '/newtab/auth/',
      search: '',
    },
    authUser: null,
    user: {
      id: null,
      username: null,
      v4BetaEnabled: false,
    },
    fetchUser: mockFetchUser,
  }
}

const mockCreateNewUserResponse = () => ({
  id: 'abc123',
  email: 'foo@bar.com',
  username: null,
  justCreated: false,
})

const mockNow = '2017-05-19T13:59:58.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))

  // Reset an unauthed user as the default.
  redirectToAuthIfNeeded.mockReturnValue(true)
  getBrowserExtensionInstallId.mockReturnValue('some-install-id')
})

afterEach(() => {
  jest.clearAllMocks()
  MockDate.reset()
})

describe('Authentication.js tests', function() {
  it('renders without error', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    shallow(<Authentication {...mockProps} />)
  })

  it('shows the Tab for a Cause logo by default with expected props', () => {
    expect.assertions(3)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)
    wrapper.update()

    const logoComponent = wrapper.find(Logo)
    expect(logoComponent.prop('brand')).toEqual('tab')
    expect(logoComponent.prop('includeText')).toBe(true)
    expect(logoComponent.prop('style')).toEqual({
      height: 40,
    })
  })

  it('shows the Tab for a Cause logo when the URL param "app" == "tab"', () => {
    expect.assertions(1)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=tab'
    const wrapper = shallow(<Authentication {...mockProps} />)
    wrapper.update()

    const logoComponent = wrapper.find(Logo)
    expect(logoComponent.prop('brand')).toEqual('tab')
  })

  it('shows the Search for a Cause logo when the URL param "app" == "search"', () => {
    expect.assertions(1)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=search'
    const wrapper = shallow(<Authentication {...mockProps} />)
    wrapper.update()

    const logoComponent = wrapper.find(Logo)
    expect(logoComponent.prop('brand')).toEqual('search')
  })

  it('shows the Tab for a Cause logo when the URL param "app" is some invalid value', () => {
    expect.assertions(1)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=foobar'
    const wrapper = shallow(<Authentication {...mockProps} />)
    wrapper.update()

    const logoComponent = wrapper.find(Logo)
    expect(logoComponent.prop('brand')).toEqual('tab')
  })

  it('displays the endorsement quote', () => {
    expect.assertions(1)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)
    wrapper.update()

    expect(wrapper.find('[data-test-id="endorsement-quote"]').length).toBe(1)
  })

  it('typically does not display the sign-in explanation', () => {
    expect.assertions(1)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)
    wrapper.update()

    expect(wrapper.find('[data-test-id="anon-sign-in-fyi"]').length).toBe(0)
  })

  it('displays the sign-in explanation (and hides the quote) when it is a mandatory sign-in', () => {
    expect.assertions(2)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.pathname = '/newtab/auth/'

    // Sign-in is mandatory when there is a "mandatory=true" URL param.
    mockProps.location.search = '?mandatory=true'

    const wrapper = shallow(<Authentication {...mockProps} />)
    wrapper.update()

    expect(wrapper.find('[data-test-id="anon-sign-in-fyi"]').length).toBe(1)
    expect(wrapper.find('[data-test-id="endorsement-quote"]').length).toBe(0)
  })

  it("does not display the sign-in explanation when it is a mandatory sign-in but we're on the iframe message page", () => {
    expect.assertions(2)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.pathname = '/newtab/auth/welcome/'

    // Sign-in is mandatory when there is a "mandatory=true" URL param.
    mockProps.location.search = '?mandatory=true'

    const wrapper = shallow(<Authentication {...mockProps} />)
    wrapper.update()

    expect(wrapper.find('[data-test-id="anon-sign-in-fyi"]').length).toBe(0)
    expect(wrapper.find('[data-test-id="endorsement-quote"]').length).toBe(1)
  })

  it('calls redirectToAuthIfNeeded with the authUser, user, and urlParams objects', () => {
    expect.assertions(1)

    // User is fully authed.
    redirectToAuthIfNeeded.mockReturnValue(false)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=tab&next=1'
    mockProps.authUser = {
      id: 'qwertyqwerty',
      email: 'charles@example.com',
      username: 'charles',
      isAnonymous: false,
      emailVerified: true,
    }
    mockProps.user = {
      id: 'qwertyqwerty',
      username: 'charles',
    }
    shallow(<Authentication {...mockProps} />)
    expect(redirectToAuthIfNeeded).toHaveBeenCalledWith({
      authUser: mockProps.authUser,
      user: mockProps.user,
      urlParams: {
        app: 'tab',
        next: '1',
      },
    })
  })

  it('calls redirectToAuthIfNeeded with undefined "app" and "next" URL params if they are not set', () => {
    expect.assertions(1)

    // User is fully authed.
    redirectToAuthIfNeeded.mockReturnValue(false)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = ''
    shallow(<Authentication {...mockProps} />)
    expect(redirectToAuthIfNeeded).toHaveBeenCalledWith({
      authUser: expect.any(Object),
      user: expect.any(Object),
      urlParams: {
        app: undefined,
        next: undefined,
      },
    })
  })

  it('redirects to the app (Tab for a Cause, by default) if the user is fully authenticated', () => {
    expect.assertions(1)

    // User is fully authed.
    redirectToAuthIfNeeded.mockReturnValue(false)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = ''
    shallow(<Authentication {...mockProps} />)
    expect(externalRedirect).toHaveBeenCalledWith(dashboardURL)
  })

  it('redirects to Search for a Cause if the user is fully authenticated and the "app" URL param === "search"', () => {
    expect.assertions(1)

    // User is fully authed.
    redirectToAuthIfNeeded.mockReturnValue(false)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=search'
    shallow(<Authentication {...mockProps} />)
    expect(externalRedirect).toHaveBeenCalledWith(searchBaseURL)
  })

  it('opts in to Tab V4 (based on local storage flag) before redirecting to the app when the user is fully authenticated', () => {
    expect.assertions(1)

    // Set that the user's local storage is flagged to use
    // the Tab V4 beta.
    isTabV4BetaUser.mockReturnValue(true)

    const defaultMockProps = MockProps()
    const mockProps = {
      ...defaultMockProps,
      user: {
        ...defaultMockProps,
        v4BetaEnabled: false, // not enabled on user profile
      },
    }

    // User is fully authed.
    redirectToAuthIfNeeded.mockReturnValue(false)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    shallow(<Authentication {...mockProps} />)

    expect(optIntoV4Beta).toHaveBeenCalledTimes(1)
  })

  it('does NOT opt in to Tab V4 (based on local storage and user profiel flags) before redirecting to the app when the user is fully authenticated', () => {
    expect.assertions(1)

    // Set that the user's local storage is NOT flagged to use
    // the Tab V4 beta.
    isTabV4BetaUser.mockReturnValue(false)

    const defaultMockProps = MockProps()
    const mockProps = {
      ...defaultMockProps,
      user: {
        ...defaultMockProps,
        v4BetaEnabled: false, // not enabled on user profile
      },
    }

    // User is fully authed.
    redirectToAuthIfNeeded.mockReturnValue(false)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    shallow(<Authentication {...mockProps} />)

    expect(optIntoV4Beta).not.toHaveBeenCalled()
  })

  it('opts in to Tab V4 (based on user profile field) before redirecting to the app when the user is fully authenticated', () => {
    expect.assertions(1)

    const defaultMockProps = MockProps()
    const mockProps = {
      ...defaultMockProps,
      user: {
        ...defaultMockProps,
        v4BetaEnabled: true, // enabled on user profile
      },
    }

    // Set that the user's local storage is NOT flagged to use
    // the Tab V4 beta.
    isTabV4BetaUser.mockReturnValue(false)

    // User is fully authed.
    redirectToAuthIfNeeded.mockReturnValue(false)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    mockProps.location.search = ''
    shallow(<Authentication {...mockProps} />)

    expect(optIntoV4Beta).toHaveBeenCalledTimes(1)
  })

  it('calls SetV4BetaMutation to enable Tab V4 when the user profile field is not set but local storage is set', async () => {
    expect.assertions(1)

    const defaultMockProps = MockProps()
    const mockProps = {
      ...defaultMockProps,
      user: {
        ...defaultMockProps,
        v4BetaEnabled: false, // not enabled on user profile
      },
    }

    // Set that the user's local storage is flagged to use
    // the Tab V4 beta.
    isTabV4BetaUser.mockReturnValue(true)

    // User is fully authed.
    redirectToAuthIfNeeded.mockReturnValue(false)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    shallow(<Authentication {...mockProps} />)

    await flushAllPromises()
    expect(SetV4BetaMutation).toHaveBeenCalledWith({
      userId: mockProps.user.id,
      enabled: true,
    })
  })

  it('does not call SetV4BetaMutation when the user profile field is already set', async () => {
    expect.assertions(1)

    const defaultMockProps = MockProps()
    const mockProps = {
      ...defaultMockProps,
      user: {
        ...defaultMockProps,
        v4BetaEnabled: true, // not enabled on user profile
      },
    }

    // Set that the user's local storage is NOT flagged to use
    // the Tab V4 beta.
    isTabV4BetaUser.mockReturnValue(false)

    // User is fully authed.
    redirectToAuthIfNeeded.mockReturnValue(false)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    shallow(<Authentication {...mockProps} />)

    await flushAllPromises()
    expect(SetV4BetaMutation).not.toHaveBeenCalled()
  })

  it('redirects to Tab for a Cause if the user is fully authenticated and the "app" URL param is some invalid value', () => {
    expect.assertions(1)

    // User is fully authed.
    redirectToAuthIfNeeded.mockReturnValue(false)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=foobar'
    shallow(<Authentication {...mockProps} />)
    expect(externalRedirect).toHaveBeenCalledWith(dashboardURL)
  })

  it('redirects to the "next" URL if it is set and the user is fully authenticated', () => {
    expect.assertions(1)

    // User is fully authed.
    redirectToAuthIfNeeded.mockReturnValue(false)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=search&next=2'
    shallow(<Authentication {...mockProps} />)
    expect(externalRedirect).toHaveBeenCalledWith(
      'https://tab-test-env.gladly.io/newtab/account/?reauthed=true'
    )
  })

  it('does not redirect to the app if the user is fully authenticated but the URL has the noredirect param', () => {
    expect.assertions(1)

    // User is fully authed.
    redirectToAuthIfNeeded.mockReturnValue(false)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?noredirect=true'
    shallow(<Authentication {...mockProps} />)

    expect(externalRedirect).not.toHaveBeenCalled()
  })

  it('redirects to the app if the user is fully authenticated but the URL has an invalid noredirect param', async () => {
    expect.assertions(1)

    // User is fully authed.
    redirectToAuthIfNeeded.mockReturnValue(false)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?noredirect=something'
    shallow(<Authentication {...mockProps} />)

    expect(externalRedirect).toHaveBeenCalledWith(dashboardURL)
  })

  it('does not redirect to the app if the user is not fully authenticated', () => {
    expect.assertions(1)

    // User is not fully authed.
    redirectToAuthIfNeeded.mockReturnValue(true)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    shallow(<Authentication {...mockProps} />)

    expect(externalRedirect).not.toHaveBeenCalled()
  })

  it('does not redirect at all if the URL is /auth/action/*', () => {
    expect.assertions(3)
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.pathname = '/auth/action/verify/'

    // User does not have a verified email but is on the email verification page.
    redirectToAuthIfNeeded.mockReturnValue(false)

    shallow(<Authentication {...mockProps} />)
    expect(goTo).not.toHaveBeenCalled()
    expect(externalRedirect).not.toHaveBeenCalled()
    expect(externalRedirect).not.toHaveBeenCalled()
  })

  it('after sign-in, goes to missing email message screen if no email address', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()

    // Args for onSignInSuccess
    const mockFirebaseUserInstance = {
      displayName: '',
      email: null, // note the missing email
      emailVerified: false,
      isAnonymous: false,
      metadata: {},
      phoneNumber: null,
      photoURL: null,
      providerData: {},
      providerId: 'some-id',
      refreshToken: 'xyzxyz',
      uid: 'abc123',
    }
    const mockFirebaseCredential = {}
    const mockFirebaseDefaultRedirectURL = ''

    const wrapper = shallow(<Authentication {...mockProps} />)
    const component = wrapper.instance()

    // Mock a call from FirebaseUI after user signs in
    component.onSignInSuccess(
      mockFirebaseUserInstance,
      mockFirebaseCredential,
      mockFirebaseDefaultRedirectURL
    )
    expect(goTo).toHaveBeenCalledWith(missingEmailMessageURL, null, {
      keepURLParams: true,
    })
  })

  it('sends an email verification after sign in if the email is not verified', async () => {
    expect.assertions(2)

    // Args for onSignInSuccess
    const mockFirebaseUserInstance = {
      displayName: '',
      email: 'foo@bar.com',
      emailVerified: false, // Note that email is unverified
      isAnonymous: false,
      metadata: {},
      phoneNumber: null,
      photoURL: null,
      providerData: {},
      providerId: 'some-id',
      refreshToken: 'xyzxyz',
      uid: 'abc123',
    }
    const mockFirebaseCredential = {}
    const mockFirebaseDefaultRedirectURL = ''

    createNewUser.mockResolvedValue({
      ...mockCreateNewUserResponse(),
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
    })

    sendVerificationEmail.mockImplementation(() => Promise.resolve(true))

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)
    const component = wrapper.instance()

    // Mock a call from FirebaseUI after user signs in
    await component.onSignInSuccess(
      mockFirebaseUserInstance,
      mockFirebaseCredential,
      mockFirebaseDefaultRedirectURL
    )

    expect(sendVerificationEmail).toHaveBeenCalledTimes(1)
    expect(goTo).toHaveBeenCalledWith(verifyEmailURL, null, {
      keepURLParams: true,
    })
  })

  it('sets the "continueURL" in the email verification with URL param "app" === "tab" and "next" === "0" if the "app" URL param is not specified', async () => {
    expect.assertions(1)

    // Args for onSignInSuccess
    const mockFirebaseUserInstance = {
      displayName: '',
      email: 'foo@bar.com',
      emailVerified: false, // Note that email is unverified
      isAnonymous: false,
      metadata: {},
      phoneNumber: null,
      photoURL: null,
      providerData: {},
      providerId: 'some-id',
      refreshToken: 'xyzxyz',
      uid: 'abc123',
    }
    const mockFirebaseCredential = {}
    const mockFirebaseDefaultRedirectURL = ''

    createNewUser.mockResolvedValue({
      ...mockCreateNewUserResponse(),
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
    })

    sendVerificationEmail.mockImplementation(() => Promise.resolve(true))

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = ''
    const wrapper = shallow(<Authentication {...mockProps} />)
    const component = wrapper.instance()

    // Mock a call from FirebaseUI after user signs in
    await component.onSignInSuccess(
      mockFirebaseUserInstance,
      mockFirebaseCredential,
      mockFirebaseDefaultRedirectURL
    )

    expect(sendVerificationEmail).toHaveBeenCalledWith({
      continueURL:
        'https://tab-test-env.gladly.io/newtab/auth/username/?app=tab&next=0',
    })
  })

  it('sets the "continueURL" in the email verification with URL param "app" === "tab" and "next" === "/newtab/" if the "app" URL param === "tab"', async () => {
    expect.assertions(1)

    // Args for onSignInSuccess
    const mockFirebaseUserInstance = {
      displayName: '',
      email: 'foo@bar.com',
      emailVerified: false, // Note that email is unverified
      isAnonymous: false,
      metadata: {},
      phoneNumber: null,
      photoURL: null,
      providerData: {},
      providerId: 'some-id',
      refreshToken: 'xyzxyz',
      uid: 'abc123',
    }
    const mockFirebaseCredential = {}
    const mockFirebaseDefaultRedirectURL = ''

    createNewUser.mockResolvedValue({
      ...mockCreateNewUserResponse(),
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
    })

    sendVerificationEmail.mockImplementation(() => Promise.resolve(true))

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=tab'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const component = wrapper.instance()

    // Mock a call from FirebaseUI after user signs in
    await component.onSignInSuccess(
      mockFirebaseUserInstance,
      mockFirebaseCredential,
      mockFirebaseDefaultRedirectURL
    )

    expect(sendVerificationEmail).toHaveBeenCalledWith({
      continueURL:
        'https://tab-test-env.gladly.io/newtab/auth/username/?app=tab&next=0',
    })
  })

  it('sets the "continueURL" in the email verification with URL params "app" === "search" if the "app" URL param === "search"', async () => {
    expect.assertions(1)

    // Args for onSignInSuccess
    const mockFirebaseUserInstance = {
      displayName: '',
      email: 'foo@bar.com',
      emailVerified: false, // Note that email is unverified
      isAnonymous: false,
      metadata: {},
      phoneNumber: null,
      photoURL: null,
      providerData: {},
      providerId: 'some-id',
      refreshToken: 'xyzxyz',
      uid: 'abc123',
    }
    const mockFirebaseCredential = {}
    const mockFirebaseDefaultRedirectURL = ''

    createNewUser.mockResolvedValue({
      ...mockCreateNewUserResponse(),
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
    })

    sendVerificationEmail.mockImplementation(() => Promise.resolve(true))

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=search'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const component = wrapper.instance()

    // Mock a call from FirebaseUI after user signs in
    await component.onSignInSuccess(
      mockFirebaseUserInstance,
      mockFirebaseCredential,
      mockFirebaseDefaultRedirectURL
    )

    expect(sendVerificationEmail).toHaveBeenCalledWith({
      continueURL:
        'https://tab-test-env.gladly.io/newtab/auth/username/?app=search&next=0',
    })
  })

  it('refetches the user after sign-in', async () => {
    expect.assertions(1)

    // Args for onSignInSuccess
    const mockFirebaseUserInstance = {
      displayName: '',
      email: 'foo@bar.com',
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      phoneNumber: null,
      photoURL: null,
      providerData: {},
      providerId: 'some-id',
      refreshToken: 'xyzxyz',
      uid: 'abc123',
    }
    const mockFirebaseCredential = {}
    const mockFirebaseDefaultRedirectURL = ''

    createNewUser.mockResolvedValue({
      ...mockCreateNewUserResponse(),
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      justCreated: true,
    })

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)
    const component = wrapper.instance()

    // Mock a call from FirebaseUI after user signs in
    await component.onSignInSuccess(
      mockFirebaseUserInstance,
      mockFirebaseCredential,
      mockFirebaseDefaultRedirectURL
    )

    expect(mockFetchUser).toHaveBeenCalledTimes(1)
  })

  it('renders AssignExperimentGroups component', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)
    const comp = wrapper.find(AssignExperimentGroups)
    expect(comp.length).toBe(1)
    expect(comp.prop('isNewUser')).toBe(true)
  })

  it('includes a "verify email" route', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/verify-email/')
    expect(routeElem.exists()).toBe(true)
  })

  it('includes a "set username" route', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/username/')
    expect(routeElem.exists()).toBe(true)
  })

  it('includes an "iframe message" route', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/welcome/')
    expect(routeElem.exists()).toBe(true)
  })

  it('includes a "missing email" route', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/missing-email/')
    expect(routeElem.exists()).toBe(true)
  })

  it('includes a default auth page route', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/')
    expect(routeElem.exists()).toBe(true)
  })

  it('passes "tab" to the FirebaseAuthenticationUI "app" prop by default', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('tab')
  })

  it('passes "search" to the FirebaseAuthenticationUI "app" prop when the "app" URL param value === "search"', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=search'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('search')
  })

  it('passes "tab" to the FirebaseAuthenticationUI "app" prop when the "app" URL param value === "tab"', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=tab'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('tab')
  })

  it('passes "search" to the VerifyEmailMessage "app" prop when the "app" URL param value === "search"', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=search'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/verify-email/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('search')
  })

  it('passes "tab" to the VerifyEmailMessage "app" prop by default', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = ''
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/verify-email/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('tab')
  })

  it('passes "tab" to the VerifyEmailMessage "app" prop when the "app" URL param value is invalid', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=blahblah'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/verify-email/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('tab')
  })

  it('passes "search" to the VerifyEmailMessage "app" prop when the "app" URL param value does not exist but the continueUrl value has ?app=search', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search =
      '?foo=bar&continueUrl=https%3A%2F%2Ftab.gladly.io%2Fnewtab%2Fauth%2Fusername%2F%3Fapp%3Dsearch%26lang%3Den'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/verify-email/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('search')
  })

  it('passes "tab" to the VerifyEmailMessage "app" prop when the "app" URL param value does not exist but the continueUrl value has ?app=tab', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search =
      '?foo=bar&continueUrl=https%3A%2F%2Ftab.gladly.io%2Fnewtab%2Fauth%2Fusername%2F%3Fapp%3Dtab%26lang%3Den'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/verify-email/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('tab')
  })

  it('it shows a cat background during email verification when v4 is enabled in user', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const defaultMockProps = MockProps()
    const mockProps = {
      ...defaultMockProps,
      user: {
        ...defaultMockProps,
        v4BetaEnabled: true, // not enabled on user profile
      },
    }
    mockProps.location.search = ''

    const wrapper = shallow(<Authentication {...mockProps} />)
    expect(wrapper.find('[data-test-id="cats-background"]').length).toEqual(1)
  })

  it('it does not show a cat background during email verification when v4 is not enabled in user', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = ''

    const wrapper = shallow(<Authentication {...mockProps} />)
    expect(wrapper.find('[data-test-id="cats-background"]').length).toEqual(0)
  })

  it('it shows a cat background by default during email verification when v4 is enabled in local storage', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = ''
    isTabV4BetaUser.mockReturnValue(true)
    const wrapper = shallow(<Authentication {...mockProps} />)
    expect(wrapper.find('[data-test-id="cats-background"]').length).toEqual(1)
  })
  it('it shows a cat background during email verification when v4 is enabled and causeId is set to cats in local storage', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = ''
    isTabV4BetaUser.mockReturnValue(true)
    getCauseId.mockReturnValue(STORAGE_CATS_CAUSE_ID)
    const wrapper = shallow(<Authentication {...mockProps} />)
    expect(wrapper.find('[data-test-id="cats-background"]').length).toEqual(1)
  })

  it('it shows a seas background during email verification when v4 is enabled and causeId is set to seas in local storage', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = ''
    isTabV4BetaUser.mockReturnValue(true)
    getCauseId.mockReturnValue(STORAGE_SEAS_CAUSE_ID)
    const wrapper = shallow(<Authentication {...mockProps} />)
    expect(wrapper.find('[data-test-id="seas-background"]').length).toEqual(1)
  })

  it('it does not show a cat background during email verification when v4 is not enabled in local storage', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = ''
    isTabV4BetaUser.mockReturnValue(false)
    const wrapper = shallow(<Authentication {...mockProps} />)
    expect(wrapper.find('[data-test-id="cats-background"]').length).toEqual(0)
  })

  it('passes "search" to the EnterUsernameForm "app" prop when the "app" URL param value === "search"', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=search'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/username/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('search')
  })

  it('passes "tab" to the EnterUsernameForm "app" prop by default', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = ''
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/username/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('tab')
  })

  it('passes "tab" to the EnterUsernameForm "app" prop when the "app" URL param value is invalid', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=blahblah'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/username/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('tab')
  })

  it('passes "search" to the EnterUsernameForm "app" prop when the "app" URL param value does not exist but the continueUrl value has ?app=search', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search =
      '?foo=bar&continueUrl=https%3A%2F%2Ftab.gladly.io%2Fnewtab%2Fauth%2Fusername%2F%3Fapp%3Dsearch%26lang%3Den'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/username/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('search')
  })

  it('passes "tab" to the EnterUsernameForm "app" prop when the "app" URL param value does not exist but the continueUrl value has ?app=tab', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search =
      '?foo=bar&continueUrl=https%3A%2F%2Ftab.gladly.io%2Fnewtab%2Fauth%2Fusername%2F%3Fapp%3Dtab%26lang%3Den'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/username/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('tab')
  })

  it('passes the onAuthProcessCompleted function as the "onCompleted" prop to the EnterUsernameForm, so it goes to the new tab page when invoked', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/username/')
    const RenderedComponent = routeElem.prop('render')
    const onCompletedCallback = shallow(<RenderedComponent />).prop(
      'onCompleted'
    )
    onCompletedCallback()
    expect(externalRedirect).toHaveBeenCalledWith('/newtab/')
  })

  it('passes the onAuthProcessCompleted function as the "onCompleted" prop to the EnterUsernameForm, so it calls to enable Tab v4 when invoked and the user has v4BetaEnabled === true', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const defaultMockProps = MockProps()
    const mockProps = {
      ...defaultMockProps,
      user: {
        ...defaultMockProps.user,
        v4BetaEnabled: true,
      },
    }
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/username/')
    const RenderedComponent = routeElem.prop('render')
    const onCompletedCallback = shallow(<RenderedComponent />).prop(
      'onCompleted'
    )
    onCompletedCallback()
    expect(optIntoV4Beta).toHaveBeenCalled()
  })

  it('passes the onAuthProcessCompleted function as the "onCompleted" prop to the EnterUsernameForm, so it does not call to enable Tab v4 when the user has v4BetaEnabled === false', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const defaultMockProps = MockProps()
    const mockProps = {
      ...defaultMockProps,
      user: {
        ...defaultMockProps.user,
        v4BetaEnabled: false,
      },
    }
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/username/')
    const RenderedComponent = routeElem.prop('render')
    const onCompletedCallback = shallow(<RenderedComponent />).prop(
      'onCompleted'
    )
    onCompletedCallback()
    expect(optIntoV4Beta).not.toHaveBeenCalled()
  })

  it('passes "search" to the to the SignInIframeMessage "app" prop when the URL param value === "search"', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=search'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/welcome/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('search')
  })

  it('passes "tab" to the SignInIframeMessage "app" prop by default', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = ''
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/welcome/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('tab')
  })

  it('passes "tab" to the SignInIframeMessage "app" prop when the "app" URL param value is invalid', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=blahblah'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/welcome/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('tab')
  })

  it('passes "search" to the SignInIframeMessage "app" prop when the "app" URL param value does not exist but the continueUrl value has ?app=search', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search =
      '?foo=bar&continueUrl=https%3A%2F%2Ftab.gladly.io%2Fnewtab%2Fauth%2Fusername%2F%3Fapp%3Dsearch%26lang%3Den'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/welcome/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('search')
  })

  it('passes "tab" to the SignInIframeMessage "app" prop when the "app" URL param value does not exist but the continueUrl value has ?app=tab', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search =
      '?foo=bar&continueUrl=https%3A%2F%2Ftab.gladly.io%2Fnewtab%2Fauth%2Fusername%2F%3Fapp%3Dtab%26lang%3Den'
    const wrapper = shallow(<Authentication {...mockProps} />)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/auth/welcome/')
    const RenderedComponent = routeElem.prop('render')
    expect(shallow(<RenderedComponent />).prop('app')).toEqual('tab')
  })

  it('uses the "tab" app theme by default', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = ''
    const wrapper = shallow(<Authentication {...mockProps} />)
    expect(wrapper.find(MuiThemeProvider).prop('theme')).toEqual(
      createMuiTheme(tabTheme)
    )
  })

  it('uses the "tab" app theme when the "app" URL param value === "tab"', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=tab'
    const wrapper = shallow(<Authentication {...mockProps} />)
    expect(wrapper.find(MuiThemeProvider).prop('theme')).toEqual(
      createMuiTheme(tabTheme)
    )
  })

  it('uses the "tab" app theme when the "app" URL param value is invalid', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=blahblah'
    const wrapper = shallow(<Authentication {...mockProps} />)
    expect(wrapper.find(MuiThemeProvider).prop('theme')).toEqual(
      createMuiTheme(tabTheme)
    )
  })

  it('uses the "search" app theme when the "app" URL param value === "tab"', () => {
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.search = '?app=search'
    const wrapper = shallow(<Authentication {...mockProps} />)
    expect(wrapper.find(MuiThemeProvider).prop('theme')).toEqual(
      createMuiTheme(searchTheme)
    )
  })
})
