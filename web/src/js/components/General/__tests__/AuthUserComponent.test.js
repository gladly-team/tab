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
import { cloneDeep } from 'lodash/lang'

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

  it('does not redirect an unauthed user if allowUnauthedRender is set', () => {
    // Remove the user's username from localStorage.
    localStorageMgr.removeItem(STORAGE_KEY_USERNAME)

    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.allowUnauthedRender = true

    const AuthUser = require('../AuthUserComponent').default
    shallow(<AuthUser {...modifiedProps} />)

    // Mock that our auth loads the user.
    __triggerAuthStateChange({
      uid: null,
      email: null,
      username: null,
      isAnonymous: false,
      emailVerified: false
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

  it('redirects to email verification screen if authed and email is unverified', () => {
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

    expect(replaceUrl).toHaveBeenCalledWith(verifyEmailURL)
  })

  it('redirects to new username screen if authed and username is not set', () => {
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

    expect(replaceUrl).toHaveBeenCalledWith(enterUsernameURL)
  })

  // TODO: renders children only after the user is fully authed
  // TODO: passes the userId variable to child components

  // TODO later:
  // - shows the sign-in message if unauthed and within an iframe
  // - goes to login screen if unauthed and NOT within an iframe
})
