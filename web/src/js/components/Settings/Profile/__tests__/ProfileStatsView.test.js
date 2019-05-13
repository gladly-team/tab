/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import { QueryRenderer } from 'react-relay'
import ProfileStatsView from 'js/components/Settings/Profile/ProfileStatsView'
import ProfileStats from 'js/components/Settings/Profile/ProfileStatsContainer'
import ErrorMessage from 'js/components/General/ErrorMessage'
import logger from 'js/utils/logger'

jest.mock('react-relay')
jest.mock('js/components/General/ErrorMessage')
jest.mock('js/components/General/withUser')
jest.mock('js/utils/logger')
jest.mock('js/components/Settings/Profile/ProfileStatsContainer')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  authUser: {
    id: 'example-user-id',
    email: 'foo@example.com',
    username: 'example',
    isAnonymous: false,
    emailVerified: true,
  },
  showError: jest.fn(),
})

describe('ProfileStatsView', () => {
  it('renders without error', () => {
    const mockProps = getMockProps()
    shallow(<ProfileStatsView {...mockProps} />)
  })

  it('sets a root style of 100% width and height', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileStatsView {...mockProps} />)
    expect(wrapper.at(0).prop('style')).toEqual({
      width: '100%',
      height: '100%',
    })
  })

  it('includes a QueryRenderer', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileStatsView {...mockProps} />)
    expect(wrapper.find(QueryRenderer).exists()).toBe(true)
  })

  it('passes the expected variables to the QueryRenderer', () => {
    const mockProps = getMockProps()
    const wrapper = mount(<ProfileStatsView {...mockProps} />)
    expect(wrapper.find(QueryRenderer).prop('variables')).toEqual({
      userId: 'example-user-id', // from the authUser prop
    })
  })

  it('does not render the child component before data has returned', () => {
    // No QueryRenderer response set.
    const mockProps = getMockProps()
    const wrapper = mount(<ProfileStatsView {...mockProps} />)
    expect(wrapper.find(ProfileStats).exists()).toBe(false)
  })

  it('does not render the child component when there is no data', () => {
    QueryRenderer.__setQueryResponse({
      error: null,
      props: null,
      retry: jest.fn(),
    })
    const mockProps = getMockProps()
    const wrapper = mount(<ProfileStatsView {...mockProps} />)
    expect(wrapper.find(ProfileStats).exists()).toBe(false)
  })

  it('passes the expected props to the child component', () => {
    const fakeQueryRendererProps = {
      user: {
        id: 'abc123xyz456',
        vc: 233,
      },
    }
    QueryRenderer.__setQueryResponse({
      error: null,
      props: fakeQueryRendererProps,
      retry: jest.fn(),
    })
    const mockProps = getMockProps()
    const wrapper = mount(<ProfileStatsView {...mockProps} />)
    expect(wrapper.find(ProfileStats).props()).toEqual({
      user: fakeQueryRendererProps.user,
      showError: mockProps.showError,
    })
  })

  it('logs an error and renders an ErrorMessage if unexpected QueryRenderer errors occur', () => {
    QueryRenderer.__setQueryResponse({
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
    const wrapper = mount(<ProfileStatsView {...mockProps} />)

    // An error should render instead of the view.
    expect(wrapper.find(ProfileStats).length).toBe(0)
    expect(wrapper.find(ErrorMessage).exists()).toBe(true)
    expect(wrapper.find(ErrorMessage).prop('message')).toBe(
      'We had a problem loading your stats :('
    )
    expect(logger.error).toHaveBeenCalled()
  })
})
