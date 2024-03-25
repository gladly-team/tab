/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import Link from 'js/components/General/Link'
import { inviteFriendsURL, donateURL } from 'js/navigation/navigation'

jest.mock('@material-ui/icons/FavoriteBorder', () => () => '[heart icon]')
jest.mock('js/navigation/navigation')

const getMockProps = () => ({
  anchorElement: <div>hi</div>,
  app: {
    referralVcReward: 350,
  },
  user: {
    vcCurrent: 120,
    level: 11,
    heartsUntilNextLevel: 40,
    vcDonatedAllTime: 80,
    numUsersRecruited: 2,
    tabsToday: 9,
  },
  open: true,
  onClose: () => {},
})

describe('HeartsDropdownComponent', () => {
  it('renders without error', () => {
    const HeartsDropdownComponent = require('js/components/Dashboard/HeartsDropdownComponent')
      .default
    const mockProps = getMockProps()
    shallow(<HeartsDropdownComponent {...mockProps} />).dive()
  })

  it('has the expected width', () => {
    const HeartsDropdownComponent = require('js/components/Dashboard/HeartsDropdownComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<HeartsDropdownComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find(DashboardPopover)
        .children()
        .first()
        .prop('style').width
    ).toBe(210)
  })

  it('displays the expected "level" text', () => {
    const HeartsDropdownComponent = require('js/components/Dashboard/HeartsDropdownComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.level = 131
    const wrapper = shallow(<HeartsDropdownComponent {...mockProps} />).dive()
    const levelText = wrapper.find(Typography).filterWhere(n => {
      return (
        n
          .render()
          .text()
          .indexOf('Level') > -1
      )
    })
    expect(levelText.render().text()).toEqual('Level 131')
  })

  it('displays the expected "hearts until next level" text', () => {
    const HeartsDropdownComponent = require('js/components/Dashboard/HeartsDropdownComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.heartsUntilNextLevel = 23
    const wrapper = shallow(<HeartsDropdownComponent {...mockProps} />).dive()
    const elem = wrapper
      .find(Typography)
      .filterWhere(
        n =>
          n
            .render()
            .text()
            .indexOf('until next level') > -1
      )
      .parent()
    expect(elem.render().text()).toEqual('23[heart icon] until next level')
  })

  it('displays the expected "donate hearts" text', () => {
    const HeartsDropdownComponent = require('js/components/Dashboard/HeartsDropdownComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.vcDonatedAllTime = 3002
    const wrapper = shallow(<HeartsDropdownComponent {...mockProps} />).dive()
    const elem = wrapper
      .find(Typography)
      .filterWhere(
        n =>
          n
            .render()
            .text()
            .indexOf('donated') > -1
      )
      .parent()
    expect(elem.render().text()).toEqual('3,002[heart icon]donated')
  })

  it('displays the expected "friends recruited" text when there are multiple recruited', () => {
    const HeartsDropdownComponent = require('js/components/Dashboard/HeartsDropdownComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.numUsersRecruited = 4
    const wrapper = shallow(<HeartsDropdownComponent {...mockProps} />).dive()
    const elem = wrapper
      .find(Typography)
      .filterWhere(
        n =>
          n
            .render()
            .text()
            .indexOf('friends recruited') > -1
      )
      .parent()
    expect(elem.render().text()).toEqual('4friends recruited')
  })

  it('displays the expected "friends recruited" text when there is one recruited', () => {
    const HeartsDropdownComponent = require('js/components/Dashboard/HeartsDropdownComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.numUsersRecruited = 1
    const wrapper = shallow(<HeartsDropdownComponent {...mockProps} />).dive()
    const elem = wrapper
      .find(Typography)
      .filterWhere(
        n =>
          n
            .render()
            .text()
            .indexOf('friend recruited') > -1
      )
      .parent()
    expect(elem.render().text()).toEqual('1friend recruited')
  })

  it('displays the expected "open a tab" reward text', () => {
    const HeartsDropdownComponent = require('js/components/Dashboard/HeartsDropdownComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<HeartsDropdownComponent {...mockProps} />).dive()
    const elem = wrapper
      .find(Typography)
      .filterWhere(
        n =>
          n
            .render()
            .text()
            .indexOf('Open a tab') > -1
      )
      .parent()
    expect(elem.render().text()).toEqual('Open a tab1[heart icon]')
  })

  it('displays the expected "recruit a friend" reward text', () => {
    const HeartsDropdownComponent = require('js/components/Dashboard/HeartsDropdownComponent')
      .default
    const mockProps = getMockProps()
    mockProps.app.referralVcReward = 480
    const wrapper = shallow(<HeartsDropdownComponent {...mockProps} />).dive()
    const elem = wrapper
      .find(Typography)
      .filterWhere(
        n =>
          n
            .render()
            .text()
            .indexOf('Recruit a friend') > -1
      )
      .parent()
    expect(elem.render().text()).toEqual('Recruit a friend480[heart icon]')
  })

  it('passes the "style" prop to the DashboardPopover component', () => {
    const HeartsDropdownComponent = require('js/components/Dashboard/HeartsDropdownComponent')
      .default
    const mockProps = getMockProps()
    mockProps.style = {
      color: 'chartreuse',
    }
    const wrapper = shallow(<HeartsDropdownComponent {...mockProps} />).dive()
    expect(wrapper.find(DashboardPopover).prop('style')).toEqual(
      mockProps.style
    )
  })
})
