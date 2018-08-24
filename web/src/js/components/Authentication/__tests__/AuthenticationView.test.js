/* eslint-env jest */

import React from 'react'
import {
  mount,
  shallow
} from 'enzyme'
import AuthenticationView from '../AuthenticationView'
import {
  QueryRenderer
} from 'react-relay/compat'
import AuthenticationContainer from '../AuthenticationContainer'
import {
  getCurrentUser
} from 'authentication/user'

jest.mock('react-relay/compat')
jest.mock('../AuthenticationContainer')
jest.mock('authentication/user')

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
})
