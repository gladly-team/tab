/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Helmet } from 'react-helmet'
import InviteFriend from 'js/components/Settings/Profile/InviteFriendContainer'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import HappyIcon from '@material-ui/icons/Mood'

jest.mock('js/mutations/LogReferralLinkClickMutation')
jest.mock('js/utils/logger')

const getMockProps = () => ({})

describe('SearchProfileInviteFriendComponent', () => {
  it('renders without error', () => {
    const SearchProfileInviteFriend = require('js/components/Search/Settings/SearchProfileInviteFriendComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SearchProfileInviteFriend {...mockProps} />).dive()
  })

  it('sets the the page title', async () => {
    const SearchProfileInviteFriend = require('js/components/Search/Settings/SearchProfileInviteFriendComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchProfileInviteFriend {...mockProps} />).dive()
    expect(
      wrapper
        .find(Helmet)
        .find('title')
        .first()
        .text()
    ).toEqual('Invite Friends')
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

  it('sets the "baseURL" in the InviteFriend component to search.gladly.io', () => {
    const SearchProfileInviteFriend = require('js/components/Search/Settings/SearchProfileInviteFriendComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchProfileInviteFriend {...mockProps} />).dive()
    const inviteFriendElem = wrapper.find(InviteFriend)
    expect(inviteFriendElem.prop('baseURL')).toEqual('https://search.gladly.io')
  })

  it('shows a "thank you" message title', () => {
    const SearchProfileInviteFriend = require('js/components/Search/Settings/SearchProfileInviteFriendComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchProfileInviteFriend {...mockProps} />).dive()
    expect(
      wrapper
        .find(Paper)
        .last()
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('Thank you!')
  })

  it('includes a smiley face icon in the "thank you" message title', () => {
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
        .last()
        .render()
        .text()
    ).toEqual(
      "You're one of the first people to use Search for a Cause, and we depend on people like you to get the word out."
    )
  })
})
