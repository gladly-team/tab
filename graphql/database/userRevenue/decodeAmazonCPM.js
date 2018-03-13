
const amazonCPMCodes = require('./amazon-cpm-codes.json')

/**
 * Change an Amazon CPM code into a CPM value
 * @param {string} amazonCPMCode - The Amazon CPM code
 * @return {number} The $USD value of the CPM
 */
const decodeAmazonCPM = (amazonCPMCode) => {
  const cpmVal = parseFloat(amazonCPMCodes[amazonCPMCode])
  if (!cpmVal) {
    throw new Error(`Invalid Amazon CPM code "${amazonCPMCode}"`)
  }
  return cpmVal
}

export default decodeAmazonCPM
