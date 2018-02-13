/* eslint-env jest */

import React from 'react'
import PropTypes from 'prop-types'
import {
  shallow
} from 'enzyme'
import appTheme from 'theme/default'

const mockUserData = {
  username: 'jbond',
  recruits: {
    totalRecruits: 2,
    recruitsActiveForAtLeastOneDay: 1
  }
}

// For legacy Material-UI:
// https://github.com/mui-org/material-ui/issues/4664#issuecomment-322032865
const MuiShallowWithContext = node => shallow(node, {
  context: { appTheme },
  childContextTypes: { muiTheme: PropTypes.object }
}).dive() // shallow-render the actual component

describe('Sticker campaign component', function () {
  it('renders without error', function () {
    const StickerCampaignComponent = require('../StickerCampaignComponent').default
    shallow(
      <StickerCampaignComponent user={mockUserData} />
    )
  })

  it('does not show the success button when there are fewer than 2 active recruits', function () {
    const StickerCampaignComponent = require('../StickerCampaignComponent').default
    const userData = {
      username: 'jbond',
      recruits: {
        totalRecruits: 2,
        recruitsActiveForAtLeastOneDay: 1
      }
    }
    const wrapper = MuiShallowWithContext(
      <StickerCampaignComponent user={userData} />
    )
    expect(wrapper.find('[data-test-id="sticker-campaign-still-working"]').length).toBe(1)
    expect(wrapper.find('[data-test-id="sticker-campaign-success"]').length).toBe(0)
  })

  it('shows the success button when there are at least 2 active recruits', function () {
    const StickerCampaignComponent = require('../StickerCampaignComponent').default
    const userData = {
      username: 'jbond',
      recruits: {
        totalRecruits: 2,
        recruitsActiveForAtLeastOneDay: 2
      }
    }
    const wrapper = MuiShallowWithContext(
      <StickerCampaignComponent user={userData} />
    )
    expect(wrapper.find('[data-test-id="sticker-campaign-still-working"]').length).toBe(0)
    expect(wrapper.find('[data-test-id="sticker-campaign-success"]').length).toBe(1)
  })
})
