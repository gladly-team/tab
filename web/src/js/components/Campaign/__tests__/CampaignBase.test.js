/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

describe('Campaign base component', function () {
  it('shows the campaign component when a campaign is live', function () {
    const CampaignBase = require('../CampaignBase').default
    const wrapper = shallow(
      <CampaignBase
        isCampaignLive
        />
    )
    expect(wrapper.find('[data-test-id="campaign-root"]').length).toBe(1)
  })

  it('does not show the campaign component when a campaign is not live', function () {
    const CampaignBase = require('../CampaignBase').default
    const wrapper = shallow(
      <CampaignBase
        isCampaignLive={false}
        />
    )
    expect(wrapper.find('[data-test-id="campaign-root"]').length).toBe(0)
  })
})
