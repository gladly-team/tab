/* eslint-env jest */

afterEach(() => {
  jest.resetModules()
})

describe('search theme', () => {
  it('sets the expected primary main color', () => {
    const searchTheme = require('js/theme/searchTheme').default
    expect(searchTheme.palette.primary.main).toEqual('#00b597')
  })

  it('sets the expected primary contrast text color', () => {
    const searchTheme = require('js/theme/searchTheme').default
    expect(searchTheme.palette.primary.contrastText).toEqual('#fff')
  })

  it('matches the Tab default theme except for primary color', () => {
    const tabTheme = require('js/theme/defaultV1').default
    const searchTheme = require('js/theme/searchTheme').default
    delete tabTheme.palette.primary
    delete searchTheme.palette.primary
    expect(searchTheme).toEqual(tabTheme)
  })
})
