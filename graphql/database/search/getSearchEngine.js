import { find } from 'lodash/collection'
import searchEngines from './searchEngines'
import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'

const getSearchEngine = async id => {
  const searchEngine = find(searchEngines, { id })
  if (!searchEngine) {
    throw new DatabaseItemDoesNotExistException()
  }
  return searchEngine
}

export default getSearchEngine
