/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import { QueryRenderer } from 'react-relay'
import SearchProfileInviteFriendView from 'js/components/Search/Settings/SearchProfileInviteFriendView'
import SearchProfileInviteFriend from 'js/components/Search/Settings/SearchProfileInviteFriendComponent'
import ErrorMessage from 'js/components/General/ErrorMessage'
import logger from 'js/utils/logger'

jest.mock('react-relay')
jest.mock('js/components/General/ErrorMessage')
jest.mock('js/components/General/withUser')
jest.mock('js/utils/logger')
jest.mock('js/components/Settings/Profile/ProfileInviteFriendContainer')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  showError: jest.fn(),
})

describe('SearchProfileInviteFriendView', () => {
  it('renders without error', () => {
    const mockProps = getMockProps()
    shallow(<SearchProfileInviteFriendView {...mockProps} />)
  })

  it('sets a root style of 100% width and height', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchProfileInviteFriendView {...mockProps} />)
    expect(wrapper.at(0).prop('style')).toEqual({
      width: '100%',
      height: '100%',
    })
  })

  it('includes a QueryRenderer', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchProfileInviteFriendView {...mockProps} />)
    expect(wrapper.find(QueryRenderer).exists()).toBe(true)
  })

  it('passes the expected variables to the QueryRenderer', () => {
    const mockProps = getMockProps()
    const wrapper = mount(<SearchProfileInviteFriendView {...mockProps} />)
    expect(wrapper.find(QueryRenderer).prop('variables')).toEqual({})
  })

  it('renders the child component without any data', () => {
    // No QueryRenderer response set.
    const mockProps = getMockProps()
    const wrapper = mount(<SearchProfileInviteFriendView {...mockProps} />)
    expect(wrapper.find(SearchProfileInviteFriend).exists()).toBe(true)
  })

  it('renders the child component when there is no data', () => {
    QueryRenderer.__setQueryResponse({
      error: null,
      props: null,
      retry: jest.fn(),
    })
    const mockProps = getMockProps()
    const wrapper = mount(<SearchProfileInviteFriendView {...mockProps} />)
    expect(wrapper.find(SearchProfileInviteFriend).exists()).toBe(true)
  })

  it('passes the expected props to the child component', () => {
    QueryRenderer.__setQueryResponse({
      error: null,
      props: {},
      retry: jest.fn(),
    })
    const mockProps = getMockProps()
    const wrapper = mount(<SearchProfileInviteFriendView {...mockProps} />)
    expect(wrapper.find(SearchProfileInviteFriend).props()).toEqual({
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
    const wrapper = mount(<SearchProfileInviteFriendView {...mockProps} />)

    // An error should render instead of the view.
    expect(wrapper.find(SearchProfileInviteFriend).length).toBe(0)
    expect(wrapper.find(ErrorMessage).exists()).toBe(true)
    expect(wrapper.find(ErrorMessage).prop('message')).toBe(
      'We had a problem loading this page :('
    )
    expect(logger.error).toHaveBeenCalled()
  })
})
