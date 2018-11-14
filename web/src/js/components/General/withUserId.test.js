/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import {
  __getAuthListenerCallbacks,
  __unregisterAuthStateChangeListeners,
  __triggerAuthStateChange
} from 'js/authentication/user'
import {
  flushAllPromises
} from 'js/utils/test-utils'
import localStorageMgr from 'js/utils/localstorage-mgr'
import {
  STORAGE_KEY_USERNAME
} from 'js/constants'

jest.mock('js/authentication/user')

afterEach(() => {
  jest.clearAllMocks()
  __unregisterAuthStateChangeListeners()
})

describe('withUserId', () => {
  it('renders without error', () => {
    const withUserId = require('js/components/General/withUserId').default
    const MockComponent = () => null
    const WrappedComponent = withUserId(MockComponent)
    shallow(<WrappedComponent />)
  })

  it('unregisters its auth listener on unmount', () => {
    const withUserId = require('js/components/General/withUserId').default
    const MockComponent = () => null
    const WrappedComponent = withUserId(MockComponent)
    const wrapper = shallow(<WrappedComponent />)
    expect(__getAuthListenerCallbacks().length).toBe(1)
    wrapper.unmount()
    expect(__getAuthListenerCallbacks().length).toBe(0)
  })

  it('renders children if the user has an ID', async () => {
    expect.assertions(1)

    const withUserId = require('js/components/General/withUserId').default
    const MockComponent = () => null
    const WrappedComponent = withUserId(MockComponent)
    const wrapper = shallow(<WrappedComponent />)
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'SomeUsername')
    __triggerAuthStateChange({
      uid: 'abc123',
      email: 'foo@bar.com',
      isAnonymous: false,
      emailVerified: true
    })
    await flushAllPromises()
    expect(wrapper.find(MockComponent).length).toBe(1)
  })

  it('does not render children if the user does not have an ID', async () => {
    expect.assertions(1)

    const withUserId = require('js/components/General/withUserId').default
    const MockComponent = () => null
    const WrappedComponent = withUserId(MockComponent)
    const wrapper = shallow(<WrappedComponent />)
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'SomeUsername')
    __triggerAuthStateChange({
      uid: null,
      email: null,
      isAnonymous: false,
      emailVerified: false
    })
    await flushAllPromises()
    expect(wrapper.find(MockComponent).length).toBe(0)
  })

  it('does not render children if the user is null', async () => {
    expect.assertions(1)

    const withUserId = require('js/components/General/withUserId').default
    const MockComponent = () => null
    const WrappedComponent = withUserId(MockComponent)
    const wrapper = shallow(<WrappedComponent />)
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'SomeUsername')
    __triggerAuthStateChange(null)
    await flushAllPromises()
    expect(wrapper.find(MockComponent).length).toBe(0)
  })

  it('passes the userId as a prop to the wrapped component', async () => {
    expect.assertions(1)

    const withUserId = require('js/components/General/withUserId').default
    const MockComponent = () => null
    const WrappedComponent = withUserId(MockComponent)
    const wrapper = shallow(<WrappedComponent />)
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'SomeUsername')
    __triggerAuthStateChange({
      uid: 'abc123',
      email: 'foo@bar.com',
      isAnonymous: false,
      emailVerified: true
    })

    await flushAllPromises()
    wrapper.update()
    expect(wrapper.find(MockComponent).prop('userId'))
      .toBe('abc123')
  })
})
