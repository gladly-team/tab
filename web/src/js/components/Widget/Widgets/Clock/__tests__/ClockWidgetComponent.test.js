/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

const mockProps = {
  user: {
    id: 'abc123'
  },
  widget: {
    id: 'widget-xyz',
    name: 'Clock',
    enabled: true,
    config: JSON.stringify([
      {
        'field': 'format24',
        'type': 'boolean',
        'display': 'Use 24 hours format',
        'defaultValue': false
      }
    ]),
    settings: JSON.stringify({
      format24: true
    }),
    type: 'clock'
  }
}

describe('Clock widget  component', () => {
  it('renders without error', () => {
    const ClockWidgetComponent = require('../ClockWidgetComponent').default
    shallow(
      <ClockWidgetComponent {...mockProps} />
    )
  })
})
