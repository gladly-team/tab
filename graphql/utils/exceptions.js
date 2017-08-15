class ExtendableError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }
}

class NotImplementedException extends ExtendableError {
  constructor () {
    super('Required method is not implmented.')
  }
}

class UnauthorizedQueryException extends ExtendableError {
  constructor () {
    super('Query not authorized.')
  }
}

class UserReachedMaxLevelException extends ExtendableError {
  constructor () {
    super('There are no more levels user at max level.')
  }
}

class MockDatabaseException extends ExtendableError {

}

class EmptyOperationStackException extends MockDatabaseException {
  constructor () {
    super('Operation stack is empty. Check if you set your expected data in the test.')
  }
}

class OperationMissmatchException extends MockDatabaseException {
  constructor (expectedOperation, receivedOperation) {
    const message = `Expected <${expectedOperation}> operation but 
              received <${receivedOperation}> operation instead.`

    super(message)
  }
}

export {
  NotImplementedException,
  UnauthorizedQueryException,
  UserReachedMaxLevelException,
  EmptyOperationStackException,
  OperationMissmatchException
}
