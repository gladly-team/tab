/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Redirect, Route, Switch } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import TabSettingsPage from 'js/components/Settings/TabSettingsPageComponent'
import AccountView from 'js/components/Settings/Account/AccountView'
import BackgroundSettingsView from 'js/components/Settings/Background/BackgroundSettingsView'
import ErrorMessage from 'js/components/General/ErrorMessage'
// import Logo from 'js/components/Logo/Logo'
import ProfileStatsView from 'js/components/Settings/Profile/ProfileStatsView'
import ProfileDonateHearts from 'js/components/Settings/Profile/ProfileDonateHeartsView'
import ProfileInviteFriend from 'js/components/Settings/Profile/ProfileInviteFriendView'
import SettingsMenuItem from 'js/components/Settings/SettingsMenuItem'
import WidgetsSettingsView from 'js/components/Settings/Widgets/WidgetsSettingsView'
import { goToDashboard } from 'js/navigation/navigation'

jest.mock('react-router-dom')
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
jest.mock('js/navigation/navigation')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({})

describe('withUser HOC in TabSettingsPage', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('is called with the expected options', () => {
    const withUser = require('js/components/General/withUser').default

    /* eslint-disable-next-line no-unused-expressions */
    require('js/components/Settings/TabSettingsPageComponent').default
    expect(withUser).toHaveBeenCalledWith()
  })

  it('wraps the TabSettingsPage component', () => {
    const {
      __mockWithUserWrappedFunction,
    } = require('js/components/General/withUser')

    /* eslint-disable-next-line no-unused-expressions */
    require('js/components/Settings/TabSettingsPageComponent').default
    const wrappedComponent = __mockWithUserWrappedFunction.mock.calls[0][0]
    expect(wrappedComponent.name).toEqual('TabSettingsPage')
  })
})

