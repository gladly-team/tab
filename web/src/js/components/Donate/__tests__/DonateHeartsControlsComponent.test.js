/* eslint-env jest */

import React from 'react'
import {
  mount,
  shallow
} from 'enzyme'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DonateVcMutation from 'js/mutations/DonateVcMutation'

jest.mock('js/mutations/DonateVcMutation')

const mockShowError = jest.fn()

const getMockProps = () => ({
  charity: {
    id: 'some-charity-id',
    image: 'http://static.example.com/img/charities/charity-post-donation-images/acfusa.jpg',
    impact: 'Your donation helps move us one step closer to ending world hunger.',
    name: 'Action Against Hunger',
    website: 'http://www.actionagainsthunger.org/'
  },
  user: {
    id: 'abc123',
    vcCurrent: 23
  },
  showError: mockShowError
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('DonateHeartsControls component', () => {
  it('renders without error', () => {
    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()
  })

  it('shows a button with the number of Hearts to donate', () => {
    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()
    expect(wrapper.find(Button).first().render().text())
      .toBe('Donate 23 Hearts')
  })

  it('shows a singular "Heart" when the user only has 1 Heart', () => {
    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    mockProps.user.vcCurrent = 1
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()
    expect(wrapper.find(Button).first().render().text())
      .toBe('Donate 1 Heart')
  })

  it('shows an option to donate a specific number of Hearts if the user has more than 2 Hearts', () => {
    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    mockProps.user.vcCurrent = 3
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()
    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => {
          return n.render().text() === 'Or, donate a specific amount'
        })
        .length
    ).toBe(1)
  })

  it('shows an option to donate a specific number of Hearts if the user has 2 or fewer Hearts', () => {
    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    mockProps.user.vcCurrent = 2
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()
    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => {
          return n.render().text() === 'Or, donate a specific amount'
        })
        .length
    ).toBe(0)
  })

  it('calls to donate VC when the user clicks the button', async () => {
    expect.assertions(1)

    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <DonateHeartsControlsComponent {...mockProps} />
    )
    wrapper.find(Button).simulate('click')
    expect(DonateVcMutation).toHaveBeenCalledWith({
      userId: 'abc123',
      charityId: 'some-charity-id',
      vc: 23
    })
  })

  it('opens the post-donation dialog if VC donation succeeds', async () => {
    expect.assertions(2)

    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()

    // First, make sure the dialog is not shown.
    expect(wrapper.find(Dialog).first().prop('open'))
      .toBe(false)

    // Call the method directly so we can wait for the async.
    await wrapper.instance().donateHearts()

    expect(wrapper.find(Dialog).first().prop('open'))
      .toBe(true)
  })

  it('shows an error if VC donation fails', async () => {
    expect.assertions(1)

    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    DonateVcMutation.mockRejectedValueOnce(() => new Error('Yikes.'))
    const mockProps = getMockProps()
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()

    await wrapper.instance().donateHearts()
    expect(mockShowError).toHaveBeenCalledWith('Oops, we could not donate your Hearts just now :(')
  })
})
