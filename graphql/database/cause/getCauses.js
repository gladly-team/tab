import { isBoolean } from 'lodash/lang'
import causes from './causes'
import { showInternalOnly } from '../../utils/authorization-helpers'

const getCauses = async (userContext, filters = {}) => {
  const { isAvailableToSelect } = filters
  // Filter out causes not ready for release yet for external users.
  const filteredCauses = causes.filter((cause) => {
    // allow internal users to switch to hidden causes
    if (isBoolean(isAvailableToSelect)) {
      return cause.isAvailableToSelect || showInternalOnly(userContext.email)
    }
    return true
  })

  return filteredCauses
}
export default getCauses
