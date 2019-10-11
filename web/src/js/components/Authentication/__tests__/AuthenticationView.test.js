/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import AuthenticationView from 'js/components/Authentication/AuthenticationView'
import AuthenticationContainer from 'js/components/Authentication/AuthenticationContainer'
import { __setMockAuthUser } from 'js/components/General/withUser'
import { flushAllPromises } from 'js/utils/test-utils'

jest.mock('js/components/General/QueryRendererWithUser')
jest.mock('js/components/Authentication/AuthenticationContainer')
jest.mock('js/authentication/helpers')
jest.mock('js/components/General/withUser')
jest.mock('js/utils/logger')

afterEach(() => {
  jest.clearAllMocks()
  __setMockAuthUser(null)
})

describe('withUser HOC in AuthenticationView', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('is called with the expected options', () => {
    const withUser = require('js/components/General/withUser').default

    /* eslint-disable-next-line no-unused-expressions */
    require('js/components/Authentication/AuthenticationView').default
    expect(withUser).toHaveBeenCalledWith({
      redirectToAuthIfIncomplete: false,
      renderIfNoUser: true,
    })
  })

  it('wraps the AuthenticationView component', () => {
    const {
      __mockWithUserWrappedFunction,
    } = require('js/components/General/withUser')

    /* eslint-disable-next-line no-unused-expressions */
    require('js/components/Authentication/AuthenticationView').default
    const wrappedComponent = __mockWithUserWrappedFunction.mock.calls[0][0]
    expect(wrappedComponent.name).toEqual('AuthenticationView')
  })
})

describe('AuthenticationView', () => {
  it('renders without error', () => {
    shallow(<AuthenticationView />).dive()
  })

  it('QueryRendererWithUser receives the "variables" prop', async () => {
    expect.assertions(1)

    __setMockAuthUser({
      id: 'abc123xyz456',
      email: 'foo@example.com',
      username: 'example',
      isAnonymous: false,
      emailVerified: true,
    })
    const wrapper = shallow(<AuthenticationView />).dive()
    wrapper.update()
    expect(wrapper.find(QueryRendererWithUser).prop('variables')).toEqual({
      userId: 'abc123xyz456',
    })
  })

  it('QueryRendererWithUser receives the "query" prop', async () => {
    expect.assertions(1)

    __setMockAuthUser({
      id: 'abc123xyz456',
      email: 'foo@example.com',
      username: 'example',
      isAnonymous: false,
      emailVerified: true,
    })
    const wrapper = shallow(<AuthenticationView />).dive()
    wrapper.update()
    expect(wrapper.find(QueryRendererWithUser).prop('query')).toEqual(
      expect.any(Function)
    )
  })

  it('QueryRendererWithUser receives empty "variables" and "query" props if there is no authed user', async () => {
    expect.assertions(2)

    __setMockAuthUser(null)
    const wrapper = shallow(<AuthenticationView />).dive()
    wrapper.update()
    expect(wrapper.find(QueryRendererWithUser).prop('variables')).toEqual({})
    expect(wrapper.find(QueryRendererWithUser).prop('query')).toBeUndefined()
  })

  it('does not render AuthenticationContainer before receiving a query response', async () => {
    expect.assertions(1)
    __setMockAuthUser(null)
    QueryRendererWithUser.__setQueryResponse({
      error: null,
      props: null,
      retry: jest.fn(),
    })
    const wrapper = mount(<AuthenticationView />)
    await flushAllPromises()
    wrapper.update()
    expect(wrapper.find(AuthenticationContainer).exists()).toBe(false)
  })

  it('passes "user" prop to the AuthenticationContainer', async () => {
    expect.assertions(1)
    __setMockAuthUser({
      id: 'abc123xyz456',
      email: 'foo@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: true,
    })
    const fakeProps = {
      user: {
        id: 'abc123xyz456',
        email: 'foo@example.com',
        username: 'MyUsername',
      },
    }
    QueryRendererWithUser.__setQueryResponse({
      error: null,
      props: fakeProps,
      retry: jest.fn(),
    })

    const wrapper = mount(<AuthenticationView />)
    await flushAllPromises()
    wrapper.update()

    const authContainer = wrapper.find(AuthenticationContainer)
    expect(authContainer.prop('user')).toEqual(fakeProps.user)
  })

  it('passes the "retry" prop to the AuthenticationContainer as the "fetchUser" prop', async () => {
    expect.assertions(1)
    __setMockAuthUser({
      id: 'abc123xyz456',
      email: 'foo@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: true,
    })
    const fakeProps = {
      user: {
        id: 'abc123xyz456',
        email: 'foo@example.com',
        username: 'MyUsername',
      },
    }
    const mockRetryFn = jest.fn()
    QueryRendererWithUser.__setQueryResponse({
      error: null,
      props: fakeProps,
      retry: mockRetryFn,
    })

    const wrapper = mount(<AuthenticationView />)
    await flushAllPromises()
    wrapper.update()

    const authContainer = wrapper.find(AuthenticationContainer)
    expect(authContainer.prop('fetchUser')).toEqual(mockRetryFn)
  })

  it('passes a function to the AuthenticationContainer as the "fetchUser" prop even when the "retry" function does not exist', async () => {
    expect.assertions(1)
    __setMockAuthUser({
      id: 'abc123xyz456',
      email: 'foo@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: true,
    })
    const fakeProps = {
      user: {
        id: 'abc123xyz456',
        email: 'foo@example.com',
        username: 'MyUsername',
      },
    }
    QueryRendererWithUser.__setQueryResponse({
      error: null,
      props: fakeProps,
      retry: undefined,
    })

    const wrapper = mount(<AuthenticationView />)
    await flushAllPromises()
    wrapper.update()

    const authContainer = wrapper.find(AuthenticationContainer)
    expect(authContainer.prop('fetchUser')).toEqual(expect.any(Function))
  })
})
