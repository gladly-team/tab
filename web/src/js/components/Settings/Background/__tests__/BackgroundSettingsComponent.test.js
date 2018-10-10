/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import { cloneDeep } from 'lodash/lang'
import { RadioButtonGroup, RadioButton } from 'material-ui/RadioButton'
import BackgroundImagePicker from 'js/components/Background/BackgroundImagePickerContainer'
import BackgroundColorPicker from 'js/components/Background/BackgroundColorPickerContainer'
import BackgroundCustomImagePicker from 'js/components/Background/BackgroundCustomImagePickerContainer'
import {
  USER_BACKGROUND_OPTION_CUSTOM,
  USER_BACKGROUND_OPTION_COLOR,
  USER_BACKGROUND_OPTION_PHOTO,
  USER_BACKGROUND_OPTION_DAILY
} from 'js/constants'
import {
  setBackgroundSettings
} from 'js/utils/local-bkg-settings'
import SetBackgroundImageMutation from 'js/mutations/SetBackgroundImageMutation'
import SetBackgroundColorMutation from 'js/mutations/SetBackgroundColorMutation'
import SetBackgroundCustomImageMutation from 'js/mutations/SetBackgroundCustomImageMutation'
import SetBackgroundDailyImageMutation, {
  __runOnCompleted as __runOnCompletedDailyImageMutation
} from 'js/mutations/SetBackgroundDailyImageMutation'

