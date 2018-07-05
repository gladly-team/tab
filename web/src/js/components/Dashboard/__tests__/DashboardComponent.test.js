/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

jest.mock('analytics/logEvent')

const mockProps = {
  user: {
    id: 'abc-123'
  },
  app: {
    isGlobalCampaignLive: false
  }
}

describe('Dashboard component', () => {
  it('renders without error', () => {
    const DashboardComponent = require('../DashboardComponent').default
    shallow(
      <DashboardComponent {...mockProps} />
    )
  })
})
