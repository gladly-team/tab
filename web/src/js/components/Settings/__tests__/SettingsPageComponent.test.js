/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import SettingsPage from 'js/components/Settings/SettingsPageComponent'
// import AccountView from 'js/components/Settings/Account/AccountView'
// import BackgroundSettingsView from 'js/components/Settings/Background/BackgroundSettingsView'
// import ErrorMessage from 'js/components/General/ErrorMessage'
// import Logo from 'js/components/Logo/Logo'
// import ProfileStatsView from 'js/components/Settings/Profile/ProfileStatsView'
// import ProfileDonateHearts from 'js/components/Settings/Profile/ProfileDonateHeartsView'
// import ProfileInviteFriend from 'js/components/Settings/Profile/ProfileInviteFriendView'
// import SettingsMenuItem from 'js/components/Settings/SettingsMenuItem'
// import WidgetsSettingsView from 'js/components/Settings/Widgets/WidgetsSettingsView'

jest.mock('js/components/Settings/Account/AccountView')
jest.mock('js/components/Settings/Background/BackgroundSettingsView')
jest.mock('js/components/General/ErrorMessage')
jest.mock('js/components/Logo/Logo')
jest.mock('js/components/Settings/Profile/ProfileStatsView')
jest.mock('js/components/Settings/Profile/ProfileDonateHeartsView')
jest.mock('js/components/Settings/Profile/ProfileInviteFriendView')
jest.mock('js/components/Settings/SettingsMenuItem')
jest.mock('js/components/Settings/Widgets/WidgetsSettingsView')
jest.mock('js/components/General/withUser')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({})

describe('withUser HOC in SettingsPage', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('is called with the expected options', () => {
    const withUser = require('js/components/General/withUser').default

    /* eslint-disable-next-line no-unused-expressions */
    require('js/components/Settings/SettingsPageComponent').default
    expect(withUser).toHaveBeenCalledWith()
  })

  it('wraps the SettingsPage component', () => {
    const {
      __mockWithUserWrappedFunction,
    } = require('js/components/General/withUser')

    /* eslint-disable-next-line no-unused-expressions */
    require('js/components/Settings/SettingsPageComponent').default
    const wrappedComponent = __mockWithUserWrappedFunction.mock.calls[0][0]
    expect(wrappedComponent.name).toEqual('SettingsPage')
  })
})

describe('SettingsPage', () => {
  it('renders without error', () => {
    const mockProps = getMockProps()
    shallow(<SettingsPage {...mockProps} />).dive()
  })
})
