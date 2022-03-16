import { find } from 'lodash/collection'
import searchEngines from './searchEngines'
import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'

const getSearchEngine = async (id, ignoreUnfound = false) => {
  const searchEngine = find(searchEngines, { id })
  if (!searchEngine) {
    if (ignoreUnfound) {
      return null
    }
    throw new DatabaseItemDoesNotExistException()
  }
  return searchEngine
}

export default getSearchEngine
