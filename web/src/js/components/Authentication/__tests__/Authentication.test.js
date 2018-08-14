/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'
import {
  goTo,
  replaceUrl,
  goToDashboard,
  goToLogin,
  authMessageURL,
  enterUsernameURL,
  missingEmailMessageURL,
  verifyEmailURL
} from 'navigation/navigation'
import {
  getCurrentUser,
  setUsernameInLocalStorage,
  sendVerificationEmail
} from 'authentication/user'
import {
  getReferralData,
  isInIframe
} from 'web-utils'
import CreateNewUserMutation from 'mutations/CreateNewUserMutation'

jest.mock('authentication/user')
jest.mock('authentication/firebaseConfig') // mock the Firebase app initialization
jest.mock('authentication/firebaseIDBErrorManager')
jest.mock('mutations/CreateNewUserMutation')
jest.mock('navigation/navigation')
jest.mock('web-utils')

const mockLocationData = {
  pathname: '/newtab/auth/'
}
const mockUserData = {
  id: null,
  username: null
}
const mockFetchUser = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
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
    const Authentication = require('../Authentication').default

    const mockUserDataProp = {
      id: null,
      username: null
    }

    // Mock the authed user
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'foo',
      isAnonymous: false,
      emailVerified: true
    })
    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserDataProp}
        fetchUser={jest.fn()}
      />
    )
    const component = wrapper.instance()
    await component.navigateToAuthStep()
    expect(goToDashboard).toHaveBeenCalled()
  })

  it('shows the sign-in message if unauthed and within an iframe', async () => {
    expect.assertions(1)
    const Authentication = require('../Authentication').default

    const mockUserDataProp = {
      id: null,
      username: null
    }

    // User is unauthed
    getCurrentUser.mockResolvedValue(null)

    // Inside an iframe
    isInIframe.mockReturnValueOnce(true)
    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserDataProp}
        fetchUser={jest.fn()}
      />
    )
    const component = wrapper.instance()
    await component.navigateToAuthStep()
    expect(goTo).toHaveBeenCalledWith(authMessageURL)
  })

  it('goes to login screen if unauthed and NOT within an iframe', async () => {
    expect.assertions(1)
    const Authentication = require('../Authentication').default

    const mockUserDataProp = {
      id: null,
      username: null
    }

    // User is unauthed
    getCurrentUser.mockResolvedValue(null)

    // Inside an iframe
    isInIframe.mockReturnValueOnce(false)
    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserDataProp}
        fetchUser={jest.fn()}
      />
    )
    const component = wrapper.instance()
    await component.navigateToAuthStep()
    expect(goToLogin).toHaveBeenCalled()
  })

  it('goes to missing email screen if authed and there is no email address', async () => {
    expect.assertions(1)
    const Authentication = require('../Authentication').default

    const mockUserDataProp = {
      id: null,
      username: null
    }

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: null,
      username: null,
      isAnonymous: false,
      emailVerified: false
    })

    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserDataProp}
        fetchUser={jest.fn()}
      />
    )
    const component = wrapper.instance()
    await component.navigateToAuthStep()
    expect(replaceUrl).toHaveBeenCalledWith(missingEmailMessageURL)
  })

  it('goes to email verification screen if authed and email is unverified', async () => {
    expect.assertions(1)
    const Authentication = require('../Authentication').default

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
        location={mockLocationData}
        user={mockUserDataProp}
        fetchUser={jest.fn()}
      />
    )
    const component = wrapper.instance()
    await component.navigateToAuthStep()
    expect(replaceUrl).toHaveBeenCalledWith(verifyEmailURL)
  })

  it('goes to new username screen if authed and username is not set', async () => {
    expect.assertions(1)
    const Authentication = require('../Authentication').default

    const mockUserDataProp = {
      id: null,
      username: null
    }

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: true
    })

    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserDataProp}
        fetchUser={jest.fn()}
      />
    )
    const component = wrapper.instance()
    await component.navigateToAuthStep()
    expect(replaceUrl).toHaveBeenCalledWith(enterUsernameURL)
  })

  it('goes to dashboard (and sets username in localStorage) if there is no local username but the account has a username', async () => {
    expect.assertions(2)
    const Authentication = require('../Authentication').default

    const mockUserDataProp = {
      id: 'abc123',
      username: 'fooismyname'
    }

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: true
    })

    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserDataProp}
        fetchUser={jest.fn()}
      />
    )
    const component = wrapper.instance()
    await component.navigateToAuthStep()
    expect(setUsernameInLocalStorage).toHaveBeenCalledWith('fooismyname')
    expect(goToDashboard).toHaveBeenCalled()
  })

  it('does not redirect at all if the URL is /auth/action/*', async () => {
    expect.assertions(3)
    const Authentication = require('../Authentication').default

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

    // Mock the authed user
    // getCurrentUser.mockResolvedValue({
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: false // Note that email is unverified
    })

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementationOnce(
      (environment, userId, email, referralData, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: 'foo@bar.com',
            username: null
          }
        })
      }
    )

    sendVerificationEmail.mockImplementationOnce(() => Promise.resolve(true))

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

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementationOnce(
      (environment, userId, email, referralData, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: 'foo@bar.com',
            username: null,
            justCreated: true
          }
        })
      }
    )

    // Mock the authed user
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
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
    const component = wrapper.instance()

    // Mock a call from FirebaseUI after user signs in
    await component.onSignInSuccess(mockFirebaseUserInstance,
      mockFirebaseCredential, mockFirebaseDefaultRedirectURL)

    expect(mockFetchUser).toHaveBeenCalledTimes(1)
  })

  it('uses referral data when creating a new user', async () => {
    expect.assertions(1)

    getReferralData.mockImplementationOnce(() => ({
      referringUser: 'asdf1234'
    }))

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

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementationOnce(
      (environment, userId, email, referralData, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: 'foo@bar.com',
            username: 'fooismyname',
            justCreated: true
          }
        })
      }
    )

    // Mock the authed user
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
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
    const component = wrapper.instance()

    // Mock a call from FirebaseUI after user signs in
    await component.onSignInSuccess(mockFirebaseUserInstance,
      mockFirebaseCredential, mockFirebaseDefaultRedirectURL)

    expect(CreateNewUserMutation.mock.calls[0][3]).toEqual({
      referringUser: 'asdf1234'
    })
  })
})
