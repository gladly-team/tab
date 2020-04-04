/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

//
const getMockProps = () => ({})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SocialShare page component', () => {
  it('renders without error', () => {
    const SocialShare = require('js/components/General/SocialShareComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SocialShare {...mockProps} />)
  })
})
