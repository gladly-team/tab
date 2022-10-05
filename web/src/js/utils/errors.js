/* eslint max-classes-per-file: 0 */

class ExtendableError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error(message).stack
    }
  }
}

const AWAIT_TIMED_OUT = 'AWAIT_TIMED_OUT'
class AwaitedPromiseTimeout extends ExtendableError {
  constructor() {
    super('Awaited promise timed out.')
    this.code = AWAIT_TIMED_OUT
  }

  static get code() {
    return AWAIT_TIMED_OUT
  }
}

// eslint-disable-next-line import/prefer-default-export
export { AwaitedPromiseTimeout }
