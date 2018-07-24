/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

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

  // TODO: test mutations when children call to change settings
  // TODO: test correct selection of radio button depending on
  //   background option selection
  // TODO: test rendering of picker components depending on which
  //   background option is selected
  // TODO: test that clicking a new value updates which picker
  //   component renders
})
