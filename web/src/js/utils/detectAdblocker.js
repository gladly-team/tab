/**
 * Determines whether the user has an ad blocker enabled.
 * @return {Promise<Boolean>} Resolves to true if an ad blocker
 *   is enabled and false if not.
 */
export default () => {
  return new Promise((resolve, reject) => {
    const onAdBlockDetected = () => {
      resolve(true)
    }
    const onNoAdBlockDetected = () => {
      resolve(false)
    }

    require('blockadblock')
    const adblockerDetection = window.blockAdBlock

    // Audit in case an ad blocker blocks the "blockadblock" script.
    if (typeof adblockerDetection === 'undefined') {
      onAdBlockDetected()
    } else {
      adblockerDetection.onDetected(onAdBlockDetected)
      adblockerDetection.onNotDetected(onNoAdBlockDetected)
    }
  })
}
