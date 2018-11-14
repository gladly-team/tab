/* eslint-env jest */

import React from 'react'
import { QueryRenderer } from 'react-relay'
import {
  shallow
} from 'enzyme'

const getMockProps = () => ({})

describe('Campaign base component', function () {
  it('renders a QueryRenderer', function () {
    const CampaignBase = require('js/components/Campaign/CampaignBase').default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <CampaignBase {...mockProps} />
    )
    expect(wrapper.find(QueryRenderer).length).toBe(1)
  })
})
