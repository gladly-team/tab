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

beforeEach(() => {
  createNewUser.mockResolvedValue({
    id: 'abc-123',
    username: 'timmy',
    email: 'tturner@example.com',
  })
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

  // TODO
  // it('passes render prop values to the child QueryRenderer\'s render function', async () => {
  //   expect.assertions(1)
  //   const mockProps = getMockProps()
  //   const wrapper = shallow(<QueryRendererWithUser {...mockProps} />)
  //   const mockQueryResponse = {
  //     error: null,
  //     props: null,
  //     retry: jest.fn(),
  //   }
  //   const ourQueryRendererRenderFn = wrapper.find(QueryRenderer).prop('render')
  //   ourQueryRendererRenderFn(mockQueryResponse)
  //   expect(mockProps.render).toHaveBeenCalledWith(mockQueryResponse)
  // })

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

    // Mock that the server returns the user on the second request.
    // const mockQueryResponseNumberTwo = {
    //   error: null,
    //   props: {
    //     user: {
    //       id: 'acbdegfh2468',
    //       email: 'foo@example.com',
    //       username: null,
    //     },
    //   },
    //   retry: jest.fn(),
    // }

    const mockProps = getMockProps()
    const wrapper = shallow(<QueryRendererWithUser {...mockProps} />)
    const ourQueryRendererRenderFn = wrapper.find(QueryRenderer).prop('render')
    ourQueryRendererRenderFn(mockQueryResponse)
    await flushAllPromises()
    expect(createNewUser).toHaveBeenCalledTimes(1)
    expect(mockRetryFn).toHaveBeenCalledTimes(1)
  })

  // TODO
  //   it('attempts to create a new user and refetch when there is a "user does not exist" error', async () => {
  //     expect.assertions(2)
  //
  //     __setMockAuthUser({
  //       id: 'acbdegfh2468',
  //       email: 'foo@example.com',
  //       username: 'example',
  //       isAnonymous: false,
  //       emailVerified: true,
  //     })
  //
  //     // Have the server return an error on the first request.
  //     const mockRetryFn = jest.fn()
  //     QueryRenderer.__setQueryResponseOnce({
  //       error: {
  //         name: 'RelayNetwork',
  //         type: 'mustfix',
  //         framesToPop: 2,
  //         source: {
  //           errors: [
  //             {
  //               message: 'No user exists with this ID.',
  //               locations: [
  //                 {
  //                   line: 8,
  //                   column: 3,
  //                 },
  //               ],
  //               path: ['user'],
  //               code: ERROR_USER_DOES_NOT_EXIST,
  //             },
  //           ],
  //           operation: { foo: 'bar' },
  //           variables: { foo: 'baz' },
  //         },
  //       },
  //       props: null,
  //       retry: mockRetryFn,
  //     })
  //
  //     // The server returns the user on the second request.
  //     QueryRenderer.__setQueryResponse({
  //       error: null,
  //       props: {
  //         user: {
  //           id: 'acbdegfh2468',
  //           email: 'foo@example.com',
  //           username: null,
  //         },
  //       },
  //       retry: jest.fn(),
  //     })
  //
  //     createNewUser.mockResolvedValue({
  //       id: 'acbdegfh2468',
  //       username: null,
  //       email: null,
  //     })
  //
  //     const wrapper = mount(<QueryRendererWithUser />)
  //     await flushAllPromises()
  //     wrapper.update()
  //
  //     expect(createNewUser).toHaveBeenCalledTimes(1)
  //
  //     // Incrementing the refetchCounter variable will cause a
  //     // refetch of data.
  //     expect(wrapper.find(QueryRenderer).prop('variables')).toEqual({
  //       userId: 'acbdegfh2468',
  //       refetchCounter: 1,
  //     })
  //   })
  //
  //   it('only tries to refetch a user 3 times when there is a repeated "user does not exist" error', async () => {
  //     expect.assertions(2)
  //
  //     __setMockAuthUser({
  //       id: 'abc123xyz456',
  //       email: 'foo@example.com',
  //       username: 'example',
  //       isAnonymous: false,
  //       emailVerified: true,
  //     })
  //
  //     // Have the server return an error every time. This would only
  //     // happen if there's a server-side bug.
  //     const mockRetryFn = jest.fn()
  //     QueryRenderer.__setQueryResponse({
  //       error: {
  //         name: 'RelayNetwork',
  //         type: 'mustfix',
  //         framesToPop: 2,
  //         source: {
  //           errors: [
  //             {
  //               message: 'No user exists with this ID.',
  //               locations: [
  //                 {
  //                   line: 8,
  //                   column: 3,
  //                 },
  //               ],
  //               path: ['user'],
  //               code: ERROR_USER_DOES_NOT_EXIST,
  //             },
  //           ],
  //           operation: { foo: 'bar' },
  //           variables: { foo: 'baz' },
  //         },
  //       },
  //       props: null,
  //       retry: mockRetryFn,
  //     })
  //
  //     createNewUser.mockResolvedValue({
  //       id: 'acbdegfh2468',
  //       username: null,
  //       email: null,
  //     })
  //
  //     const wrapper = mount(<QueryRendererWithUser />)
  //     await flushAllPromises()
  //     wrapper.update()
  //
  //     expect(createNewUser).toHaveBeenCalledTimes(3)
  //     expect(logger.error).toHaveBeenCalledTimes(1)
  //   })
  //
  //   // Note: Jest warnings will fail the test, because we include this
  //   // in our setupTests.js file:
  //   // https://github.com/facebook/jest/issues/6121#issuecomment-444269677
  //   it('does not throw or log an error if the component unmounts during the async createNewUser call', async () => {
  //     expect.assertions(1)
  //
  //     __setMockAuthUser({
  //       id: 'acbdegfh2468',
  //       email: 'foo@example.com',
  //       username: 'example',
  //       isAnonymous: false,
  //       emailVerified: true,
  //     })
  //
  //     // Have the server return an error on the first request.
  //     const mockRetryFn = jest.fn()
  //     QueryRenderer.__setQueryResponseOnce({
  //       error: {
  //         name: 'RelayNetwork',
  //         type: 'mustfix',
  //         framesToPop: 2,
  //         source: {
  //           errors: [
  //             {
  //               message: 'No user exists with this ID.',
  //               locations: [
  //                 {
  //                   line: 8,
  //                   column: 3,
  //                 },
  //               ],
  //               path: ['user'],
  //               code: ERROR_USER_DOES_NOT_EXIST,
  //             },
  //           ],
  //           operation: { foo: 'bar' },
  //           variables: { foo: 'baz' },
  //         },
  //       },
  //       props: null,
  //       retry: mockRetryFn,
  //     })
  //
  //     // The server returns the user on the second request.
  //     QueryRenderer.__setQueryResponse({
  //       error: null,
  //       props: {
  //         user: {
  //           id: 'acbdegfh2468',
  //           email: 'foo@example.com',
  //           username: null,
  //         },
  //       },
  //       retry: jest.fn(),
  //     })
  //
  //     jest.useFakeTimers()
  //     createNewUser.mockImplementation(() => {
  //       return new Promise((resolve, reject) => {
  //         setTimeout(() => {
  //           resolve({
  //             id: 'acbdegfh2468',
  //             username: null,
  //             email: 'foo@example.com',
  //           })
  //         }, 8e3)
  //       })
  //     })
  //
  //     const wrapper = mount(<QueryRendererWithUser />)
  //     await flushAllPromises()
  //
  //     // Unmount
  //     wrapper.unmount()
  //
  //     jest.advanceTimersByTime(10e3)
  //     await flushAllPromises()
  //     expect(logger.error).not.toHaveBeenCalled()
  //   })
})
