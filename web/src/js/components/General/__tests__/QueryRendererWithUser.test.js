/* eslint-env jest */

import React from 'react'
import graphql from 'babel-plugin-relay/macro'
import { shallow } from 'enzyme'
import { QueryRenderer } from 'react-relay'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import { createNewUser } from 'js/authentication/helpers'
import { ERROR_USER_DOES_NOT_EXIST } from 'js/constants'
import { flushAllPromises } from 'js/utils/test-utils'
import logger from 'js/utils/logger'

jest.mock('react-relay')
jest.mock('js/authentication/helpers')
jest.mock('js/utils/logger')

const getMockProps = () => ({
  query: graphql`
    query AuthenticationViewQuery($userId: String!) {
      user(userId: $userId) {
        ...AuthenticationContainer_user
      }
    }
  `,
  render: jest.fn(),
  variables: {
    userId: 'abc-123',
  },
})

beforeAll(() => {
  jest.useFakeTimers()
})

beforeEach(() => {
  createNewUser.mockResolvedValue({
    id: 'abc-123',
    username: 'timmy',
    email: 'tturner@example.com',
  })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('QueryRendererWithUser', () => {
  it('renders without error', () => {
    const mockProps = getMockProps()
    shallow(<QueryRendererWithUser {...mockProps} />)
  })

  it('the react-relay QueryRenderer receives the "variables" prop', async () => {
    expect.assertions(1)
    const mockProps = getMockProps()
    const wrapper = shallow(<QueryRendererWithUser {...mockProps} />)
    wrapper.update()
    expect(wrapper.find(QueryRenderer).prop('variables')).toEqual({
      userId: 'abc-123',
    })
  })

  it('the react-relay QueryRenderer receives the "query" prop', async () => {
    expect.assertions(1)
    const mockProps = getMockProps()
    const wrapper = shallow(<QueryRendererWithUser {...mockProps} />)
    wrapper.update()
    expect(wrapper.find(QueryRenderer).prop('query')).toEqual(
      expect.any(Function)
    )
  })

  it('calls render before receiving a query response', async () => {
    expect.assertions(1)
    const mockProps = getMockProps()
    const wrapper = shallow(<QueryRendererWithUser {...mockProps} />)
    const mockQueryResponse = {
      error: null,
      props: null,
      retry: jest.fn(),
    }
    const ourQueryRendererRenderFn = wrapper.find(QueryRenderer).prop('render')
    ourQueryRendererRenderFn(mockQueryResponse)
    expect(mockProps.render).toHaveBeenCalledWith(mockQueryResponse)
  })

  it("passes render prop values to the child QueryRenderer's render function", async () => {
    expect.assertions(1)
    const mockProps = getMockProps()
    const wrapper = shallow(<QueryRendererWithUser {...mockProps} />)
    const mockQueryResponse = {
      error: null,
      props: {
        user: {
          hi: 'there',
        },
      },
      retry: jest.fn(),
    }
    const ourQueryRendererRenderFn = wrapper.find(QueryRenderer).prop('render')
    ourQueryRendererRenderFn(mockQueryResponse)
    expect(mockProps.render).toHaveBeenCalledWith({
      props: {
        user: {
          hi: 'there',
        },
      },
      error: null,
      retry: expect.any(Function),
    })
  })

  it('attempts to create a new user and refetch when there is a "user does not exist" error', async () => {
    expect.assertions(2)

    const mockRetryFn = jest.fn()

    // Mock an error that the user does not exist server-side.
    const mockQueryResponse = {
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
    }

    const mockProps = getMockProps()
    const wrapper = shallow(<QueryRendererWithUser {...mockProps} />)
    const ourQueryRendererRenderFn = wrapper.find(QueryRenderer).prop('render')
    ourQueryRendererRenderFn(mockQueryResponse)
    await flushAllPromises()
    expect(createNewUser).toHaveBeenCalledTimes(1)
    expect(mockRetryFn).toHaveBeenCalledTimes(1)
  })

  it('does not attempt to create a new user when the user already exists', async () => {
    expect.assertions(2)

    const mockRetryFn = jest.fn()

    // Mock that the server returns the user.
    const mockQueryResponse = {
      error: null,
      props: {
        user: {
          id: 'acbdegfh2468',
          email: 'foo@example.com',
          username: null,
        },
      },
      retry: jest.fn(),
    }

    const mockProps = getMockProps()
    const wrapper = shallow(<QueryRendererWithUser {...mockProps} />)
    const ourQueryRendererRenderFn = wrapper.find(QueryRenderer).prop('render')
    ourQueryRendererRenderFn(mockQueryResponse)
    await flushAllPromises()
    expect(createNewUser).not.toHaveBeenCalled()
    expect(mockRetryFn).not.toHaveBeenCalled()
  })

  it('only tries to refetch a user 5 times when there is a repeated "user does not exist" error', async () => {
    expect.assertions(2)

    const mockRetryFn = jest.fn()

    // Mock an error that the user does not exist server-side.
    const mockQueryResponse = {
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
    }

    const mockProps = getMockProps()
    const wrapper = shallow(<QueryRendererWithUser {...mockProps} />)
    const ourQueryRendererRenderFn = wrapper.find(QueryRenderer).prop('render')

    // Mock that the server continues to return the error.
    for (let i = 0; i < 12; i++) {
      ourQueryRendererRenderFn(mockQueryResponse)
    }
    expect(createNewUser).toHaveBeenCalledTimes(5)
    expect(logger.error).toHaveBeenCalledTimes(7) // the remaining attempts are error logs
  })

  // Note: Jest warnings will fail the test, because we include this
  // in our setupTests.js file:
  it('does not throw or log an error if the component unmounts during the async createNewUser call', async () => {
    expect.assertions(2)

    jest.advanceTimersByTime(10e3)
    await flushAllPromises()
    expect(logger.error).not.toHaveBeenCalled()
    const mockRetryFn = jest.fn()

    // Mock an error that the user does not exist server-side.
    const mockQueryResponse = {
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
    }

    const mockProps = getMockProps()
    const wrapper = shallow(<QueryRendererWithUser {...mockProps} />)

    createNewUser.mockImplementation(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            id: 'acbdegfh2468',
            username: null,
            email: 'foo@example.com',
          })
        }, 8e3)
      })
    })
    const ourQueryRendererRenderFn = wrapper.find(QueryRenderer).prop('render')
    ourQueryRendererRenderFn(mockQueryResponse)

    // Unmount
    wrapper.unmount()

    jest.advanceTimersByTime(10e3)
    await flushAllPromises()
    expect(logger.error).not.toHaveBeenCalled()
  })

  it("does not pass any errors to the child QueryRenderer's render function while trying to create a server-side user", async () => {
    expect.assertions(2)

    const mockRetryFn = jest.fn()

    // Mock an error that the user does not exist server-side.
    const mockQueryResponse = {
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
    }

    const mockProps = getMockProps()
    const wrapper = shallow(<QueryRendererWithUser {...mockProps} />)
    const ourQueryRendererRenderFn = wrapper.find(QueryRenderer).prop('render')
    ourQueryRendererRenderFn(mockQueryResponse)
    expect(mockProps.render).toHaveBeenCalledWith({
      props: null,
      error: null,
      retry: expect.any(Function),
    })

    // After we give up trying to create a user, we should pass
    // the actual error to the child to let it handle the error.
    for (let i = 0; i < 5; i++) {
      ourQueryRendererRenderFn(mockQueryResponse)
    }
    expect(mockProps.render).toHaveBeenLastCalledWith({
      props: null,
      error: mockQueryResponse.error,
      retry: expect.any(Function),
    })
  })
})
