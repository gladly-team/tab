/* eslint-env jest */

import React from 'react'
import {
  mount,
  shallow
} from 'enzyme'
import AuthenticationView from '../AuthenticationView'
import {
  QueryRenderer
} from 'react-relay'
import AuthenticationContainer from '../AuthenticationContainer'
import { createNewUser } from 'authentication/helpers'
import {
  ERROR_USER_DOES_NOT_EXIST
} from '../../../constants'
import {
  getCurrentUser
} from 'authentication/user'

jest.mock('react-relay')
jest.mock('../AuthenticationContainer')
jest.mock('authentication/user')
jest.mock('authentication/helpers')

afterEach(() => {
  jest.clearAllMocks()
  getCurrentUser.mockResolvedValue(null)
})

describe('AuthenticationView', () => {
  it('renders without error', () => {
    shallow(
      <AuthenticationView />
    )
  })

  it('QueryRenderer receives the "variables" prop', async () => {
    expect.assertions(1)

    getCurrentUser.mockResolvedValue({
      id: 'xyz987',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: true
    })
    const wrapper = mount(
      <AuthenticationView />
    )
    await wrapper.instance().componentDidMount()
    wrapper.update()
    expect(wrapper.find(QueryRenderer).prop('variables')).toEqual({
      userId: 'xyz987',
      refetchCounter: 2
    })
  })

  it('renders AuthenticationContainer before receiving a query response', () => {
    QueryRenderer.__setQueryResponse({
      error: null,
      props: null,
      retry: jest.fn()
    })

    const wrapper = mount(
      <AuthenticationView />
    )
    expect(wrapper.find(AuthenticationContainer).length).toBe(1)
  })

  it('passes "user" prop to the AuthenticationContainer', () => {
    expect.assertions(1)

    const fakeProps = {
      user: {
        id: 'abc123xyz456',
        email: 'foo@example.com',
        username: 'MyUsername'
      }
    }
    QueryRenderer.__setQueryResponse({
      error: null,
      props: fakeProps,
      retry: jest.fn()
    })

    const wrapper = mount(
      <AuthenticationView />
    )

    const authContainer = wrapper.find(AuthenticationContainer)
    expect(authContainer.prop('user')).toEqual(fakeProps.user)
  })

  it('attempts to create a new user and refetch when there is a "user does not exist" error', async () => {
    expect.assertions(2)

    getCurrentUser.mockResolvedValue({
      id: 'acbdegfh2468',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: true
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
              locations: [{
                line: 8,
                column: 3
              }],
              path: ['user'],
              code: ERROR_USER_DOES_NOT_EXIST
            }
          ],
          operation: { foo: 'bar' },
          variables: { foo: 'baz' }
        }
      },
      props: null,
      retry: mockRetryFn
    })

    // The server returns the user on the second request.
    QueryRenderer.__setQueryResponse({
      error: null,
      props: {
        user: {
          id: 'abc123xyz456',
          email: 'foo@example.com',
          username: null
        }
      },
      retry: jest.fn()
    })

    createNewUser.mockResolvedValue({
      id: 'acbdegfh2468',
      username: null,
      email: null
    })

    const wrapper = mount(<AuthenticationView />)
    await wrapper.instance().componentDidMount()
    wrapper.update()

    expect(createNewUser).toHaveBeenCalledTimes(1)

    // Incrementing the refetchCounter variable will cause a
    // refetch of data.
    expect(wrapper.find(QueryRenderer).prop('variables')).toEqual({
      userId: 'acbdegfh2468',
      refetchCounter: 3
    })
  })

  it('only tries to refetch a user 3 times when there is a repeated "user does not exist" error', async () => {
    expect.assertions(2)

    // Suppress expected console error.
    const mockConsoleErr = jest.fn()
    jest.spyOn(console, 'error').mockImplementation(mockConsoleErr)

    getCurrentUser.mockResolvedValue({
      id: 'acbdegfh2468',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: true
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
              locations: [{
                line: 8,
                column: 3
              }],
              path: ['user'],
              code: ERROR_USER_DOES_NOT_EXIST
            }
          ],
          operation: { foo: 'bar' },
          variables: { foo: 'baz' }
        }
      },
      props: null,
      retry: mockRetryFn
    })

    createNewUser.mockResolvedValue({
      id: 'acbdegfh2468',
      username: null,
      email: null
    })

    const wrapper = mount(<AuthenticationView />)
    await wrapper.instance().componentDidMount()
    wrapper.update()

    expect(createNewUser).toHaveBeenCalledTimes(3)
    expect(mockConsoleErr).toHaveBeenCalledTimes(1)
  })
})
