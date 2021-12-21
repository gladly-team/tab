import { filter } from 'lodash/collection'
import { isBoolean } from 'lodash/lang'
import causes from './causes'

const getCauses = async (userContext, filters = {}) => {
  const { isAvailableToSelect } = filters
  // Filter out causes not ready for release yet.
  const filteredCauses = filter(causes, {
    ...(isBoolean(isAvailableToSelect) && { isAvailableToSelect }),
  })

  return filteredCauses
}
export default getCauses
