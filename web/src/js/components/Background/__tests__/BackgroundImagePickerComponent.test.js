/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import { GridTile } from 'material-ui/GridList'

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
})
