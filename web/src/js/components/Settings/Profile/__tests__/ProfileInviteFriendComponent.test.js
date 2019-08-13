/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

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
    shallow(<ProfileInviteFriend {...mockProps} />)
  })
})
