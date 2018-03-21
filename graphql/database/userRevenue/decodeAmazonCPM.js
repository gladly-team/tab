
const amazonCPMCodes = require('./amazon-cpm-codes.json')

/**
 * Change an Amazon CPM code into a CPM value
 * @param {string} amazonCPMCode - The Amazon CPM code
 * @return {number} The $USD value of the CPM
 */
const decodeAmazonCPM = (amazonCPMCode) => {
  const cpmStr = amazonCPMCodes[amazonCPMCode]
  // If no valid CPM value, return 0.0
  if (!cpmStr) {
    return 0.0
  }
  const cpmVal = parseFloat(cpmStr)
  if (isNaN(cpmVal)) {
    throw new Error(`Amazon CPM code "${amazonCPMCode}" resolved to a non-numeric value`)
  }
  return cpmVal
}

export default decodeAmazonCPM
