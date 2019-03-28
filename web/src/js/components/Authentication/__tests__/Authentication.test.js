/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import MockDate from 'mockdate'
import { shallow } from 'enzyme'
import {
  createNewUser,
  checkAuthStateAndRedirectIfNeeded,
} from 'js/authentication/helpers'
import {
  goTo,
  replaceUrl,
  goToDashboard,
  missingEmailMessageURL,
  verifyEmailURL,
} from 'js/navigation/navigation'
import { getCurrentUser, sendVerificationEmail } from 'js/authentication/user'
import { getUrlParameters } from 'js/utils/utils'
import { getBrowserExtensionInstallId } from 'js/utils/local-user-data-mgr'
import AssignExperimentGroups from 'js/components/Dashboard/AssignExperimentGroupsContainer'
import Logo from 'js/components/Logo/Logo'

jest.mock('js/authentication/helpers')
jest.mock('js/authentication/user')
jest.mock('js/navigation/navigation')
jest.mock('js/utils/utils')
jest.mock('js/utils/local-user-data-mgr')
jest.mock('js/components/Dashboard/AssignExperimentGroupsContainer')
jest.mock('js/components/Logo/Logo')

const mockFetchUser = jest.fn()

const MockProps = () => {
  return {
    location: {
      pathname: '/newtab/auth/',
    },
    user: {
      id: null,
      username: null,
    },
    fetchUser: mockFetchUser,
  }
}

