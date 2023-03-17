/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import SetV4BetaMutation from 'js/mutations/SetV4BetaMutation'
import optIntoV4Beta from 'js/utils/v4-beta-opt-in'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { flushAllPromises } from 'js/utils/test-utils'
import { reloadDashboard } from 'js/navigation/navigation'
import SetBackgroundDailyImageMutation from 'js/mutations/SetBackgroundDailyImageMutation'
import SetUserCauseMutation from 'js/mutations/SetUserCauseMutation'
import switchToV4 from 'js/utils/switchToV4'

jest.mock('js/utils/v4-beta-opt-in')
jest.mock('js/mutations/SetV4BetaMutation')
jest.mock('js/navigation/navigation', () => ({ reloadDashboard: jest.fn() }))
jest.mock('js/mutations/SetBackgroundDailyImageMutation')
jest.mock('js/mutations/SetUserCauseMutation')
jest.mock('js/utils/switchToV4')

const getMockProps = () => ({
  user: {
    id: 'abc123',
  },
  title: 'Help Orcas and Others (Beta)',
  causeId: 'fake-cause-id-1',
  causeName: 'Tab for Whales',
  causeShortDesc: 'Turn your tabs into saving the whales!',
  imgSrc: '/static/example.png',
  relay: { environment: {} },
})

describe('Switch to V4 component', () => {
  it('renders without error', () => {
    const Comp = require('js/components/Donate/SwitchToV4Component').default
    const mockProps = getMockProps()
    shallow(<Comp {...mockProps} />)
  })

  it('contains the expected image', () => {
    const Comp = require('js/components/Donate/SwitchToV4Component').default
    const mockProps = getMockProps()
    const wrapper = shallow(<Comp {...mockProps} />)
    expect(
      wrapper
        .find('img')
        .first()
        .prop('src')
    ).toBe('/static/example.png')
  })

  it('contains the expected title', () => {
    const Comp = require('js/components/Donate/SwitchToV4Component').default
    const mockProps = getMockProps()
    const wrapper = shallow(<Comp {...mockProps} />)
    expect(
      wrapper
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('Help Orcas and Others (Beta)')
  })

  it('contains the expected button text', () => {
    const Comp = require('js/components/Donate/SwitchToV4Component').default
    const mockProps = getMockProps()
    const wrapper = shallow(<Comp {...mockProps} />)
    expect(
      wrapper
        .find(Button)
        .first()
        .render()
        .text()
    ).toEqual('Try Tab for Whales')
  })

  it('contains the expected button text with prefix', () => {
    const Comp = require('js/components/Donate/SwitchToV4Component').default
    const mockProps = getMockProps()
    mockProps.prefix = 'Shop for'
    mockProps.causeName = 'Whales'
    const wrapper = shallow(<Comp {...mockProps} />)
    expect(
      wrapper
        .find(Button)
        .first()
        .render()
        .text()
    ).toEqual('Shop for Whales')
  })

  it('opts user into v4 and sets the new cause on click', async () => {
    expect.assertions(1)
    const Comp = require('js/components/Donate/SwitchToV4Component').default
    const mockProps = getMockProps()
    const wrapper = shallow(<Comp {...mockProps} />)
    const switchButton = wrapper.find(Button).first()
    switchButton.simulate('click')
    await flushAllPromises()
    expect(switchToV4).toHaveBeenCalledWith({
      relayEnvironment: expect.any(Object),
      userId: 'abc123',
      causeId: 'fake-cause-id-1',
      redirect: '',
    })
  })
})
