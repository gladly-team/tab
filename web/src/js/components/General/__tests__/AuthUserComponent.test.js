/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import {
  goTo,
  replaceUrl,
  goToDashboard,
  goToLogin,
  // authMessageURL,
  // enterUsernameURL,
  missingEmailMessageURL
  // verifyEmailURL
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

jest.mock('authentication/user')
jest.mock('mutations/CreateNewUserMutation')
jest.mock('navigation/navigation')
jest.mock('utils/localstorage-mgr')

beforeEach(() => {
  // Set the user's username in localStorage.
  localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'SomeUsername')
})

afterEach(() => {
  jest.clearAllMocks()
  __unregisterAuthStateChangeListeners()
})

const mockProps = {
  variables: {},
  allowUnauthedRender: false
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

  it('does not redirect if the user is fully authenticated', () => {
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

    expect(goToDashboard).not.toHaveBeenCalled()
    expect(goTo).not.toHaveBeenCalled()
    expect(replaceUrl).not.toHaveBeenCalled()
    expect(goToLogin).not.toHaveBeenCalled()
  })

  it('redirects to missing email screen if authed and there is no email address', () => {
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

    expect(replaceUrl).toHaveBeenCalledWith(missingEmailMessageURL)
  })

  // TODO: redirects to email verification screen if authed and email is unverified
  // TODO: redirects to new username screen if authed and username is not set
  // TODO: does not redirect if allowUnauthedRender is set
  // TODO: renders children only after the user is fully authed
  // TODO: passes the userId variable to child components
  // TODO: redirects to email verification screen if authed and email is unverified
  // TODO: redirects to email verification screen if authed and email is unverified

  // TODO later:
  // - shows the sign-in message if unauthed and within an iframe
  // - goes to login screen if unauthed and NOT within an iframe
})
