/* eslint-env jest */

import {
  NotImplementedException,
  UnauthorizedQueryException,
  DatabaseItemDoesNotExistException,
  UserReachedMaxLevelException,
  UserDoesNotExistException,
  EmptyOperationStackException,
} from '../exceptions'

describe('custom exceptions', () => {
  test('NotImplementedException has expected code', () => {
    const err = new NotImplementedException()
    expect(err.code).toBe('METHOD_NOT_IMPLEMENTED')
  })

  test('UnauthorizedQueryException has expected code', () => {
    const err = new UnauthorizedQueryException()
    expect(err.code).toBe('UNAUTHORIZED_QUERY')
  })

  test('DatabaseItemDoesNotExistException has expected code', () => {
    const err = new DatabaseItemDoesNotExistException()
    expect(err.code).toBe('DATABASE_ITEM_DOES_NOT_EXIST')
  })

  test('UserReachedMaxLevelException has expected code', () => {
    const err = new UserReachedMaxLevelException()
    expect(err.code).toBe('USER_REACHED_MAX_LEVEL')
  })

  test('UserDoesNotExistException has expected code', () => {
    const err = new UserDoesNotExistException()
    expect(err.code).toBe('USER_DOES_NOT_EXIST')
  })

  test('EmptyOperationStackException has expected code', () => {
    const err = new EmptyOperationStackException()
    expect(err.code).toBe('OPERATION_STACK_IS_EMPTY')
  })
})
