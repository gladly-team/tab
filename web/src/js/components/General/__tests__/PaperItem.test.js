/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const buttonHandler = jest.fn()
const secondaryButtonHandler = jest.fn()

const mockProps = {
  title: 'test-title',
  text: 'test-text',
  buttonText: 'button-text',
  buttonHandler,
  secondaryButtonText: 'secondary-button-text',
  secondaryButtonHandler,
}

describe('PaperItem tests', function() {
  it('renders without error', function() {
    const PaperItem = require('js/components/General/PaperItem').default
    shallow(<PaperItem {...mockProps} />)
  })

  it('displays all the attributes', function() {
    const PaperItem = require('js/components/General/PaperItem').default
    var wrapper = mount(<PaperItem {...mockProps} />)

    expect(
      wrapper
        .find('span')
        .first()
        .text()
    ).toEqual(mockProps.title)
    expect(
      wrapper
        .find(Typography)
        .first()
        .text()
    ).toEqual(mockProps.text)
    var firstButton = wrapper.find(Button).first()
    expect(firstButton.text()).toEqual(mockProps.buttonText)
    var secondButton = wrapper.find(Button).last()
    expect(secondButton.text()).toEqual(mockProps.secondaryButtonText)

    firstButton.simulate('click')
    expect(buttonHandler).toHaveBeenCalled()
    secondButton.simulate('click')
    expect(secondaryButtonHandler).toHaveBeenCalled()
  })
})
