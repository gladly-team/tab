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
  it('renders without error', function () {
    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    shallow(
      <FirebaseAuthenticationUI />
    )
  })
})
