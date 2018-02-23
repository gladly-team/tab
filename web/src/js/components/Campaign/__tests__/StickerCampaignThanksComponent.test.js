/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

const mockUserData = {
  username: 'jbond',
  recruits: {
    totalRecruits: 2,
    recruitsActiveForAtLeastOneDay: 1
  }
}

describe('Sticker campaign component', function () {
  it('renders without error', function () {
    const StickerCampaignThanksComponent = require('../StickerCampaignThanksComponent').default
    shallow(
      <StickerCampaignThanksComponent user={mockUserData} />
    )
  })

  it('does not show the success button when there are fewer than 2 active recruits', function () {
    const StickerCampaignThanksComponent = require('../StickerCampaignThanksComponent').default
    const userData = {
      username: 'jbond',
      recruits: {
        totalRecruits: 2,
        recruitsActiveForAtLeastOneDay: 1
      }
    }
    const wrapper = shallow(
      <StickerCampaignThanksComponent user={userData} />
    )
    expect(wrapper.find('[data-test-id="sticker-campaign-thanks-success"]').length).toBe(0)
  })

  it('shows the success button when there are at least 2 active recruits', function () {
    const StickerCampaignThanksComponent = require('../StickerCampaignThanksComponent').default
    const userData = {
      username: 'jbond',
      recruits: {
        totalRecruits: 2,
        recruitsActiveForAtLeastOneDay: 2
      }
    }
    const wrapper = shallow(
      <StickerCampaignThanksComponent user={userData} />
    )
    expect(wrapper.find('[data-test-id="sticker-campaign-thanks-success"]').length).toBe(1)
  })
})
