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
  authMessageURL,
  missingEmailMessageURL,
  verifyEmailURL
} from 'navigation/navigation'
import {
  getCurrentUser
} from 'authentication/user'
import {
  isInIframe
} from 'web-utils'

jest.mock('analytics/logEvent')
jest.mock('authentication/user')
jest.mock('authentication/firebaseConfig') // mock the Firebase app initialization
jest.mock('navigation/navigation')
jest.mock('web-utils')

const mockLocationData = {
  pathname: '/newtab/auth/'
}
const mockUserData = {
  id: null,
  username: null
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
      id: null,
      username: null
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

  it('redirects to the app if the user is fully authenticated', async () => {
    expect.assertions(1)
    const Authentication = require('../Authentication').default

    const mockUserDataProp = {
      id: null,
      username: null
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

  it('shows the sign-in message if unauthed and within an iframe', async () => {
    expect.assertions(1)
    const Authentication = require('../Authentication').default

    const mockUserDataProp = {
      id: null,
      username: null
    }

    // User is unauthed
    getCurrentUser.mockReturnValueOnce(null)

    // Inside an iframe
    isInIframe.mockReturnValueOnce(true)
    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserDataProp}
        fetchUser={jest.fn()}
        />
    )
    const component = wrapper.instance()
    await component.navigateToAuthStep()
    expect(goTo).toHaveBeenCalledWith(authMessageURL)
  })

  it('goes to login screen if unauthed and NOT within an iframe', async () => {
    expect.assertions(1)
    const Authentication = require('../Authentication').default

    const mockUserDataProp = {
      id: null,
      username: null
    }

    // User is unauthed
    getCurrentUser.mockReturnValueOnce(null)

    // Inside an iframe
    isInIframe.mockReturnValueOnce(false)
    const wrapper = shallow(
      <Authentication
        location={mockLocationData}
        user={mockUserDataProp}
        fetchUser={jest.fn()}
        />
    )
    const component = wrapper.instance()
    await component.navigateToAuthStep()
    expect(goToLogin).toHaveBeenCalled()
  })

  it('goes to missing email screen if authed and there is no email address', async () => {
    expect.assertions(1)
    const Authentication = require('../Authentication').default

    const mockUserDataProp = {
      id: null,
      username: null
    }

    getCurrentUser.mockReturnValueOnce({
      id: 'abc123',
      email: null,
      username: null,
      isAnonymous: false,
      emailVerified: false
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
    expect(goTo).toHaveBeenCalledWith(missingEmailMessageURL)
  })

  it('goes to email verification screen if authed and email is unverified', async () => {
    expect.assertions(1)
    const Authentication = require('../Authentication').default

    const mockUserDataProp = {
      id: null,
      username: null
    }

    getCurrentUser.mockReturnValueOnce({
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: false
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
    expect(replaceUrl).toHaveBeenCalledWith(verifyEmailURL)
  })
})
