import { find } from 'lodash/collection'
import causes from './causes'
import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'

const getCause = async id => {
  const cause = find(causes, { id })
  if (!cause) {
    throw new DatabaseItemDoesNotExistException()
  }
  return cause
}

export default getCause
