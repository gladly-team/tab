/* eslint-env jest */

import prebidModule from '../prebidModule'

beforeEach(() => {
  delete window.pbjs
})

afterAll(() => {
  delete window.pbjs
})

describe('prebid module', function () {
  it('sets window.pbjs variable', () => {
    expect(window.pbjs).not.toBeDefined()
    prebidModule()
    expect(window.pbjs).toBeDefined()
  })
})