const mockNow = '2017-05-19T13:59:58.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))

  // Reset an unauthed user as the default.
  checkAuthStateAndRedirectIfNeeded.mockResolvedValue(true)
  getCurrentUser.mockResolvedValue(null)
  getUrlParameters.mockReturnValue({})
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

  it('shows the logo with expected props', async () => {
    expect.assertions(3)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)

    // Wait for mount to complete.
    const component = wrapper.instance()
    await component.componentDidMount()
    wrapper.update()

    const logoComponent = wrapper.find(Logo)
    expect(logoComponent.prop('brand')).toEqual('tab')
    expect(logoComponent.prop('includeText')).toBe(true)
    expect(logoComponent.prop('style')).toEqual({
      height: 40,
    })
  })

  it('displays the endorsement quote', async () => {
    expect.assertions(1)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)

    // Wait for mount to complete.
    const component = wrapper.instance()
    await component.componentDidMount()
    wrapper.update()

    expect(wrapper.find('[data-test-id="endorsement-quote"]').length).toBe(1)
  })

  it('typically does not display the sign-in explanation', async () => {
    expect.assertions(1)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)

    // Wait for mount to complete.
    const component = wrapper.instance()
    await component.componentDidMount()
    wrapper.update()

    expect(wrapper.find('[data-test-id="anon-sign-in-fyi"]').length).toBe(0)
  })

  it('displays the sign-in explanation (and hides the quote) when it is a mandatory sign-in', async () => {
    expect.assertions(2)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.pathname = '/newtab/auth/'

    // Sign-in is mandatory when there is a "mandatory=true" URL param.
    getUrlParameters.mockReturnValue({
      mandatory: 'true',
    })
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false,
    })

    const wrapper = shallow(<Authentication {...mockProps} />)

    // Wait for mount to complete.
    const component = wrapper.instance()
    await component.componentDidMount()
    wrapper.update()

    expect(wrapper.find('[data-test-id="anon-sign-in-fyi"]').length).toBe(1)
    expect(wrapper.find('[data-test-id="endorsement-quote"]').length).toBe(0)
  })

  it("does not display the sign-in explanation when it is a mandatory sign-in but we're on the iframe message page", async () => {
    expect.assertions(2)

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.pathname = '/newtab/auth/welcome/'

    // Sign-in is mandatory when there is a "mandatory=true" URL param.
    getUrlParameters.mockReturnValue({
      mandatory: 'true',
    })
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false,
    })

    const wrapper = shallow(<Authentication {...mockProps} />)

    // Wait for mount to complete.
    const component = wrapper.instance()
    await component.componentDidMount()
    wrapper.update()

    expect(wrapper.find('[data-test-id="anon-sign-in-fyi"]').length).toBe(0)
    expect(wrapper.find('[data-test-id="endorsement-quote"]').length).toBe(1)
  })

  it('calls the `navigateToAuthStep` method on mount', async () => {
    expect.assertions(1)
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)

    // Mock method and simulate mount.
    const component = wrapper.instance()
    component.navigateToAuthStep = jest.fn()
    await component.componentDidMount()
    expect(component.navigateToAuthStep).toHaveBeenCalled()
  })

  it('sets "loadChildren" state to true when mounting', async () => {
    expect.assertions(1)

    // User is fully authed.
    checkAuthStateAndRedirectIfNeeded.mockResolvedValue(false)
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: true,
    })

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)

    // Mock method and simulate mount.
    const component = wrapper.instance()
    component.navigateToAuthStep = jest.fn()
    await component.componentDidMount()
    expect(wrapper.state().loadChildren).toBe(true)
  })

  it('redirects to the app if the user is fully authenticated', async () => {
    expect.assertions(1)

    // User is fully authed.
    checkAuthStateAndRedirectIfNeeded.mockResolvedValue(false)
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: true,
    })

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)

    // Wait for mount to complete.
    const component = wrapper.instance()
    await component.componentDidMount()

    expect(goToDashboard).toHaveBeenCalled()
  })

  it('does not redirect to the app if the user is fully authenticated but the URL has the noredirect param', async () => {
    expect.assertions(1)

    // User is fully authed.
    checkAuthStateAndRedirectIfNeeded.mockResolvedValue(false)
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: true,
    })

    getUrlParameters.mockReturnValue({
      noredirect: 'true',
    })

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)

    // Wait for mount to complete.
    const component = wrapper.instance()
    await component.componentDidMount()

    expect(goToDashboard).not.toHaveBeenCalled()
  })

  it('redirect to the app if the user is fully authenticated but the URL has an invalid noredirect param', async () => {
    expect.assertions(1)

    // User is fully authed.
    checkAuthStateAndRedirectIfNeeded.mockResolvedValue(false)
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: true,
    })

    getUrlParameters.mockReturnValue({
      noredirect: 'something',
    })

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)

    // Wait for mount to complete.
    const component = wrapper.instance()
    await component.componentDidMount()

    expect(goToDashboard).toHaveBeenCalled()
  })

  it('does not redirect to the app if the user is not fully authenticated', async () => {
    expect.assertions(1)

    // User is not fully authed.
    checkAuthStateAndRedirectIfNeeded.mockResolvedValue(true)
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: null,
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: false,
    })

    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    const wrapper = shallow(<Authentication {...mockProps} />)

    // Wait for mount to complete.
    const component = wrapper.instance()
    await component.componentDidMount()

    expect(goToDashboard).not.toHaveBeenCalled()
  })

  it('does not redirect at all if the URL is /auth/action/*', async () => {
    expect.assertions(3)
    const Authentication = require('js/components/Authentication/Authentication')
      .default
    const mockProps = MockProps()
    mockProps.location.pathname = '/auth/action/verify/'

    // User does not have a verified email but is on the email verification page.
    checkAuthStateAndRedirectIfNeeded.mockResolvedValue(false)
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: false,
    })

    const wrapper = shallow(<Authentication {...mockProps} />)
    const component = wrapper.instance()
    await component.navigateToAuthStep()
    expect(goTo).not.toHaveBeenCalled()
    expect(replaceUrl).not.toHaveBeenCalled()
    expect(goToDashboard).not.toHaveBeenCalled()
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
    expect(goTo).toHaveBeenCalledWith(missingEmailMessageURL)
  })

  it('after sign-in, send email verification if email is not verified', async () => {
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

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: false, // Note that email is unverified
    })
    createNewUser.mockResolvedValue({
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
    expect(goTo).toHaveBeenCalledWith(verifyEmailURL)
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

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: true,
    })
    createNewUser.mockResolvedValue({
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
})
