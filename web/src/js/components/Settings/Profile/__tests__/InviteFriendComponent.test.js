/* eslint-env jest */

import React from 'react'
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
    const InviteFriendComponent = require('../InviteFriendComponent').default
    shallow(
      <InviteFriendComponent {...mockProps} />
    )
  })

  it('contains the correct referral URL', () => {
    const InviteFriendComponent = require('../InviteFriendComponent').default
    const wrapper = mount(
      <InviteFriendComponent {...mockProps} />
    )
    const referralUrl = 'https://tab.gladly.io/?u=bob'
    expect(wrapper.find('input').first().prop('value')).toBe(referralUrl)
  })
})
