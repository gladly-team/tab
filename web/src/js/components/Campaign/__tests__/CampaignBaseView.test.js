/* eslint-env jest */

import React from 'react'
import { QueryRenderer } from 'react-relay'
import { shallow } from 'enzyme'

jest.mock('react-relay')
jest.mock('js/components/General/withUserId')
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
    expect(wrapper.find(QueryRenderer).length).toBe(1)
  })
})
