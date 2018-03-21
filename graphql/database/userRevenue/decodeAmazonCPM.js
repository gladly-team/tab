
import logger from '../../utils/logger'
const amazonCPMCodes = require('./amazon-cpm-codes.json')

/**
 * Change an Amazon CPM code into a CPM value
 * @param {string} amazonCPMCode - The Amazon CPM code
 * @return {number} The $USD value of the CPM
 */
const decodeAmazonCPM = (amazonCPMCode) => {
  const cpmStr = amazonCPMCodes[amazonCPMCode]
  if (!cpmStr) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Invalid Amazon CPM code "${amazonCPMCode}"`)
    } else {
      // When not in production environment, we won't decode real Amazon
      // CPM codes appropriately. Don't throw an error.
      logger.warn(`Warning: Amazon CPM code "${amazonCPMCode}" is invalid. Resolving to a value of 0.0 in development.`)
      return 0.0
    }
  }
  const cpmVal = parseFloat(cpmStr)
  if (isNaN(cpmVal)) {
    throw new Error(`Amazon CPM code "${amazonCPMCode}" resolved to a non-numeric value`)
  }
  return cpmVal
}

export default decodeAmazonCPM
