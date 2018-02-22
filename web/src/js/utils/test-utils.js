
// Like Enzyme's `find` method, but polling to wait for
// elements to mount.
export const enzymeFindAsync = async (rootComponent, selector, maxTimeMs = 4000, intervalMs = 50) => {
  function enzymeFind () {
    return rootComponent.update().find(selector)
  }
  function timeout (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  var elems = []
  const pollIntervalMs = 100
  let remainingTimeMs = maxTimeMs
  while (remainingTimeMs > 0) {
    elems = enzymeFind()
    if (elems.length) {
      return elems
    }
    remainingTimeMs -= intervalMs
    await timeout(pollIntervalMs)
  }
  return elems
}
