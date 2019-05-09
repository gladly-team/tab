/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import MockDate from 'mockdate'
import { mount, shallow } from 'enzyme'
import { checkAuthStateAndRedirectIfNeeded } from 'js/authentication/helpers'
import {
  getUserToken,
  __getAuthListenerCallbacks,
  __unregisterAuthStateChangeListeners,
  __triggerAuthStateChange,
} from 'js/authentication/user'
import { flushAllPromises } from 'js/utils/test-utils'

jest.mock('js/authentication/helpers')
jest.mock('js/authentication/user')

const mockNow = '2017-05-19T13:59:58.000Z'

beforeAll(() => {
  getUserToken.mockResolvedValue('some-token')
})

beforeEach(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  jest.clearAllMocks()
  MockDate.reset()
  __unregisterAuthStateChangeListeners()
})

const mockProps = {
  variables: {},
}

describe('AuthUser tests', () => {
  it('renders without error', () => {
    const AuthUser = require('js/components/General/AuthUserComponent').default
    shallow(<AuthUser {...mockProps} />)
  })

  it('unregisters its auth listener on unmount', () => {
    const AuthUser = require('js/components/General/AuthUserComponent').default
    const wrapper = shallow(<AuthUser {...mockProps} />)
    expect(__getAuthListenerCallbacks().length).toBe(1)
    wrapper.unmount()
    expect(__getAuthListenerCallbacks().length).toBe(0)
  })

  it('renders children only if the user is fully authed', async () => {
    expect.assertions(1)

    // Did not redirect because user is fully authed.
    checkAuthStateAndRedirectIfNeeded.mockResolvedValueOnce(false)

    const AuthUser = require('js/components/General/AuthUserComponent').default
    const MockChildComponent = jest.fn(() => null)
    mount(
      <AuthUser {...mockProps}>
        <MockChildComponent />
      </AuthUser>
    )
    __triggerAuthStateChange({
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: true,
    })
    await flushAllPromises()
    expect(MockChildComponent).toHaveBeenCalled()
  })

  it('does not render children if the user is not fully authed', async () => {
    expect.assertions(1)

    // Mock redirect because the user is not fully authed.
    checkAuthStateAndRedirectIfNeeded.mockResolvedValueOnce(true)

    const AuthUser = require('js/components/General/AuthUserComponent').default
    const MockChildComponent = jest.fn(() => null)
    mount(
      <AuthUser {...mockProps}>
        <MockChildComponent />
      </AuthUser>
    )
    __triggerAuthStateChange({
      id: 'abc123',
      email: null, // no email
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: false,
    })
    await flushAllPromises()
    expect(MockChildComponent).not.toHaveBeenCalled()
  })

  it('passes the userId variable to child components', async () => {
    expect.assertions(1)

    // Did not redirect because user is fully authed.
    checkAuthStateAndRedirectIfNeeded.mockResolvedValueOnce(false)

    const MockChildComponent = jest.fn(() => null)
    const AuthUser = require('js/components/General/AuthUserComponent').default
    const wrapper = mount(
      <AuthUser {...mockProps}>
        <MockChildComponent />
      </AuthUser>
    )
    __triggerAuthStateChange({
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: true,
    })

    await flushAllPromises()
    wrapper.update()
    expect(wrapper.find(MockChildComponent).prop('variables').userId).toBe(
      'abc123'
    )
  })
})
