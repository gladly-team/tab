/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const mockUserData = {
  recruits: {
    edges: [
      {
        node: {
          recruitedAt: '2017-07-19T03:05:12Z',
          id: 'some-fake-id-1'
        }
      },
      {
        node: {
          recruitedAt: '2017-07-20T13:22:30Z',
          id: 'some-fake-id-2'
        }
      }
    ],
    totalRecruits: 2,
    recruitsActiveForAtLeastOneDay: 1
  }
}

describe('Sticker campaign component', function () {
  it('renders without error', function () {
    const StickerCampaignComponent = require('../StickerCampaignComponent').default
    shallow(
      <StickerCampaignComponent user={mockUserData} />
    )
  })
})
