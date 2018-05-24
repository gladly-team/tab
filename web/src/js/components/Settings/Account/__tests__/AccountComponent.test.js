/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import { getDefaultTabGlobal } from 'utils/test-utils'
jest.mock('utils/client-location')

const getMockUserData = () => {
  return {
    id: 'user-abc-123',
    email: 'somebody@example.com',
    username: 'somebody123'
  }
}

beforeEach(() => {
  window.tabforacause = getDefaultTabGlobal()
  // featureFlag-gdprConsent
  window.tabforacause.featureFlags.gdprConsent = true
})

afterAll(() => {
  delete window.tabforacause
})

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

  it('does not show the data privacy choices when the feature is not enabled (even in the EU)', async () => {
    // Mock that the client is in the EU
    const isInEuropeanUnion = require('utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)

    // Feature not enabled
    window.tabforacause.featureFlags.gdprConsent = false

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
    expect(containsDataPrivacyOption).toBe(false)
  })
})
