/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import MockDate from 'mockdate'
import {
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'
import {
  createNewUser,
  checkAuthStateAndRedirectIfNeeded
} from 'authentication/helpers'
import {
  goTo,
  replaceUrl,
  goToDashboard,
  missingEmailMessageURL,
  verifyEmailURL
} from 'navigation/navigation'
import {
  getCurrentUser,
  sendVerificationEmail
} from 'authentication/user'

jest.mock('authentication/helpers')
jest.mock('authentication/user')
jest.mock('navigation/navigation')

const mockLocationData = {
  pathname: '/newtab/auth/'
}
const mockUserData = {
  id: null,
  username: null
}
const mockFetchUser = jest.fn()

const mockNow = '2017-05-19T13:59:58.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))

  // Reset an unauthed user as the default.
  checkAuthStateAndRedirectIfNeeded.mockResolvedValue(true)
  getCurrentUser.mockResolvedValue(null)
})

afterEach(() => {
  jest.clearAllMocks()
  MockDate.reset()
})

describe('Authentication.js tests', function () {
  it('renders without error', () => {
    const Authentication = require('../Authentication').default
    shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserData}
        fetchUser={mockFetchUser}
      />
    )
  })

  it('calls the `navigateToAuthStep` method on mount', async () => {
    expect.assertions(1)
    const Authentication = require('../Authentication').default
    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserData}
        fetchUser={mockFetchUser}
      />
    )

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
      emailVerified: true
    })

    const Authentication = require('../Authentication').default
    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserData}
        fetchUser={mockFetchUser}
      />
    )

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
      emailVerified: true
    })

    const Authentication = require('../Authentication').default
    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserData}
        fetchUser={mockFetchUser}
      />
    )

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
      emailVerified: false
    })

    const Authentication = require('../Authentication').default
    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserData}
        fetchUser={mockFetchUser}
      />
    )

    // Wait for mount to complete.
    const component = wrapper.instance()
    await component.componentDidMount()

    expect(goToDashboard).not.toHaveBeenCalled()
  })

  it('does not redirect at all if the URL is /auth/action/*', async () => {
    expect.assertions(3)
    const Authentication = require('../Authentication').default

    // User does not have a verified email but is on the email verification page.
    checkAuthStateAndRedirectIfNeeded.mockResolvedValue(false)
    const mockUserDataProp = {
      id: null,
      username: null
    }
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: false
    })

    const wrapper = shallow(
      <Authentication
        location={{
          pathname: '/auth/action/verify/'
        }}
        user={mockUserDataProp}
        fetchUser={jest.fn()}
      />
    )
    const component = wrapper.instance()
    await component.navigateToAuthStep()
    expect(goTo).not.toHaveBeenCalled()
    expect(replaceUrl).not.toHaveBeenCalled()
    expect(goToDashboard).not.toHaveBeenCalled()
  })

  it('renders as expected prior to navigating', () => {
    const Authentication = require('../Authentication').default
    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserData}
        fetchUser={mockFetchUser}
      />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('after sign-in, goes to missing email message screen if no email address', () => {
    const Authentication = require('../Authentication').default

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
      uid: 'abc123'
    }
    const mockFirebaseCredential = {}
    const mockFirebaseDefaultRedirectURL = ''

    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserData}
        fetchUser={jest.fn()}
      />
    )
    const component = wrapper.instance()

    // Mock a call from FirebaseUI after user signs in
    component.onSignInSuccess(mockFirebaseUserInstance,
      mockFirebaseCredential, mockFirebaseDefaultRedirectURL)
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
      uid: 'abc123'
    }
    const mockFirebaseCredential = {}
    const mockFirebaseDefaultRedirectURL = ''

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: false // Note that email is unverified
    })
    createNewUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: null
    })

    sendVerificationEmail.mockImplementation(() => Promise.resolve(true))

    const Authentication = require('../Authentication').default
    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserData}
        fetchUser={jest.fn()}
      />
    )
    const component = wrapper.instance()

    // Mock a call from FirebaseUI after user signs in
    await component.onSignInSuccess(mockFirebaseUserInstance,
      mockFirebaseCredential, mockFirebaseDefaultRedirectURL)

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
      uid: 'abc123'
    }
    const mockFirebaseCredential = {}
    const mockFirebaseDefaultRedirectURL = ''
    const mockFetchUser = jest.fn()

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: true
    })
    createNewUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      justCreated: true
    })

    const Authentication = require('../Authentication').default
    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserData}
        fetchUser={mockFetchUser}
      />
    )
    const component = wrapper.instance()

    // Mock a call from FirebaseUI after user signs in
    await component.onSignInSuccess(mockFirebaseUserInstance,
      mockFirebaseCredential, mockFirebaseDefaultRedirectURL)

    expect(mockFetchUser).toHaveBeenCalledTimes(1)
  })
})
