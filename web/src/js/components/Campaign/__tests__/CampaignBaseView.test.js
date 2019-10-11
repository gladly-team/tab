/* eslint-env jest */

import React from 'react'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import { shallow } from 'enzyme'

jest.mock('js/components/General/QueryRendererWithUser')
jest.mock('js/components/General/withUser')
jest.mock('js/utils/local-user-data-mgr')

const getMockProps = () => ({
  showError: () => {},
  onDismiss: () => {},
})

describe('Campaign base view', () => {
  it('renders a QueryRenderer', () => {
    const CampaignBaseView = require('js/components/Campaign/CampaignBaseView')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<CampaignBaseView {...mockProps} />).dive()
    expect(wrapper.find(QueryRendererWithUser).length).toBe(1)
  })

  it("uses the authed user's user ID in the query", () => {
    const CampaignBaseView = require('js/components/Campaign/CampaignBaseView')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<CampaignBaseView {...mockProps} />).dive()
    const mockUserId = 'abc123xyz456' // from mocked `withUser` function
    expect(
      wrapper.find(QueryRendererWithUser).prop('variables')
    ).toHaveProperty('userId', mockUserId)
  })
})
