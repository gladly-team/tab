/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import AuthenticationView from 'js/components/Authentication/AuthenticationView'
import { QueryRenderer } from 'react-relay'
import AuthenticationContainer from 'js/components/Authentication/AuthenticationContainer'
import { createNewUser } from 'js/authentication/helpers'
import { ERROR_USER_DOES_NOT_EXIST } from 'js/constants'
import { __setMockAuthUser } from 'js/components/General/withUser'
import { flushAllPromises } from 'js/utils/test-utils'
import logger from 'js/utils/logger'

jest.mock('react-relay')
jest.mock('js/components/Authentication/AuthenticationContainer')
jest.mock('js/authentication/helpers')
jest.mock('js/components/General/withUser')
jest.mock('js/utils/logger')

afterEach(() => {
  jest.clearAllMocks()
  __setMockAuthUser(null)
})

describe('AuthenticationView', () => {
  it('renders without error', () => {
    shallow(<AuthenticationView />).dive()
  })

  it('QueryRenderer receives the "variables" prop', async () => {
    expect.assertions(1)

    __setMockAuthUser({
      id: 'abc123xyz456',
      email: 'foo@example.com',
      username: 'example',
      isAnonymous: false,
      emailVerified: true,
    })
    const wrapper = mount(<AuthenticationView />)
    wrapper.update()
    expect(wrapper.find(QueryRenderer).prop('variables')).toEqual({
      userId: 'abc123xyz456',
      refetchCounter: 0,
    })
  })

  it('QueryRenderer receives the "query" prop', async () => {
    expect.assertions(1)

    __setMockAuthUser({
      id: 'abc123xyz456',
      email: 'foo@example.com',
      username: 'example',
      isAnonymous: false,
      emailVerified: true,
    })
    const wrapper = mount(<AuthenticationView />)
    wrapper.update()
    expect(wrapper.find(QueryRenderer).prop('query')).toEqual(
      expect.any(Function)
    )
  })

  it('QueryRenderer receives empty "variables" and "query" props if there is no authed user', async () => {
    expect.assertions(2)

    __setMockAuthUser(null)
    const wrapper = mount(<AuthenticationView />)
    wrapper.update()
    expect(wrapper.find(QueryRenderer).prop('variables')).toEqual({})
    expect(wrapper.find(QueryRenderer).prop('query')).toBeUndefined()
  })

  it('does not render AuthenticationContainer before receiving a query response', async () => {
    expect.assertions(1)
    __setMockAuthUser(null)
    QueryRenderer.__setQueryResponse({
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
    QueryRenderer.__setQueryResponse({
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

  it('attempts to create a new user and refetch when there is a "user does not exist" error', async () => {
    expect.assertions(2)

    __setMockAuthUser({
      id: 'acbdegfh2468',
      email: 'foo@example.com',
      username: 'example',
      isAnonymous: false,
      emailVerified: true,
    })

    // Have the server return an error on the first request.
    const mockRetryFn = jest.fn()
    QueryRenderer.__setQueryResponseOnce({
      error: {
        name: 'RelayNetwork',
        type: 'mustfix',
        framesToPop: 2,
        source: {
          errors: [
            {
              message: 'No user exists with this ID.',
              locations: [
                {
                  line: 8,
                  column: 3,
                },
              ],
              path: ['user'],
              code: ERROR_USER_DOES_NOT_EXIST,
            },
          ],
          operation: { foo: 'bar' },
          variables: { foo: 'baz' },
        },
      },
      props: null,
      retry: mockRetryFn,
    })

    // The server returns the user on the second request.
    QueryRenderer.__setQueryResponse({
      error: null,
      props: {
        user: {
          id: 'acbdegfh2468',
          email: 'foo@example.com',
          username: null,
        },
      },
      retry: jest.fn(),
    })

    createNewUser.mockResolvedValue({
      id: 'acbdegfh2468',
      username: null,
      email: null,
    })

    const wrapper = mount(<AuthenticationView />)
    await flushAllPromises()
    wrapper.update()

    expect(createNewUser).toHaveBeenCalledTimes(1)

    // Incrementing the refetchCounter variable will cause a
    // refetch of data.
    expect(wrapper.find(QueryRenderer).prop('variables')).toEqual({
      userId: 'acbdegfh2468',
      refetchCounter: 1,
    })
  })

  it('only tries to refetch a user 3 times when there is a repeated "user does not exist" error', async () => {
    expect.assertions(2)

    __setMockAuthUser({
      id: 'abc123xyz456',
      email: 'foo@example.com',
      username: 'example',
      isAnonymous: false,
      emailVerified: true,
    })

    // Have the server return an error every time. This would only
    // happen if there's a server-side bug.
    const mockRetryFn = jest.fn()
    QueryRenderer.__setQueryResponse({
      error: {
        name: 'RelayNetwork',
        type: 'mustfix',
        framesToPop: 2,
        source: {
          errors: [
            {
              message: 'No user exists with this ID.',
              locations: [
                {
                  line: 8,
                  column: 3,
                },
              ],
              path: ['user'],
              code: ERROR_USER_DOES_NOT_EXIST,
            },
          ],
          operation: { foo: 'bar' },
          variables: { foo: 'baz' },
        },
      },
      props: null,
      retry: mockRetryFn,
    })

    createNewUser.mockResolvedValue({
      id: 'acbdegfh2468',
      username: null,
      email: null,
    })

    const wrapper = mount(<AuthenticationView />)
    await flushAllPromises()
    wrapper.update()

    expect(createNewUser).toHaveBeenCalledTimes(3)
    expect(logger.error).toHaveBeenCalledTimes(1)
  })

  // Note: Jest warnings will fail the test, because we include this
  // in our setupTests.js file:
  // https://github.com/facebook/jest/issues/6121#issuecomment-444269677
  it('does not throw or log an error if the component unmounts during the async createNewUser call', async () => {
    expect.assertions(1)

    __setMockAuthUser({
      id: 'acbdegfh2468',
      email: 'foo@example.com',
      username: 'example',
      isAnonymous: false,
      emailVerified: true,
    })

    // Have the server return an error on the first request.
    const mockRetryFn = jest.fn()
    QueryRenderer.__setQueryResponseOnce({
      error: {
        name: 'RelayNetwork',
        type: 'mustfix',
        framesToPop: 2,
        source: {
          errors: [
            {
              message: 'No user exists with this ID.',
              locations: [
                {
                  line: 8,
                  column: 3,
                },
              ],
              path: ['user'],
              code: ERROR_USER_DOES_NOT_EXIST,
            },
          ],
          operation: { foo: 'bar' },
          variables: { foo: 'baz' },
        },
      },
      props: null,
      retry: mockRetryFn,
    })

    // The server returns the user on the second request.
    QueryRenderer.__setQueryResponse({
      error: null,
      props: {
        user: {
          id: 'acbdegfh2468',
          email: 'foo@example.com',
          username: null,
        },
      },
      retry: jest.fn(),
    })

    jest.useFakeTimers()
    createNewUser.mockImplementation(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            id: 'acbdegfh2468',
            username: null,
            email: null,
          })
        }, 8e3)
      })
    })

    const wrapper = mount(<AuthenticationView />)
    await flushAllPromises()

    // Unmount
    wrapper.unmount()

    jest.advanceTimersByTime(10e3)
    await flushAllPromises()
    expect(logger.error).not.toHaveBeenCalled()
  })
})
