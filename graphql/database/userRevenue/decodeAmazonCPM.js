
import logger from '../../utils/logger'
const amazonCPMCodes = require('./amazon-cpm-codes.json')

/**
 * Change an Amazon CPM code into a CPM value
 * @param {string} amazonCPMCode - The Amazon CPM code
 * @return {number} The $USD value of the CPM
 */
const decodeAmazonCPM = (amazonCPMCode) => {
  const cpmVal = parseFloat(amazonCPMCodes[amazonCPMCode])
  if (!cpmVal) {
    const warningMsg = `Invalid Amazon CPM code "${amazonCPMCode}"`
    if (process.env.NODE_ENV === 'production') {
      throw new Error(warningMsg)
    } else {
      // When not in production environment, we won't decode real Amazon
      // CPM codes appropriately. Don't throw an error.
      logger.warn(warningMsg)
      return 0.0
    }
  }
  return cpmVal
}

export default decodeAmazonCPM
