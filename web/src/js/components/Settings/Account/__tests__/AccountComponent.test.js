/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
jest.mock('utils/client-location')

const getMockUserData = () => {
  return {
    id: 'user-abc-123',
    email: 'somebody@example.com',
    username: 'somebody123'
  }
}

describe('Account component', () => {
  it('renders without error', () => {
    const AccountComponent = require('../AccountComponent').default
    const userData = getMockUserData()
    shallow(
      <AccountComponent user={userData} />
    )
  })

  it('shows data privacy choices when the client is in the EU', async () => {
    // Mock that the client is in the EU
    const isInEuropeanUnion = require('utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)

    const AccountComponent = require('../AccountComponent').default
    const wrapper = shallow(
      <AccountComponent
        user={getMockUserData()}
      />
    )
    await wrapper.instance().componentDidMount()
    wrapper.update()

    // Find the data privacy choices setting
    const AccountItem = require('../AccountComponent').AccountItem
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
    const isInEuropeanUnion = require('utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(false)

    const AccountComponent = require('../AccountComponent').default
    const wrapper = shallow(
      <AccountComponent
        user={getMockUserData()}
      />
    )
    await wrapper.instance().componentDidMount()
    wrapper.update()

    // Try to find the data privacy choices setting
    const AccountItem = require('../AccountComponent').AccountItem
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
    const isInEuropeanUnion = require('utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)

    const AccountComponent = require('../AccountComponent').default
    const wrapper = shallow(
      <AccountComponent
        user={getMockUserData()}
      />
    )
    await wrapper.instance().componentDidMount()
    wrapper.update()

    const LogConsentData = require('../../../Dashboard/LogConsentDataContainer').default
    expect(wrapper.find(LogConsentData).length > 0).toBe(true)
  })

  it('does not contain the LogConsentData component when the client is not in the EU', async () => {
    const isInEuropeanUnion = require('utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(false)

    const AccountComponent = require('../AccountComponent').default
    const wrapper = shallow(
      <AccountComponent
        user={getMockUserData()}
      />
    )
    await wrapper.instance().componentDidMount()
    wrapper.update()

    const LogConsentData = require('../../../Dashboard/LogConsentDataContainer').default
    expect(wrapper.find(LogConsentData).length > 0).toBe(false)
  })
})
