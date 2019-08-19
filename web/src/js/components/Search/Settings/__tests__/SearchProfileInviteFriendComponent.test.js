/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import InviteFriend from 'js/components/Settings/Profile/InviteFriendContainer'
import Stat from 'js/components/Settings/Profile/StatComponent'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import HappyIcon from '@material-ui/icons/Mood'

jest.mock('js/mutations/LogReferralLinkClickMutation')
jest.mock('js/utils/logger')

const getMockProps = () => ({
  app: {
    referralVcReward: 300,
  },
  user: {
    numUsersRecruited: 2,
  },
})

//
describe('SearchProfileInviteFriendComponent', () => {
  it('renders without error', () => {
    const SearchProfileInviteFriend = require('js/components/Search/Settings/SearchProfileInviteFriendComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SearchProfileInviteFriend {...mockProps} />).dive()
  })

  it('renders the InviteFriend component and passes it a null "user" prop value', () => {
    const SearchProfileInviteFriend = require('js/components/Search/Settings/SearchProfileInviteFriendComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchProfileInviteFriend {...mockProps} />).dive()
    const inviteFriendElem = wrapper.find(InviteFriend)
    expect(inviteFriendElem.exists()).toBe(true)
    expect(inviteFriendElem.prop('user')).toBeNull()
  })

  it('shows a "thank you" message', () => {
    const SearchProfileInviteFriend = require('js/components/Search/Settings/SearchProfileInviteFriendComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchProfileInviteFriend {...mockProps} />).dive()
    expect(
      wrapper
        .find(Paper)
        .last()
        .find(Typography)
        .render()
        .text()
    ).toEqual(
      'Thank you! Every new person raises more money for charity, and we depend on people like you to get the word out.'
    )
  })

  it('includes a smiley face icon in the "thank you" message at the bottom', () => {
    const SearchProfileInviteFriend = require('js/components/Search/Settings/SearchProfileInviteFriendComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchProfileInviteFriend {...mockProps} />).dive()
    expect(
      wrapper
        .find(Paper)
        .last()
        .find(HappyIcon)
        .exists()
    ).toBe(true)
  })
})
