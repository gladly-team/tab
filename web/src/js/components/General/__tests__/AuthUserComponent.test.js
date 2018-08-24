/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import MockDate from 'mockdate'
import {
  mount,
  shallow
} from 'enzyme'
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
  __getAuthListenerCallbacks,
  __unregisterAuthStateChangeListeners,
  __triggerAuthStateChange
} from 'authentication/user'
import localStorageMgr from 'utils/localstorage-mgr'
import {
  STORAGE_KEY_USERNAME
} from '../../../constants'
import {
  isInIframe
} from 'web-utils'
import CreateNewUserMutation from 'mutations/CreateNewUserMutation'
import {
  getAnonymousUserTestGroup
} from 'utils/experiments'
import {
  isAnonymousUserSignInEnabled
} from 'utils/feature-flags'
import {
  getBrowserExtensionInstallTime
} from 'utils/local-user-data-mgr'

jest.mock('authentication/user')
jest.mock('mutations/CreateNewUserMutation')
jest.mock('navigation/navigation')
jest.mock('utils/localstorage-mgr')
jest.mock('web-utils')
jest.mock('utils/experiments')
jest.mock('utils/feature-flags')
jest.mock('utils/local-user-data-mgr')

const mockNow = '2017-05-19T13:59:58.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))

  // Set the user's username in localStorage.
  localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'SomeUsername')
})

afterEach(() => {
  jest.clearAllMocks()
  MockDate.reset()
})

// See authentication/helpers.js
const setIfAnonymousUserIsAllowed = (allow) => {
  // Set the mocked return values that will allow or
  // or disallow the user to be anonymous.
  if (allow) {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(2, 'minutes'))
    isAnonymousUserSignInEnabled.mockReturnValue(true)
    getAnonymousUserTestGroup.mockReturnValue('unauthed')
  } else {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(23, 'days'))
    isAnonymousUserSignInEnabled.mockReturnValue(false)
    getAnonymousUserTestGroup.mockReturnValue('none')
  }
}

afterEach(() => {
  jest.clearAllMocks()
  __unregisterAuthStateChangeListeners()
})

const mockProps = {
  variables: {}
}

