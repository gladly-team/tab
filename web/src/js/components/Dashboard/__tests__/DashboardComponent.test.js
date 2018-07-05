/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import MoneyRaised from '../../MoneyRaised/MoneyRaisedContainer'
import UserBackgroundImage from '../../User/UserBackgroundImageContainer'
import UserMenu from '../../User/UserMenuContainer'
import WidgetsContainer from '../../Widget/WidgetsContainer'
import CampaignBaseContainer from '../../Campaign/CampaignBaseContainer'
import Ad from '../../Ad/Ad'
import LogTab from '../LogTabContainer'
import LogRevenue from '../LogRevenueContainer'
import LogConsentData from '../LogConsentDataContainer'
import LogAccountCreation from '../LogAccountCreationContainer'
import ErrorMessage from 'general/ErrorMessage'

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

  it('renders MoneyRaised component', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(MoneyRaised).length).toBe(1)
  })

  it('renders UserBackgroundImage component', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(UserBackgroundImage).length).toBe(1)
  })

  it('renders UserMenu component', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(UserMenu).length).toBe(1)
  })

  it('renders WidgetsContainer component', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(WidgetsContainer).length).toBe(1)
  })

  it('renders CampaignBaseContainer component', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(CampaignBaseContainer).length).toBe(1)
  })

  it('renders Ad components', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(Ad).length).toBe(2)
  })

  it('renders LogTab component', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(LogTab).length).toBe(1)
  })

  it('renders LogRevenue component', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(LogRevenue).length).toBe(1)
  })

  it('renders LogConsentData component', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(LogConsentData).length).toBe(1)
  })

  it('renders LogAccountCreation component', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(LogAccountCreation).length).toBe(1)
  })

  it('does not render MoneyRaised component until the "user" prop exists', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutUser} />
    )
    expect(wrapper.find(MoneyRaised).length).toBe(0)
  })

  it('does not render UserMenu component until the "user" prop exists', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutUser} />
    )
    expect(wrapper.find(UserMenu).length).toBe(0)
  })

  it('does not render CampaignBaseContainer component until the "user" prop exists', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutUser} />
    )
    expect(wrapper.find(CampaignBaseContainer).length).toBe(0)
  })

  it('does not render LogTab component until the "user" prop exists', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutUser} />
    )
    expect(wrapper.find(LogTab).length).toBe(0)
  })

  it('does not render LogRevenue component until the "user" prop exists', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutUser} />
    )
    expect(wrapper.find(LogRevenue).length).toBe(0)
  })

  it('does not render LogConsentData component until the "user" prop exists', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutUser} />
    )
    expect(wrapper.find(LogConsentData).length).toBe(0)
  })

  it('does not render LogAccountCreation component until the "user" prop exists', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutUser} />
    )
    expect(wrapper.find(LogAccountCreation).length).toBe(0)
  })

  it('does not render the ErrorMessage component when no error message is set', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(ErrorMessage).length).toBe(0)
  })

  it('renders the ErrorMessage component when WidgetsContainer calls its "showError" prop', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    wrapper.find(WidgetsContainer).prop('showError')('Big widget problem!')
    wrapper.update()
    expect(wrapper.find(ErrorMessage).length).toBe(1)
    expect(wrapper.find(ErrorMessage).prop('message')).toBe('Big widget problem!')
  })

  it('passes false to childrens\' "isCampaignLive" props when the "isGlobalCampaignLive" prop is false', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(WidgetsContainer).prop('isCampaignLive')).toBe(false)
    expect(wrapper.find(CampaignBaseContainer).prop('isCampaignLive')).toBe(false)
  })

  it('passes true to childrens\' "isCampaignLive" props when the "isGlobalCampaignLive" prop is true', () => {
    const DashboardComponent = require('../DashboardComponent').default
    const mockPropsWithoutCampaignLive = Object.assign({}, mockProps, { app: { isGlobalCampaignLive: true } })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutCampaignLive} />
    )
    expect(wrapper.find(WidgetsContainer).prop('isCampaignLive')).toBe(true)
    expect(wrapper.find(CampaignBaseContainer).prop('isCampaignLive')).toBe(true)
  })
})
