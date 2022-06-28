/* eslint-env jest */

import { getMockSNSEventObject } from '../../utils/lambda-arg-utils'

beforeEach(() => {
  jest.clearAllMocks()
})

const setSNSEventMessage = (event, message) => {
  const newRecords = event.Records.map(rec => {
    return {
      ...rec,
      Sns: {
        ...rec.Sns,
        Message: message,
      },
    }
  })
  return {
    ...event,
    Records: newRecords,
  }
}

describe('Search request logger', () => {
  it('calls console.log with the SNS message', async () => {
    expect.assertions(1)
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementationOnce(() => {})
    const mockEvent = setSNSEventMessage(getMockSNSEventObject(), 'Hello world')
    const { handler } = require('../search-request-logger.mjs')
    await handler(mockEvent)

    // eslint-disable-next-line no-console
    expect(consoleLogSpy).toHaveBeenLastCalledWith('Hello world')
  })
})