describe('TabSettingsPage', () => {
  it('renders without error', () => {
    const mockProps = getMockProps()
    shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
  })

  it('renders the expected side menu items', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const menuItems = wrapper.find(SettingsMenuItem)
    const expectedMenuItems = [
      'Widgets',
      'Background',
      'Your Stats',
      'Donate Hearts',
      'Invite Friends',
      'Account',
    ]
    menuItems.forEach((menuItem, index) => {
      expect(menuItem.prop('children')).toEqual(expectedMenuItems[index])
    })
  })

  it('includes a WidgetsSettingsView route', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/settings/widgets/')
    expect(routeElem.exists()).toBe(true)
  })

  it('renders the expected WidgetsSettingsView component with the expected props', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/settings/widgets/')
    const ThisRouteComponent = routeElem.prop('render')
    const ThisRouteComponentElem = shallow(
      <ThisRouteComponent fakeProp={'abc'} />
    )
    expect(ThisRouteComponentElem.type()).toEqual(WidgetsSettingsView)
    expect(ThisRouteComponentElem.prop('fakeProp')).toEqual('abc')
    expect(ThisRouteComponentElem.prop('authUser')).toEqual({
      // From the default withUser mock
      id: 'abc123xyz456',
      email: 'foo@example.com',
      username: 'example',
      isAnonymous: false,
      emailVerified: true,
    })
    expect(ThisRouteComponentElem.prop('showError')).toEqual(
      expect.any(Function)
    )
  })

  it('includes a BackgroundSettingsView route', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/settings/background/')
    expect(routeElem.exists()).toBe(true)
  })

  it('renders the expected BackgroundSettingsView component with the expected props', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/settings/background/')
    const ThisRouteComponent = routeElem.prop('render')
    const ThisRouteComponentElem = shallow(
      <ThisRouteComponent fakeProp={'abc'} />
    )
    expect(ThisRouteComponentElem.type()).toEqual(BackgroundSettingsView)
    expect(ThisRouteComponentElem.prop('fakeProp')).toEqual('abc')
    expect(ThisRouteComponentElem.prop('authUser')).toEqual({
      // From the default withUser mock
      id: 'abc123xyz456',
      email: 'foo@example.com',
      username: 'example',
      isAnonymous: false,
      emailVerified: true,
    })
    expect(ThisRouteComponentElem.prop('showError')).toEqual(
      expect.any(Function)
    )
  })

  it('includes a ProfileStatsView route', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/profile/stats/')
    expect(routeElem.exists()).toBe(true)
  })

  it('renders the expected ProfileStatsView component with the expected props', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/profile/stats/')
    const ThisRouteComponent = routeElem.prop('render')
    const ThisRouteComponentElem = shallow(
      <ThisRouteComponent fakeProp={'abc'} />
    )
    expect(ThisRouteComponentElem.type()).toEqual(ProfileStatsView)
    expect(ThisRouteComponentElem.prop('fakeProp')).toEqual('abc')
    expect(ThisRouteComponentElem.prop('authUser')).toEqual({
      // From the default withUser mock
      id: 'abc123xyz456',
      email: 'foo@example.com',
      username: 'example',
      isAnonymous: false,
      emailVerified: true,
    })
    expect(ThisRouteComponentElem.prop('showError')).toEqual(
      expect.any(Function)
    )
  })

  it('includes a ProfileDonateHearts route', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/profile/donate/')
    expect(routeElem.exists()).toBe(true)
  })

  it('renders the expected ProfileDonateHearts component with the expected props', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/profile/donate/')
    const ThisRouteComponent = routeElem.prop('render')
    const ThisRouteComponentElem = shallow(
      <ThisRouteComponent fakeProp={'abc'} />
    )
    expect(ThisRouteComponentElem.type()).toEqual(ProfileDonateHearts)
    expect(ThisRouteComponentElem.prop('fakeProp')).toEqual('abc')
    expect(ThisRouteComponentElem.prop('authUser')).toEqual({
      // From the default withUser mock
      id: 'abc123xyz456',
      email: 'foo@example.com',
      username: 'example',
      isAnonymous: false,
      emailVerified: true,
    })
    expect(ThisRouteComponentElem.prop('showError')).toEqual(
      expect.any(Function)
    )
  })

  it('includes a ProfileInviteFriend route', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/profile/invite/')
    expect(routeElem.exists()).toBe(true)
  })

  it('renders the expected ProfileInviteFriend component with the expected props', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/profile/invite/')
    const ThisRouteComponent = routeElem.prop('render')
    const ThisRouteComponentElem = shallow(
      <ThisRouteComponent fakeProp={'abc'} />
    )
    expect(ThisRouteComponentElem.type()).toEqual(ProfileInviteFriend)
    expect(ThisRouteComponentElem.prop('fakeProp')).toEqual('abc')
    expect(ThisRouteComponentElem.prop('authUser')).toEqual({
      // From the default withUser mock
      id: 'abc123xyz456',
      email: 'foo@example.com',
      username: 'example',
      isAnonymous: false,
      emailVerified: true,
    })
    expect(ThisRouteComponentElem.prop('showError')).toEqual(
      expect.any(Function)
    )
  })

  it('includes a AccountView route', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/account/')
    expect(routeElem.exists()).toBe(true)
  })

  it('renders the expected AccountView component with the expected props', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/account/')
    const ThisRouteComponent = routeElem.prop('render')
    const ThisRouteComponentElem = shallow(
      <ThisRouteComponent fakeProp={'abc'} />
    )
    expect(ThisRouteComponentElem.type()).toEqual(AccountView)
    expect(ThisRouteComponentElem.prop('fakeProp')).toEqual('abc')
    expect(ThisRouteComponentElem.prop('authUser')).toEqual({
      // From the default withUser mock
      id: 'abc123xyz456',
      email: 'foo@example.com',
      username: 'example',
      isAnonymous: false,
      emailVerified: true,
    })
    expect(ThisRouteComponentElem.prop('showError')).toEqual(
      expect.any(Function)
    )
  })

  it('redirects from any nonexistent settings page to the widgets settings page', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const redirectElem = wrapper
      .find(Switch)
      .find(Redirect)
      .filterWhere(elem => elem.prop('from') === '/newtab/settings/*')
    expect(redirectElem.prop('to')).toEqual('/newtab/settings/widgets/')
  })

  it('redirects from any nonexistent settings page to the widgets settings page', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const redirectElem = wrapper
      .find(Switch)
      .find(Redirect)
      .filterWhere(elem => elem.prop('from') === '/newtab/settings/*')
    expect(redirectElem.prop('to')).toEqual('/newtab/settings/widgets/')
  })

  it('redirects from any nonexistent profile page to the profile stats page', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const redirectElem = wrapper
      .find(Switch)
      .find(Redirect)
      .filterWhere(elem => elem.prop('from') === '/newtab/profile/*')
    expect(redirectElem.prop('to')).toEqual('/newtab/profile/stats/')
  })

  it('redirects from any nonexistent account page to the main account page', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const redirectElem = wrapper
      .find(Switch)
      .find(Redirect)
      .filterWhere(elem => elem.prop('from') === '/newtab/account/*')
    expect(redirectElem.prop('to')).toEqual('/newtab/account/')
  })

  it('displays an error message when a child route calls the showError prop', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()

    // We should not show an error message yet.
    expect(wrapper.find(ErrorMessage).prop('open')).toBe(false)

    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/newtab/settings/widgets/')
    const ThisRouteComponent = routeElem.prop('render')
    const ThisRouteComponentElem = shallow(
      <ThisRouteComponent fakeProp={'abc'} />
    )
    const showErrorFunc = ThisRouteComponentElem.prop('showError')
    showErrorFunc('We made a mistake :(')
    expect(wrapper.find(ErrorMessage).prop('open')).toBe(true)
    expect(wrapper.find(ErrorMessage).prop('message')).toEqual(
      'We made a mistake :('
    )
  })

  it('goes to the Tab dashboard when clicking the close IconButton', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<TabSettingsPage {...mockProps} />)
      .dive()
      .dive()
    expect(goToDashboard).not.toHaveBeenCalled()
    wrapper.find(IconButton).simulate('click')
    expect(goToDashboard).toHaveBeenCalled()
  })
})
