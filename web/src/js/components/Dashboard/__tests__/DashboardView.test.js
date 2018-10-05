/* eslint-env jest */

import React from 'react'
import {
  mount,
  shallow
} from 'enzyme'
import DashboardView from '../DashboardView'
import AuthUserComponent from 'general/AuthUserComponent'
import {
  QueryRenderer
} from 'react-relay'
import DashboardContainer from '../DashboardContainer'
import ErrorMessage from 'general/ErrorMessage'
import { createNewUser } from 'authentication/helpers'
import {
  goTo,
  loginURL
} from 'navigation/navigation'
import {
  ERROR_USER_DOES_NOT_EXIST
} from '../../../constants'

jest.mock('general/AuthUserComponent')
jest.mock('general/ErrorMessage')
jest.mock('analytics/logEvent')
jest.mock('react-relay')
jest.mock('../DashboardContainer')
jest.mock('authentication/helpers')
jest.mock('navigation/navigation')

afterEach(() => {
  jest.clearAllMocks()
})

describe('DashboardView', () => {
  it('renders without error', () => {
    shallow(
      <DashboardView />
    )
  })

  it('includes AuthUserComponent', () => {
    const wrapper = shallow(
      <DashboardView />
    )
    expect(wrapper.find(AuthUserComponent).length).toBe(1)

    // Make sure AuthUserComponent is the top-level component.
    // We're not using Enzyme's .type() here because the
    // component is mocked.
    expect(wrapper.name()).toEqual('AuthUserComponent')
  })

  it('includes QueryRenderer', () => {
    const wrapper = shallow(
      <DashboardView />
    )
    expect(wrapper.find(QueryRenderer).length).toBe(1)
  })

  it('QueryRenderer receives the "variables" prop', () => {
    const wrapper = mount(
      <DashboardView />
    )
    expect(wrapper.find(QueryRenderer).prop('variables')).toEqual({
      userId: 'abc123xyz456' // default value in AuthUser mock
    })
  })

  it('renders DashboardContainer before receiving a query response', () => {
    QueryRenderer.__setQueryResponse({
      error: null,
      props: null,
      retry: jest.fn()
    })

    const wrapper = mount(
      <DashboardView />
    )
    expect(wrapper.find(DashboardContainer).length).toBe(1)
  })

  it('passes "app" and "user" props to the DashboardContainer when they exist', () => {
    const fakeProps = {
      app: {
        some: 'value'
      },
      user: {
        id: 'abc123xyz456',
        vc: 233
      }
    }
    QueryRenderer.__setQueryResponse({
      error: null,
      props: fakeProps,
      retry: jest.fn()
    })

    const wrapper = mount(
      <DashboardView />
    )
    const dashboardContainer = wrapper.find(DashboardContainer)
    expect(dashboardContainer.prop('app')).toEqual(fakeProps.app)
    expect(dashboardContainer.prop('user')).toEqual(fakeProps.user)
  })

  it('renders an ErrorMessage if unexpected errors occur', () => {
    QueryRenderer.__setQueryResponse({
      error: {
        name: 'RelayNetwork',
        type: 'mustfix',
        framesToPop: 2,
        source: {
          errors: [
            {
              message: 'Something went horribly wrong.',
              locations: [{
                line: 8,
                column: 3
              }],
              path: ['user'],
              code: 'HORRIBLY_WRONG_ERROR'
            }
          ],
          operation: { foo: 'bar' },
          variables: { foo: 'baz' }
        }
      },
      props: null,
      retry: jest.fn()
    })

    const wrapper = mount(
      <DashboardView />
    )

    // Dashboard should not render.
    expect(wrapper.find(DashboardContainer).length).toBe(0)

    // Make sure the ErrorMessage exists and has the expected message.
    expect(wrapper.find(ErrorMessage).length).toBe(1)
    expect(wrapper.find(ErrorMessage).prop('message')).toBe(
      'We had a problem loading your dashboard :(')
  })

  it('attempts to create a new user and refetch when there is a "user does not exist" error', async () => {
    expect.assertions(2)

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
      id: 'abc123xyz456',
      username: null,
      email: null
    })

    mount(<DashboardView />)

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(createNewUser).toHaveBeenCalledTimes(1)
    expect(mockRetryFn).toHaveBeenCalledTimes(1)
  })

  it('redirects to the login page if it cannot create the user after a "user does not exist" error', async () => {
    expect.assertions(3)

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

    // Failed to create a new user.
    createNewUser.mockRejectedValue(new Error('Failure'))

    mount(<DashboardView />)

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(createNewUser).toHaveBeenCalledTimes(1)
    expect(mockRetryFn).not.toHaveBeenCalled()
    expect(goTo).toHaveBeenCalledWith(loginURL)
  })
})
