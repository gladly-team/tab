/* eslint-env jest */

import React from 'react'
import {
  mount,
  shallow
} from 'enzyme'
import Typography from '@material-ui/core/Typography'
jest.mock('js/utils/client-location')

const getMockUserData = () => {
  return {
    id: 'user-abc-123',
    email: 'somebody@example.com',
    username: 'somebody123'
  }
}

describe('Account component', () => {
  it('renders without error', () => {
    const AccountComponent = require('js/components/Settings/Account/AccountComponent').default
    const userData = getMockUserData()
    shallow(
      <AccountComponent user={userData} />
    )
  })

  it('shows data privacy choices when the client is in the EU', async () => {
    // Mock that the client is in the EU
    const isInEuropeanUnion = require('js/utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)

    const AccountComponent = require('js/components/Settings/Account/AccountComponent').default
    const wrapper = shallow(
      <AccountComponent
        user={getMockUserData()}
      />
    )
    await wrapper.instance().componentDidMount()
    wrapper.update()

    // Find the data privacy choices setting
    const AccountItem = require('js/components/Settings/Account/AccountComponent').AccountItem
    const accountItems = wrapper.find(AccountItem)
    var containsDataPrivacyOption = false
    accountItems.forEach(item => {
      if (item.prop('name') === 'Data privacy choices') {
        containsDataPrivacyOption = true
      }
    })
    expect(containsDataPrivacyOption).toBe(true)
  })

  it('does not show data privacy choices when the client is not in the EU', async () => {
    // Mock that the client is not in the EU
    const isInEuropeanUnion = require('js/utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(false)

    const AccountComponent = require('js/components/Settings/Account/AccountComponent').default
    const wrapper = shallow(
      <AccountComponent
        user={getMockUserData()}
      />
    )
    await wrapper.instance().componentDidMount()
    wrapper.update()

    // Try to find the data privacy choices setting
    const AccountItem = require('js/components/Settings/Account/AccountComponent').AccountItem
    const accountItems = wrapper.find(AccountItem)
    var containsDataPrivacyOption = false
    accountItems.forEach(item => {
      if (item.prop('name') === 'Data privacy choices') {
        containsDataPrivacyOption = true
      }
    })
    expect(containsDataPrivacyOption).toBe(false)
  })

  it('contains the LogConsentData component when the client is in the EU', async () => {
    // Mock that the client is in the EU
    const isInEuropeanUnion = require('js/utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)

    const AccountComponent = require('js/components/Settings/Account/AccountComponent').default
    const wrapper = shallow(
      <AccountComponent
        user={getMockUserData()}
      />
    )
    await wrapper.instance().componentDidMount()
    wrapper.update()

    const LogConsentData = require('js/components/Dashboard/LogConsentDataContainer').default
    expect(wrapper.find(LogConsentData).length > 0).toBe(true)
  })

  it('does not contain the LogConsentData component when the client is not in the EU', async () => {
    const isInEuropeanUnion = require('js/utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(false)

    const AccountComponent = require('js/components/Settings/Account/AccountComponent').default
    const wrapper = shallow(
      <AccountComponent
        user={getMockUserData()}
      />
    )
    await wrapper.instance().componentDidMount()
    wrapper.update()

    const LogConsentData = require('js/components/Dashboard/LogConsentDataContainer').default
    expect(wrapper.find(LogConsentData).length > 0).toBe(false)
  })

  it('displays the username', () => {
    const AccountComponent = require('js/components/Settings/Account/AccountComponent').default
    const userData = getMockUserData()
    const wrapper = mount(
      <AccountComponent user={userData} />
    )
    const typographies = wrapper.find(Typography)
    expect(typographies.at(1).text()).toBe('Username')
    expect(typographies.at(2).text()).toBe('somebody123')
  })

  it('displays the email address', () => {
    const AccountComponent = require('js/components/Settings/Account/AccountComponent').default
    const userData = getMockUserData()
    const wrapper = mount(
      <AccountComponent user={userData} />
    )
    const typographies = wrapper.find(Typography)
    expect(typographies.at(3).text()).toBe('Email')
    expect(typographies.at(4).text()).toBe('somebody@example.com')
  })

  it('displays a placeholder when there is no username', () => {
    const AccountComponent = require('js/components/Settings/Account/AccountComponent').default
    const userData = getMockUserData()
    delete userData.username
    const wrapper = mount(
      <AccountComponent user={userData} />
    )
    const typographies = wrapper.find(Typography)
    expect(typographies.at(1).text()).toBe('Username')
    expect(typographies.at(2).text()).toBe('Not signed in')
  })

  it('displays a placeholder when there is no email address', () => {
    const AccountComponent = require('js/components/Settings/Account/AccountComponent').default
    const userData = getMockUserData()
    delete userData.email
    const wrapper = mount(
      <AccountComponent user={userData} />
    )
    const typographies = wrapper.find(Typography)
    expect(typographies.at(3).text()).toBe('Email')
    expect(typographies.at(4).text()).toBe('Not signed in')
  })
})
