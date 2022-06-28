/* eslint-env jest */

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Search request logger', () => {
  it('calls console.log', async () => {
    expect.assertions(1)
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementationOnce(() => {})
    const { handler } = require('../search-request-logger.mjs')
    await handler()

    // eslint-disable-next-line no-console
    expect(consoleLogSpy).toHaveBeenCalled()
  })
})
