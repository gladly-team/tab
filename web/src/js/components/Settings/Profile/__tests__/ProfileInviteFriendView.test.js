/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import ProfileInviteFriendView from 'js/components/Settings/Profile/ProfileInviteFriendView'
import ProfileInviteFriend from 'js/components/Settings/Profile/ProfileInviteFriendContainer'
import ErrorMessage from 'js/components/General/ErrorMessage'
import logger from 'js/utils/logger'

jest.mock('js/components/General/QueryRendererWithUser')
jest.mock('js/components/General/ErrorMessage')
jest.mock('js/components/General/withUser')
jest.mock('js/utils/logger')
jest.mock('js/components/Settings/Profile/ProfileInviteFriendContainer')

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

describe('ProfileInviteFriendView', () => {
  it('renders without error', () => {
    const mockProps = getMockProps()
    shallow(<ProfileInviteFriendView {...mockProps} />)
  })

  it('sets a root style of 100% width and height', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileInviteFriendView {...mockProps} />)
    expect(wrapper.at(0).prop('style')).toEqual({
      width: '100%',
      height: '100%',
    })
  })

  it('includes a QueryRenderer', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileInviteFriendView {...mockProps} />)
    expect(wrapper.find(QueryRendererWithUser).exists()).toBe(true)
  })

  it('passes the expected variables to the QueryRenderer', () => {
    const mockProps = getMockProps()
    const wrapper = mount(<ProfileInviteFriendView {...mockProps} />)
    expect(wrapper.find(QueryRendererWithUser).prop('variables')).toEqual({
      userId: 'example-user-id', // from the authUser prop
    })
  })

  it('does not render the child component before data has returned', () => {
    // No QueryRenderer response set.
    const mockProps = getMockProps()
    const wrapper = mount(<ProfileInviteFriendView {...mockProps} />)
    expect(wrapper.find(ProfileInviteFriend).exists()).toBe(false)
  })

  it('does not render the child component when there is no data', () => {
    QueryRendererWithUser.__setQueryResponse({
      error: null,
      props: null,
      retry: jest.fn(),
    })
    const mockProps = getMockProps()
    const wrapper = mount(<ProfileInviteFriendView {...mockProps} />)
    expect(wrapper.find(ProfileInviteFriend).exists()).toBe(false)
  })

  it('passes the expected props to the child component', () => {
    const fakeQueryRendererProps = {
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
      props: fakeQueryRendererProps,
      retry: jest.fn(),
    })
    const mockProps = getMockProps()
    const wrapper = mount(<ProfileInviteFriendView {...mockProps} />)
    expect(wrapper.find(ProfileInviteFriend).props()).toEqual({
      app: fakeQueryRendererProps.app,
      user: fakeQueryRendererProps.user,
      showError: mockProps.showError,
    })
  })

  it('logs an error and renders an ErrorMessage if unexpected QueryRenderer errors occur', () => {
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
    const wrapper = mount(<ProfileInviteFriendView {...mockProps} />)

    // An error should render instead of the view.
    expect(wrapper.find(ProfileInviteFriend).length).toBe(0)
    expect(wrapper.find(ErrorMessage).exists()).toBe(true)
    expect(wrapper.find(ErrorMessage).prop('message')).toBe(
      'We had a problem loading this page :('
    )
    expect(logger.error).toHaveBeenCalled()
  })
})
