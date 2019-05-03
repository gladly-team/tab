/* eslint-env jest */

import React from 'react'
import TextField from '@material-ui/core/TextField'
import { cloneDeep } from 'lodash/lang'
import { mount, shallow } from 'enzyme'
import LogReferralLinkClick from 'js/mutations/LogReferralLinkClickMutation'
import logger from 'js/utils/logger'

jest.mock('js/mutations/LogReferralLinkClickMutation')
jest.mock('js/utils/logger')

const mockProps = {
  user: {
    id: 'abc-123',
    username: 'bob',
  },
  classes: {
    inputUnderline: 'something',
    formLabelRoot: 'something',
    formLabelFocused: 'something',
  },
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('Invite friend component', () => {
  it('renders without error', () => {
    const InviteFriendComponent = require('js/components/Settings/Profile/InviteFriendComponent')
      .default
    shallow(<InviteFriendComponent {...mockProps} />)
  })

  it('contains the correct referral URL', () => {
    const InviteFriendComponent = require('js/components/Settings/Profile/InviteFriendComponent')
      .default
    const wrapper = mount(<InviteFriendComponent {...mockProps} />)
    const referralUrl = 'https://tab.gladly.io/?u=bob'
    expect(
      wrapper
        .find(TextField)
        .first()
        .prop('value')
    ).toBe(referralUrl)
  })

  it('contains the correct description text', () => {
    const InviteFriendComponent = require('js/components/Settings/Profile/InviteFriendComponent')
      .default
    const wrapper = mount(<InviteFriendComponent {...mockProps} />)
    expect(
      wrapper
        .find(TextField)
        .first()
        .prop('label')
    ).toBe(`Share this link`)
    expect(
      wrapper
        .find(TextField)
        .first()
        .prop('helperText')
    ).toBe(`and you'll get 350 Hearts for every person who joins!`)
  })

  it('contains the correct referral URL when there is no provided username', () => {
    const InviteFriendComponent = require('js/components/Settings/Profile/InviteFriendComponent')
      .default
    const newMockProps = cloneDeep(mockProps)
    newMockProps.user.username = undefined
    const wrapper = mount(<InviteFriendComponent {...newMockProps} />)
    const referralUrl = 'https://tab.gladly.io'
    expect(
      wrapper
        .find(TextField)
        .first()
        .prop('value')
    ).toBe(referralUrl)
  })

  it('contains the correct description text when there is no provided username', () => {
    const InviteFriendComponent = require('js/components/Settings/Profile/InviteFriendComponent')
      .default
    const newMockProps = cloneDeep(mockProps)
    newMockProps.user.username = undefined
    const wrapper = mount(<InviteFriendComponent {...newMockProps} />)
    expect(
      wrapper
        .find(TextField)
        .first()
        .prop('label')
    ).toBe(`Share this link`)
    expect(
      wrapper
        .find(TextField)
        .first()
        .prop('helperText')
    ).toBe(`and have a bigger positive impact!`)
  })

  it('logs when the user clicks on their referral link', () => {
    const InviteFriendComponent = require('js/components/Settings/Profile/InviteFriendComponent')
      .default
    const wrapper = shallow(<InviteFriendComponent {...mockProps} />).dive()
    const onClickCallback = wrapper
      .find(TextField)
      .first()
      .prop('onClick')
    onClickCallback()
    expect(LogReferralLinkClick).toHaveBeenCalledWith({
      userId: 'abc-123',
    })
  })

  it('logs an error if LogReferralLinkClick throws', async () => {
    expect.assertions(1)
    const mockErr = new Error('LogReferralLinkClick messed up.')
    LogReferralLinkClick.mockImplementationOnce(() => Promise.reject(mockErr))
    const InviteFriendComponent = require('js/components/Settings/Profile/InviteFriendComponent')
      .default
    const wrapper = shallow(<InviteFriendComponent {...mockProps} />).dive()
    const onClickCallback = wrapper
      .find(TextField)
      .first()
      .prop('onClick')
    await onClickCallback()
    expect(logger.error).toHaveBeenCalledWith(mockErr)
  })
})
