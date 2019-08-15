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

describe('ProfileInviteFriendComponent', () => {
  it('renders without error', () => {
    const ProfileInviteFriend = require('js/components/Settings/Profile/ProfileInviteFriendComponent')
      .default
    const mockProps = getMockProps()
    shallow(<ProfileInviteFriend {...mockProps} />).dive()
  })

  it('renders the InviteFriend component and passes it the "user" prop', () => {
    const ProfileInviteFriend = require('js/components/Settings/Profile/ProfileInviteFriendComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileInviteFriend {...mockProps} />).dive()
    const inviteFriendElem = wrapper.find(InviteFriend)
    expect(inviteFriendElem.exists()).toBe(true)
    expect(inviteFriendElem.prop('user')).toEqual({
      numUsersRecruited: 2,
    })
  })

  it('renders the "friends recruited" statistic', () => {
    const ProfileInviteFriend = require('js/components/Settings/Profile/ProfileInviteFriendComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileInviteFriend {...mockProps} />).dive()
    const elem = wrapper.find(Stat).first()
    expect(elem.prop('stat')).toEqual(2)
    expect(elem.prop('statText')).toEqual('friends recruited')
  })

  it('renders the "friends recruited" statistic with a singular "friend" when numUsersRecruited == 1', () => {
    const ProfileInviteFriend = require('js/components/Settings/Profile/ProfileInviteFriendComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.numUsersRecruited = 1
    const wrapper = shallow(<ProfileInviteFriend {...mockProps} />).dive()
    const elem = wrapper.find(Stat).first()
    expect(elem.prop('stat')).toEqual(1)
    expect(elem.prop('statText')).toEqual('friend recruited')
  })

  it('renders the "VC reward" statistic', () => {
    const ProfileInviteFriend = require('js/components/Settings/Profile/ProfileInviteFriendComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileInviteFriend {...mockProps} />).dive()
    const elem = wrapper.find(Stat).at(1)
    expect(elem.prop('stat')).toEqual(300)
    expect(elem.prop('statText')).toEqual(
      'extra Hearts when you recruit a new friend'
    )
  })

  it('shows a "thank you" message at the bottom', () => {
    const ProfileInviteFriend = require('js/components/Settings/Profile/ProfileInviteFriendComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileInviteFriend {...mockProps} />).dive()
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
    const ProfileInviteFriend = require('js/components/Settings/Profile/ProfileInviteFriendComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileInviteFriend {...mockProps} />).dive()
    expect(
      wrapper
        .find(Paper)
        .last()
        .find(HappyIcon)
        .exists()
    ).toBe(true)
  })
})
