/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import {
  goToDashboard
} from 'navigation/navigation'
import {
  getCurrentUser
} from 'authentication/user'

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

  it('calls the `navigateToAuthStep` method before mount', () => {
    const Authentication = require('../Authentication').default
    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserData}
        fetchUser={mockFetchUser}
        />
    )
    const component = wrapper.instance()
    component.navigateToAuthStep = jest.fn()

    // Force the lifecycle method
    component.componentWillMount()
    expect(component.navigateToAuthStep).toHaveBeenCalled()
  })

  it('redirects to the app if the user is fully authenticated', async () => {
    expect.assertions(1)
    const Authentication = require('../Authentication').default

    const mockUserDataProp = {
      id: 'abc123',
      username: 'steve'
    }

    // Mock the Firebase user
    getCurrentUser.mockReturnValueOnce({
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
})
