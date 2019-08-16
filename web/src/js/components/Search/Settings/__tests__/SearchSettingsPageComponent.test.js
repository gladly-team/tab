/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Redirect, Route, Switch } from 'react-router-dom'
import SearchSettingsPage from 'js/components/Search/Settings/SearchSettingsPageComponent'
import AccountView from 'js/components/Settings/Account/AccountView'
import ProfileDonateHearts from 'js/components/Settings/Profile/ProfileDonateHeartsView'
import ProfileInviteFriend from 'js/components/Settings/Profile/ProfileInviteFriendView'
import SettingsMenuItem from 'js/components/Settings/SettingsMenuItem'
import SettingsPage from 'js/components/Settings/SettingsPageComponent'
import { goTo, searchBaseURL } from 'js/navigation/navigation'

jest.mock('react-router-dom')
jest.mock('js/components/Settings/Account/AccountView')
jest.mock('js/components/Settings/Background/BackgroundSettingsView')
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

describe('withUser HOC in SearchSettingsPage', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('is called with the expected options', () => {
    const withUser = require('js/components/General/withUser').default

    /* eslint-disable-next-line no-unused-expressions */
    require('js/components/Search/Settings/SearchSettingsPageComponent').default
    expect(withUser).toHaveBeenCalledWith()
  })

  it('wraps the SearchSettingsPage component', () => {
    const {
      __mockWithUserWrappedFunction,
    } = require('js/components/General/withUser')

    /* eslint-disable-next-line no-unused-expressions */
    require('js/components/Search/Settings/SearchSettingsPageComponent').default
    const wrappedComponent = __mockWithUserWrappedFunction.mock.calls[0][0]
    expect(wrappedComponent.name).toEqual('SearchSettingsPage')
  })
})

describe('SearchSettingsPage', () => {
  it('renders without error', () => {
    const mockProps = getMockProps()
    shallow(<SearchSettingsPage {...mockProps} />)
      .dive()
      .dive()
  })

  it('goes to the main search results page when the SettingsPage "onClose" callback is called', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchSettingsPage {...mockProps} />)
      .dive()
      .dive()
    expect(goTo).not.toHaveBeenCalled()
    wrapper.find(SettingsPage).prop('onClose')()
    expect(goTo).toHaveBeenCalledWith(searchBaseURL)
  })
})

describe('SearchSettingsPage: sidebar content', () => {
  it('renders the expected side menu items', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchSettingsPage {...mockProps} />)
      .dive()
      .dive()
    const menuItems = wrapper.find(SettingsMenuItem)
    const expectedMenuItems = ['Donate Hearts', 'Invite Friends', 'Account']
    menuItems.forEach((menuItem, index) => {
      expect(menuItem.prop('children')).toEqual(expectedMenuItems[index])
    })
  })
})

describe('SearchSettingsPage: main content', () => {
  const getMainContentRenderPropArgs = () => ({
    showError: jest.fn(),
  })

  it('includes a ProfileDonateHearts route', () => {
    const mockProps = getMockProps()
    const mainContentRenderPropArgs = getMainContentRenderPropArgs()
    const wrapper = shallow(<SearchSettingsPage {...mockProps} />)
      .dive()
      .dive()
      .renderProp('mainContent')(mainContentRenderPropArgs)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/search/profile/donate/')
    expect(routeElem.exists()).toBe(true)
  })

  it('renders the expected ProfileDonateHearts component with the expected props', () => {
    const mockProps = getMockProps()
    const mainContentRenderPropArgs = getMainContentRenderPropArgs()
    const wrapper = shallow(<SearchSettingsPage {...mockProps} />)
      .dive()
      .dive()
      .renderProp('mainContent')(mainContentRenderPropArgs)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/search/profile/donate/')
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
      mainContentRenderPropArgs.showError
    )
  })

  it('includes a ProfileInviteFriend route', () => {
    const mockProps = getMockProps()
    const mainContentRenderPropArgs = getMainContentRenderPropArgs()
    const wrapper = shallow(<SearchSettingsPage {...mockProps} />)
      .dive()
      .dive()
      .renderProp('mainContent')(mainContentRenderPropArgs)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/search/profile/invite/')
    expect(routeElem.exists()).toBe(true)
  })

  it('renders the expected ProfileInviteFriend component with the expected props', () => {
    const mockProps = getMockProps()
    const mainContentRenderPropArgs = getMainContentRenderPropArgs()
    const wrapper = shallow(<SearchSettingsPage {...mockProps} />)
      .dive()
      .dive()
      .renderProp('mainContent')(mainContentRenderPropArgs)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/search/profile/invite/')
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
      mainContentRenderPropArgs.showError
    )
  })

  it('includes a AccountView route', () => {
    const mockProps = getMockProps()
    const mainContentRenderPropArgs = getMainContentRenderPropArgs()
    const wrapper = shallow(<SearchSettingsPage {...mockProps} />)
      .dive()
      .dive()
      .renderProp('mainContent')(mainContentRenderPropArgs)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/search/account/')
    expect(routeElem.exists()).toBe(true)
  })

  it('renders the expected AccountView component with the expected props', () => {
    const mockProps = getMockProps()
    const mainContentRenderPropArgs = getMainContentRenderPropArgs()
    const wrapper = shallow(<SearchSettingsPage {...mockProps} />)
      .dive()
      .dive()
      .renderProp('mainContent')(mainContentRenderPropArgs)
    const routeElem = wrapper
      .find(Switch)
      .find(Route)
      .filterWhere(elem => elem.prop('path') === '/search/account/')
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
      mainContentRenderPropArgs.showError
    )
  })

  it('redirects from any nonexistent profile page to the "donate Hearts" page', () => {
    const mockProps = getMockProps()
    const mainContentRenderPropArgs = getMainContentRenderPropArgs()
    const wrapper = shallow(<SearchSettingsPage {...mockProps} />)
      .dive()
      .dive()
      .renderProp('mainContent')(mainContentRenderPropArgs)
    const redirectElem = wrapper
      .find(Switch)
      .find(Redirect)
      .filterWhere(elem => elem.prop('from') === '/search/profile/*')
    expect(redirectElem.prop('to')).toEqual('/search/profile/donate/')
  })

  it('redirects from any nonexistent account page to the main account page', () => {
    const mockProps = getMockProps()
    const mainContentRenderPropArgs = getMainContentRenderPropArgs()
    const wrapper = shallow(<SearchSettingsPage {...mockProps} />)
      .dive()
      .dive()
      .renderProp('mainContent')(mainContentRenderPropArgs)
    const redirectElem = wrapper
      .find(Switch)
      .find(Redirect)
      .filterWhere(elem => elem.prop('from') === '/search/account/*')
    expect(redirectElem.prop('to')).toEqual('/search/account/')
  })
})
