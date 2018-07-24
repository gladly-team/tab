/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import { cloneDeep } from 'lodash/lang'
import { RadioButtonGroup, RadioButton } from 'material-ui/RadioButton'
import BackgroundImagePicker from '../../../Background/BackgroundImagePickerContainer'
import BackgroundColorPicker from '../../../Background/BackgroundColorPickerContainer'
import BackgroundCustomImagePicker from '../../../Background/BackgroundCustomImagePickerContainer'
import {
  USER_BACKGROUND_OPTION_CUSTOM,
  USER_BACKGROUND_OPTION_COLOR,
  USER_BACKGROUND_OPTION_PHOTO,
  USER_BACKGROUND_OPTION_DAILY
} from '../../../../constants'

jest.mock('material-ui/RadioButton')
jest.mock('../../../Background/BackgroundImagePickerContainer')
jest.mock('../../../Background/BackgroundColorPickerContainer')
jest.mock('../../../Background/BackgroundCustomImagePickerContainer')

const mockShowError = jest.fn()
const mockProps = {
  app: {},
  user: {
    id: 'abc-123',
    backgroundOption: 'photo',
    customImage: 'https://example.com/here/is/some-img.png',
    backgroundColor: '#FF0000',
    backgroundImage: {
      imageURL: 'https://example.com/here/is/some-img.png'
    }
  },
  showError: mockShowError,
  relay: {
    environment: {}
  }
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('Background settings component', () => {
  it('renders without error', () => {
    const BackgroundSettings = require('../BackgroundSettingsComponent').default
    shallow(
      <BackgroundSettings {...mockProps} />
    )
  })

  it('renders all of the expected background option radio buttons', () => {
    const BackgroundSettings = require('../BackgroundSettingsComponent').default
    const wrapper = shallow(
      <BackgroundSettings {...mockProps} />
    )

    const backgroundOptions = [
      USER_BACKGROUND_OPTION_CUSTOM,
      USER_BACKGROUND_OPTION_COLOR,
      USER_BACKGROUND_OPTION_PHOTO,
      USER_BACKGROUND_OPTION_DAILY
    ]
    backgroundOptions.forEach(backgroundOption => {
      expect(wrapper.find(RadioButton)
        .filterWhere(node => node.prop('value') === backgroundOption)
        .length
      ).toBe(1)
    })

    expect(wrapper.find(RadioButton).length).toBe(backgroundOptions.length)
  })

  it('selects the correct background option depending on initial background settings option prop', () => {
    const BackgroundSettings = require('../BackgroundSettingsComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundOption = 'color'
    const wrapper = shallow(
      <BackgroundSettings {...customMockProps} />
    )

    // Make sure the color option is selected.
    expect(wrapper.find(RadioButtonGroup).prop('valueSelected') === USER_BACKGROUND_OPTION_COLOR)

    // Make sure the color selection component is displayed.
    expect(wrapper.find(BackgroundColorPicker).length).toBe(1)
  })

  it('selects the photo option if the background option is null', () => {
    const BackgroundSettings = require('../BackgroundSettingsComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundOption = null
    const wrapper = shallow(
      <BackgroundSettings {...customMockProps} />
    )

    // Make sure the color option is selected.
    expect(wrapper.find(RadioButtonGroup).prop('valueSelected') === USER_BACKGROUND_OPTION_PHOTO)

    // Make sure the photo selection component is displayed.
    expect(wrapper.find(BackgroundImagePicker).length).toBe(1)
  })

  it('selects the photo option if the background option is some unexpected value', () => {
    const BackgroundSettings = require('../BackgroundSettingsComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundOption = 'BAD-VALUE!'
    const wrapper = shallow(
      <BackgroundSettings {...customMockProps} />
    )

    // Make sure the color option is selected.
    expect(wrapper.find(RadioButtonGroup).prop('valueSelected') === USER_BACKGROUND_OPTION_PHOTO)

    // Make sure the photo selection component is displayed.
    expect(wrapper.find(BackgroundImagePicker).length).toBe(1)
  })

  it('renders new selection components depending on which background option is selected', () => {
    const BackgroundSettings = require('../BackgroundSettingsComponent').default
    const wrapper = shallow(
      <BackgroundSettings {...mockProps} />
    )
    expect(wrapper.find(BackgroundImagePicker).length).toBe(1)
    expect(wrapper.find(BackgroundColorPicker).length).toBe(0)
    expect(wrapper.find(BackgroundCustomImagePicker).length).toBe(0)

    // Simulate clicking the color background option.
    wrapper.find(RadioButtonGroup).prop('onChange')({}, USER_BACKGROUND_OPTION_COLOR)
    wrapper.update()

    expect(wrapper.find(BackgroundImagePicker).length).toBe(0)
    expect(wrapper.find(BackgroundColorPicker).length).toBe(1)
    expect(wrapper.find(BackgroundCustomImagePicker).length).toBe(0)
  })

  // TODO: test mutations when children call to change settings
})
