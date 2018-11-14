/* eslint-env jest */

import React from 'react'
import { QueryRenderer } from 'react-relay'
import {
  shallow
} from 'enzyme'

jest.mock('js/components/General/withUserId')

const getMockProps = () => ({})

describe('Campaign base component', () => {
  it('renders a QueryRenderer', () => {
    const CampaignBase = require('js/components/Campaign/CampaignBase').default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <CampaignBase {...mockProps} />
    ).dive()
    expect(wrapper.find(QueryRenderer).length).toBe(1)
  })
})
