/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import DashboardView from 'js/components/Dashboard/DashboardView'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import DashboardContainer from 'js/components/Dashboard/DashboardContainer'
import ErrorMessage from 'js/components/General/ErrorMessage'

jest.mock('js/components/General/QueryRendererWithUser')
jest.mock('js/components/General/ErrorMessage')
jest.mock('js/components/Dashboard/DashboardContainer')
jest.mock('js/authentication/helpers')
jest.mock('js/navigation/navigation')
jest.mock('js/components/General/withUser')
jest.mock('js/utils/logger')

const getMockProps = () => ({
  authUser: {
    id: 'example-user-id',
    email: 'foo@example.com',
    username: 'example',
    isAnonymous: false,
    emailVerified: true,
  },
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('withUser HOC in DashboardView', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('is called with the expected options', () => {
    const withUser = require('js/components/General/withUser').default

    /* eslint-disable-next-line no-unused-expressions */
    require('js/components/Dashboard/DashboardView').default
    expect(withUser).toHaveBeenCalledWith()
  })

  it('wraps the DashboardView component', () => {
    const {
      __mockWithUserWrappedFunction,
    } = require('js/components/General/withUser')

    /* eslint-disable-next-line no-unused-expressions */
    require('js/components/Dashboard/DashboardView').default
    const wrappedComponent = __mockWithUserWrappedFunction.mock.calls[0][0]
    expect(wrappedComponent.name).toEqual('DashboardView')
  })
})

describe('DashboardView', () => {
  it('renders without error', () => {
    const mockProps = getMockProps()
    shallow(<DashboardView {...mockProps} />).dive()
  })

  it('sets a root style of 100% width and height', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<DashboardView {...mockProps} />).dive()
    expect(wrapper.at(0).prop('style')).toEqual({
      width: '100%',
      height: '100%',
    })
  })

  it('includes QueryRendererWithUser', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<DashboardView {...mockProps} />).dive()
    expect(wrapper.find(QueryRendererWithUser).length).toBe(1)
  })

  it('passes the expected variables to the QueryRendererWithUser', () => {
    const mockProps = getMockProps()
    const wrapper = mount(<DashboardView {...mockProps} />)
    expect(wrapper.find(QueryRendererWithUser).prop('variables')).toEqual({
      userId: 'example-user-id', // from the authUser prop
    })
  })

  it('renders DashboardContainer before receiving a query response', () => {
    QueryRendererWithUser.__setQueryResponse({
      error: null,
      props: null,
      retry: jest.fn(),
    })

    const mockProps = getMockProps()
    const wrapper = mount(<DashboardView {...mockProps} />)
    expect(wrapper.find(DashboardContainer).length).toBe(1)
  })

  it('passes "app" and "user" props to the DashboardContainer when they exist', () => {
    const fakeProps = {
      app: {
        some: 'value',
      },
      user: {
        id: 'abc123xyz456',
        vc: 233,
      },
    }
    QueryRendererWithUser.__setQueryResponse({
      error: null,
      props: fakeProps,
      retry: jest.fn(),
    })

    const mockProps = getMockProps()
    const wrapper = mount(<DashboardView {...mockProps} />)
    const dashboardContainer = wrapper.find(DashboardContainer)
    expect(dashboardContainer.prop('app')).toEqual(fakeProps.app)
    expect(dashboardContainer.prop('user')).toEqual(fakeProps.user)
  })

  it('renders an ErrorMessage if unexpected errors occur', () => {
    QueryRendererWithUser.__setQueryResponse({
      error: {
        name: 'RelayNetwork',
        type: 'mustfix',
        framesToPop: 2,
        source: {
          errors: [
            {
              message: 'Something went horribly wrong.',
              locations: [
                {
                  line: 8,
                  column: 3,
                },
              ],
              path: ['user'],
              code: 'HORRIBLY_WRONG_ERROR',
            },
          ],
          operation: { foo: 'bar' },
          variables: { foo: 'baz' },
        },
      },
      props: null,
      retry: jest.fn(),
    })

    const mockProps = getMockProps()
    const wrapper = mount(<DashboardView {...mockProps} />)

    // Dashboard should not render.
    expect(wrapper.find(DashboardContainer).length).toBe(0)

    // Make sure the ErrorMessage exists and has the expected message.
    expect(wrapper.find(ErrorMessage).length).toBe(1)
    expect(wrapper.find(ErrorMessage).prop('message')).toBe(
      'We had a problem loading your dashboard :('
    )
  })
})
