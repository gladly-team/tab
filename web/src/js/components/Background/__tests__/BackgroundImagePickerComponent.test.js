/* eslint-env jest */

import React from 'react'
import {
  mount,
  shallow
} from 'enzyme'
import { cloneDeep } from 'lodash/lang'
import { GridTile } from 'material-ui/GridList'
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle'
import RadioButtonUncheckedIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const mockOnBackgroundImageSelection = jest.fn()
const mockShowError = jest.fn()
const mockProps = {
  app: {
    backgroundImages: {
      edges: [
        {
          node: {
            id: 'abcdef',
            name: 'Some Cool Image',
            imageURL: 'https://example.com/here/is/some-img.png',
            thumbnailURL: 'https://example.com/here/is/some-thumbnail.png'
          }
        },
        {
          node: {
            id: 'xyz123',
            name: 'Another Neat Image',
            imageURL: 'https://example.com/here/is/a-neat-img.png',
            thumbnailURL: 'https://example.com/here/is/a-neat-thumbnail.png'
          }
        }
      ]
    }
  },
  user: {
    backgroundImage: {
      id: 'abcdef',
      imageURL: 'https://example.com/here/is/some-img.png'
    }
  },
  onBackgroundImageSelection: mockOnBackgroundImageSelection,
  showError: mockShowError
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('Background image picker component', () => {
  it('renders without error', () => {
    const BackgroundImagePicker = require('../BackgroundImagePickerComponent').default
    shallow(
      <BackgroundImagePicker {...mockProps} />
    )
  })

  it('calls onBackgroundImageSelection on mount', () => {
    const BackgroundImagePicker = require('../BackgroundImagePickerComponent').default
    shallow(
      <BackgroundImagePicker {...mockProps} />
    )
    expect(mockOnBackgroundImageSelection)
      .toHaveBeenCalledWith(mockProps.app.backgroundImages.edges[0].node)
  })

  it('visually selects the current image', () => {
    const BackgroundImagePicker = require('../BackgroundImagePickerComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundImage = {
      id: 'xyz123',
      imageURL: 'https://example.com/here/is/a-neat-img.png'
    }

    // @material-ui-1-todo: remove MuiThemeProvider wrapper
    const wrapper = mount(
      <MuiThemeProvider>
        <BackgroundImagePicker {...customMockProps} />
      </MuiThemeProvider>
    )

    // This image should be selected.
    const selectedImgTile = wrapper.find(GridTile)
      .filterWhere(node => node.key() === 'xyz123')
    expect(selectedImgTile.children().find(CheckCircleIcon).length)
      .toBe(1)

    // Another image should not be selected.
    const otherImgTile = wrapper.find(GridTile)
      .filterWhere(node => node.key() === 'abcdef')
    expect(otherImgTile.children().find(CheckCircleIcon).length)
      .toBe(0)
    expect(otherImgTile.children().find(RadioButtonUncheckedIcon).length)
      .toBe(1)
  })

  it('calls onBackgroundImageSelection prop when the selected image changes', () => {
    const BackgroundImagePicker = require('../BackgroundImagePickerComponent').default
    const wrapper = shallow(
      <BackgroundImagePicker {...mockProps} />
    )

    // Mock that the user selects another image.
    const mockSelectedImgData = mockProps.app.backgroundImages.edges[1].node
    const imgToClick = wrapper.find(GridTile)
      .filterWhere(node => node.key() === mockSelectedImgData.id)
    imgToClick.simulate('click')
    expect(mockOnBackgroundImageSelection)
      .toHaveBeenCalledWith(mockSelectedImgData)
  })

  it('automatically visually selects the first image if the user does not have an image defined', () => {
    const BackgroundImagePicker = require('../BackgroundImagePickerComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundImage = null

    // Suppress expected PropType failure message
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    // @material-ui-1-todo: remove MuiThemeProvider wrapper
    const wrapper = mount(
      <MuiThemeProvider>
        <BackgroundImagePicker {...customMockProps} />
      </MuiThemeProvider>
    )

    // The first image should be selected.
    const selectedImgTile = wrapper.find(GridTile).first()
    expect(selectedImgTile.children().find(CheckCircleIcon).length)
      .toBe(1)
  })

  it('uses the first image in onBackgroundImageSelection callback on mount if the user does not have an image defined', () => {
    const BackgroundImagePicker = require('../BackgroundImagePickerComponent').default
    const customMockProps = cloneDeep(mockProps)
    customMockProps.user.backgroundImage = null

    // Suppress expected PropType failure message
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    shallow(
      <BackgroundImagePicker {...customMockProps} />
    )
    expect(mockOnBackgroundImageSelection)
      .toHaveBeenCalledWith(mockProps.app.backgroundImages.edges[0].node)
  })
})
