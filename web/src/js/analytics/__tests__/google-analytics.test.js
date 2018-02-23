/* eslint-env jest */

import ReactGA from 'react-ga'

afterEach(() => {
  jest.clearAllMocks()
})

describe('google-analytics tests', () => {
  test('initializes on module load', () => {
    const GA = require('../google-analytics')
    expect(ReactGA.initialize).toHaveBeenCalledWith('UA-24159386-1')
  })
})
