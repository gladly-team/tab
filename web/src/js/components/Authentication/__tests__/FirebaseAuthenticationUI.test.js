/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import { map } from 'lodash/collection'
import { FirebaseAuth } from 'react-firebaseui'
import logger from 'utils/logger'
import firebase, {
  __setFirebaseUser
} from 'firebase/app'
import MergeIntoExistingUserMutation, {
  __setErrorResponse
} from 'mutations/MergeIntoExistingUserMutation'

// Init Firebase
import { initializeFirebase } from 'authentication/firebaseConfig'
initializeFirebase()

jest.mock('analytics/logEvent')
jest.mock('authentication/helpers')
jest.mock('authentication/user')
jest.mock('authentication/firebaseConfig') // mock the Firebase app initialization
jest.mock('navigation/navigation')
jest.mock('react-firebaseui')
jest.mock('utils/logger')
jest.mock('firebase/app')
jest.mock('mutations/MergeIntoExistingUserMutation')
jest.mock('mutations/LogEmailVerifiedMutation')
jest.mock('../../../../relay-env', () => { return {} })

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
        uid: 'abc-123',
        delete: jest.fn().mockImplementation(() => Promise.resolve())
      }
    }
    signInSuccessWithAuthResult(mockAuthResult)
    expect(onSignInSuccessMock).toHaveBeenCalledWith(mockAuthResult.user)
  })

  it('calls "onSignInSuccess" prop if FirebaseUI calls "signInFailure" with a non-merge-related error', async () => {
    expect.assertions(1)

    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    const wrapper = shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
    const uiConfig = wrapper.find(FirebaseAuth).prop('uiConfig')
    const signInFailure = uiConfig.callbacks.signInFailure

    const mockFirebaseUIErr = {
      code: 'firebaseui/some-fake-error',
      message: 'This is just a fake error.',
      credential: {}
    }

    // Set the mock current Firebase user.
    const mockUser = {
      uid: 'abc-123',
      delete: jest.fn().mockImplementation(() => Promise.resolve())
    }
    __setFirebaseUser(mockUser)
    await signInFailure(mockFirebaseUIErr)
    expect(onSignInSuccessMock).toHaveBeenCalledWith(mockUser)
  })

  it('calls "onSignInSuccess" prop after resolving a merge-related error when upgrading the anonymous user', async () => {
    expect.assertions(1)

    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    const wrapper = shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
    const uiConfig = wrapper.find(FirebaseAuth).prop('uiConfig')
    const signInFailure = uiConfig.callbacks.signInFailure

    const mockFirebaseUIErr = {
      code: 'firebaseui/anonymous-upgrade-merge-conflict',
      message: 'Merge problem.',
      credential: {}
    }

    // Set the mock current Firebase user.
    const mockUser = {
      uid: 'abc-123',
      delete: jest.fn().mockImplementation(() => Promise.resolve())
    }
    __setFirebaseUser(mockUser)
    await signInFailure(mockFirebaseUIErr)
    expect(onSignInSuccessMock).toHaveBeenCalledWith(mockUser)
  })

  it('deletes the anonymous Firebase user when resolving a merge-related error during anonymous user sign-in', async () => {
    expect.assertions(1)

    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    const wrapper = shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
    const uiConfig = wrapper.find(FirebaseAuth).prop('uiConfig')
    const signInFailure = uiConfig.callbacks.signInFailure

    const mockFirebaseUIErr = {
      code: 'firebaseui/anonymous-upgrade-merge-conflict',
      message: 'Merge problem.',
      credential: {}
    }

    // Set the mock current Firebase user.
    const mockDeleteUser = jest.fn().mockImplementation(() => Promise.resolve())
    const mockUser = {
      uid: 'abc-123',
      delete: mockDeleteUser
    }
    __setFirebaseUser(mockUser)
    await signInFailure(mockFirebaseUIErr)
    expect(mockDeleteUser).toHaveBeenCalledTimes(1)
  })

  it('logs an error when signInAndRetrieveDataWithCredential fails when resolving a merge-related error during anonymous user sign-in', async () => {
    expect.assertions(1)

    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    const wrapper = shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
    const uiConfig = wrapper.find(FirebaseAuth).prop('uiConfig')
    const signInFailure = uiConfig.callbacks.signInFailure

    // Mock some unexpected Firebase sign-in error.
    const unexpectedErr = new Error('Whoops!')
    firebase.auth().signInAndRetrieveDataWithCredential
      .mockRejectedValueOnce(unexpectedErr)

    const mockFirebaseUIErr = {
      code: 'firebaseui/anonymous-upgrade-merge-conflict',
      message: 'Merge problem.',
      credential: {}
    }

    // Set the mock current Firebase user.
    const mockDeleteUser = jest.fn().mockImplementation(() => Promise.resolve())
    const mockUser = {
      uid: 'abc-123',
      delete: mockDeleteUser
    }
    __setFirebaseUser(mockUser)
    await signInFailure(mockFirebaseUIErr)
    expect(logger.error).toHaveBeenCalledWith(unexpectedErr)
  })

  it('logs an error when deleting the anonymous Firebase user fails when resolving a merge-related error during anonymous user sign-in', async () => {
    expect.assertions(1)

    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    const wrapper = shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
    const uiConfig = wrapper.find(FirebaseAuth).prop('uiConfig')
    const signInFailure = uiConfig.callbacks.signInFailure

    const mockFirebaseUIErr = {
      code: 'firebaseui/anonymous-upgrade-merge-conflict',
      message: 'Merge problem.',
      credential: {}
    }

    // Mock some unexpected Firebase error when deleting the anonymous user.
    const unexpectedErr = new Error('Whoops!')
    const mockDeleteUser = jest.fn().mockRejectedValueOnce(unexpectedErr)
    const mockUser = {
      uid: 'abc-123',
      delete: mockDeleteUser
    }
    __setFirebaseUser(mockUser)
    await signInFailure(mockFirebaseUIErr)
    expect(logger.error).toHaveBeenCalledWith(unexpectedErr)
  })

  it('merges the anonymous user in our database with the existing user when resolving a merge-related error during anonymous user sign-in', async () => {
    expect.assertions(1)

    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    const wrapper = shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
    const uiConfig = wrapper.find(FirebaseAuth).prop('uiConfig')
    const signInFailure = uiConfig.callbacks.signInFailure

    const mockFirebaseUIErr = {
      code: 'firebaseui/anonymous-upgrade-merge-conflict',
      message: 'Merge problem.',
      credential: {}
    }

    // Set the mock current Firebase user.
    const mockDeleteUser = jest.fn().mockImplementation(() => Promise.resolve())
    const mockUser = {
      uid: 'abc-123',
      delete: mockDeleteUser
    }
    __setFirebaseUser(mockUser)
    await signInFailure(mockFirebaseUIErr)
    expect(MergeIntoExistingUserMutation)
      .toHaveBeenCalledWith({}, 'abc-123', expect.any(Function), expect.any(Function))
  })

  it('logs an error when it fails to merge the anonymous user in our database with the existing user', async () => {
    expect.assertions(1)

    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    const wrapper = shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
    const uiConfig = wrapper.find(FirebaseAuth).prop('uiConfig')
    const signInFailure = uiConfig.callbacks.signInFailure

    const mockFirebaseUIErr = {
      code: 'firebaseui/anonymous-upgrade-merge-conflict',
      message: 'Merge problem.',
      credential: {}
    }

    // Mock a mutation error response.
    __setErrorResponse(new Error('Merge problem.'))

    // Set the mock current Firebase user.
    const mockDeleteUser = jest.fn().mockImplementation(() => Promise.resolve())
    const mockUser = {
      uid: 'abc-123',
      delete: mockDeleteUser
    }
    __setFirebaseUser(mockUser)
    await signInFailure(mockFirebaseUIErr)
    expect(logger.error)
      .toHaveBeenCalledWith(new Error('Merge problem.'))
  })

  it('still calls the "onSignInSuccess" prop if it fails to merge the anonymous user in our database with the existing user', async () => {
    expect.assertions(1)

    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    const wrapper = shallow(
      <FirebaseAuthenticationUI {...mockProps} />
    )
    const uiConfig = wrapper.find(FirebaseAuth).prop('uiConfig')
    const signInFailure = uiConfig.callbacks.signInFailure

    const mockFirebaseUIErr = {
      code: 'firebaseui/anonymous-upgrade-merge-conflict',
      message: 'Merge problem.',
      credential: {}
    }

    // Mock a mutation error response.
    __setErrorResponse(new Error('Merge problem.'))

    // Set the mock current Firebase user.
    const mockDeleteUser = jest.fn().mockImplementation(() => Promise.resolve())
    const mockUser = {
      uid: 'abc-123',
      delete: mockDeleteUser
    }
    __setFirebaseUser(mockUser)
    await signInFailure(mockFirebaseUIErr)
    expect(onSignInSuccessMock)
      .toHaveBeenCalledWith(mockUser)
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
