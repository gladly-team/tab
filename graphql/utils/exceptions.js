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

export const METHOD_NOT_IMPLEMENTED = 'METHOD_NOT_IMPLEMENTED'
class NotImplementedException extends ExtendableError {
  constructor () {
    super('Required method is not implemented.')
    this.code = UNAUTHORIZED_QUERY
  }
}

export const UNAUTHORIZED_QUERY = 'UNAUTHORIZED_QUERY'
class UnauthorizedQueryException extends ExtendableError {
  constructor () {
    super('Query not authorized.')
    this.code = UNAUTHORIZED_QUERY
  }
}

export const DATABASE_ITEM_DOES_NOT_EXIST = 'DATABASE_ITEM_DOES_NOT_EXIST'
class DatabaseItemDoesNotExistException extends ExtendableError {
  constructor () {
    super('The database does not contain an item with these keys.')
    this.code = DATABASE_ITEM_DOES_NOT_EXIST
  }
}

export const USER_REACHED_MAX_LEVEL = 'USER_REACHED_MAX_LEVEL'
class UserReachedMaxLevelException extends ExtendableError {
  constructor () {
    super('There are no more levels. The user is at the max level.')
    this.code = USER_REACHED_MAX_LEVEL
  }
}

export const USER_DOES_NOT_EXIST = 'USER_DOES_NOT_EXIST'
class UserDoesNotExistException extends ExtendableError {
  constructor () {
    super('No user exists with this ID.')
    this.code = USER_DOES_NOT_EXIST
  }
}

// For tests.
class MockDatabaseException extends ExtendableError {}

export const OPERATION_STACK_IS_EMPTY = 'OPERATION_STACK_IS_EMPTY'
class EmptyOperationStackException extends MockDatabaseException {
  constructor () {
    super('Operation stack is empty. Check if you set your expected data in the test.')
    this.code = OPERATION_STACK_IS_EMPTY
  }
}

export {
  NotImplementedException,
  UnauthorizedQueryException,
  DatabaseItemDoesNotExistException,
  UserReachedMaxLevelException,
  UserDoesNotExistException,
  EmptyOperationStackException
}
