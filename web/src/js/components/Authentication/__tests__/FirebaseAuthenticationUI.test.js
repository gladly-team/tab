/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

// Init Firebase
import { initializeFirebase } from 'authentication/firebaseConfig'
initializeFirebase()

jest.unmock('firebase') // use the real firebase module

jest.mock('analytics/logEvent')
jest.mock('authentication/user')
jest.mock('authentication/firebaseConfig') // mock the Firebase app initialization
jest.mock('navigation/navigation')

describe('FirebaseAuthenticationUI tests', function () {
  it('renders without error', () => {
    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    shallow(
      <FirebaseAuthenticationUI />
    )
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
