/* eslint-env jest */

import React from 'react'
import TextField from '@material-ui/core/TextField'
import { cloneDeep } from 'lodash/lang'
import {
  mount,
  shallow
} from 'enzyme'

const mockProps = {
  user: {
    username: 'bob'
  },
  classes: {
    inputUnderline: 'something',
    formLabelRoot: 'something',
    formLabelFocused: 'something'
  }
}

describe('Invite friend component', () => {
  it('renders without error', () => {
    const InviteFriendComponent = require('js/components/Settings/Profile/InviteFriendComponent').default
    shallow(
      <InviteFriendComponent {...mockProps} />
    )
  })

  it('contains the correct referral URL', () => {
    const InviteFriendComponent = require('js/components/Settings/Profile/InviteFriendComponent').default
    const wrapper = mount(
      <InviteFriendComponent {...mockProps} />
    )
    const referralUrl = 'https://tab.gladly.io/?u=bob'
    expect(wrapper.find(TextField).first().prop('value')).toBe(referralUrl)
  })

  it('contains the correct description text', () => {
    const InviteFriendComponent = require('js/components/Settings/Profile/InviteFriendComponent').default
    const wrapper = mount(
      <InviteFriendComponent {...mockProps} />
    )
    expect(wrapper.find(TextField).first().prop('label')).toBe(`Share this link`)
    expect(wrapper.find(TextField).first().prop('helperText')).toBe(
      `and you'll get 350 Hearts for every person who joins!`)
  })

  it('contains the correct referral URL when there is no provided username', () => {
    const InviteFriendComponent = require('js/components/Settings/Profile/InviteFriendComponent').default
    const newMockProps = cloneDeep(mockProps)
    newMockProps.user.username = undefined
    const wrapper = mount(
      <InviteFriendComponent {...newMockProps} />
    )
    const referralUrl = 'https://tab.gladly.io'
    expect(wrapper.find(TextField).first().prop('value')).toBe(referralUrl)
  })

  it('contains the correct description text  when there is no provided username', () => {
    const InviteFriendComponent = require('js/components/Settings/Profile/InviteFriendComponent').default
    const newMockProps = cloneDeep(mockProps)
    newMockProps.user.username = undefined
    const wrapper = mount(
      <InviteFriendComponent {...newMockProps} />
    )
    expect(wrapper.find(TextField).first().prop('label')).toBe(`Share this link`)
    expect(wrapper.find(TextField).first().prop('helperText')).toBe(
      `and have a bigger positive impact!`)
  })
})
