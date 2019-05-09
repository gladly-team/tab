/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import {
  __getAuthListenerCallbacks,
  __unregisterAuthStateChangeListeners,
  __triggerAuthStateChange,
} from 'js/authentication/user'
import { flushAllPromises } from 'js/utils/test-utils'

jest.mock('js/authentication/user')

afterEach(() => {
  jest.clearAllMocks()
  __unregisterAuthStateChangeListeners()
})

describe('withUser', () => {
  it('renders without error', () => {
    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser()(MockComponent)
    shallow(<WrappedComponent />)
  })

  it('unregisters its auth listener on unmount', () => {
    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser()(MockComponent)
    const wrapper = shallow(<WrappedComponent />)
    expect(__getAuthListenerCallbacks().length).toBe(1)
    wrapper.unmount()
    expect(__getAuthListenerCallbacks().length).toBe(0)
  })

  it('renders children if the user has an ID', async () => {
    expect.assertions(1)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser()(MockComponent)
    const wrapper = shallow(<WrappedComponent />)
    __triggerAuthStateChange({
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: true,
    })
    await flushAllPromises()
    expect(wrapper.find(MockComponent).length).toBe(1)
  })

  it('does not render children if the user does not have an ID, by default', async () => {
    expect.assertions(1)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser()(MockComponent)
    const wrapper = shallow(<WrappedComponent />)
    __triggerAuthStateChange({
      id: null,
      email: null,
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: false,
    })
    await flushAllPromises()
    expect(wrapper.find(MockComponent).length).toBe(0)
  })

  it('does not render children if the user is null, by default', async () => {
    expect.assertions(1)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser()(MockComponent)
    const wrapper = shallow(<WrappedComponent />)
    __triggerAuthStateChange(null)
    await flushAllPromises()
    expect(wrapper.find(MockComponent).length).toBe(0)
  })

  it('renders children if the user does not have an ID when the "renderIfNoUser" option is true', async () => {
    expect.assertions(1)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null

    // Allow an unauthed user.
    const WrappedComponent = withUser({
      renderIfNoUser: true,
    })(MockComponent)

    const wrapper = shallow(<WrappedComponent />)
    __triggerAuthStateChange({
      id: null,
      email: null,
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: false,
    })
    await flushAllPromises()
    expect(wrapper.find(MockComponent).length).toBe(1)
  })

  it('renders children if the user is null when the "renderIfNoUser" option is true', async () => {
    expect.assertions(1)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null

    // Allow an unauthed user.
    const WrappedComponent = withUser({
      renderIfNoUser: true,
    })(MockComponent)

    const wrapper = shallow(<WrappedComponent />)
    __triggerAuthStateChange(null)
    await flushAllPromises()
    expect(wrapper.find(MockComponent).length).toBe(1)
  })

  it('passes the user as a prop to the wrapped component', async () => {
    expect.assertions(1)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser()(MockComponent)
    const wrapper = shallow(<WrappedComponent />)
    const mockAuthUser = {
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: true,
    }
    __triggerAuthStateChange(mockAuthUser)

    await flushAllPromises()
    wrapper.update()
    expect(wrapper.find(MockComponent).prop('authUser')).toEqual(mockAuthUser)
  })

  it('renders children only after determing the auth state', async () => {
    expect.assertions(2)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null

    // Allow an unauthed user.
    const WrappedComponent = withUser({
      renderIfNoUser: true,
    })(MockComponent)

    const wrapper = shallow(<WrappedComponent />)

    // Should not yet have rendered children.
    await flushAllPromises()
    expect(wrapper.find(MockComponent).length).toBe(0)

    __triggerAuthStateChange({
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: true,
    })

    await flushAllPromises()
    expect(wrapper.find(MockComponent).length).toBe(1)
  })
})
