/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import { map } from 'lodash/collection'
import { FirebaseAuth } from 'react-firebaseui'

// Init Firebase
import { initializeFirebase } from 'authentication/firebaseConfig'
initializeFirebase()

jest.mock('analytics/logEvent')
jest.mock('authentication/user')
jest.mock('authentication/firebaseConfig') // mock the Firebase app initialization
jest.mock('navigation/navigation')
jest.mock('react-firebaseui')

const onSignInSuccessMock = jest.fn()
const mockProps = {
  onSignInSuccess: onSignInSuccessMock
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('FirebaseAuthenticationUI tests', function () {
  it('renders without error', () => {
    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
  })

  it('shows the expected Terms of Service URL', () => {
    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    const wrapper = shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
    const uiConfig = wrapper.find(FirebaseAuth).prop('uiConfig')
    expect(uiConfig.tosUrl).toBe('https://tab-test-env.gladly.io/terms/')
  })

  it('shows the expected Privacy Policy URL', () => {
    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    const wrapper = shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
    const uiConfig = wrapper.find(FirebaseAuth).prop('uiConfig')
    expect(uiConfig.privacyPolicyUrl).toBe('https://tab-test-env.gladly.io/privacy/')
  })

  it('redirects to the dashboard on sign in success', () => {
    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    const wrapper = shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
    const uiConfig = wrapper.find(FirebaseAuth).prop('uiConfig')
    expect(uiConfig.signInSuccessUrl).toBe('/newtab/')
  })

  it('is set to auto-upgrade anonymous users when they sign in', () => {
    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    const wrapper = shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
    const uiConfig = wrapper.find(FirebaseAuth).prop('uiConfig')
    expect(uiConfig.autoUpgradeAnonymousUsers).toBe(true)
  })

  it('does not use any credential helper', () => {
    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    const wrapper = shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
    const uiConfig = wrapper.find(FirebaseAuth).prop('uiConfig')
    expect(uiConfig.credentialHelper).toBe('none')
  })

  it('shows the expected sign-in providers', () => {
    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    const wrapper = shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
    const uiConfig = wrapper.find(FirebaseAuth).prop('uiConfig')
    expect(map(uiConfig.signInOptions, 'provider')).toEqual([
      'google.com', 'facebook.com', 'password'
    ])
  })

  it('calls the "onSignInSuccess" prop when FirebaseUI calls "signInSuccessWithAuthResult"', () => {
    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    const wrapper = shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
    const uiConfig = wrapper.find(FirebaseAuth).prop('uiConfig')
    const signInSuccessWithAuthResult = uiConfig.callbacks.signInSuccessWithAuthResult
    const mockAuthResult = {
      user: {
        id: 'abc-123'
      }
    }
    signInSuccessWithAuthResult(mockAuthResult)
    expect(onSignInSuccessMock).toHaveBeenCalledWith(mockAuthResult.user)
  })

// Note: no clear way to mount react-firebaseui in a JSDOM environment.
// Doing so throws the error:
// "The current environment does not support the specified persistence type"
//   https://github.com/firebase/firebase-js-sdk/blob/369b411b52de56ad38c82993c9dca4b6bd7b82a4/packages/auth/src/authstorage.js#L106
// Setting persistence to 'none' does not currently solve the problem:
//   `firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)`
// Unsure if this is a bug in firebaseui, firebase, or my implementation,
// but we'll leave it untested for now.
})
