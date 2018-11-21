/* eslint-env jest */

import React from 'react'
import {
  mount,
  shallow
} from 'enzyme'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Popover from '@material-ui/core/Popover'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DonateVcMutation from 'js/mutations/DonateVcMutation'
import Slider from '@material-ui/lab/Slider'

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

  it('does not show an option to donate a specific number of Hearts if the user has 2 or fewer Hearts', () => {
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

  it('shows the "custom number of Hearts" popover if the user clicks to donate a specific number', () => {
    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    mockProps.user.vcCurrent = 3
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()

    // First, make sure the popover is not shown.
    expect(wrapper.find(Popover).first().prop('open'))
      .toBe(false)

    const customHeartOption = wrapper
      .find(Typography)
      .filterWhere(n => {
        return n.render().text() === 'Or, donate a specific amount'
      })
      .parent()
    customHeartOption.simulate('click', { currentTarget: null })
    expect(wrapper.find(Popover).first().prop('open'))
      .toBe(true)
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

  it('changes the displayed VC to donate when moving the custom slider', () => {
    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()

    expect(wrapper.find(Button).first().render().text())
      .toBe('Donate 23 Hearts')

    // Mock moving the slider.
    wrapper.find(Slider).prop('onChange')({}, 8)
    expect(wrapper.find(Button).first().render().text())
      .toBe('Donate 8 Hearts')
  })

  it('donates the custom amount of VC when the amount is set with the slider', async () => {
    expect.assertions(1)

    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()

    // Mock moving the slider.
    wrapper.find(Slider).prop('onChange')({}, 14)

    // Click to donate Hearts.
    wrapper.find(Button).first().simulate('click')
    expect(DonateVcMutation).toHaveBeenCalledWith({
      userId: 'abc123',
      charityId: 'some-charity-id',
      vc: 14
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

  it('shows the correct title in the post-donation message', () => {
    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    mockProps.charity.name = 'A Great Nonprofit'
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()
    expect(wrapper.find(DialogTitle).find(Typography).render().text())
      .toBe('Thanks for supporting A Great Nonprofit!')
  })

  it('links to the nonprofit\'s website in the post-donation message title', () => {
    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    mockProps.charity.website = 'http://example.com'
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()
    const anchor = wrapper.find(DialogTitle).find('a').first()
    expect(anchor.prop('href')).toBe('http://example.com')
    expect(anchor.prop('target')).toBe('_blank')
    expect(anchor.prop('rel')).toBe('noopener noreferrer')
  })

  it('does not render the image caption in the post-donation message if none is provided', () => {
    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    mockProps.charity.imageCaption = null
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()
    expect(
      wrapper.find(DialogContent)
        .find(Typography)
        .filterWhere(n => {
          return n.prop('variant') === 'caption'
        })
        .length
    )
      .toBe(0)
  })

  it('renders the image caption in the post-donation message if one is provided', () => {
    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    mockProps.charity.imageCaption = 'There is a nice photo above this text.'
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()
    expect(
      wrapper.find(DialogContent)
        .find(Typography)
        .filterWhere(n => {
          return n.prop('variant') === 'caption' &&
          n.render().text() === 'There is a nice photo above this text.'
        })
        .length
    )
      .toBe(1)
  })

  it('shows the image in the post-donation message', () => {
    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    mockProps.charity.image = 'http://example.com/foo.png'
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()
    expect(wrapper.find(DialogContent).find('img').first().prop('src'))
      .toBe('http://example.com/foo.png')
  })

  it('shows the correct (non-HTML) content in the post-donation message', () => {
    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    mockProps.charity.impact = 'Your support is going to some good stuff.'
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()
    expect(wrapper.find(DialogContent).render().text())
      .toBe('Your support is going to some good stuff.')
  })

  it('shows the correct sanitized HTML content in the post-donation message', () => {
    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    mockProps.charity.impact = '<p>Your support is going to some <a data-thing="this attribute is not allowed" href="http://example.com" target="_blank" rel="noopener noreferrer">good stuff</a>.</p><script>var foo = "script tags are not allowed!"</script>'
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()
    expect(wrapper.find(DialogContent).find('span').last().render().html())
      .toBe('<p>Your support is going to some <a href="http://example.com" target="_blank" rel="noopener noreferrer">good stuff</a>.</p>')
  })

  it('closes the post-donation message when clicking the "done" button', async () => {
    expect.assertions(3)

    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    ).dive()

    // First, open the post-donation message.
    await wrapper.instance().donateHearts()
    expect(wrapper.find(Dialog).first().prop('open'))
      .toBe(true)

    const doneButton = wrapper.find(DialogActions).find(Button).first()
    expect(doneButton.render().text()).toBe('Done')

    // Mock a button click.
    doneButton.prop('onClick')()
    expect(wrapper.find(Dialog).first().prop('open'))
      .toBe(false)
  })
})
