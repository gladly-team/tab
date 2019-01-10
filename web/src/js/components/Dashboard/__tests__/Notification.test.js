/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

const mockProps = {
  title: 'Message Title',
  message: 'Here is some additional information.',
  buttonText: 'Click Me',
  buttonAction: 'http://example.com/some-link/'
}

describe('Notification component', function () {
  it('renders without error', function () {
    const Notification = require('js/components/Dashboard/NotificationComponent').default
    shallow(
      <Notification {...mockProps} />
    )
  })
})