jest.mock('material-ui/RadioButton')
jest.mock('js/components/Background/BackgroundImagePickerContainer')
jest.mock('js/components/Background/BackgroundColorPickerContainer')
jest.mock('js/components/Background/BackgroundCustomImagePickerContainer')
jest.mock('js/utils/local-bkg-settings')
jest.mock('js/mutations/SetBackgroundImageMutation')
jest.mock('js/mutations/SetBackgroundColorMutation')
jest.mock('js/mutations/SetBackgroundCustomImageMutation')
jest.mock('js/mutations/SetBackgroundDailyImageMutation')

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
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
    shallow(
      <BackgroundSettings {...mockProps} />
    )
  })

  it('renders all of the expected background option radio buttons', () => {
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
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
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
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
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
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
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
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
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
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

  it('it saves settings when the user selects the daily photo option', () => {
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundOption = 'photo'
    const wrapper = shallow(
      <BackgroundSettings {...mockProps} />
    )

    // Simulate clicking the daily photo option.
    wrapper.find(RadioButtonGroup).prop('onChange')({}, USER_BACKGROUND_OPTION_DAILY)
    wrapper.update()
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalled()
  })

  it('it updates localStorage immediately when the user selects the daily photo option', () => {
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundOption = 'photo'
    const wrapper = shallow(
      <BackgroundSettings {...mockProps} />
    )

    // Simulate clicking the daily photo option.
    wrapper.find(RadioButtonGroup).prop('onChange')({}, USER_BACKGROUND_OPTION_DAILY)
    wrapper.update()
    expect(setBackgroundSettings).toHaveBeenCalledWith(
      USER_BACKGROUND_OPTION_DAILY,
      customMockProps.user.customImage,
      customMockProps.user.backgroundColor,
      customMockProps.user.backgroundImage.imageURL
    )
  })

  it('it updates localStorage when the new daily photo returns after choosing to the daily photo option', () => {
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundOption = 'photo'
    const wrapper = shallow(
      <BackgroundSettings {...mockProps} />
    )

    // Simulate clicking the daily photo option.
    wrapper.find(RadioButtonGroup).prop('onChange')({}, USER_BACKGROUND_OPTION_DAILY)
    wrapper.update()

    setBackgroundSettings.mockClear()

    // Mock that the SetBackgroundDailyImage mutation returns.
    __runOnCompletedDailyImageMutation({
      setUserBkgDailyImage: {
        user: {
          backgroundImage: {
            id: 'some-image-id',
            imageURL: 'https://example.com/some/brand-new-image.jpg',
            timestamp: '2018-07-27T17:30:56.753Z'
          }
        }
      }
    })
    expect(setBackgroundSettings).toHaveBeenCalledWith(
      USER_BACKGROUND_OPTION_DAILY,
      customMockProps.user.customImage,
      customMockProps.user.backgroundColor,
      'https://example.com/some/brand-new-image.jpg'
    )
  })

  it('it does not update localStorage with the new daily photo if the user chooses another background option before the daily photo data returns', () => {
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundOption = 'photo'
    const wrapper = shallow(
      <BackgroundSettings {...mockProps} />
    )

    // Simulate clicking the daily photo option.
    wrapper.find(RadioButtonGroup).prop('onChange')({}, USER_BACKGROUND_OPTION_DAILY)
    wrapper.update()

    // Simulate clicking the photo option.
    wrapper.find(RadioButtonGroup).prop('onChange')({}, USER_BACKGROUND_OPTION_PHOTO)
    wrapper.update()

    setBackgroundSettings.mockClear()

    // Mock that the SetBackgroundDailyImage mutation returns.
    __runOnCompletedDailyImageMutation({
      setUserBkgDailyImage: {
        user: {
          backgroundImage: {
            id: 'some-image-id',
            imageURL: 'https://example.com/some/brand-new-image.jpg',
            timestamp: '2018-07-27T17:30:56.753Z'
          }
        }
      }
    })

    expect(setBackgroundSettings).not.toHaveBeenCalled()
  })

  it('it updates localStorage when the user selects a new background option', () => {
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundOption = 'photo'
    const wrapper = shallow(
      <BackgroundSettings {...mockProps} />
    )

    // Simulate clicking the color background option.
    wrapper.find(RadioButtonGroup).prop('onChange')({}, USER_BACKGROUND_OPTION_COLOR)
    wrapper.update()

    expect(setBackgroundSettings).toHaveBeenCalledWith(
      USER_BACKGROUND_OPTION_COLOR,
      customMockProps.user.customImage,
      customMockProps.user.backgroundColor,
      customMockProps.user.backgroundImage.imageURL
    )
  })

  it('saves settings when the user selects a new photo', () => {
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundOption = 'photo'
    const wrapper = shallow(
      <BackgroundSettings {...customMockProps} />
    )

    // Mock the callback from the child component.
    const mockImg = {
      id: 'some-image-id',
      name: 'Some Image!',
      imageURL: 'https://example.com/some/image.png',
      thumbnailURL: 'https://example.com/some/thumbnail.png'
    }
    wrapper.find(BackgroundImagePicker)
      .prop('onBackgroundImageSelection')(mockImg)

    const mutationMockCall = SetBackgroundImageMutation.commit.mock.calls[0]
    expect(mutationMockCall[2]).toEqual(mockImg)
  })

  it('calls to update localStorage when the user selects a new photo', () => {
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundOption = 'photo'
    const wrapper = shallow(
      <BackgroundSettings {...customMockProps} />
    )

    // Mock the callback from the child component.
    const mockImg = {
      id: 'some-image-id',
      name: 'Some Image!',
      imageURL: 'https://example.com/some/image.png',
      thumbnailURL: 'https://example.com/some/thumbnail.png'
    }
    wrapper.find(BackgroundImagePicker)
      .prop('onBackgroundImageSelection')(mockImg)

    expect(setBackgroundSettings).toHaveBeenCalledWith(
      USER_BACKGROUND_OPTION_PHOTO,
      customMockProps.user.customImage,
      customMockProps.user.backgroundColor,
      mockImg.imageURL
    )
  })

  it('saves settings when the user selects a new color', () => {
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundOption = 'color'
    const wrapper = shallow(
      <BackgroundSettings {...customMockProps} />
    )

    // Mock the callback from the child component.
    const mockColor = '#EFEFEF'
    wrapper.find(BackgroundColorPicker)
      .prop('onBackgroundColorSelection')(mockColor)

    const mutationMockCall = SetBackgroundColorMutation.commit.mock.calls[0]
    expect(mutationMockCall[2]).toEqual(mockColor)
  })

  it('calls to update localStorage when the user selects a new color', () => {
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundOption = 'color'
    const wrapper = shallow(
      <BackgroundSettings {...customMockProps} />
    )

    // Mock the callback from the child component.
    const mockColor = '#EFEFEF'
    wrapper.find(BackgroundColorPicker)
      .prop('onBackgroundColorSelection')(mockColor)

    expect(setBackgroundSettings).toHaveBeenCalledWith(
      USER_BACKGROUND_OPTION_COLOR,
      customMockProps.user.customImage,
      mockColor,
      customMockProps.user.backgroundImage.imageURL
    )
  })

  it('saves settings when the user selects a new custom photo', () => {
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundOption = 'custom'
    const wrapper = shallow(
      <BackgroundSettings {...customMockProps} />
    )

    // Mock the callback from the child component.
    const mockCustomImgURL = 'https://example.com/my/custom/photo.png'
    wrapper.find(BackgroundCustomImagePicker)
      .prop('onCustomImageSelection')(mockCustomImgURL)

    const mutationMockCall = SetBackgroundCustomImageMutation.commit.mock.calls[0]
    expect(mutationMockCall[2]).toEqual(mockCustomImgURL)
  })

  it('calls to update localStorage when the user selects a new custom photo', () => {
    const BackgroundSettings = require('js/components/Settings/Background/BackgroundSettingsComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundOption = 'custom'
    const wrapper = shallow(
      <BackgroundSettings {...customMockProps} />
    )

    // Mock the callback from the child component.
    const mockCustomImgURL = 'https://example.com/my/custom/photo.png'
    wrapper.find(BackgroundCustomImagePicker)
      .prop('onCustomImageSelection')(mockCustomImgURL)

    expect(setBackgroundSettings).toHaveBeenCalledWith(
      USER_BACKGROUND_OPTION_CUSTOM,
      mockCustomImgURL,
      customMockProps.user.backgroundColor,
      customMockProps.user.backgroundImage.imageURL
    )
  })
})
