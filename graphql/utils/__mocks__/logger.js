/* eslint-env jest */

const logger = {}

logger.log = jest.fn()
logger.debug = jest.fn()
logger.info = jest.fn()
logger.warn = jest.fn()
logger.error = jest.fn()
logger.fatal = jest.fn()
export default logger

export const logErrorWithId = jest.fn()