describe('AuthUser tests', () => {
  it('renders without error', () => {
    const AuthUser = require('../AuthUserComponent').default
    shallow(
      <AuthUser {...mockProps} />
    )
  })

  it('unregisters its auth listener on unmount', () => {
    const AuthUser = require('../AuthUserComponent').default
    const wrapper = shallow(
      <AuthUser {...mockProps} />
    )
    expect(__getAuthListenerCallbacks().length).toBe(1)
    wrapper.unmount()
    expect(__getAuthListenerCallbacks().length).toBe(0)
  })

  it('[no-anon-allowed] redirects to the sign-in view if the user is unauthed and NOT within an iframe', async () => {
    expect.assertions(1)
    setIfAnonymousUserIsAllowed(false)

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    // Remove the user's username from localStorage.
    localStorageMgr.removeItem(STORAGE_KEY_USERNAME)

    // Mock that we're not in an iframe.
    isInIframe.mockReturnValue(false)

    const AuthUser = require('../AuthUserComponent').default
    shallow(<AuthUser {...mockProps} />)

    // Mock that our auth loads the user.
    __triggerAuthStateChange({
      uid: null,
      email: null,
      username: null,
      isAnonymous: false,
      emailVerified: false
    })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(goToLogin).toHaveBeenCalledTimes(1)
  })

  it('[anon] does not redirect when the user is anonymous and is allowed to be anonymous', async () => {
    expect.assertions(4)
    setIfAnonymousUserIsAllowed(true)

    const AuthUser = require('../AuthUserComponent').default
    shallow(<AuthUser {...mockProps} />)

    // Mock the authed user
    __triggerAuthStateChange({
      uid: 'abc123',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false
    })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(goToDashboard).not.toHaveBeenCalled()
    expect(goTo).not.toHaveBeenCalled()
    expect(replaceUrl).not.toHaveBeenCalled()
    expect(goToLogin).not.toHaveBeenCalled()
  })

  it('redirects to the login screen if the user is anonymous but has been around long enough for us to ask them to sign in', async () => {
    expect.assertions(1)

    // This is longer than users are allowed to remain anonymous.
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(4, 'days'))

    // Otherwise, anonymous users are allowed.
    isAnonymousUserSignInEnabled.mockReturnValue(true)
    getAnonymousUserTestGroup.mockReturnValue('unauthed')

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    // Mock that we're not in an iframe.
    isInIframe.mockReturnValue(false)

    const AuthUser = require('../AuthUserComponent').default
    shallow(<AuthUser {...mockProps} />)

    // Mock that our auth loads the user.
    __triggerAuthStateChange({
      uid: null,
      email: null,
      username: null,
      isAnonymous: false,
      emailVerified: false
    })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(goToLogin).toHaveBeenCalledTimes(1)
  })

  it('redirects to the login screen if the user is anonymous but is not in the anonymous sign-up experimental group', async () => {
    expect.assertions(1)

    // The user is still be required to sign in.
    getAnonymousUserTestGroup.mockReturnValue('auth')

    // Otherwise, the user is allowed to be anonymous.
    isAnonymousUserSignInEnabled.mockReturnValue(true)
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(2, 'minutes'))

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    // Mock that we're not in an iframe.
    isInIframe.mockReturnValue(false)

    const AuthUser = require('../AuthUserComponent').default
    shallow(<AuthUser {...mockProps} />)

    // Mock that our auth loads the user.
    __triggerAuthStateChange({
      uid: null,
      email: null,
      username: null,
      isAnonymous: false,
      emailVerified: false
    })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(goToLogin).toHaveBeenCalledTimes(1)
  })

  it('[no-anon-allowed] redirects to the sign-in message if the user is unauthed and within an iframe', async () => {
    expect.assertions(1)
    setIfAnonymousUserIsAllowed(false)

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    // Remove the user's username from localStorage.
    localStorageMgr.removeItem(STORAGE_KEY_USERNAME)

    // Mock that we're in an iframe.
    isInIframe.mockReturnValue(true)

    const AuthUser = require('../AuthUserComponent').default
    shallow(<AuthUser {...mockProps} />)

    // Mock that our auth loads the user.
    __triggerAuthStateChange({
      uid: null,
      email: null,
      username: null,
      isAnonymous: false,
      emailVerified: false
    })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(goTo).toHaveBeenCalledWith(authMessageURL)
  })

  it('[no-anon-allowed] does not redirect if the user is fully authenticated', async () => {
    expect.assertions(4)
    setIfAnonymousUserIsAllowed(false)

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    const AuthUser = require('../AuthUserComponent').default
    shallow(<AuthUser {...mockProps} />)

    // Mock that our auth loads the user.
    __triggerAuthStateChange({
      uid: 'abc123',
      email: 'foo@bar.com',
      username: 'foo',
      isAnonymous: false,
      emailVerified: true
    })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(goToDashboard).not.toHaveBeenCalled()
    expect(goTo).not.toHaveBeenCalled()
    expect(replaceUrl).not.toHaveBeenCalled()
    expect(goToLogin).not.toHaveBeenCalled()
  })

  it('[no-anon-allowed] redirects to missing email screen if authed and there is no email address', async () => {
    expect.assertions(1)
    setIfAnonymousUserIsAllowed(false)

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    const AuthUser = require('../AuthUserComponent').default
    shallow(<AuthUser {...mockProps} />)

    // Mock that our auth loads the user.
    __triggerAuthStateChange({
      uid: 'abc123',
      email: null,
      username: 'foo',
      isAnonymous: false,
      emailVerified: false
    })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(replaceUrl).toHaveBeenCalledWith(missingEmailMessageURL)
  })

  it('[no-anon-allowed] redirects to email verification screen if authed and email is unverified', async () => {
    expect.assertions(1)
    setIfAnonymousUserIsAllowed(false)

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    const AuthUser = require('../AuthUserComponent').default
    shallow(<AuthUser {...mockProps} />)

    // Mock that our auth loads the user.
    __triggerAuthStateChange({
      uid: 'abc123',
      email: 'somebody@example.com',
      username: 'foo',
      isAnonymous: false,
      emailVerified: false
    })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(replaceUrl).toHaveBeenCalledWith(verifyEmailURL)
  })

  it('[no-anon-allowed] redirects to new username screen if authed and username is not set', async () => {
    expect.assertions(1)
    setIfAnonymousUserIsAllowed(false)

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    // Remove the user's username from localStorage.
    localStorageMgr.removeItem(STORAGE_KEY_USERNAME)

    const AuthUser = require('../AuthUserComponent').default
    shallow(<AuthUser {...mockProps} />)

    // Mock that our auth loads the user.
    __triggerAuthStateChange({
      uid: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: true
    })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(replaceUrl).toHaveBeenCalledWith(enterUsernameURL)
  })

  it('[no-anon-allowed] renders children only if the user is fully authed', async () => {
    expect.assertions(2)
    setIfAnonymousUserIsAllowed(false)

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    // Remove the user's username from localStorage.
    localStorageMgr.removeItem(STORAGE_KEY_USERNAME)
    __triggerAuthStateChange({
      uid: null,
      email: null,
      username: null,
      isAnonymous: false,
      emailVerified: false
    })

    const MockChildComponent = jest.fn(() => null)

    const AuthUser = require('../AuthUserComponent').default
    mount(
      <AuthUser {...mockProps}>
        <MockChildComponent />
      </AuthUser>
    )

    expect(MockChildComponent).not.toHaveBeenCalled()

    // Set the user's username in localStorage.
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'SomeUsername')
    __triggerAuthStateChange({
      uid: 'abc123',
      email: 'foo@bar.com',
      username: 'foo',
      isAnonymous: false,
      emailVerified: true
    })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(MockChildComponent).toHaveBeenCalled()
  })

  it('[anon] renders children when the user is anonymous and is allowed to be anonymous', async () => {
    expect.assertions(1)
    setIfAnonymousUserIsAllowed(true)

    const MockChildComponent = jest.fn(() => null)

    const AuthUser = require('../AuthUserComponent').default
    mount(
      <AuthUser {...mockProps}>
        <MockChildComponent />
      </AuthUser>
    )

    // Mock the authed user
    __triggerAuthStateChange({
      uid: 'abc123',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false
    })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(MockChildComponent).toHaveBeenCalled()
  })

  it('passes the userId variable to child components', async () => {
    expect.assertions(1)

    const MockChildComponent = jest.fn(() => null)
    const AuthUser = require('../AuthUserComponent').default
    const wrapper = mount(
      <AuthUser {...mockProps}>
        <MockChildComponent />
      </AuthUser>
    )

    __triggerAuthStateChange({
      uid: 'abc123',
      email: 'foo@bar.com',
      username: 'foo',
      isAnonymous: false,
      emailVerified: true
    })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    wrapper.update()
    expect(wrapper.find(MockChildComponent).prop('variables').userId).toBe('abc123')
  })
})
