/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import {
  shallow
} from 'enzyme'

const getMockProps = () => ({
  user: {
    vcCurrent: 12
  },
  campaignStartDatetime: moment(),
  campaignEndDatetime: moment()
})

describe('Heart donation campaign component', () => {
  it('renders without error', () => {
    const HeartDonationCampaign = require('js/components/Campaign/HeartDonationCampaignComponent').default
    const mockProps = getMockProps()
    shallow(
      <HeartDonationCampaign {...mockProps} />
    )
  })
})
