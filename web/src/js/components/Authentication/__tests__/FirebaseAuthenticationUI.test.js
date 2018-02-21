/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

// Initialize Firebase
import 'authentication/firebase'

jest.unmock('firebase') // use the real firebase module

jest.mock('analytics/logEvent')
jest.mock('authentication/user')
jest.mock('authentication/firebase') // mock the Firebase app initialization
jest.mock('navigation/navigation')

describe('FirebaseAuthenticationUI tests', function () {
  it('renders without error', function () {
    const FirebaseAuthenticationUI = require('../FirebaseAuthenticationUI').default
    shallow(
      <FirebaseAuthenticationUI />
    )
  })
})
