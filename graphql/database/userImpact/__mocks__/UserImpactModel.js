/* eslint-env jest */
import { DatabaseItemDoesNotExistException } from '../../../utils/exceptions'

let getStack = []
let errorStack = []
let getCount = 0
let errorCount = 0
export default {
  get: jest.fn(() => {
    if (errorStack[errorCount] !== undefined) {
      errorCount += 1
      throw errorStack[errorCount - 1]
    }
    const result = getStack[getCount]
    getCount += 1
    if (result) {
      return result
    }
    throw new DatabaseItemDoesNotExistException()
  }),
  getOrCreate: jest.fn(() => {
    if (errorStack[errorCount] !== undefined) {
      errorCount += 1
      throw errorStack[errorCount - 1]
    }
    const result = getStack[getCount]
    getCount += 1
    return { item: result }
  }),
  update: jest.fn(),
  mockGetOrCreate: impactItem => {
    getStack.push(impactItem)
  },
  mockError: error => {
    errorStack.push(error)
  },
  clearAllMockItems: () => {
    getStack = []
    getCount = 0
    errorStack = []
    errorCount = 0
  },
}
