// Used to deploy from CI.

/**
 * Check if the settings are appropriate to deploy.
 * @param {string} stageName - The name of the deployment stage
 * @param {(string|undefined)} envCI - The value of process.env.CI
 * @return {boolean} Returns `true` if there are no errors.
 */
export const checkDeployValidity = function (stageName, envCI) {
  const acceptableStages = ['', 'DEV', 'TEST', 'STAGING', 'PROD']
  if (acceptableStages.indexOf(stageName) === -1) {
    throw new Error(`Deployment stage name must be one of: DEV, TEST, STAGING, PROD`)
  }
  if (envCI !== 'true') {
    throw new Error('Deployment should only happen via a CI server.')
  }
  return true
}

/**
 * Get the formatted Serverless stage name from the provided stage.
 * @param {string} stageName - The name of the deployment stage
 * @return {string} Returns the corresponding stage name string.
 */
export const getServerlessStageName = function (stageName) {
  const acceptableSlsStages = ['dev', 'test', 'staging', 'prod']
  const slsStageName = stageName.toLowerCase()
  if (acceptableSlsStages.indexOf(slsStageName) === -1) {
    throw new Error(`Serverless stage must be one of: dev, test, staging, prod`)
  }
  return slsStageName
}
