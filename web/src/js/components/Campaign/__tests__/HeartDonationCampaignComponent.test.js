/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import {
  shallow
} from 'enzyme'

const getMockProps = () => ({
  app: {
    charity: {
      vcReceived: 0
    }
  },
  user: {
    vcCurrent: 12
  },
  campaignTitle: 'Some title here!',
  campaignStartDatetime: moment(),
  campaignEndDatetime: moment(),
  showError: jest.fn()
})

describe('Heart donation campaign component', () => {
  it('renders without error', () => {
    const HeartDonationCampaign = require('js/components/Campaign/HeartDonationCampaignComponent').default
    const mockProps = getMockProps()
    shallow(
      <HeartDonationCampaign {...mockProps}>
        <span>Some content</span>
      </HeartDonationCampaign>
    )
  })
})
