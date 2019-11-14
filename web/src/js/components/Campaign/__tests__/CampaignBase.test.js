/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import IconButton from '@material-ui/core/IconButton'
import { setCampaignDismissTime } from 'js/utils/local-user-data-mgr'

jest.mock('js/utils/local-user-data-mgr')

const getMockProps = () => ({
  app: {},
  user: {},
  showError: () => {},
  onDismiss: () => {},
  campaignStartTimeISO: '2019-01-18T12:00:00.000Z',
  campaignEndTimeISO: '2019-01-25T22:00:00.000Z',
})

describe('Campaign base component', () => {
  it('sets the dismiss time in local storage when clicking the "dismiss" button ', () => {
    const CampaignBase = require('js/components/Campaign/CampaignBase').default
    const mockProps = getMockProps()
    const wrapper = shallow(<CampaignBase {...mockProps} />)
      .dive()
      .dive()
      .dive()
    wrapper
      .find(IconButton)
      .first()
      .simulate('click')
    expect(setCampaignDismissTime).toHaveBeenCalled()
  })

  it('calls the onDismiss prop when clicking the "dismiss" button ', () => {
    const CampaignBase = require('js/components/Campaign/CampaignBase').default
    const mockProps = getMockProps()
    mockProps.onDismiss = jest.fn()
    const wrapper = shallow(<CampaignBase {...mockProps} />)
      .dive()
      .dive()
      .dive()
    wrapper
      .find(IconButton)
      .first()
      .simulate('click')
    expect(mockProps.onDismiss).toHaveBeenCalled()
  })
})
