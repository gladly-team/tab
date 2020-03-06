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

const METHOD_NOT_IMPLEMENTED = 'METHOD_NOT_IMPLEMENTED'
class NotImplementedException extends ExtendableError {
  constructor() {
    super('Required method is not implemented.')
    this.code = METHOD_NOT_IMPLEMENTED
  }

  static get code() {
    return METHOD_NOT_IMPLEMENTED
  }
}

const UNAUTHORIZED_QUERY = 'UNAUTHORIZED_QUERY'
class UnauthorizedQueryException extends ExtendableError {
  constructor() {
    super('Query not authorized.')
    this.code = UNAUTHORIZED_QUERY
  }

  static get code() {
    return UNAUTHORIZED_QUERY
  }
}

// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.Errors.html#Programming.Errors.MessagesAndCodes
const DATABASE_CONDITIONAL_CHECK_FAILED = 'DATABASE_CONDITIONAL_CHECK_FAILED'
class DatabaseConditionalCheckFailedException extends ExtendableError {
  constructor() {
    super('The conditional check failed when trying to modify a database item.')
    this.code = DATABASE_CONDITIONAL_CHECK_FAILED
  }

  static get code() {
    return DATABASE_CONDITIONAL_CHECK_FAILED
  }
}

const DATABASE_ITEM_DOES_NOT_EXIST = 'DATABASE_ITEM_DOES_NOT_EXIST'
class DatabaseItemDoesNotExistException extends ExtendableError {
  constructor() {
    super('The database does not contain an item with these keys.')
    this.code = DATABASE_ITEM_DOES_NOT_EXIST
  }

  static get code() {
    return DATABASE_ITEM_DOES_NOT_EXIST
  }
}

const USER_REACHED_MAX_LEVEL = 'USER_REACHED_MAX_LEVEL'
class UserReachedMaxLevelException extends ExtendableError {
  constructor() {
    super('There are no more levels. The user is at the max level.')
    this.code = USER_REACHED_MAX_LEVEL
  }

  static get code() {
    return USER_REACHED_MAX_LEVEL
  }
}

const USER_DOES_NOT_EXIST = 'USER_DOES_NOT_EXIST'
class UserDoesNotExistException extends ExtendableError {
  constructor() {
    super('No user exists with this ID.')
    this.code = USER_DOES_NOT_EXIST
  }

  static get code() {
    return USER_DOES_NOT_EXIST
  }
}

// For tests.
class MockDatabaseException extends ExtendableError {}

const OPERATION_STACK_IS_EMPTY = 'OPERATION_STACK_IS_EMPTY'
class EmptyOperationStackException extends MockDatabaseException {
  constructor() {
    super(
      'Operation stack is empty. Check if you set your expected data in the test.'
    )
    this.code = OPERATION_STACK_IS_EMPTY
  }

  static get code() {
    return OPERATION_STACK_IS_EMPTY
  }
}

export {
  NotImplementedException,
  UnauthorizedQueryException,
  DatabaseConditionalCheckFailedException,
  DatabaseItemDoesNotExistException,
  UserReachedMaxLevelException,
  UserDoesNotExistException,
  EmptyOperationStackException,
}
