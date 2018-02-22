/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

jest.mock('analytics/logEvent')
jest.mock('authentication/user')
jest.mock('authentication/firebaseConfig') // mock the Firebase app initialization
jest.mock('navigation/navigation')

const mockLocationData = {
  pathname: '/newtab/auth/'
}
const mockUserData = {
  id: 'abc123',
  username: 'steve'
}
const mockFetchUser = jest.fn()

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
})
